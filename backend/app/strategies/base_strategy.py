class BaseStrategy:
    def build(self, text: str, count: int = 1):
        raise NotImplementedError
