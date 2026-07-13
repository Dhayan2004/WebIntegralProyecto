import logging

from app.services.rag.ports import LoadedDocument, TextChunk, TextChunker

logger = logging.getLogger(__name__)


class SentenceTextChunker(TextChunker):
    def __init__(self, chunk_size: int = 512, chunk_overlap: int = 64):
        self._chunk_size = chunk_size
        self._chunk_overlap = chunk_overlap

    def chunk(self, documents: list[LoadedDocument]) -> list[TextChunk]:
        chunks: list[TextChunk] = []
        for doc in documents:
            sentences = self._split_sentences(doc.text)
            current_chunk = ""
            for sentence in sentences:
                if len(current_chunk) + len(sentence) > self._chunk_size and current_chunk:
                    chunks.append(
                        TextChunk(
                            content=current_chunk.strip(),
                            page_number=doc.page_number,
                            metadata=doc.metadata,
                        )
                    )
                    overlap_text = current_chunk[-self._chunk_overlap :] if self._chunk_overlap else ""
                    current_chunk = overlap_text + " " + sentence
                else:
                    current_chunk = (current_chunk + " " + sentence).strip()

            if current_chunk.strip():
                chunks.append(
                    TextChunk(
                        content=current_chunk.strip(),
                        page_number=doc.page_number,
                        metadata=doc.metadata,
                    )
                )

        logger.info("Produced %d chunks from %d documents", len(chunks), len(documents))
        return chunks

    @staticmethod
    def _split_sentences(text: str) -> list[str]:
        import re
        return [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]
