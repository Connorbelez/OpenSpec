# Proposal: Add Research and Audit Capabilities

## Why

AI coding assistants frequently implement features that integrate with external libraries, SDKs, APIs, and frameworks. Currently, there is no structured way to research and document these external dependencies before implementation begins. This leads to:

- Common integration mistakes and footguns that could be avoided
- Lack of understanding of codebase blast radius before making changes
- Missing best practices and patterns recommended by official documentation
- Implementation using deprecated methods still present in LLM training data
- Specs that don't align with current library/framework conventions

Adding research and audit capabilities allows AI agents to systematically investigate external dependencies, understand their proper usage, identify potential issues, assess codebase impact, and ensure specs reflect current best practices before implementation begins.

## What Changes

- **NEW**: `/research` slash command for AI agents to fetch and analyze external documentation
  - Accepts multiple resources as arguments: URLs, GitHub repos, local .md files, package names
  - Generates three research artifact files in `changes/<change-id>/research/`:
    - `research.md` - Implementation guide with patterns, best practices, and examples
    - `blastradius.md` - Integration points and codebase impact analysis
    - `footguns.md` - Common mistakes, gotchas, and how to avoid them
- **NEW**: `/audit` slash command for AI agents to validate and augment specs against research
  - Compares research findings to spec deltas
  - Adds missing requirements discovered in research
  - Updates design.md with current API patterns, code snippets, non-deprecated methods
  - Focuses on information not in LLM training data (latest APIs, recent deprecations)
  - Re-runs validation after augmentation
- **NEW**: Integration with Context7 for package documentation lookup
- **MODIFIED**: Agent workflow to include research and audit as manual steps after proposal creation
- **MODIFIED**: `design.md` generation to incorporate research findings and current code patterns

These are manual, AI-initiated steps invoked via slash commands after proposal artifacts are created.

## Impact

### Affected Specs
- **NEW**: `specs/agent-research/` - AI agent research capability via `/research` slash command
- **NEW**: `specs/agent-audit/` - AI agent audit capability via `/audit` slash command
- **MODIFIED**: `specs/docs-agent-instructions/` - Updated workflow guidance with slash commands

### Affected Code
None. These are AI agent capabilities defined through specifications, not implemented code features. The AI agent performs these behaviors based on the spec definitions.

### Breaking Changes
None. This is an additive feature that enhances the proposal creation workflow without changing existing functionality.

## Workflow Integration

```
Current:
User Request → AI Creates Proposal → Approval → Implementation

With Research & Audit:
User Request → AI Creates Proposal → AI: /research [sources] → AI: /audit → Enhanced Proposal → Approval → Implementation
```

The research and audit steps are explicit slash commands that AI agents invoke manually after creating proposal artifacts. They are optional but recommended when external dependencies are involved.

## Example Usage

```
User: "Create a proposal to add Stripe payment integration"

AI: Creates proposal/tasks/design/specs for Stripe integration

AI: /research https://stripe.com/docs stripe/stripe-node https://stripe.com/docs/security

AI: [Fetches documentation, generates research artifacts]
- ✓ research/research.md (implementation patterns)
- ✓ research/blastradius.md (codebase impact)
- ✓ research/footguns.md (common mistakes)

AI: /audit

AI: [Validates and augments]
- ✓ Compared specs to research findings
- ✓ Added 3 missing requirements from Stripe best practices
- ✓ Updated design.md with current API patterns
- ✓ Added code snippets for webhook verification (v12.0+)
- ✓ Noted deprecated methods to avoid
- ✓ Re-ran validation: PASSED

AI: "Proposal ready for review. Specs validated against current Stripe documentation."

User: Approves
```
