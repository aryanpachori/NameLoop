"""Apply sql/001_init.sql using DATABASE_URL from .env."""

from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

from app.config import get_settings  # noqa: E402


def main() -> None:
    settings = get_settings()
    sql_path = ROOT / "sql" / "001_init.sql"
    sql = sql_path.read_text(encoding="utf-8")
    engine = create_engine(settings.sqlalchemy_url)
    with engine.begin() as conn:
        conn.execute(text(sql))
    print(f"Applied {sql_path.name}")


if __name__ == "__main__":
    main()
