import logging

from sqlalchemy.orm import Session

from app.db.models.document import Document
from app.services.rag.ports import EmbeddingService, ResponseGenerator, VectorStore

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_TEMPLATE = (
    "Eres StudyBuddy, un asistente de estudio inteligente e interactivo.\n"
    "Tu tarea es responder a la pregunta del usuario utilizando unicamente el contexto proporcionado.\n"
    "Se preciso, didactico y cita siempre las fuentes indicando el documento y la pagina si estan disponibles.\n"
    "Si no encuentras la respuesta en el contexto, indicalo amablemente.\n\n"
    "--- CONTEXTO DE DOCUMENTOS DE ESTUDIO ---\n{context}"
)


class RAGEngine:
    def __init__(
        self,
        embedding_service: EmbeddingService,
        vector_store: VectorStore,
        response_generator: ResponseGenerator,
    ):
        self._embedding_service = embedding_service
        self._vector_store = vector_store
        self._response_generator = response_generator

    def answer(
        self,
        db: Session,
        user_id: str,
        question: str,
        document_id: str | None = None,
        top_k: int = 4,
    ) -> dict:
        query_embedding = self._embedding_service.embed(question)

        filters = {"user_id": user_id}
        if document_id:
            filters["document_id"] = document_id

        results = self._vector_store.search(query_embedding, limit=top_k, filters=filters)

        if not results:
            return {
                "answer": "No se encontraron fragmentos relevantes en tus documentos para responder esta pregunta. Sube documentos PDF para comenzar.",
                "sources": [],
            }

        context_parts: list[str] = []
        sources: list[dict] = []

        for i, (_, score, meta) in enumerate(results):
            doc = db.query(Document).filter(Document.id == meta["document_id"]).first()
            doc_title = doc.title if doc else "Documento desconocido"
            doc_filename = doc.file_name if (doc and doc.file_name) else doc_title

            context_parts.append(
                f"Source [{i+1}]: {doc_filename} (Page: {meta['page_number']})\n"
                f"Content: {meta['content']}\n"
            )
            sources.append({
                "document_id": meta["document_id"],
                "document_title": doc_title,
                "file_name": doc_filename,
                "page_number": meta["page_number"],
                "similarity_score": float(score),
            })

        context_text = "\n---\n".join(context_parts)
        system_prompt = SYSTEM_PROMPT_TEMPLATE.format(context=context_text)

        answer = self._response_generator.generate(system_prompt, question)

        return {"answer": answer, "sources": sources}
