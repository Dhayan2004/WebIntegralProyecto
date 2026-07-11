import math
from dataclasses import dataclass


@dataclass
class PaginationParams:
    page: int
    page_size: int
    total_items: int

    @property
    def total_pages(self) -> int:
        return math.ceil(self.total_items / self.page_size) if self.page_size else 0

    @property
    def has_next(self) -> bool:
        return self.page < self.total_pages

    @property
    def has_previous(self) -> bool:
        return self.page > 1

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size

    def to_dict(self) -> dict:
        return {
            "page": self.page,
            "page_size": self.page_size,
            "total_items": self.total_items,
            "total_pages": self.total_pages,
            "has_next": self.has_next,
            "has_previous": self.has_previous,
        }


def paginate_query(query, page: int = 1, page_size: int = 20):
    total = query.count()
    params = PaginationParams(page=page, page_size=page_size, total_items=total)
    items = query.offset(params.offset).limit(params.limit).all()
    return items, params
