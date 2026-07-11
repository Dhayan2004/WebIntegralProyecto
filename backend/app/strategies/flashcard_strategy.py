import json
from .base_strategy import BaseStrategy
from app.services.rag.llama_index_client import LlamaIndexClient

class FlashcardStrategy(BaseStrategy):
    def build(self, text: str, count: int = 5) -> list[dict]:
        if not text or not text.strip():
            return []
            
        system_prompt = (
            f"Eres un asistente académico. Genera exactamente {count} tarjetas de estudio (flashcards) a partir del texto.\n"
            "Cada tarjeta debe tener una pregunta clara y concisa y su correspondiente respuesta.\n"
            "Responde estrictamente en formato JSON de lista de objetos:\n"
            "[\n"
            "  {\"question\": \"pregunta\", \"answer\": \"respuesta\"}\n"
            "]\n"
            "No agregues texto extra, etiquetas de código markdown ni explicaciones."
        )
        user_prompt = f"Texto de estudio:\n\n{text}"
        
        response = LlamaIndexClient.generate_completion(system_prompt, user_prompt)
        
        # Clean markdown code blocks if present
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
        except Exception as e:
            print(f"Error parsing flashcards JSON: {e}. Raw response: {response}")
            
        # Fallback
        fallback_cards = []
        sentences = [s.strip() for s in text.replace("\n", ". ").split(".") if s.strip()]
        for idx, s in enumerate(sentences[:count]):
            fallback_cards.append({
                "question": f"¿Qué es lo más importante de esta sección (Parte {idx+1})?",
                "answer": s[:500]
            })
        return fallback_cards

