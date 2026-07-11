
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.models.document import Document
from app.db.models.summary import Summary
from app.db.models.user import User


class SummaryService:
	@staticmethod
	def list_summaries(db: Session, current_user: User) -> list[Summary]:
		return (
			db.query(Summary)
			.filter(Summary.user_id == current_user.id)
			.order_by(Summary.created_at.desc())
			.all()
		)

	@staticmethod
	def build_summary(text: str) -> str:
		from app.strategies.summary_strategy import SummaryStrategy
		strategy = SummaryStrategy()
		return strategy.build(text)


	@staticmethod
	def create_summary(
		db: Session,
		current_user: User,
		title: str | None = None,
		content: str | None = None,
		document_id: str | None = None,
	) -> Summary:
		source = content or ""
		resolved_title = title or "Resumen"
		if document_id:
			document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
			if not document:
				raise HTTPException(status_code=404, detail="Documento no encontrado")
			source = source or document.content or document.title
			resolved_title = title or f"Resumen de {document.title}"

		summary = Summary(
			user_id=current_user.id,
			document_id=document_id,
			title=resolved_title,
			content=SummaryService.build_summary(source),
		)
		db.add(summary)
		db.commit()
		db.refresh(summary)
		return summary

