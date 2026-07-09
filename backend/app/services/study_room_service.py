
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.models.study_room import StudyRoom
from app.db.models.user import User


class StudyRoomService:
	@staticmethod
	def list_study_rooms(db: Session, current_user: User) -> list[StudyRoom]:
		return db.query(StudyRoom).filter(StudyRoom.user_id == current_user.id).order_by(StudyRoom.created_at.desc()).all()

	@staticmethod
	def create_study_room(db: Session, current_user: User, name: str, description: str | None = None) -> StudyRoom:
		room = StudyRoom(user_id=current_user.id, name=name, description=description)
		db.add(room)
		db.commit()
		db.refresh(room)
		return room

	@staticmethod
	def get_study_room(db: Session, room_id: str, current_user: User) -> StudyRoom:
		room = db.query(StudyRoom).filter(StudyRoom.id == room_id, StudyRoom.user_id == current_user.id).first()
		if not room:
			raise HTTPException(status_code=404, detail="Sala de estudio no encontrada")
		return room

	@staticmethod
	def update_study_room(db: Session, room_id: str, current_user: User, data: dict) -> StudyRoom:
		room = StudyRoomService.get_study_room(db, room_id, current_user)
		for key, value in data.items():
			setattr(room, key, value)
		db.commit()
		db.refresh(room)
		return room

	@staticmethod
	def delete_study_room(db: Session, room_id: str, current_user: User) -> None:
		room = StudyRoomService.get_study_room(db, room_id, current_user)
		db.delete(room)
		db.commit()

