from .base_repository import BaseRepository
class StudyRoomRepository(BaseRepository):
    @staticmethod
    def list_by_user(db, user_id: str):
        from app.db.models.study_room import StudyRoom

        return db.query(StudyRoom).filter(StudyRoom.user_id == user_id).order_by(StudyRoom.created_at.desc()).all()

    @staticmethod
    def get_by_id(db, room_id: str, user_id: str):
        from app.db.models.study_room import StudyRoom

        return db.query(StudyRoom).filter(StudyRoom.id == room_id, StudyRoom.user_id == user_id).first()
