from .base_strategy import BaseStrategy
class SummaryStrategy(BaseStrategy):
    def build(self, text: str, count: int = 1):
        clean = " ".join((text or "").split())
        return clean[:700] + ("..." if len(clean) > 700 else "") if clean else "No hay contenido suficiente para generar un resumen."
