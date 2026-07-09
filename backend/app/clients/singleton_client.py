from app.clients.llama_client import LlamaClient


class SingletonClient:
    _instance: LlamaClient | None = None

    @classmethod
    def get_client(cls) -> LlamaClient:
        if cls._instance is None:
            cls._instance = LlamaClient()
        return cls._instance
