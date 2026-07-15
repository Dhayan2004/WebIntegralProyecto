from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class LoadedDocument:
    text: str
    page_number: int
    metadata: dict | None = None


@dataclass
class TextChunk:
    content: str
    page_number: int
    metadata: dict | None = None


class DocumentLoader(ABC):
    @abstractmethod
    def load(self, raw_bytes: bytes, filename: str) -> list[LoadedDocument]:
        ...


class TextChunker(ABC):
    @abstractmethod
    def chunk(self, documents: list[LoadedDocument]) -> list[TextChunk]:
        ...


class EmbeddingService(ABC):
    @abstractmethod
    def embed(self, text: str) -> list[float]:
        ...

    @abstractmethod
    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        ...


class VectorStore(ABC):
    @abstractmethod
    def add(self, chunk_id: str, content: str, embedding: list[float], metadata: dict) -> None:
        ...

    @abstractmethod
    def search(self, query_embedding: list[float], limit: int, filters: dict | None = None) -> list[tuple[str, float, dict]]:
        ...

    @abstractmethod
    def delete_by_filter(self, filters: dict) -> None:
        ...


class ResponseGenerator(ABC):
    @abstractmethod
    def generate(self, system_prompt: str, user_prompt: str) -> str:
        ...
