# agent-audit Specification

## Purpose
Defines the `/audit` slash command capability for AI agents to validate spec deltas against research findings, augment design.md with current code patterns, and ensure specs reflect information beyond LLM training data.

## ADDED Requirements

### Requirement: Slash command invocation

AI agents SHALL recognize and execute the `/audit` slash command after research artifacts have been generated.

#### Scenario: Basic audit invocation

- **WHEN** AI agent invokes `/audit` for a change with research artifacts
- **THEN** read all proposal artifacts (proposal.md, design.md, spec deltas)
- **AND** read all three research files (research.md, blastradius.md, footguns.md)
- **AND** validate specs against research findings
- **AND** augment design.md with current patterns and code snippets
- **AND** re-run `openspec validate --strict`
- **AND** report audit results

#### Scenario: Audit without research artifacts

- **WHEN** invoking `/audit` for a change without research/ directory
- **THEN** display error "No research artifacts found. Run /research first."
- **AND** exit without making changes
- **AND** suggest running `/research` with appropriate resources

#### Scenario: Audit with incomplete research

- **WHEN** invoking `/audit` but research/ directory is missing files
- **THEN** display warning listing missing research files
- **AND** prompt "Continue audit with incomplete research? (y/n)"
- **AND** if "n", exit without changes
- **AND** if "y", proceed with available research files

### Requirement: Spec delta validation

AI agents SHALL compare research findings to spec deltas and identify gaps.

#### Scenario: Identifying missing requirements

- **WHEN** validating spec deltas against research.md
- **THEN** extract all documented patterns, best practices, and integration requirements from research
- **AND** map them to existing requirements in spec deltas
- **AND** identify patterns mentioned in research but not covered by any requirement
- **AND** flag missing requirements for addition

#### Scenario: Validating requirement completeness

- **WHEN** validating individual requirements
- **THEN** check if requirement addresses relevant patterns from research.md
- **AND** check if requirement considers footguns from footguns.md
- **AND** check if requirement aligns with blast radius from blastradius.md
- **AND** flag requirements that may be incomplete or inconsistent with research

#### Scenario: Checking for deprecated patterns

- **WHEN** validating spec deltas
- **THEN** search for code examples or method names in requirements
- **AND** compare against deprecated methods listed in footguns.md
- **AND** flag any requirements that reference deprecated APIs
- **AND** suggest replacements from research findings

#### Scenario: Version-specific validation

- **WHEN** validating spec deltas
- **THEN** extract version requirements from research artifacts
- **AND** ensure specs specify correct dependency versions
- **AND** note if specs assume older version patterns
- **AND** flag version mismatches or missing version constraints

### Requirement: Adding missing requirements

AI agents SHALL augment spec deltas with requirements discovered during research validation.

#### Scenario: Adding security requirements

- **WHEN** research identifies security patterns not in specs
- **THEN** add new requirement to appropriate spec delta
- **AND** format as `### Requirement: <descriptive name>`
- **AND** include rationale referencing research findings
- **AND** add at least one scenario demonstrating secure usage
- **AND** include citation to research.md or footguns.md

#### Scenario: Adding configuration requirements

- **WHEN** research identifies required configuration not in specs
- **THEN** add new requirement for configuration setup
- **AND** specify required environment variables or config files
- **AND** include default values and validation rules
- **AND** add scenario for proper configuration
- **AND** reference research.md configuration section

#### Scenario: Adding error handling requirements

- **WHEN** research identifies common error cases or gotchas not in specs
- **THEN** add new requirement for error handling
- **AND** specify how system SHALL handle identified edge cases
- **AND** include scenarios for each error condition
- **AND** reference footguns.md for known failure modes

#### Scenario: Adding test requirements

- **WHEN** research identifies testing recommendations not in specs
- **THEN** add new requirement for testing approach
- **AND** specify test coverage expectations
- **AND** include mocking patterns from research
- **AND** add scenarios for key test cases
- **AND** reference research.md testing section

#### Scenario: Preserving existing requirements

- **WHEN** adding new requirements to spec deltas
- **THEN** preserve all existing requirements unchanged
- **AND** append new requirements after existing ones
- **AND** maintain consistent requirement numbering and formatting
- **AND** ensure new requirements don't duplicate existing ones

### Requirement: Design.md augmentation

AI agents SHALL update design.md with current API patterns, code snippets, and information beyond LLM training data.

#### Scenario: Adding current API patterns

- **WHEN** augmenting design.md
- **THEN** read "Code Examples" section from research.md
- **AND** extract current, version-specific API usage patterns
- **AND** add "API Integration Patterns" section to design.md
- **AND** include code snippets with version annotations
- **AND** highlight patterns that differ from older versions in LLM training
- **AND** include citations to research.md

#### Scenario: Documenting deprecated methods to avoid

- **WHEN** augmenting design.md
- **THEN** read "Deprecated Methods" section from footguns.md
- **AND** add or update "Decisions" section in design.md
- **AND** explicitly note deprecated methods to avoid
- **AND** document current replacements with code examples
- **AND** explain why deprecation matters (breaking changes, security, performance)
- **AND** include version where deprecation occurred

#### Scenario: Adding initialization code snippets

- **WHEN** augmenting design.md
- **THEN** extract initialization patterns from research.md "Architecture Patterns"
- **AND** add "Implementation Details" section to design.md if missing
- **AND** include complete, runnable initialization code
- **AND** annotate required configuration and environment variables
- **AND** specify version requirements (e.g., "Requires SDK v3.0+")
- **AND** include error handling patterns

#### Scenario: Adding authentication patterns

- **WHEN** augmenting design.md and authentication is involved
- **THEN** extract authentication patterns from research.md
- **AND** add "Security Implementation" section to design.md
- **AND** include code snippets for proper authentication
- **AND** document credential management approach
- **AND** reference security concerns from footguns.md
- **AND** specify token refresh or session handling if applicable

#### Scenario: Adding configuration examples

- **WHEN** augmenting design.md
- **THEN** extract configuration requirements from research.md
- **AND** add "Configuration" section to design.md if missing
- **AND** provide complete configuration file examples
- **AND** document all required and optional settings
- **AND** specify default values and validation rules
- **AND** include environment-specific configurations (dev/staging/prod)

#### Scenario: Documenting breaking changes from research

- **WHEN** augmenting design.md
- **THEN** read "Breaking Changes in Recent Versions" from footguns.md
- **AND** update "Migration Plan" section in design.md
- **AND** document each breaking change and mitigation strategy
- **AND** provide before/after code examples
- **AND** specify version upgrade path

#### Scenario: Adding performance considerations

- **WHEN** research identifies performance patterns
- **THEN** read "Performance Pitfalls" from footguns.md
- **AND** add or update "Risks / Trade-offs" section in design.md
- **AND** document performance-critical patterns
- **AND** include code examples of efficient usage
- **AND** note resource limits or rate limiting from documentation

#### Scenario: Highlighting non-obvious patterns

- **WHEN** augmenting design.md
- **THEN** identify patterns from research that contradict common assumptions
- **AND** explicitly call out non-obvious behaviors
- **AND** add "Implementation Gotchas" subsection if needed
- **AND** provide clear examples of correct usage
- **AND** explain why intuitive approach doesn't work

#### Scenario: Preserving existing design content

- **WHEN** augmenting design.md
- **THEN** read existing design.md first
- **AND** preserve all existing sections and content
- **AND** augment by adding new sections or expanding existing ones
- **AND** do not remove or contradict existing design decisions
- **AND** note if research reveals conflicts with existing design

### Requirement: Focus on beyond-LLM-training information

AI agents SHALL prioritize augmenting specs and design with information not available in LLM training data.

#### Scenario: Identifying recent API changes

- **WHEN** processing research findings
- **THEN** look for explicit version numbers and release dates
- **AND** prioritize patterns marked as "new in vX.Y" or "since vX.Y"
- **AND** highlight these as likely beyond LLM training cutoff
- **AND** ensure these patterns are included in design.md

#### Scenario: Flagging deprecated methods in training data

- **WHEN** processing footguns.md deprecations
- **THEN** identify methods that were common but are now deprecated
- **AND** explicitly note "This was common in older versions but is now deprecated"
- **AND** provide migration path from old to new API
- **AND** add to design.md as critical implementation note

#### Scenario: Documenting latest best practices

- **WHEN** research shows evolved best practices
- **THEN** compare current recommendations to historical common patterns
- **AND** note when best practice has changed from earlier versions
- **AND** explain rationale for the change
- **AND** ensure design.md reflects current, not historical, approach

#### Scenario: Including current type signatures

- **WHEN** research provides TypeScript/type information
- **THEN** extract current type signatures for key APIs
- **AND** include in design.md code snippets
- **AND** note if types have changed in recent versions
- **AND** specify minimum version for type safety

#### Scenario: Documenting current error codes

- **WHEN** research documents error handling
- **THEN** extract current error codes and messages
- **AND** include in design.md error handling section
- **AND** note if error structure has changed
- **AND** provide example error handling code

### Requirement: Validation and quality checks

AI agents SHALL validate augmented specs and design against quality standards.

#### Scenario: Running strict validation

- **WHEN** audit augmentation is complete
- **THEN** run `openspec validate --strict` on the change
- **AND** capture all validation errors and warnings
- **AND** fix any formatting issues introduced during augmentation
- **AND** ensure all new requirements have scenarios
- **AND** verify no duplicate requirements were added

#### Scenario: Cross-checking citations

- **WHEN** validating augmented content
- **THEN** verify all claims reference research artifacts
- **AND** ensure citations are accurate (correct file and section)
- **AND** check that code snippets match cited sources
- **AND** flag any unsupported claims

#### Scenario: Consistency validation

- **WHEN** validating augmented content
- **THEN** verify spec deltas align with design.md additions
- **AND** ensure terminology is consistent across files
- **AND** check version numbers match between specs and design
- **AND** verify no contradictions between requirements and design

#### Scenario: Completeness check

- **WHEN** validating audit results
- **THEN** confirm all high-priority research findings are addressed
- **AND** verify security concerns from footguns.md are spec'd
- **AND** ensure configuration requirements are complete
- **AND** check that blast radius impacts are reflected in specs

### Requirement: Reporting and feedback

AI agents SHALL provide clear reporting of audit results and changes made.

#### Scenario: Audit summary report

- **WHEN** audit completes successfully
- **THEN** display summary header "✓ Audit complete"
- **AND** report number of requirements added
- **AND** report number of design.md sections augmented
- **AND** list key additions (e.g., "Added authentication pattern", "Updated deprecated APIs")
- **AND** report validation status (passed/failed)

#### Scenario: Detailed changes report

- **WHEN** audit completes
- **THEN** list each spec delta modified
- **AND** for each modification, specify what was added
- **AND** list each design.md section augmented
- **AND** provide before/after comparison for critical changes
- **AND** include citations for all additions

#### Scenario: Validation failure reporting

- **WHEN** validation fails after augmentation
- **THEN** display validation errors clearly
- **AND** attempt to fix common issues (formatting, missing scenarios)
- **AND** if auto-fix fails, explain what needs manual correction
- **AND** do not leave the change in invalid state

#### Scenario: Research gap reporting

- **WHEN** research has missing information
- **THEN** note gaps in audit report
- **AND** list areas that require manual research
- **AND** flag requirements that couldn't be validated due to gaps
- **AND** suggest additional research sources if applicable

#### Scenario: Conflict reporting

- **WHEN** research findings conflict with existing design decisions
- **THEN** highlight conflicts in audit report
- **AND** explain the discrepancy
- **AND** provide research citation for conflicting information
- **AND** recommend manual review to resolve conflict

### Requirement: Error handling

AI agents SHALL handle errors gracefully during audit process.

#### Scenario: Invalid spec deltas

- **WHEN** spec deltas have syntax errors
- **THEN** attempt to parse and fix common issues
- **AND** if unfixable, display error with location
- **AND** do not proceed with augmentation
- **AND** suggest running validation first

#### Scenario: Missing proposal artifacts

- **WHEN** proposal.md or design.md is missing
- **THEN** display error listing missing files
- **AND** do not proceed with audit
- **AND** suggest completing proposal scaffolding first

#### Scenario: Malformed research artifacts

- **WHEN** research files have unexpected format
- **THEN** log warning about format issues
- **AND** attempt to extract information best-effort
- **AND** continue with valid portions
- **AND** note limitations in audit report

#### Scenario: Write permission errors

- **WHEN** unable to write to spec or design files
- **THEN** display clear error message
- **AND** explain which file is protected
- **AND** suggest checking file permissions
- **AND** do not partially modify files

### Requirement: Integration with workflow

AI agents SHALL complete the audit as the final step before proposal approval.

#### Scenario: Post-audit next steps

- **WHEN** audit completes successfully
- **THEN** display "Proposal ready for review"
- **AND** summarize complete proposal contents
- **AND** note that research-backed specs are ready
- **AND** indicate no further AI steps required before approval

#### Scenario: Audit triggering re-research

- **WHEN** audit reveals significant research gaps
- **THEN** suggest re-running `/research` with additional sources
- **AND** list specific documentation areas needed
- **AND** do not mark proposal as ready until gaps filled

#### Scenario: Iterative audit

- **WHEN** audit is run multiple times on same change
- **THEN** preserve previous augmentations
- **AND** only add new findings from research
- **AND** update existing sections if research has changed
- **AND** log that this is a re-audit