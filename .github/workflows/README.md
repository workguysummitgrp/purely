# Workflow Pack Integration

This folder contains the GitHub Actions workflow pack pushed by `development-writer.agent.md` when `github.push_workflow_pack` is enabled in `config/integrations.yml`. All actions are SHA-pinned to immutable commit references.

## Auto Triggers

| Workflow | Trigger |
|---|---|
| `dependency-security.yml` | PR opened/synchronized/reopened |
| `license-check.yml` | PR + daily schedule + manual |
| `pr-review.yml` | PR opened/synchronized/reopened (opt-in) |
| `pr-summary.yml` | PR opened/synchronized/reopened + manual (opt-in) |
| `unit-test.yml` | PR + manual |
| `deploy-static-site.yml` | push to `main` + manual |
| `release-note.yml` | release published + manual |
| `repo-health.yml` | weekly schedule + manual |
| `requirements-approved.yml` | `repository_dispatch` type `requirements-approved` + manual |

## Required Secrets

| Secret | Used by | Required |
|---|---|---|
| `OPENAI_API_KEY` | pr-review, pr-summary, release-note | Yes (for AI features) |
| `AWS_ACCESS_KEY_ID` | deploy-static-site | If not using OIDC |
| `AWS_SECRET_ACCESS_KEY` | deploy-static-site | If not using OIDC |
| `AWS_OIDC_ROLE_ARN` | deploy-static-site | Preferred over static keys |
| `AWS_SESSION_TOKEN` | deploy-static-site | Optional (temp creds) |
| `JIRA_EMAIL` | pr-summary | Optional |
| `JIRA_API_TOKEN` | pr-summary | Optional |
| `JIRA_BASE_URL` | pr-summary | Optional |
| `GEMINI_API_KEY` | release-note | Optional fallback |
| `ANTHROPIC_API_KEY` | release-note | Optional fallback |

## Repository Variables (Feature Flags)

| Variable | Default | Purpose |
|---|---|---|
| `ENABLE_AI_PR_REVIEW` | `false` | Set to `true` to enable AI-powered PR reviews |
| `ENABLE_AI_PR_SUMMARY` | `false` | Set to `true` to enable AI-powered PR summaries |
| `AI_MODEL` | `gpt-4.1-mini` | Override the OpenAI model used by AI workflows |

## AWS Authentication

`deploy-static-site.yml` supports two authentication methods:

1. **OIDC (recommended)**: Set `AWS_OIDC_ROLE_ARN` secret to your IAM role ARN configured for GitHub OIDC federation. See [GitHub docs](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services).
2. **Static keys (fallback)**: Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

## Prompt Dependency

`release-note.yml` expects `.github/prompts/release-notes.md`.

## Security Hardening

- All third-party actions are pinned to full commit SHAs (not floating tags).
- Untrusted inputs (`github.event.pull_request.*`, `github.event.client_payload.*`) are passed via intermediate `env:` vars — never interpolated directly into `run:` blocks.
- Heredoc delimiters are randomized (`openssl rand -hex 16`) to prevent delimiter injection.
- AI workflows are opt-in via repository variables, disabled by default.
- All workflows degrade gracefully when secrets are absent.

## Notes

- The CI template at `.github/templates/ci-workflow.yml` is customized per project stack by the development writer.
- Deploy and test workflows include path/secret guards so missing project-specific assets do not fail unrelated PRs.
