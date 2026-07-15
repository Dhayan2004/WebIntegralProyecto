import logging
import math

from sqlalchemy.orm import Session

from app.db.models.document import Document, DocumentChunk
from app.services.rag.ports import VectorStore

logger = logging.getLogger(__name__)


def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot_product = sum(x * y for x, y in zip(v1, v2))
    norm_v1 = math.sqrt(sum(x * x for x in v1))
    norm_v2 = math.sqrt(sum(x * x for x in v2))
    if not norm_v1 or not norm_v2:
        return 0.0
    return dot_product / (norm_v1 * norm_v2)


class PostgresVectorStore(VectorStore):
    def __init__(self, db: Session):
        self._db = db

    def add(self, chunk_id: str, content: str, embedding: list[float], metadata: dict) -> None:
        chunk = DocumentChunk(
            id=chunk_id,
            document_id=metadata.get("document_id", ""),
            content=content,
            embedding=embedding,
            page_number=metadata.get("page_number", 1),
        )
        self._db.add(chunk)

    def search(self, query_embedding: list[float], limit: int = 5, filters: dict | None = None) -> list[tuple[str, float, dict]]:
        document_id = filters.get("document_id") if filters else None
        user_id = filters.get("user_id") if filters else None

        chunk_query = self._db.query(DocumentChunk).join(Document)
        if document_id:
            chunk_query = chunk_query.filter(Document.id == document_id)
        if user_id:
            chunk_query = chunk_query.filter(Document.user_id == user_id)

        chunks = chunk_query.all()

        scored: list[tuple[str, float, dict]] = []
        for chunk in chunks:
            if not chunk.embedding:
                continue
            sim = cosine_similarity(query_embedding, chunk.embedding)
            scored.append(
                (
                    chunk.id,
                    sim,
                    {
                        "chunk_id": chunk.id,
                        "document_id": chunk.document_id,
                        "content": chunk.content,
                        "page_number": chunk.page_number,
                    },
                )
            )

        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:limit]

    def delete_by_filter(self, filters: dict) -> None:
        document_id = filters.get("document_id")
        if document_id:
            self._db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).delete()
