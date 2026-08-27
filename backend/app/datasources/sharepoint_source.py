from .base import DataSource


class SharePointDataSource(DataSource):
    """Legacy support via Microsoft Graph API; not yet implemented."""

    def get_options(self, query: str) -> list[str]:
        raise NotImplementedError("SharePoint data source not yet implemented")
