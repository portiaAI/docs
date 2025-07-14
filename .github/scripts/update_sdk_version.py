#!/usr/bin/env python3
"""
Script to update the portia-sdk-python commit hash in pyproject.toml.

Usage:
    uv run .github/scripts/update_sdk_version.py <new_commit_hash>
    uv run .github/scripts/update_sdk_version.py --latest  # Fetch latest from GitHub API
"""

import argparse
import re
import sys
import requests
from pathlib import Path


def get_latest_commit():
    """Fetch the latest commit hash from portiaAI/portia-sdk-python main branch."""
    try:
        response = requests.get(
            "https://api.github.com/repos/portiaAI/portia-sdk-python/commits/main",
            timeout=10
        )
        response.raise_for_status()
        return response.json()["sha"]
    except requests.RequestException as e:
        print(f"Error fetching latest commit: {e}")
        sys.exit(1)


def update_pyproject_toml(commit_hash, pyproject_path="pyproject.toml"):
    """Update the portia-sdk-python commit hash in pyproject.toml."""
    pyproject_file = Path(pyproject_path)
    
    if not pyproject_file.exists():
        print(f"Error: {pyproject_path} not found")
        sys.exit(1)
    
    try:
        with open(pyproject_file, 'r') as f:
            content = f.read()
        
        # Pattern to match the portia-sdk-python line with any commit hash
        pattern = r'(portia-sdk-python = \{ git = "https://github\.com/portiaAI/portia-sdk-python\.git", rev = ")[a-f0-9]*(" \})'
        
        # Check if the pattern exists
        if not re.search(pattern, content):
            print("Error: Could not find portia-sdk-python dependency in pyproject.toml")
            sys.exit(1)
        
        # Replace the commit hash
        updated_content = re.sub(pattern, r'\1' + commit_hash + r'\2', content)
        
        # Write the updated content back
        with open(pyproject_file, 'w') as f:
            f.write(updated_content)
        
        print(f"✅ Successfully updated pyproject.toml with commit: {commit_hash}")
        
        # Show the updated line for verification
        lines = updated_content.split('\n')
        for i, line in enumerate(lines):
            if 'portia-sdk-python' in line:
                print(f"Updated line {i+1}: {line.strip()}")
                break
                
    except Exception as e:
        print(f"Error updating pyproject.toml: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Update portia-sdk-python commit hash in pyproject.toml"
    )
    parser.add_argument(
        "commit_hash",
        nargs="?",
        help="The commit hash to update to"
    )
    parser.add_argument(
        "--latest",
        action="store_true",
        help="Fetch the latest commit hash from GitHub API"
    )
    parser.add_argument(
        "--pyproject-path",
        default="pyproject.toml",
        help="Path to pyproject.toml file (default: pyproject.toml)"
    )
    
    args = parser.parse_args()
    
    if args.latest:
        commit_hash = get_latest_commit()
        print(f"📥 Fetched latest commit: {commit_hash}")
    elif args.commit_hash:
        commit_hash = args.commit_hash
        # Validate commit hash format (basic check)
        if not re.match(r'^[a-f0-9]{40}$', commit_hash):
            print("Warning: Commit hash doesn't look like a valid SHA-1 hash")
    else:
        print("Error: Either provide a commit hash or use --latest flag")
        parser.print_help()
        sys.exit(1)
    
    update_pyproject_toml(commit_hash, args.pyproject_path)


if __name__ == "__main__":
    main() 