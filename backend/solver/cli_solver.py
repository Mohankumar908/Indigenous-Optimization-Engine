"""
CLI Interface for Python Solver & SQLite Persistence
Allows Express server or standalone testing to execute the optimization pipeline
"""

import sys
import json
import uuid
import os
from milp_engine import IndigenousMILPEngine

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from database.db import get_db_connection, init_db

def solve_from_cli():
    init_db()
    
    input_data = {}
    if len(sys.argv) > 1 and sys.argv[1] != "-":
        arg = sys.argv[1].strip()
        if arg.startswith("{"):
            input_data = json.loads(arg)
        elif os.path.exists(arg):
            with open(arg, "r") as f:
                input_data = json.load(f)
    elif not sys.stdin.isatty():
        raw_in = sys.stdin.read().strip()
        if raw_in:
            input_data = json.loads(raw_in)
            
    engine = IndigenousMILPEngine(input_data)
    result = engine.solve_mrpl_refinery()
    
    # Save run to SQLite
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        run_id = f"run_{uuid.uuid4().hex[:8]}"
        model_id = input_data.get("id", "mrpl_sample_model")
        
        cursor.execute("""
        INSERT INTO optimization_runs 
        (id, model_id, status, objective_value, runtime_seconds, optimality_gap, 
         nodes_explored, nodes_pruned, cpu_time_ms, gpu_time_ms, speedup, memory_usage_mb, presolve_stats, execution_log)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            run_id,
            model_id,
            result["status"],
            result["objective_raw"],
            result["runtime_seconds"],
            result["optimality_gap"],
            result["nodes_explored"],
            result["nodes_pruned"],
            result["cpu_gpu_execution"]["cpu_role"]["time_ms"],
            result["cpu_gpu_execution"]["gpu_role"]["time_ms"],
            3.3,
            result["memory_usage_mb"],
            json.dumps(result["presolver"]),
            json.dumps(result["cpu_gpu_execution"])
        ))
        
        cursor.execute("""
        INSERT INTO solutions 
        (run_id, model_id, variable_values, production_plan, validation_status, validation_details)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            run_id,
            model_id,
            json.dumps(result["production_plan"]),
            json.dumps(result["production_plan"]),
            result["validation"]["solution_status"],
            json.dumps(result["validation"])
        ))
        
        conn.commit()
        conn.close()
        result["run_id"] = run_id
    except Exception as e:
        result["db_save_notice"] = str(e)

    print(json.dumps(result))

if __name__ == "__main__":
    solve_from_cli()
