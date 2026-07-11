import os
import random
import numpy as np
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import Settings
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import Document as LlamaDocument

class LlamaIndexClient:
    _initialized = False
    _is_mock = False

    @classmethod
    def initialize(cls):
        if cls._initialized:
            return
        
        api_key = os.getenv("OPENAI_API_KEY", "")
        if not api_key or "your-openai" in api_key or api_key == "change-me":
            print("WARNING: Valid OPENAI_API_KEY not found in environment. Using Mock AI Service.")
            cls._is_mock = True
        else:
            try:
                Settings.llm = OpenAI(model="gpt-4o-mini", api_key=api_key)
                Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small", api_key=api_key)
                cls._is_mock = False
            except Exception as e:
                print(f"Error initializing OpenAI client: {e}. Falling back to mock.")
                cls._is_mock = True
        cls._initialized = True

    @classmethod
    def get_splitter(cls):
        return SentenceSplitter(chunk_size=512, chunk_overlap=64)

    @classmethod
    def get_embedding(cls, text: str) -> list[float]:
        cls.initialize()
        if cls._is_mock:
            # Return a mock embedding (dimension 1536)
            random.seed(hash(text))
            vec = [random.uniform(-1, 1) for _ in range(1536)]
            # Normalize vector
            norm = sum(x*x for x in vec) ** 0.5
            return [x / norm for x in vec]
        
        try:
            return Settings.embed_model.get_text_embedding(text)
        except Exception as e:
            print(f"Embedding error: {e}. Returning mock vector.")
            random.seed(hash(text))
            vec = [random.uniform(-1, 1) for _ in range(1536)]
            norm = sum(x*x for x in vec) ** 0.5
            return [x / norm for x in vec]

    @classmethod
    def generate_completion(cls, system_prompt: str, user_prompt: str) -> str:
        cls.initialize()
        if cls._is_mock:
            return (
                "[MOCK RESPONSE - OpenAI API key not set in .env]\n"
                "Para obtener respuestas reales del motor RAG, por favor configura tu variable OPENAI_API_KEY en el archivo .env.\n\n"
                f"Simulación de respuesta basada en tu consulta:\n"
                f"Has preguntado sobre: '{user_prompt[:100]}'\n"
                f"El prompt del sistema fue: '{system_prompt[:100]}'"
            )
        try:
            response = Settings.llm.complete(
                f"{system_prompt}\n\nUser Question: {user_prompt}"
            )
            return str(response)
        except Exception as e:
            return f"Error llamando a OpenAI LLM: {e}. Asegúrate de que la API key en el archivo .env sea válida."
