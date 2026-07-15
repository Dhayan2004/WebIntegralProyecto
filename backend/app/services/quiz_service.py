
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

		from app.strategies.quiz_strategy import QuizStrategy
		strategy = QuizStrategy()
		generated_quizzes = strategy.build(source_text, count)

		quizzes: list[Quiz] = []
		for q in generated_quizzes:
			quiz = Quiz(
				user_id=current_user.id,
				document_id=document_id,
				question=q.get("question", "Pregunta de examen"),
				options=q.get("options", ["Opción A", "Opción B", "Opción C", "Opción D"]),
				correct_answer=q.get("correct_answer", "Opción A"),
			)
			db.add(quiz)
			quizzes.append(quiz)
		db.commit()
		for quiz in quizzes:
			db.refresh(quiz)
		return quizzes

