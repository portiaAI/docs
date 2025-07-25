# /// script
# dependencies = [
#   "PyGithub",
#   "python-dotenv",
# ]
# ///

import os
from github import Github
import argparse
from dotenv import load_dotenv

load_dotenv()

def overwrite_branch(repo_name: str, push: bool, target_branch: str, source_branch: str, token: str) -> None:
    """Overwrites target branch with source branch head
    
    This is used to overwrite target branch with source branch head. This will force push
    the source branch to the target branch, completely replacing the target branch content.
    
    Args:
        repo_name: The name of the repository to overwrite target branch with source branch
        push: If True, will overwrite target branch with source branch head
        target_branch: The branch to be overwritten
        source_branch: The branch whose head will overwrite the target branch

    Returns:
        None
    """
    github = Github(token)
    repo = github.get_repo(repo_name)
    source_ref = repo.get_branch(source_branch)
    
    if not push:
        print(f"Dry run: Would have overwritten {target_branch} branch with {source_branch} branch head")
    else:
        target_ref = repo.get_git_ref(f"heads/{target_branch}")
        target_ref.edit(source_ref.commit.sha, force=True)
        
        print(f"{target_branch} branch successfully overwritten with {source_branch} branch head")

def main():
    parser = argparse.ArgumentParser(description="Deploy")
    parser.add_argument("--repo-name", type=str, required=True)
    parser.add_argument("--push", action="store_true", default=False)
    parser.add_argument("--target-branch", type=str, required=True)
    parser.add_argument("--source-branch", type=str, required=True)
    parser.add_argument("--token", type=str, help="GitHub token")
    args = parser.parse_args()

    overwrite_branch(
        repo_name=args.repo_name,
        push=args.push,
        target_branch=args.target_branch,
        source_branch=args.source_branch,
        token=args.token or os.getenv("DEPLOY_PAT_TOKEN")
    )
    
if __name__ == "__main__":
    main()