import json

from .base_strategy import BaseStrategy
from app.services.rag.container import get_response_generator


class FlashcardStrategy(BaseStrategy):
    def build(self, text: str, count: int = 5) -> list[dict]:
        if not text or not text.strip():
            return []

        system_prompt = (
            f"Eres un asistente academico. Genera exactamente {count} tarjetas de estudio (flashcards) a partir del texto.\n"
            "Cada tarjeta debe tener una pregunta clara y concisa y su correspondiente respuesta.\n"
            "Responde estrictamente en formato JSON de lista de objetos:\n"
            "[\n"
            '  {"question": "pregunta", "answer": "respuesta"}\n'
            "]\n"
            "No agregues texto extra, etiquetas de codigo markdown ni explicaciones."
        )
        user_prompt = f"Texto de estudio:\n\n{text}"

        generator = get_response_generator()
        response = generator.generate(system_prompt, user_prompt)

        clean_response = response.strip()
        if clean_response.startswith("```json"):
            clean_response = clean_response[7:]
        elif clean_response.startswith("```"):
            clean_response = clean_response[3:]
        if clean_response.endswith("```"):
            clean_response = clean_response[:-3]
        clean_response = clean_response.strip()

        try:
            cards = json.loads(clean_response)
            if isinstance(cards, list):
                return cards
        except Exception:
            pass

        fallback_cards = []
        sentences = [s.strip() for s in text.replace("\n", ". ").split(".") if s.strip()]
        for idx, s in enumerate(sentences[:count]):
            fallback_cards.append({
                "question": f"Que es lo mas importante de esta seccion (Parte {idx+1})?",
                "answer": s[:500],
            })
        return fallback_cards
