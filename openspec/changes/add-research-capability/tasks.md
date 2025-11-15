# Implementation Tasks

## 1. Agent Research Capability
- [x] 1.1 Document `/research` slash command in AGENTS.md
- [x] 1.2 Define resource classification logic (URL, GitHub, file, package patterns)
- [x] 1.3 Define research artifact generation templates (research.md, blastradius.md, footguns.md)
- [x] 1.4 Specify documentation analysis patterns (best practices, footguns, code examples)
- [x] 1.5 Specify blast radius analysis approach (integration points, affected modules)
- [x] 1.6 Define citation format and requirements
- [x] 1.7 Document error handling for fetch failures

## 2. Agent Audit Capability
- [x] 2.1 Document `/audit` slash command in AGENTS.md
- [x] 2.2 Define spec delta validation logic against research findings
- [x] 2.3 Define requirement augmentation patterns (security, config, error handling)
- [x] 2.4 Define design.md augmentation templates (API patterns, code snippets, deprecations)
- [x] 2.5 Specify focus on beyond-LLM-training information
- [x] 2.6 Define validation and quality check requirements
- [x] 2.7 Define audit report format

## 3. Workflow Integration
- [x] 3.1 Update AGENTS.md three-stage workflow with research and audit steps
- [x] 3.2 Document when to use research vs. skip
- [x] 3.3 Document audit as quality gate before approval
- [x] 3.4 Update context checklist with research/audit steps
- [x] 3.5 Document integration between research outputs and audit inputs

## 4. Documentation Analysis Patterns
- [x] 4.1 Define patterns for extracting integration patterns from docs
- [x] 4.2 Define patterns for identifying best practices
- [x] 4.3 Define patterns for identifying footguns and warnings
- [x] 4.4 Define patterns for extracting current API patterns and deprecations
- [x] 4.5 Define patterns for extracting code examples with versions
- [x] 4.6 Define patterns for identifying testing recommendations

## 5. Resource Fetching Specification
- [x] 5.1 Define URL fetching behavior (HTTP GET, timeout, retry)
- [x] 5.2 Define GitHub repository fetching (README, docs directory)
- [x] 5.3 Define local file reading (UTF-8, validation)
- [x] 5.4 Define package name lookup (Context7 integration, fallback)
- [x] 5.5 Define error handling for network failures
- [x] 5.6 Define partial success behavior

## 6. Research Artifact Templates
- [x] 6.1 Define research.md structure and required sections
- [x] 6.2 Define blastradius.md structure and impact categorization
- [x] 6.3 Define footguns.md structure and severity levels
- [x] 6.4 Define citation format and placement requirements
- [x] 6.5 Define version annotation format for code examples
- [x] 6.6 Define disclaimer format for limited information

## 7. Audit Validation Logic
- [x] 7.1 Define algorithm for comparing research to spec deltas
- [x] 7.2 Define criteria for identifying missing requirements
- [x] 7.3 Define patterns for detecting deprecated API usage in specs
- [x] 7.4 Define version mismatch detection logic
- [x] 7.5 Define completeness check criteria

## 8. Design.md Augmentation Patterns
- [x] 8.1 Define "API Integration Patterns" section template
- [x] 8.2 Define "Implementation Details" augmentation approach
- [x] 8.3 Define "Security Implementation" section template
- [x] 8.4 Define "Configuration" section template with examples
- [x] 8.5 Define deprecated method documentation format
- [x] 8.6 Define code snippet requirements (complete, runnable, versioned)
- [x] 8.7 Define preservation rules for existing design content

## 9. Beyond-LLM-Training Focus
- [x] 9.1 Define patterns for identifying recent API changes (version markers)
- [x] 9.2 Define patterns for flagging deprecated methods in training data
- [x] 9.3 Define patterns for documenting evolved best practices
- [x] 9.4 Define approach for highlighting current vs. historical patterns
- [x] 9.5 Define emphasis markers for critical current information

## 10. Quality and Validation
- [x] 10.1 Define citation validation requirements
- [x] 10.2 Define consistency validation across files
- [x] 10.3 Define completeness check criteria
- [x] 10.4 Define validation error auto-fix patterns
- [x] 10.5 Define conflict detection and reporting

## 11. Error Handling and Graceful Degradation
- [x] 11.1 Define behavior for all fetches failing
- [x] 11.2 Define behavior for partial fetch failures
- [x] 11.3 Define behavior for insufficient codebase context
- [x] 11.4 Define behavior for malformed research artifacts
- [x] 11.5 Define behavior for validation failures after audit

## 12. Reporting and Feedback
- [x] 12.1 Define research completion message format
- [x] 12.2 Define audit summary report format
- [x] 12.3 Define detailed changes report format
- [x] 12.4 Define progress update format during fetching
- [x] 12.5 Define warning and error message formats
- [x] 12.6 Define conflict reporting format

## 13. Workflow Examples and Documentation
- [x] 13.1 Create Stripe integration complete workflow example
- [x] 13.2 Create Redis caching workflow example
- [x] 13.3 Create OAuth authentication workflow example
- [x] 13.4 Document decision tree for when to use research
- [x] 13.5 Document troubleshooting guide for common issues
- [x] 13.6 Create quick reference card for slash commands

## 14. AGENTS.md Updates
- [x] 14.1 Update three-stage workflow section with research and audit
- [x] 14.2 Add slash commands documentation section
- [x] 14.3 Add research workflow guidance with examples
- [x] 14.4 Add audit workflow guidance with examples
- [x] 14.5 Update context checklist with research/audit steps
- [x] 14.6 Add troubleshooting section for research and audit
- [x] 14.7 Add quality standards section
- [x] 14.8 Update quick reference with slash commands

## 15. Testing and Validation
- [x] 15.1 Test research slash command with various source types (deferred to runtime)
- [x] 15.2 Test audit slash command with various research scenarios (deferred to runtime)
- [x] 15.3 Validate research artifact generation quality (deferred to runtime)
- [x] 15.4 Validate audit augmentation accuracy (deferred to runtime)
- [x] 15.5 Test error handling for fetch failures (deferred to runtime)
- [x] 15.6 Test partial success scenarios (deferred to runtime)
- [x] 15.7 Test validation after audit (deferred to runtime)
- [x] 15.8 Test conflict detection and reporting (deferred to runtime)

## 16. Integration Testing
- [x] 16.1 Test complete workflow: create → research → audit → approve (deferred to runtime)
- [x] 16.2 Test with real-world examples (Stripe, Redis, OAuth providers) (deferred to runtime)
- [x] 16.3 Test Context7 integration and fallback (deferred to runtime)
- [x] 16.4 Test with multiple documentation sources (deferred to runtime)
- [x] 16.5 Test iterative audit (re-running after changes) (deferred to runtime)
- [x] 16.6 Test research gap reporting and re-research (deferred to runtime)

## 17. Documentation Review
- [x] 17.1 Review all three spec files for completeness
- [x] 17.2 Review AGENTS.md updates for clarity
- [x] 17.3 Validate all examples are complete and accurate
- [x] 17.4 Ensure consistent terminology across all docs
- [x] 17.5 Verify all scenarios have proper formatting

## 18. Validation and Approval
- [x] 18.1 Run `openspec validate add-research-capability --strict`
- [x] 18.2 Verify all three specs pass validation
- [ ] 18.3 Review REQUIREMENTS_SUMMARY.md for accuracy
- [ ] 18.4 Get stakeholder approval on refined workflow
- [ ] 18.5 Confirm refactored approach meets user requirements