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
        
        
        # Find the line containing portia-sdk-python in [tool.uv.sources]
        lines = content.split('\n')
        updated_lines = []
        found = False
        
        for line in lines:
            if 'portia-sdk-python' in line and 'rev = "' in line:
                # Extract the current commit hash
                current_match = re.search(r'rev = "([a-f0-9]+)"', line)
                if current_match:
                    current_hash = current_match.group(1)
                    # Replace just the commit hash
                    updated_line = line.replace(f'rev = "{current_hash}"', f'rev = "{commit_hash}"')
                    updated_lines.append(updated_line)
                    found = True
                    print(f"🔍 Found and updated line: {line.strip()}")
                    print(f"📝 Updated to: {updated_line.strip()}")
                else:
                    updated_lines.append(line)
            else:
                updated_lines.append(line)
        
        if not found:
            print("Error: Could not find portia-sdk-python dependency with rev in pyproject.toml")
            print("Looking for lines containing 'portia-sdk-python':")
            for i, line in enumerate(lines):
                if 'portia-sdk-python' in line:
                    print(f"Line {i+1}: {line}")
            sys.exit(1)
        
        updated_content = '\n'.join(updated_lines)
        
        # Verify the replacement worked
        if updated_content == content:
            print("Error: No changes were made to pyproject.toml")
            print("Current content:")
            print(content)
            sys.exit(1)
        
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
        
        # Show the full updated content for debugging
        print("\n📄 Updated pyproject.toml content:")
        print(updated_content)
                
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