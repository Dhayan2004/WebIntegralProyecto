from sqlalchemy.orm import Session


class BaseRepository:
    @staticmethod
    def add(db: Session, instance):
        db.add(instance)
        db.commit()
        db.refresh(instance)
        return instance

    @staticmethod
    def delete(db: Session, instance) -> None:
        db.delete(instance)
        db.commit()
