import json

from .base_strategy import BaseStrategy
from app.services.rag.container import get_response_generator


class QuizStrategy(BaseStrategy):
    def build(self, text: str, count: int = 5) -> list[dict]:
        if not text or not text.strip():
            return []

        system_prompt = (
            f"Eres un asistente academico. Genera exactamente {count} preguntas de opcion multiple para examen a partir del texto.\n"
            "Cada pregunta debe tener una pregunta, una lista de exactamente 4 opciones y la respuesta correcta que debe coincidir con una de las opciones.\n"
            "Responde estrictamente en formato JSON de lista de objetos:\n"
            "[\n"
            "  {\n"
            '    "question": "pregunta",\n'
            '    "options": ["opcion A", "opcion B", "opcion C", "opcion D"],\n'
            '    "correct_answer": "opcion A"\n'
            "  }\n"
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
            quizzes = json.loads(clean_response)
            if isinstance(quizzes, list):
                return quizzes
        except Exception:
            pass

        fallback_quizzes = []
        sentences = [s.strip() for s in text.replace("\n", ". ").split(".") if s.strip()]
        for idx, s in enumerate(sentences[:count]):
            correct = s[:100]
            fallback_quizzes.append({
                "question": f"Pregunta {idx+1}: Cual de los siguientes puntos es correcto sobre el texto?",
                "options": [correct, "Una idea incorrecta", "Un dato erroneo", "Ninguna de las anteriores"],
                "correct_answer": correct,
            })
        return fallback_quizzes
