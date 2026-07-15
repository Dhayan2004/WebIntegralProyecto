from sqlalchemy.orm import Session
from app.services.rag.retrieval import RetrievalService
from app.services.rag.llama_index_client import LlamaIndexClient
from app.db.models.document import Document

class RAGOrchestrator:
    @staticmethod
    def answer_question(
        db: Session,
        user_id: str,
        question: str,
        document_id: str | None = None
    ) -> dict:
        # Retrieve top relevant chunks
        scored_chunks = RetrievalService.retrieve_relevant_chunks(
            db=db,
            query=question,
            user_id=user_id,
            document_id=document_id,
            limit=4
        )

        if not scored_chunks:
            return {
                "answer": "No he encontrado fragmentos de texto en tus documentos cargados para responder a esta pregunta. Por favor, asegúrate de subir documentos PDF y de que la ingesta se complete.",
                "sources": []
            }

        # Build context
        context_parts = []
        sources = []
        for i, (chunk, score) in enumerate(scored_chunks):
            # Fetch document info to cite
            doc = db.query(Document).filter(Document.id == chunk.document_id).first()
            doc_title = doc.title if doc else "Documento desconocido"
            doc_filename = doc.file_name if (doc and doc.file_name) else doc_title
            
            context_parts.append(
                f"Source [{i+1}]: {doc_filename} (Page: {chunk.page_number})\nContent: {chunk.content}\n"
            )
            sources.append({
                "document_id": chunk.document_id,
                "document_title": doc_title,
                "file_name": doc_filename,
                "page_number": chunk.page_number,
                "similarity_score": float(score)
            })

        context_text = "\n---\n".join(context_parts)

        system_prompt = (
            "Eres StudyBuddy, un asistente de estudio inteligente e interactivo.\n"
            "Tu tarea es responder a la pregunta del usuario utilizando únicamente el contexto proporcionado.\n"
            "Sé preciso, didáctico y cita siempre las fuentes indicando el documento y la página si están disponibles.\n"
            "Si no encuentras la respuesta en el contexto, indícalo amablemente.\n\n"
            f"--- CONTEXTO DE DOCUMENTOS DE ESTUDIO ---\n{context_text}"
        )

        answer = LlamaIndexClient.generate_completion(system_prompt, question)

        return {
            "answer": answer,
            "sources": sources
        }
