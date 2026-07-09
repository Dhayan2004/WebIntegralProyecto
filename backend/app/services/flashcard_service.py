
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

		concepts = [part.strip() for part in source_text.replace("\n", ". ").split(".") if part.strip()]
		if not concepts:
			concepts = ["Concepto principal"]

		cards: list[Flashcard] = []
		for index, concept in enumerate(concepts[: max(1, min(count, 20))], start=1):
			card = Flashcard(
				user_id=current_user.id,
				document_id=document_id,
				question=f"Pregunta {index}: Que debes recordar sobre este tema?",
				answer=concept[:500],
			)
			db.add(card)
			cards.append(card)
		db.commit()
		for card in cards:
			db.refresh(card)
		return cards

