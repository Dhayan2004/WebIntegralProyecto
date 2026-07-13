from abc import ABC, abstractmethod


class BaseStrategy(ABC):
    @abstractmethod
    def build(self, text: str, count: int = 1):
        ...
