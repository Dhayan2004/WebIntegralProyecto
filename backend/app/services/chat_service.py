
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.models.chat_message import ChatMessage, ChatSession
from app.db.models.user import User


class ChatService:
	@staticmethod
	def list_sessions(db: Session, current_user: User) -> list[ChatSession]:
		return (
			db.query(ChatSession)
			.filter(ChatSession.user_id == current_user.id)
			.order_by(ChatSession.updated_at.desc())
			.all()
		)

	@staticmethod
	def create_session(db: Session, current_user: User, title: str) -> ChatSession:
		session = ChatSession(user_id=current_user.id, title=title)
		db.add(session)
		db.commit()
		db.refresh(session)
		return session

	@staticmethod
	def get_session(db: Session, session_id: str, current_user: User) -> ChatSession:
		session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
		if not session:
			raise HTTPException(status_code=404, detail="Sesion no encontrada")
		return session

	@staticmethod
	def list_messages(db: Session, session_id: str, current_user: User) -> list[ChatMessage]:
		ChatService.get_session(db, session_id, current_user)
		return (
			db.query(ChatMessage)
			.filter(ChatMessage.session_id == session_id)
			.order_by(ChatMessage.created_at.asc())
			.all()
		)

	@staticmethod
	def send_message(db: Session, session_id: str, current_user: User, message: str) -> list[ChatMessage]:
		session = ChatService.get_session(db, session_id, current_user)
		user_message = ChatMessage(session_id=session.id, user_id=current_user.id, role="user", content=message)
		
		# Call RAG Engine to generate answer
		from app.services.rag_question_service import RAGQuestionService
		rag_result = RAGQuestionService.answer(db, current_user.id, message)
		assistant_text = rag_result["answer"]
		
		assistant_message = ChatMessage(session_id=session.id, user_id=current_user.id, role="assistant", content=assistant_text)
		db.add_all([user_message, assistant_message])
		db.commit()
		db.refresh(user_message)
		db.refresh(assistant_message)
		return [user_message, assistant_message]

