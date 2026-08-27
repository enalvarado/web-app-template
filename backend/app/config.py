from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "mssql+pyodbc://localhost/webapptemplate?driver=ODBC+Driver+17+for+SQL+Server"
    storage_dir: str = "./storage"
    api_key: str = "dev-only-change-me"
    cors_origins: list[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"


settings = Settings()
