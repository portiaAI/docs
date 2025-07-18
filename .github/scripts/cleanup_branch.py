# /// script
# dependencies = [
#   "PyGithub",
#   "python-dotenv",
# ]
# ///

import os
import argparse
from github import Github
from dotenv import load_dotenv

load_dotenv(override=True)

def check_and_cleanup_existing(repo_name: str, title_pattern: str, branch_pattern: str, delete: bool = False, token: str = None) -> bool:
    """Check if there's already an open PR with the given title pattern and optionally clean up
    
    Args:
        repo_name: The repository name in format 'owner/repo'
        title_pattern: Pattern to match in PR titles (e.g., "🤖 Automated: Bump SDK version")
        branch_pattern: Pattern to match in branch names (e.g., "automated/bump-sdk-version")
        delete: If True, close existing PRs and delete branches
    
    Returns:
        bool: True if an open PR with matching title exists, False otherwise
    """
    
    github = Github(token)
    repo = github.get_repo(repo_name)
    
    found_existing = False
    
    # Get all open PRs
    open_prs = repo.get_pulls(state='open')
    
    for pr in open_prs:
        if title_pattern in pr.title:
            print(f"Found existing open PR #{pr.number}: {pr.title}")
            found_existing = True
            
            if delete:
                print(f"Closing PR #{pr.number} and deleting branch {pr.head.ref}")
                # Close the PR
                pr.create_issue_comment("This PR was automatically closed by a new SDK version bump workflow run.")
                pr.edit(state="closed")
                
                # Delete the branch
                try:
                    repo.get_git_ref(f"heads/{pr.head.ref}").delete()
                    print(f"Successfully deleted branch {pr.head.ref}")
                except Exception as e:
                    print(f"Warning: Could not delete branch {pr.head.ref}: {e}")
    
    # Also check for orphaned branches (branches without PRs)
    if delete:
        try:
            branches = repo.get_branches()
            for branch in branches:
                if branch_pattern in branch.name and branch.name != "main" and branch.name != "production":
                    print(f"Found orphaned branch: {branch.name}")
                    try:
                        repo.get_git_ref(f"heads/{branch.name}").delete()
                        print(f"Successfully deleted orphaned branch {branch.name}")
                    except Exception as e:
                        print(f"Warning: Could not delete orphaned branch {branch.name}: {e}")
        except Exception as e:
            print(f"Warning: Could not check for orphaned branches: {e}")
    
    if not found_existing:
        print(f"No existing open PR found with pattern: {title_pattern}")
    
    return found_existing

def main():
    parser = argparse.ArgumentParser(description="Check for existing PRs with title pattern and optionally clean up")
    parser.add_argument("--repo-name", type=str, required=True, help="Repository name in format 'owner/repo'")
    parser.add_argument("--title-pattern", type=str, required=True, help="Pattern to match in PR titles")
    parser.add_argument("--branch-pattern", type=str, required=True, help="Pattern to match in branch names")
    parser.add_argument("--delete", action="store_true", default=False, help="Close existing PRs and delete branches")
    parser.add_argument("--token", type=str, help="GitHub token")
    args = parser.parse_args()

    try:
        exists = check_and_cleanup_existing(
            repo_name=args.repo_name,
            title_pattern=args.title_pattern,
            branch_pattern=args.branch_pattern,
            delete=args.delete,
            token=args.token or os.getenv("DEPLOY_PAT_TOKEN")
        )
        exit(0 if not exists else 1)  # Exit 0 if no existing PR, 1 if exists
    except Exception as e:
        print(f"Error: {e}")
        exit(1)

if __name__ == "__main__":
    main() 