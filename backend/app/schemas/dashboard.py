from pydantic import BaseModel


class DashboardMetrics(BaseModel):
    subjects: int
    documents: int
    summaries: int
    flashcards: int
    quizzes: int
    chat_messages: int
