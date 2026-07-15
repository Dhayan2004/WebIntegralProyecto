from app.clients.ai_client import AIClient


class LlamaClient(AIClient):
    def generate_text(self, prompt: str) -> str:
        return super().generate_text(prompt)
