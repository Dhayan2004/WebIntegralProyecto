
from sqlalchemy.orm import Session

from app.db.models.chat_message import ChatMessage
from app.db.models.document import Document
from app.db.models.flashcard import Flashcard
from app.db.models.quiz import Quiz
from app.db.models.subject import Subject
from app.db.models.summary import Summary
from app.db.models.user import User


class DashboardService:
	@staticmethod
	def metrics(db: Session, current_user: User) -> dict:
		return {
			"subjects": db.query(Subject).filter(Subject.user_id == current_user.id).count(),
			"documents": db.query(Document).filter(Document.user_id == current_user.id).count(),
			"summaries": db.query(Summary).filter(Summary.user_id == current_user.id).count(),
			"flashcards": db.query(Flashcard).filter(Flashcard.user_id == current_user.id).count(),
			"quizzes": db.query(Quiz).filter(Quiz.user_id == current_user.id).count(),
			"chat_messages": db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).count(),
		}

