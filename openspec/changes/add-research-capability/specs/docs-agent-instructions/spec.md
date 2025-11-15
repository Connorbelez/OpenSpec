## MODIFIED Requirements

### Requirement: Three-Stage Workflow

The AI instructions SHALL document a three-stage workflow that includes proposal creation, implementation, and archiving, with research and audit as optional intermediate steps invoked via slash commands.

#### Scenario: Research and audit as optional slash command steps

- **WHEN** documenting the workflow stages
- **THEN** include Stage 1: Creating Changes (proposal creation with all artifacts)
- **AND** include optional research step: "After creating proposal artifacts, invoke `/research <sources>` to analyze external dependencies"
- **AND** include optional audit step: "After research, invoke `/audit` to validate and augment specs"
- **AND** include Stage 2: Implementing Changes (using proposal, research, design, and tasks)
- **AND** include Stage 3: Archiving Changes (after deployment)
- **AND** provide guidance on when research and audit are beneficial vs. when they can be skipped

#### Scenario: Research and audit triggers

- **WHEN** documenting when to use research and audit
- **THEN** list triggers: mentions of external libraries, SDKs, APIs, frameworks, third-party services
- **AND** list indicators: words like "integrate", "API", "SDK", "library", "framework", "package", "authentication"
- **AND** provide examples: "integrate Stripe", "add Redis caching", "use React Query", "authenticate with OAuth"
- **AND** note research can be skipped for: internal-only changes, well-understood dependencies, or simple feature additions

#### Scenario: Complete workflow with research and audit

- **WHEN** external dependencies are involved
- **THEN** document workflow as:
  1. AI creates proposal.md + tasks.md + design.md + spec deltas
  2. AI invokes `/research <url> <repo> <file> ...` with documentation sources
  3. Research artifacts generated (research.md, blastradius.md, footguns.md)
  4. AI invokes `/audit` to validate and augment specs
  5. Specs augmented, design.md updated with current patterns
  6. Validation re-run
  7. Proposal ready for approval

### Requirement: Slash Command Documentation

The AI instructions SHALL provide complete documentation for `/research` and `/audit` slash commands.

#### Scenario: Research slash command syntax

- **WHEN** documenting `/research` command
- **THEN** explain syntax: `/research <resource1> <resource2> ... <resourceN>`
- **AND** document supported resource types:
  - URLs: `https://stripe.com/docs`
  - GitHub repos: `owner/repo` (e.g., `stripe/stripe-node`)
  - Local files: `./path/to/doc.md` or `/absolute/path/doc.md`
  - Package names: `stripe` or `@stripe/stripe-js`
- **AND** explain resources are automatically classified by pattern
- **AND** provide example: `/research https://redis.io/docs redis/redis ./local-guide.md`

#### Scenario: Research command output

- **WHEN** documenting `/research` results
- **THEN** explain three generated files in `changes/<change-id>/research/`:
  - `research.md` - Implementation guide with patterns, best practices, code examples, testing approaches
  - `blastradius.md` - Integration points, affected modules, codebase impact analysis, risk assessment
  - `footguns.md` - Common mistakes, gotchas, warnings, deprecated methods, security concerns
- **AND** explain each file includes citations linking back to source documentation
- **AND** note fetch timestamps are included
- **AND** specify files are structured for audit consumption

#### Scenario: Audit slash command syntax

- **WHEN** documenting `/audit` command
- **THEN** explain syntax: `/audit` (no arguments required)
- **AND** specify precondition: research artifacts must exist
- **AND** explain audit reads research/ directory automatically
- **AND** note audit must be run after `/research`

#### Scenario: Audit command behavior

- **WHEN** documenting `/audit` results
- **THEN** explain audit performs four key actions:
  1. Validates spec deltas against research findings
  2. Adds missing requirements discovered in research
  3. Augments design.md with current API patterns, code snippets, non-deprecated methods
  4. Re-runs `openspec validate --strict`
- **AND** emphasize focus on information beyond LLM training data
- **AND** explain audit highlights recent API changes, deprecations, and current best practices
- **AND** specify audit reports what was added and validation status

### Requirement: Research Workflow Guidance

The AI instructions SHALL provide step-by-step guidance for conducting research.

#### Scenario: When to invoke research

- **WHEN** providing research workflow guidance
- **THEN** instruct to invoke `/research` when:
  - Proposal mentions external libraries, SDKs, or APIs
  - Integration with third-party services is required
  - Authentication patterns involve external providers
  - Framework-specific implementation patterns are needed
- **AND** instruct to skip research when:
  - Change is purely internal logic
  - Dependencies are well-understood and stable
  - Simple feature additions without external integration

#### Scenario: Selecting research sources

- **WHEN** providing research source guidance
- **THEN** recommend official documentation as primary source
- **AND** suggest package-specific getting started guides
- **AND** recommend security and production readiness documentation
- **AND** suggest GitHub repositories for real-world examples
- **AND** note to include multiple sources for comprehensive coverage
- **AND** recommend version-specific documentation when applicable

#### Scenario: Research best practices

- **WHEN** documenting research best practices
- **THEN** instruct to provide multiple diverse sources
- **AND** recommend including both high-level guides and API references
- **AND** suggest including security-focused documentation
- **AND** note to include deprecation guides or migration documentation
- **AND** recommend checking for "common mistakes" or "gotchas" sections

### Requirement: Audit Workflow Guidance

The AI instructions SHALL provide step-by-step guidance for conducting audit.

#### Scenario: When to invoke audit

- **WHEN** providing audit workflow guidance
- **THEN** instruct to always invoke `/audit` after `/research` completes
- **AND** explain audit is the quality gate before proposal approval
- **AND** note audit ensures specs reflect current best practices
- **AND** emphasize audit catches deprecated patterns that may be in LLM training

#### Scenario: Understanding audit augmentations

- **WHEN** documenting what audit adds
- **THEN** explain audit focuses on:
  - Current API patterns not in LLM training data
  - Deprecated methods to avoid with replacements
  - Version-specific code examples
  - Security patterns from official documentation
  - Configuration examples with current best practices
  - Error handling patterns for known edge cases
- **AND** explain augmentations go into design.md primarily
- **AND** note missing requirements are added to spec deltas
- **AND** specify all additions include research citations

#### Scenario: Interpreting audit results

- **WHEN** documenting audit output interpretation
- **THEN** explain audit summary reports:
  - Number of requirements added
  - Number of design.md sections augmented
  - Key additions (authentication, deprecated APIs, etc.)
  - Validation status
- **AND** instruct to review audit report for conflicts or gaps
- **AND** note if validation fails, audit will attempt auto-fix
- **AND** explain when re-research may be needed

### Requirement: Context Checklist Updates

The AI instructions SHALL include research and audit in the "Before Any Task" context checklist.

#### Scenario: Updated context checklist for proposals

- **WHEN** providing pre-task checklist for proposal creation
- **THEN** add step: "After creating proposal artifacts, decide if `/research` is needed"
- **AND** add step: "If research conducted, always run `/audit` before requesting approval"
- **AND** maintain existing items: read specs, check pending changes, read project.md, run openspec list

#### Scenario: Updated context checklist for implementation

- **WHEN** providing pre-implementation checklist
- **THEN** add item: "Check for `research/` directory in active change"
- **AND** add item: "Read all three research artifacts if present"
- **AND** add item: "Review design.md for current API patterns and code snippets"
- **AND** emphasize using current patterns from research, not patterns from LLM training

### Requirement: Integration with Design.md

The AI instructions SHALL document how audit augments design.md with research-backed patterns.

#### Scenario: Design.md augmentation sections

- **WHEN** documenting design.md augmentation
- **THEN** explain audit adds or updates these sections:
  - "API Integration Patterns" - current, version-specific usage
  - "Implementation Details" - initialization and configuration code
  - "Security Implementation" - authentication and credential patterns
  - "Configuration" - complete config file examples
  - "Migration Plan" - breaking changes from recent versions
  - "Risks / Trade-offs" - performance and security considerations
- **AND** note all code snippets include version annotations
- **AND** specify deprecated methods are explicitly called out with replacements

#### Scenario: Code snippet requirements

- **WHEN** documenting code snippets in augmented design.md
- **THEN** require all snippets to be complete and runnable
- **AND** require version annotations (e.g., "Requires v12.0+")
- **AND** require highlighting of non-obvious patterns
- **AND** require citations to research.md source
- **AND** require error handling to be included
- **AND** emphasize current, non-deprecated patterns

#### Scenario: Preserving existing design decisions

- **WHEN** documenting audit's relationship to existing design.md
- **THEN** explain audit augments, does not replace
- **AND** note existing design decisions are preserved
- **AND** specify conflicts between research and design are flagged
- **AND** instruct manual review if conflicts arise

### Requirement: Workflow Examples

The AI instructions SHALL provide complete end-to-end examples of research and audit workflow.

#### Scenario: Stripe integration example

- **WHEN** providing workflow examples
- **THEN** include complete example:
  ```
  User: "Create a proposal to add Stripe payment integration"
  
  AI: Creates proposal/tasks/design/specs
  
  AI: /research https://stripe.com/docs/api https://stripe.com/docs/security stripe/stripe-node
  
  AI: [Research artifacts generated]
  - ✓ research/research.md
  - ✓ research/blastradius.md  
  - ✓ research/footguns.md
  
  AI: /audit
  
  AI: [Audit results]
  - ✓ Added 3 requirements (webhook verification, idempotency, error handling)
  - ✓ Augmented design.md with Stripe API v12 patterns
  - ✓ Added code snippets for PaymentIntent creation
  - ✓ Noted deprecated Charges API (use PaymentIntents instead)
  - ✓ Validation: PASSED
  
  AI: "Proposal ready for review. Specs validated against current Stripe documentation."
  ```

#### Scenario: Redis caching example

- **WHEN** providing workflow examples
- **THEN** include Redis example showing:
  - Research with official docs and GitHub repo
  - Audit finding missing connection pooling requirement
  - Design.md augmented with redis v4 connection patterns
  - Deprecated methods flagged (HMSET → HSET)

### Requirement: Troubleshooting Guidance

The AI instructions SHALL include troubleshooting for common research and audit issues.

#### Scenario: Research errors

- **WHEN** documenting research troubleshooting
- **THEN** add "No resources fetched" - check network, URLs, or use local files
- **AND** add "Context7 unavailable" - fallback to manual URL or infer from package registry
- **AND** add "Incomplete blast radius" - limited codebase context disclaimer added
- **AND** add "Partial fetch failures" - research generates with available sources

#### Scenario: Audit errors

- **WHEN** documenting audit troubleshooting
- **THEN** add "No research artifacts found" - run `/research` first
- **AND** add "Validation failed after audit" - review error messages, audit attempts auto-fix
- **AND** add "Conflicts with existing design" - manual review required
- **AND** add "Incomplete research" - consider re-running `/research` with more sources

### Requirement: Progressive Disclosure

The AI instructions SHALL organize research and audit documentation with progressive disclosure principles.

#### Scenario: Quick reference for slash commands

- **WHEN** providing quick reference section
- **THEN** include concise command summaries:
  - `/research <sources>` - Analyze external dependencies
  - `/audit` - Validate and augment specs with research
- **AND** defer detailed workflow to dedicated section
- **AND** provide anchor links to full documentation

#### Scenario: Detailed workflow section

- **WHEN** providing detailed guidance
- **THEN** create dedicated "Research & Audit Workflow" section
- **AND** include subsections:
  - When to research
  - Selecting sources
  - Running research
  - Interpreting research artifacts
  - Running audit
  - Understanding augmentations
  - Handling conflicts
- **AND** provide complete examples with sample outputs
- **AND** include decision tree for research vs. skip

### Requirement: Quality Standards

The AI instructions SHALL document quality standards for research and audit outputs.

#### Scenario: Research quality criteria

- **WHEN** documenting research quality
- **THEN** require all claims have citations
- **AND** require code examples include source links
- **AND** require footguns include severity levels
- **AND** require blast radius includes impact rationale
- **AND** require version-specific information is clearly marked
- **AND** note manual review is final quality gate

#### Scenario: Audit quality criteria

- **WHEN** documenting audit quality
- **THEN** require all augmentations cite research sources
- **AND** require code snippets are complete and runnable
- **AND** require version annotations on all code examples
- **AND** require deprecated methods are flagged with replacements
- **AND** require validation passes after augmentation
- **AND** require audit report summarizes all changes