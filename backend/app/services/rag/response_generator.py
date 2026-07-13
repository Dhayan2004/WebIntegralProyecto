import logging

from app.core.config import settings
from app.services.rag.ports import ResponseGenerator

logger = logging.getLogger(__name__)


class GroqResponseGenerator(ResponseGenerator):
    GROQ_MODELS = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "gemma2-9b-it",
    ]

    def __init__(self):
        self._client = None
        self._initialized = False
        self._model = self.GROQ_MODELS[0]

    def _ensure_initialized(self):
        if self._initialized:
            return
        api_key = settings.GROQ_API_KEY
        if not api_key or api_key in ("your-groq-api-key-here", "change-me"):
            logger.warning("No valid GROQ_API_KEY. Using mock response generator.")
            self._client = None
        else:
            try:
                from openai import OpenAI
                self._client = OpenAI(
                    api_key=api_key,
                    base_url="https://api.groq.com/openai/v1",
                )
                logger.info("Groq response generator initialized with model: %s", self._model)
            except Exception as e:
                logger.error("Failed to initialize Groq client: %s", e)
                self._client = None
        self._initialized = True

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        self._ensure_initialized()
        if self._client is None:
            return self._mock_response(system_prompt, user_prompt)
        try:
            response = self._client.chat.completions.create(
                model=self._model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.3,
                max_tokens=2048,
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error("Groq generation error: %s", e)
            return f"Error generando respuesta: {e}"

    @staticmethod
    def _mock_response(system_prompt: str, user_prompt: str) -> str:
        return (
            "[MOCK RESPONSE - GROQ API key not configured]\n"
            "Para obtener respuestas reales, configura GROQ_API_KEY en .env.\n\n"
            f"Consulta: '{user_prompt[:150]}'"
        )


class LocalMockResponseGenerator(ResponseGenerator):
    def generate(self, system_prompt: str, user_prompt: str) -> str:
        return (
            "[MOCK RESPONSE - No AI provider configured]\n"
            f"Consulta: '{user_prompt[:150]}'"
        )
