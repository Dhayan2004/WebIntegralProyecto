from fastapi import APIRouter, Depends, Query, status, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.schemas.documents import DocumentCreate, DocumentOut, DocumentUpdate
from app.services.document_service import DocumentService
from app.services.document_ingestion_service import DocumentIngestionService

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    subject_id: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_name = file.filename or "documento.pdf"
    title = file_name.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()
    file_bytes = await file.read()

    doc = DocumentService.create_processing_document(
        db=db,
        current_user=current_user,
        title=title,
        file_name=file_name,
        subject_id=subject_id
    )

    background_tasks.add_task(DocumentIngestionService.ingest_pdf, db, doc.id, file_bytes, file_name)
    return doc


@router.get("", response_model=list[DocumentOut])
def list_documents(
    q: str | None = Query(default=None),
    db=Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DocumentService.list_documents(db=db, current_user=current_user, query_text=q)


@router.post("", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
def create_document(payload: DocumentCreate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return DocumentService.create_document(
        db=db,
        current_user=current_user,
        title=payload.title,
        content=payload.content,
        subject_id=payload.subject_id,
        file_name=payload.file_name,
    )


@router.get("/{document_id}", response_model=DocumentOut)
def get_document(document_id: str, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return DocumentService.get_document(db=db, document_id=document_id, current_user=current_user)


@router.patch("/{document_id}", response_model=DocumentOut)
def update_document(document_id: str, payload: DocumentUpdate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return DocumentService.update_document(db=db, document_id=document_id, current_user=current_user, data=payload.model_dump(exclude_unset=True))


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: str, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    DocumentService.delete_document(db=db, document_id=document_id, current_user=current_user)
    return None
