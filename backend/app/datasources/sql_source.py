from sqlalchemy import text
from sqlalchemy.orm import Session

from .base import DataSource

# Builders reference a query by name in config; only queries registered here
# can run, so form config JSON never carries raw SQL.
REGISTERED_QUERIES: dict[str, str] = {}


class SqlDataSource(DataSource):
    def __init__(self, db: Session):
        self.db = db

    def get_options(self, query: str) -> list[str]:
        sql = REGISTERED_QUERIES.get(query)
        if sql is None:
            raise ValueError(f"Unregistered query: {query}")
        result = self.db.execute(text(sql))
        return [str(row[0]) for row in result]
