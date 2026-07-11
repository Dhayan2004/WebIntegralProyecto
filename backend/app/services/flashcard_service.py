
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.models.document import Document
from app.db.models.flashcard import Flashcard
from app.db.models.user import User


class FlashcardService:
	@staticmethod
	def list_flashcards(db: Session, current_user: User) -> list[Flashcard]:
		return db.query(Flashcard).filter(Flashcard.user_id == current_user.id).order_by(Flashcard.created_at.desc()).all()

	@staticmethod
	def create_flashcard(db: Session, current_user: User, data: dict) -> Flashcard:
		card = Flashcard(user_id=current_user.id, **data)
		db.add(card)
		db.commit()
		db.refresh(card)
		return card

	@staticmethod
	def generate_flashcards(db: Session, current_user: User, document_id: str | None = None, text: str | None = None, count: int = 5) -> list[Flashcard]:
		source_text = text or ""
		if document_id:
			document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
			if not document:
				raise HTTPException(status_code=404, detail="Documento no encontrado")
			source_text = source_text or document.content or document.title

		from app.strategies.flashcard_strategy import FlashcardStrategy
		strategy = FlashcardStrategy()
		generated_cards = strategy.build(source_text, count)

		cards: list[Flashcard] = []
		for concept in generated_cards:
			card = Flashcard(
				user_id=current_user.id,
				document_id=document_id,
				question=concept.get("question", "Pregunta de estudio"),
				answer=concept.get("answer", ""),
			)
			db.add(card)
			cards.append(card)
		db.commit()
		for card in cards:
			db.refresh(card)
		return cards

