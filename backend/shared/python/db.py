"""Database utilities for Chako backend services."""
from typing import Any, Dict, List, Optional
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Get database connection with RLS enabled."""
    conn = psycopg2.connect(
        dbname=os.environ.get('DB_NAME'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        host=os.environ.get('DB_HOST'),
        port=os.environ.get('DB_PORT', 5432)
    )
    # Enable RLS for all connections
    with conn.cursor() as cur:
        cur.execute('SET row_security = on;')
    return conn

def execute_query(query: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """Execute a query with SQL injection prevention."""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query, params or {})
            return cur.fetchall()
    finally:
        conn.close()
