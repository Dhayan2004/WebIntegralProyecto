import logging

from sqlalchemy.orm import Session

from app.db.models.document import Document
from app.services.rag.container import build_ingestion_pipeline

logger = logging.getLogger(__name__)


class DocumentIngestionService:
    @staticmethod
    def ingest_pdf(db: Session, document_id: str, raw_bytes: bytes, filename: str) -> int:
        pipeline = build_ingestion_pipeline()
        return pipeline.ingest(db, document_id, raw_bytes, filename)
