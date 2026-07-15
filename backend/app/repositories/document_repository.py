from .base_repository import BaseRepository
class DocumentRepository(BaseRepository):
    @staticmethod
    def list_by_user(db, user_id: str):
        from app.db.models.document import Document

        return db.query(Document).filter(Document.user_id == user_id).order_by(Document.created_at.desc()).all()

    @staticmethod
    def get_by_id(db, document_id: str, user_id: str):
        from app.db.models.document import Document

        return db.query(Document).filter(Document.id == document_id, Document.user_id == user_id).first()
