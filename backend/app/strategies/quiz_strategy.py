from .base_strategy import BaseStrategy
class QuizStrategy(BaseStrategy):
    def build(self, text: str, count: int = 1):
        fragments = [part.strip() for part in (text or "").replace("\n", ". ").split(".") if part.strip()]
        return fragments[: max(1, min(count, 20))] or ["Concepto principal"]
