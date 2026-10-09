import sys
import os

# Add backend directory to path
backend_dir = os.path.join(os.path.dirname(__file__), "..", "backend")
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from main import app
