from .base_strategy import BaseStrategy
from app.services.rag.llama_index_client import LlamaIndexClient

class SummaryStrategy(BaseStrategy):
    def build(self, text: str, count: int = 1) -> str:
        if not text or not text.strip():
            return "No hay contenido suficiente para generar un resumen."
        
        system_prompt = (
            "Eres un asistente académico experto. Tu tarea es generar un resumen estructurado, "
            "detallado y claro del siguiente texto, organizado por capítulos o secciones lógicas. "
            "Usa viñetas para que sea fácil de estudiar."
        )
        user_prompt = f"Por favor, resume el siguiente texto:\n\n{text}"
        
        return LlamaIndexClient.generate_completion(system_prompt, user_prompt)

