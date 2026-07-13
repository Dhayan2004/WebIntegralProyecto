
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.models.subject import Subject
from app.db.models.user import User


class SubjectService:
	@staticmethod
	def list_subjects(db: Session, current_user: User) -> list[Subject]:
		return db.query(Subject).filter(Subject.user_id == current_user.id).order_by(Subject.created_at.desc()).all()

	@staticmethod
	def create_subject(db: Session, current_user: User, data: dict) -> Subject:
		subject = Subject(user_id=current_user.id, **data)
		db.add(subject)
		db.commit()
		db.refresh(subject)
		return subject

	@staticmethod
	def get_subject(db: Session, subject_id: str, current_user: User) -> Subject:
		subject = db.query(Subject).filter(Subject.id == subject_id, Subject.user_id == current_user.id).first()
		if not subject:
			raise HTTPException(status_code=404, detail="Materia no encontrada")
		return subject

	@staticmethod
	def update_subject(db: Session, subject_id: str, current_user: User, data: dict) -> Subject:
		subject = SubjectService.get_subject(db, subject_id, current_user)
		for key, value in data.items():
			setattr(subject, key, value)
		db.commit()
		db.refresh(subject)
		return subject

	@staticmethod
	def delete_subject(db: Session, subject_id: str, current_user: User) -> None:
		subject = SubjectService.get_subject(db, subject_id, current_user)
		db.delete(subject)
		db.commit()

