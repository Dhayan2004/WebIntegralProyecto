
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.models.document import Document
from app.db.models.user import User


class DocumentService:
	@staticmethod
	def list_documents(db: Session, current_user: User, query_text: str | None = None) -> list[Document]:
		query = db.query(Document).filter(Document.user_id == current_user.id)
		if query_text:
			query = query.filter(Document.title.ilike(f"%{query_text}%"))
		return query.order_by(Document.created_at.desc()).all()

	@staticmethod
	def create_document(
		db: Session,
		current_user: User,
		title: str,
		content: str | None = None,
		subject_id: str | None = None,
		file_name: str | None = None,
	) -> Document:
		text = content or ""
		document = Document(
			user_id=current_user.id,
			title=title,
			content=text,
			subject_id=subject_id,
			file_name=file_name,
			file_size_bytes=len(text.encode("utf-8")),
			status="ready",
		)
		db.add(document)
		db.commit()
		db.refresh(document)
		return document

	@staticmethod
	def create_processing_document(
		db: Session,
		current_user: User,
		title: str,
		file_name: str,
		subject_id: str | None = None,
	) -> Document:
		document = Document(
			user_id=current_user.id,
			title=title,
			content="",
			subject_id=subject_id,
			file_name=file_name,
			file_size_bytes=0,
			status="processing",
		)
		db.add(document)
		db.commit()
		db.refresh(document)
		return document


	@staticmethod
	def get_document(db: Session, document_id: str, current_user: User) -> Document:
		document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
		if not document:
			raise HTTPException(status_code=404, detail="Documento no encontrado")
		return document

	@staticmethod
	def update_document(db: Session, document_id: str, current_user: User, data: dict) -> Document:
		document = DocumentService.get_document(db, document_id, current_user)
		for key, value in data.items():
			setattr(document, key, value)
		if "content" in data and data["content"] is not None:
			document.file_size_bytes = len(str(data["content"]).encode("utf-8"))
		db.commit()
		db.refresh(document)
		return document

	@staticmethod
	def delete_document(db: Session, document_id: str, current_user: User) -> None:
		document = DocumentService.get_document(db, document_id, current_user)
		db.delete(document)
		db.commit()

