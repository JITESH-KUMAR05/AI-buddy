#!/usr/bin/env python3
"""
Simple entry point for Railway that changes to backend directory and runs main.py
"""
import os
import sys
import subprocess

# Change to backend directory
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
os.chdir(backend_dir)

# Run main.py
if __name__ == "__main__":
    subprocess.run([sys.executable, "main.py"])
