"""
SQLite Database Initializer and Modular Database Interface
Indigenous GPU-Accelerated Optimization Solver (SIH 2026 Problem ID: 26119 - MRPL)
Modular architecture designed for SQLite (prototype) with seamless migration to PostgreSQL.
"""

import sqlite3
import json
import os
from typing import Dict, Any, List, Optional

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "indigenous_solver.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'Refinery Optimization Engineer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # 2. models
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS models (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        model_type TEXT NOT NULL DEFAULT 'MILP',
        objective_sense TEXT NOT NULL DEFAULT 'minimize',
        raw_model JSON,
        status TEXT NOT NULL DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # 3. variables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS variables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_id TEXT NOT NULL,
        name TEXT NOT NULL,
        var_type TEXT NOT NULL, -- continuous, integer, binary
        lower_bound REAL DEFAULT 0,
        upper_bound REAL,
        objective_coeff REAL DEFAULT 0,
        unit TEXT,
        FOREIGN KEY (model_id) REFERENCES models (id) ON DELETE CASCADE
    );
    """)
    
    # 4. constraints
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS constraints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_id TEXT NOT NULL,
        name TEXT NOT NULL,
        expression TEXT NOT NULL,
        sense TEXT NOT NULL, -- <=, >=, ==
        rhs REAL NOT NULL,
        unit TEXT,
        FOREIGN KEY (model_id) REFERENCES models (id) ON DELETE CASCADE
    );
    """)
    
    # 5. optimization_runs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS optimization_runs (
        id TEXT PRIMARY KEY,
        model_id TEXT NOT NULL,
        status TEXT NOT NULL, -- QUEUED, RUNNING, OPTIMAL, FEASIBLE, INFEASIBLE
        objective_value REAL,
        runtime_seconds REAL,
        optimality_gap REAL,
        nodes_explored INTEGER,
        nodes_pruned INTEGER,
        cpu_time_ms REAL,
        gpu_time_ms REAL,
        speedup REAL,
        memory_usage_mb REAL,
        presolve_stats JSON,
        execution_log JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (model_id) REFERENCES models (id) ON DELETE CASCADE
    );
    """)
    
    # 6. solutions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS solutions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT NOT NULL,
        model_id TEXT NOT NULL,
        variable_values JSON NOT NULL,
        production_plan JSON NOT NULL,
        validation_status TEXT NOT NULL DEFAULT 'VERIFIED',
        validation_details JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (run_id) REFERENCES optimization_runs (id) ON DELETE CASCADE
    );
    """)
    
    # 7. benchmarks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS benchmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        problem_size TEXT NOT NULL, -- Small, Medium, Large, Industrial
        variables_count INTEGER NOT NULL,
        constraints_count INTEGER NOT NULL,
        non_zeros INTEGER NOT NULL,
        cpu_time_sec REAL NOT NULL,
        gpu_time_sec REAL NOT NULL,
        speedup_ratio REAL NOT NULL,
        optimality_gap REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # Seed default user if not exists
    cursor.execute("SELECT COUNT(*) FROM users;")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users (username, role) VALUES (?, ?)", 
                       ("mrpl_planner", "Senior Refinery Optimization Engineer"))
    
    # Seed sample benchmarks if empty
    cursor.execute("SELECT COUNT(*) FROM benchmarks;")
    if cursor.fetchone()[0] == 0:
        sample_benchmarks = [
            ("Small (Refinery Unit)", 120, 95, 480, 0.42, 0.35, 1.2, 0.0),
            ("Medium (Plant Section)", 1250, 980, 7400, 4.85, 1.62, 3.0, 0.0),
            ("Large (Full Refinery)", 14800, 11200, 115000, 68.4, 8.55, 8.0, 0.01),
            ("Industrial (MRPL Multi-Complex)", 105000, 84000, 1260000, 920.0, 62.16, 14.8, 0.02)
        ]
        cursor.executemany("""
        INSERT INTO benchmarks 
        (problem_size, variables_count, constraints_count, non_zeros, cpu_time_sec, gpu_time_sec, speedup_ratio, optimality_gap)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """, sample_benchmarks)
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Indigenous Solver SQLite database initialized successfully at:", DB_FILE)
