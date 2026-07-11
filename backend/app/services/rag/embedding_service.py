import hashlib
import logging

import numpy as np

from app.services.rag.ports import EmbeddingService

logger = logging.getLogger(__name__)

EMBEDDING_DIMENSION = 768


class GroqEmbeddingService(EmbeddingService):
    """Embedding service con embeddings deterministas locales.

    Groq no soporta endpoints de embedding, asi que usamos un enfoque local
    basado en hashing de contenido + numpy para generar vectores consistentes
    que permiten busqueda por similitud coseno.
    """

    def embed(self, text: str) -> list[float]:
        return self._local_embedding(text)

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        return [self._local_embedding(text) for text in texts]

    @staticmethod
    def _local_embedding(text: str) -> list[float]:
        text = text.lower().strip()
        tokens = text.split()

        seed = int(hashlib.sha256(text.encode()).hexdigest(), 16) % (2**32)
        rng = np.random.RandomState(seed)

        base_vector = rng.uniform(-1, 1, EMBEDDING_DIMENSION).astype(np.float64)

        for i, token in enumerate(tokens[:200]):
            token_hash = int(hashlib.md5(token.encode()).hexdigest(), 16) % EMBEDDING_DIMENSION
            weight = 1.0 / (1.0 + i * 0.1)
            base_vector[token_hash] += weight

        bigrams = [f"{tokens[i]}_{tokens[i+1]}" for i in range(len(tokens) - 1)]
        for bigram in bigrams[:100]:
            bh = int(hashlib.md5(bigram.encode()).hexdigest(), 16) % EMBEDDING_DIMENSION
            base_vector[bh] += 0.5

        norm = np.linalg.norm(base_vector)
        if norm > 0:
            base_vector = base_vector / norm

        return base_vector.tolist()
