from sqlalchemy.orm import Session

from app.services.rag.container import build_rag_engine


class RAGQuestionService:
    @staticmethod
    def answer(db: Session, user_id: str, question: str, document_id: str | None = None) -> dict:
        engine = build_rag_engine(db)
        return engine.answer(db, user_id, question, document_id)
