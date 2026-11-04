#!/bin/bash
# =============================================================================
# Voyager Coding Club - Vercel Build Hook Script
# =============================================================================
set -e

echo "=== Installing Python Dependencies ==="
python3 -m pip install -r requirements.txt

echo "=== Collecting Django Static Assets ==="
python3 manage.py collectstatic --noinput --clear

echo "=== Vercel Build Ready ==="
