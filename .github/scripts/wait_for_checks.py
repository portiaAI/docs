# /// script
# dependencies = [
#   "PyGithub",
#   "python-dotenv",
# ]
# ///

import os
import time
import argparse
from typing import List, Optional
from github import Github
from dotenv import load_dotenv

load_dotenv(override=True)

def wait_for_checks(
    repo_name: str, 
    pr_number: int, 
    timeout_minutes: int = 30,
    wait_seconds: int = 30,
    ignore_checks: Optional[List[str]] = None
) -> str:
    """Wait for PR checks to complete
    
    This function waits for all status checks and GitHub Actions checks to complete
    for a given pull request. It supports ignoring specific checks and has configurable
    timeout and wait intervals.
    
    Args:
        repo_name: The repository name in format 'owner/repo'
        pr_number: The pull request number
        timeout_minutes: Maximum time to wait in minutes (default: 30)
        wait_seconds: Time to wait between checks in seconds (default: 30)
        ignore_checks: List of check names to ignore (default: None)
    
    Returns:
        str: Status result - 'success', 'failure', or 'timeout'
    """
    if ignore_checks is None:
        ignore_checks = []
    
    github_token = os.getenv("DEPLOY_PAT_TOKEN")
    if not github_token:
        raise ValueError("DEPLOY_PAT_TOKEN environment variable is required")
    
    github = Github(github_token)
    repo = github.get_repo(repo_name)
    pr = repo.get_pull(pr_number)
    
    print(f"Waiting for PR #{pr_number} checks to complete...")
    print(f"Repository: {repo_name}")
    print(f"Timeout: {timeout_minutes} minutes")
    print(f"Check interval: {wait_seconds} seconds")
    if ignore_checks:
        print(f"Ignoring checks: {', '.join(ignore_checks)}")
    
    # Wait for checks to start
    print("Waiting 30 seconds for checks to start...")
    time.sleep(30)
    
    # Calculate max attempts based on timeout
    max_attempts = (timeout_minutes * 60) // wait_seconds
    
    for attempt in range(1, max_attempts + 1):
        print(f"\nCheck status (attempt {attempt}/{max_attempts}):")
        
        # Get the PR's head SHA
        pr_head_sha = pr.head.sha
        
        # Get status checks (external checks like Vercel)
        status_response = repo.get_commit(pr_head_sha).get_statuses()
        status_checks = list(status_response)
        
        # Get GitHub Actions check runs
        check_runs = repo.get_commit(pr_head_sha).get_check_runs()
        
        # Filter out ignored checks
        status_checks = [check for check in status_checks if check.context not in ignore_checks]
        check_runs = [run for run in check_runs if run.name not in ignore_checks]
        
        # Count status checks by state
        status_total = len(status_checks)
        status_success = len([c for c in status_checks if c.state == "success"])
        status_pending = len([c for c in status_checks if c.state == "pending"])
        status_failure = len([c for c in status_checks if c.state in ["failure", "error"]])
        
        # Count GitHub Actions checks by status
        checks_total = len(check_runs)
        checks_success = len([r for r in check_runs if r.conclusion == "success"])
        checks_pending = len([r for r in check_runs if r.status in ["in_progress", "queued"]])
        checks_failure = len([r for r in check_runs if r.conclusion in ["failure", "cancelled", "timed_out"]])
        
        # Combined totals
        total_checks = status_total + checks_total
        total_success = status_success + checks_success
        total_pending = status_pending + checks_pending
        total_failure = status_failure + checks_failure
        
        print(f"  External status checks: {status_total} total, {status_success} success, {status_pending} pending, {status_failure} failed")
        print(f"  GitHub Actions checks: {checks_total} total, {checks_success} success, {checks_pending} pending, {checks_failure} failed")
        print(f"  Combined: {total_checks} total, {total_success} success, {total_pending} pending, {total_failure} failed")
        
        # Show pending external checks for debugging
        if status_pending > 0:
            print("  Pending external checks:")
            for check in status_checks:
                if check.state == "pending":
                    print(f"    - {check.context} ({check.state})")
        
        # Show pending GitHub Actions checks for debugging
        if checks_pending > 0:
            print("  Pending GitHub Actions checks:")
            for run in check_runs:
                if run.status in ["in_progress", "queued"]:
                    print(f"    - {run.name} ({run.status})")
        
        # Check PR's mergeable state
        pr = repo.get_pull(pr_number) # Refresh to get latest mergeable state
        mergeable_state = pr.mergeable_state
        print(f"  PR mergeable state: {mergeable_state}")
        
        # Check if all required status checks are complete
        if total_pending == 0 and total_failure == 0 and mergeable_state != "unstable":
            print("All checks passed and PR is ready to merge!")
            return "success"
        elif total_failure > 0:
            print("Checks failed!")
            return "failure"
        elif attempt == max_attempts:
            print("Timeout waiting for checks to complete")
            return "timeout"
        
        # Wait before next check
        if attempt < max_attempts:
            print(f"Waiting {wait_seconds} seconds before next check...")
            time.sleep(wait_seconds)

def main():
    parser = argparse.ArgumentParser(description="Wait for PR checks to complete")
    parser.add_argument("--repo-name", type=str, required=True, help="Repository name in format 'owner/repo'")
    parser.add_argument("--pr-number", type=int, required=True, help="Pull request number")
    parser.add_argument("--timeout-minutes", type=int, default=30, help="Maximum time to wait in minutes (default: 30)")
    parser.add_argument("--wait-seconds", type=int, default=30, help="Time to wait between checks in seconds (default: 30)")
    parser.add_argument("--ignore-checks", type=str, nargs="*", default=[], help="List of check names to ignore")
    args = parser.parse_args()

    try:
        result = wait_for_checks(
            repo_name=args.repo_name,
            pr_number=args.pr_number,
            timeout_minutes=args.timeout_minutes,
            wait_seconds=args.wait_seconds,
            ignore_checks=args.ignore_checks
        )
        print(f"\nFinal result: {result}")
        # Return different exit codes for different states
        if result == "success":
            exit(0)
        elif result == "failure":
            exit(1)
        elif result == "timeout":
            exit(2)
        else:
            exit(1)  # Default to failure for unknown states
    except Exception as e:
        print(f"Error: {e}")
        exit(1)

if __name__ == "__main__":
    main() 