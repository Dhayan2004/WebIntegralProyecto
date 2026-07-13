import logging

from sqlalchemy.orm import Session

from app.services.rag.document_loader import PDFDocumentLoader
from app.services.rag.embedding_service import GroqEmbeddingService
from app.services.rag.engine import RAGEngine
from app.services.rag.ingestion import IngestionPipeline
from app.services.rag.response_generator import GroqResponseGenerator
from app.services.rag.text_chunker import SentenceTextChunker
from app.services.rag.vector_store import PostgresVectorStore

logger = logging.getLogger(__name__)

_embedding_service: GroqEmbeddingService | None = None
_response_generator: GroqResponseGenerator | None = None


def get_embedding_service() -> GroqEmbeddingService:
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = GroqEmbeddingService()
    return _embedding_service


def get_response_generator() -> GroqResponseGenerator:
    global _response_generator
    if _response_generator is None:
        _response_generator = GroqResponseGenerator()
    return _response_generator


def build_ingestion_pipeline() -> IngestionPipeline:
    return IngestionPipeline(
        loader=PDFDocumentLoader(),
        chunker=SentenceTextChunker(chunk_size=512, chunk_overlap=64),
        embedding_service=get_embedding_service(),
    )


def build_rag_engine(db: Session) -> RAGEngine:
    return RAGEngine(
        embedding_service=get_embedding_service(),
        vector_store=PostgresVectorStore(db),
        response_generator=get_response_generator(),
    )
