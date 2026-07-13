from sqlalchemy.orm import Session
from app.db.models.document import Document, DocumentChunk
from app.services.rag.llama_index_client import LlamaIndexClient

def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot_product = sum(x * y for x, y in zip(v1, v2))
    norm_v1 = sum(x * x for x in v1) ** 0.5
    norm_v2 = sum(x * x for x in v2) ** 0.5
    if not norm_v1 or not norm_v2:
        return 0.0
    return dot_product / (norm_v1 * norm_v2)

class RetrievalService:
    @staticmethod
    def retrieve_relevant_chunks(
        db: Session,
        query: str,
        user_id: str,
        document_id: str | None = None,
        limit: int = 5
    ) -> list[tuple[DocumentChunk, float]]:
        # Get query embedding
        query_embedding = LlamaIndexClient.get_embedding(query)

        # Build query for document chunks
        # Filter by user_id to ensure light multi-tenant isolation (security requirement)
        chunk_query = db.query(DocumentChunk).join(Document)
        if document_id:
            chunk_query = chunk_query.filter(Document.id == document_id)
        chunk_query = chunk_query.filter(Document.user_id == user_id)
        
        chunks = chunk_query.all()
        
        # Calculate similarity in python
        scored_chunks = []
        for chunk in chunks:
            if not chunk.embedding:
                continue
            sim = cosine_similarity(query_embedding, chunk.embedding)
            scored_chunks.append((chunk, sim))
            
        # Sort by similarity desc
        scored_chunks.sort(key=lambda x: x[1], reverse=True)
        return scored_chunks[:limit]
