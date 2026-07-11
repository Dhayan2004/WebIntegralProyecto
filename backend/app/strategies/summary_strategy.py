from .base_strategy import BaseStrategy
from app.services.rag.container import get_response_generator


class SummaryStrategy(BaseStrategy):
    def build(self, text: str, count: int = 1) -> str:
        if not text or not text.strip():
            return "No hay contenido suficiente para generar un resumen."

        system_prompt = (
            "Eres un asistente academico experto. Tu tarea es generar un resumen estructurado, "
            "detallado y claro del siguiente texto, organizado por capitulos o secciones logicas. "
            "Usa viñetas para que sea facil de estudiar."
        )
        user_prompt = f"Por favor, resume el siguiente texto:\n\n{text}"

        generator = get_response_generator()
        return generator.generate(system_prompt, user_prompt)
