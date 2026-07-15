import logging
import uuid

from sqlalchemy.orm import Session

from app.db.models.document import Document, DocumentChunk
from app.services.rag.ports import (
    DocumentLoader,
    EmbeddingService,
    TextChunker,
)

logger = logging.getLogger(__name__)


class IngestionPipeline:
    def __init__(
        self,
        loader: DocumentLoader,
        chunker: TextChunker,
        embedding_service: EmbeddingService,
    ):
        self._loader = loader
        self._chunker = chunker
        self._embedding_service = embedding_service

    def ingest(self, db: Session, document_id: str, raw_bytes: bytes, filename: str) -> int:
        documents = self._loader.load(raw_bytes, filename)
        if not documents:
            self._mark_error(db, document_id)
            return 0

        chunks = self._chunker.chunk(documents)
        if not chunks:
            self._mark_error(db, document_id)
            return 0

        full_text_parts: list[str] = []
        chunks_created = 0

        for chunk in chunks:
            embedding = self._embedding_service.embed(chunk.content)
            db_chunk = DocumentChunk(
                id=str(uuid.uuid4()),
                document_id=document_id,
                content=chunk.content,
                embedding=embedding,
                page_number=chunk.page_number,
            )
            db.add(db_chunk)
            full_text_parts.append(chunk.content)
            chunks_created += 1

        doc = db.query(Document).filter(Document.id == document_id).first()
        if doc:
            doc.content = "\n".join(full_text_parts)
            doc.file_size_bytes = len(doc.content.encode("utf-8"))
            doc.status = "ready"

        db.commit()
        logger.info("Ingested %d chunks for document %s", chunks_created, document_id)
        return chunks_created

    @staticmethod
    def _mark_error(db: Session, document_id: str) -> None:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if doc:
            doc.status = "error"
            db.commit()
