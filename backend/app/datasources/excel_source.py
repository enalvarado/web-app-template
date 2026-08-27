from .base import DataSource


class ExcelDataSource(DataSource):
    """Legacy support via Microsoft Graph API; not yet implemented."""

    def get_options(self, query: str) -> list[str]:
        raise NotImplementedError("Excel data source not yet implemented")
