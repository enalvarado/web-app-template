from abc import ABC, abstractmethod


class DataSource(ABC):
    @abstractmethod
    def get_options(self, query: str) -> list[str]: ...
