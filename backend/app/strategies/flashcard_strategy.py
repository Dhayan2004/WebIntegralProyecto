from .base_strategy import BaseStrategy
class FlashcardStrategy(BaseStrategy):
    def build(self, text: str, count: int = 1):
        concepts = [part.strip() for part in (text or "").replace("\n", ". ").split(".") if part.strip()]
        return concepts[: max(1, min(count, 20))] or ["Concepto principal"]
