
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.models.document import Document
from app.db.models.quiz import Quiz
from app.db.models.user import User


class QuizService:
	@staticmethod
	def list_quizzes(db: Session, current_user: User) -> list[Quiz]:
		return db.query(Quiz).filter(Quiz.user_id == current_user.id).order_by(Quiz.created_at.desc()).all()

	@staticmethod
	def create_quiz(db: Session, current_user: User, data: dict) -> Quiz:
		quiz = Quiz(user_id=current_user.id, **data)
		db.add(quiz)
		db.commit()
		db.refresh(quiz)
		return quiz

	@staticmethod
	def generate_quizzes(db: Session, current_user: User, document_id: str | None = None, text: str | None = None, count: int = 5) -> list[Quiz]:
		source_text = text or ""
		if document_id:
			document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
			if not document:
				raise HTTPException(status_code=404, detail="Documento no encontrado")
			source_text = source_text or document.content or document.title

		fragments = [part.strip() for part in source_text.replace("\n", ". ").split(".") if part.strip()] or ["Concepto principal"]
		quizzes: list[Quiz] = []
		for index, fragment in enumerate(fragments[: max(1, min(count, 20))], start=1):
			correct = fragment[:120]
			quiz = Quiz(
				user_id=current_user.id,
				document_id=document_id,
				question=f"Pregunta {index}: Cual opcion resume mejor el contenido?",
				options=[correct, "Una idea no relacionada", "Un dato insuficiente", "Ninguna de las anteriores"],
				correct_answer=correct,
			)
			db.add(quiz)
			quizzes.append(quiz)
		db.commit()
		for quiz in quizzes:
			db.refresh(quiz)
		return quizzes

