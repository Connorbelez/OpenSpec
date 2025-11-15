# Requirements Summary: Add Research and Audit Capabilities

## Overview

This document provides a high-level summary of the requirements for adding research and audit capabilities to OpenSpec. These are AI agent slash commands that enable systematic investigation of external dependencies and validation/augmentation of specs to reflect current best practices beyond LLM training data.

## What Problem Does This Solve?

When AI agents create proposals for features integrating external dependencies, they face several challenges:
- **Outdated training data**: LLM training may include deprecated methods and outdated patterns
- **Missing current best practices**: Official documentation evolves faster than training data
- **Integration mistakes**: Common footguns and pitfalls not captured in specs
- **Incomplete specs**: Missing requirements for security, configuration, error handling
- **Codebase impact unknown**: Blast radius not assessed before implementation

The research and audit capabilities address these gaps through a two-step AI agent workflow:
1. **`/research`** - Fetch and analyze external documentation
2. **`/audit`** - Validate specs and augment with current patterns

## High-Level Design

### Workflow Position

```
Current Flow:
User Request → AI Creates Proposal → Approval → Implementation

New Flow with Research & Audit:
User Request → AI Creates Proposal → AI: /research [sources] → AI: /audit → Enhanced Proposal → Approval → Implementation
                                              ↓                        ↓
                                    Research Artifacts          Specs Validated & Augmented
                                                                design.md Updated
```

Research and audit are **explicit slash commands** that AI agents invoke manually after creating proposal artifacts. They are optional but recommended when external dependencies are involved.

### Two Slash Commands

#### 1. `/research <resource1> <resource2> ... <resourceN>`

**Purpose**: Fetch and analyze external documentation to generate research artifacts.

**Arguments**: Variable number of resources (URLs, GitHub repos, local files, package names)

**Outputs**: Three markdown files in `changes/<change-id>/research/`:
- `research.md` - Implementation guide with patterns, best practices, code examples
- `blastradius.md` - Integration points, affected modules, codebase impact
- `footguns.md` - Common mistakes, gotchas, deprecated methods, security concerns

**Example**:
```
/research https://stripe.com/docs stripe/stripe-node ./local-guide.md
```

#### 2. `/audit`

**Purpose**: Validate specs against research findings and augment with current patterns.

**Arguments**: None (reads from `research/` directory)

**Behavior**:
1. Compare research findings to spec deltas
2. Add missing requirements (security, config, error handling)
3. Update design.md with current API patterns and code snippets
4. Focus on information beyond LLM training data
5. Re-run validation

**Example output**:
```
✓ Added 3 requirements (webhook verification, idempotency, error handling)
✓ Augmented design.md with Stripe API v12 patterns
✓ Added code snippets for PaymentIntent creation
✓ Noted deprecated Charges API (use PaymentIntents instead)
✓ Validation: PASSED
```

## Key Requirements

### 1. Agent Research Capability (`specs/agent-research/spec.md`)

**Resource Classification**:
- **URL**: Starts with `http://` or `https://` → HTTP GET fetch
- **GitHub repo**: Matches `owner/repo` pattern → Fetch README.md from main/master
- **Local file**: Ends with `.md` or contains path separators → Read UTF-8 file
- **Package name**: Default classification → Query Context7 API

**Documentation Analysis**:
AI extracts from fetched documentation:
- Integration patterns (Getting Started, Installation sections)
- Best practices (Best Practices, Guidelines sections)
- Footguns (Warning, Important, Note, Caution, Deprecated keywords)
- Current API patterns with version numbers
- Code examples with language hints and version annotations
- Testing recommendations

**Blast Radius Analysis**:
AI analyzes codebase to determine:
- Integration points (files that will import dependency)
- Affected modules with impact levels (high/medium/low)
- Dependency graph (upstream/downstream impacts)
- Data model impact (schema, API changes)
- Configuration changes (env vars, config files)
- Risk assessment (security, performance concerns)

**Research Artifact Generation**:
Three structured markdown files with:
- Citations for all claims `[Source: <section> - <url>]`
- Fetch timestamps
- Version-specific information clearly marked
- Complete, runnable code examples
- Severity levels for footguns
- Impact rationale for blast radius

**Error Handling**:
- All fetches fail → Error, don't create files
- Partial failures → Warning, continue with available sources
- Context7 unavailable → Attempt URL inference, fallback gracefully
- Limited codebase context → Include disclaimer in blastradius.md

### 2. Agent Audit Capability (`specs/agent-audit/spec.md`)

**Spec Delta Validation**:
- Compare research findings to existing requirements
- Identify patterns in research not covered by specs
- Flag requirements referencing deprecated APIs
- Check version mismatches
- Validate completeness against research

**Adding Missing Requirements**:
When research identifies gaps:
- Add new requirements to spec deltas
- Format as `### Requirement: <name>` with scenarios
- Include rationale and citation to research
- Cover security, configuration, error handling, testing
- Preserve existing requirements unchanged

**Design.md Augmentation**:
Update design.md with sections:
- **API Integration Patterns** - Current, version-specific usage
- **Implementation Details** - Initialization and configuration code
- **Security Implementation** - Authentication and credential patterns
- **Configuration** - Complete config file examples
- **Decisions** - Document deprecated methods to avoid with replacements
- **Risks / Trade-offs** - Performance and security considerations

**Code Snippet Requirements**:
All code in design.md must:
- Be complete and runnable
- Include version annotations (e.g., "Requires SDK v3.0+")
- Highlight deprecated methods with replacements
- Include error handling
- Cite research.md source
- Focus on current patterns beyond LLM training

**Focus on Beyond-LLM-Training Information**:
Prioritize:
- Methods marked "new in vX.Y" or "since vX.Y"
- Deprecated methods that were common but now obsolete
- Evolved best practices different from historical patterns
- Current type signatures and error codes
- Recent security recommendations

**Validation and Quality**:
- Run `openspec validate --strict` after augmentation
- Verify all claims have research citations
- Check consistency across spec deltas and design.md
- Ensure all new requirements have scenarios
- Fix formatting issues automatically

**Reporting**:
Display audit summary:
- Number of requirements added
- Number of design.md sections augmented
- Key additions (e.g., "Added authentication pattern")
- Validation status (passed/failed)
- Any conflicts requiring manual resolution

### 3. Agent Instructions Update (`specs/docs-agent-instructions/spec.md`)

**Modified Workflow**:
Stage 1 now includes:
1. AI creates proposal.md + tasks.md + design.md + spec deltas
2. AI invokes `/research <sources>` if external dependencies detected
3. Research artifacts generated
4. AI invokes `/audit` to validate and augment
5. Proposal ready for approval

**Slash Command Documentation**:
- `/research <resource1> <resource2> ...` syntax and examples
- Resource type classification patterns
- Research artifact structure and purpose
- `/audit` behavior and outputs
- When to use vs. skip

**Workflow Guidance**:
- When to invoke research (external libs, SDKs, APIs, frameworks)
- When to skip (internal changes, well-understood dependencies)
- Selecting research sources (official docs, security guides, GitHub)
- Always invoke audit after research
- Audit is quality gate before approval

**Context Checklist Updates**:
- "After creating proposal artifacts, decide if `/research` is needed"
- "If research conducted, always run `/audit` before requesting approval"
- "Read research/ artifacts during implementation if present"
- "Use current patterns from research, not patterns from LLM training"

**Examples**:
Complete Stripe integration workflow:
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

## Technical Design Decisions

### Why Slash Commands vs. CLI Tools?

**Decision**: AI agent slash commands, not user-facing CLI commands

**Rationale**:
- These are AI agent capabilities, not user actions
- Documented in specs for AI agents to understand
- No code implementation required (behavior-driven)
- AI agents invoke as part of proposal workflow
- Simpler than interactive prompts or CLI tooling

### Why Two Separate Commands?

**Decision**: Separate `/research` and `/audit` commands

**Rationale**:
- Clear separation of concerns (fetch vs. validate)
- Research can be re-run independently
- Audit can focus solely on validation and augmentation
- Sequential workflow is explicit and understandable
- Easier to troubleshoot when separated

### Why Variable Arguments for `/research`?

**Decision**: Accept N resources as arguments instead of interactive prompts

**Rationale**:
- Simpler for AI agents to invoke
- All sources specified upfront
- Automatic type classification (URL, GitHub, file, package)
- No prompt/response loop needed
- Easier to document and use

### Why Augment design.md vs. Create Separate File?

**Decision**: Audit augments existing design.md rather than creating new file

**Rationale**:
- design.md is canonical location for implementation patterns
- Keeps all technical decisions in one place
- Research artifacts remain as supporting evidence
- Easier for implementers to find information
- Reduces file proliferation

### Why Focus on Beyond-LLM-Training Data?

**Decision**: Audit emphasizes information not in LLM training data

**Rationale**:
- AI agents naturally use training data patterns
- Training data may include deprecated methods
- Official docs evolve faster than model retraining
- Explicit current patterns prevent outdated implementations
- Version markers indicate likely new information

### Why HITL Approval as Validation Gate?

**Decision**: Human approval instead of automated validation

**Rationale**:
- AI can hallucinate during analysis
- Manual review ensures quality
- Structured validation can come later
- Simpler initial implementation
- Maintains human oversight

## Implementation Approach

**Note**: This is a documentation-only change. No code implementation required.

1. Update `openspec/AGENTS.md` with slash command documentation
2. Document resource classification patterns
3. Document research artifact generation templates
4. Document audit validation and augmentation logic
5. Provide complete workflow examples
6. Add troubleshooting guidance

AI agents read the specifications and perform the behaviors naturally through their capabilities (reading files, analyzing content, generating markdown).

## Success Criteria

### Research Quality
- ✓ All claims have citations with URLs
- ✓ Code examples include version annotations
- ✓ Blast radius includes impact rationale
- ✓ Footguns categorized by severity
- ✓ Proper markdown formatting
- ✓ Cross-file consistency

### Audit Quality
- ✓ Specs validated against research findings
- ✓ Missing requirements identified and added
- ✓ design.md augmented with current patterns
- ✓ Deprecated methods flagged with replacements
- ✓ All augmentations cite research sources
- ✓ Validation passes after augmentation

### Workflow Integration
- ✓ Clear slash command documentation
- ✓ Complete workflow examples
- ✓ Troubleshooting guidance
- ✓ Quality standards defined
- ✓ When to use vs. skip guidance

## Example Workflows

### Stripe Integration

```
User: "Create a proposal to add Stripe payment integration"

AI: [Creates proposal/tasks/design/specs for Stripe integration]

AI: /research https://stripe.com/docs/api https://stripe.com/docs/security stripe/stripe-node

AI: Fetching: https://stripe.com/docs/api
    ✓ Fetched: https://stripe.com/docs/api
    Fetching: https://stripe.com/docs/security
    ✓ Fetched: https://stripe.com/docs/security
    Fetching: stripe/stripe-node (GitHub)
    ✓ Fetched: stripe/stripe-node README.md
    
    Research complete:
    - ✓ research/research.md (patterns, best practices, code examples)
    - ✓ research/blastradius.md (integration points, impact analysis)
    - ✓ research/footguns.md (common mistakes, deprecations)
    
    Next step: /audit

AI: /audit

AI: Comparing research findings to spec deltas...
    ✓ Validated existing requirements
    ✓ Added requirement: Webhook Signature Verification
    ✓ Added requirement: Idempotency Key Usage
    ✓ Added requirement: Payment Intent Error Handling
    
    Augmenting design.md...
    ✓ Added "API Integration Patterns" section
    ✓ Added PaymentIntent creation code (v12.0+)
    ✓ Added webhook verification code
    ✓ Noted deprecated Charges API → use PaymentIntents
    ✓ Added configuration examples with secrets management
    
    Re-running validation...
    ✓ Validation: PASSED
    
    Audit complete:
    - 3 requirements added
    - 5 design.md sections augmented
    - 0 conflicts detected

AI: "Proposal ready for review. Specs include:
     - Webhook signature verification (required for security)
     - Idempotency key handling (prevent duplicate charges)
     - Error handling for all payment states
     - Current PaymentIntent API patterns (v12.0+)
     - Deprecated methods flagged (Charges API removed)"
     
User: [Reviews and approves]
```

### Redis Caching

```
User: "Create a proposal to add Redis caching layer"

AI: [Creates proposal/tasks/design/specs]

AI: /research https://redis.io/docs redis/redis-node ./docs/redis-guide.md

AI: [Generates research artifacts noting Redis v4 connection patterns]

AI: /audit

AI: [Finds missing connection pooling requirement]
    ✓ Added requirement: Connection Pool Management
    ✓ Added requirement: Graceful Redis Failure Handling
    ✓ Augmented design.md with redis v4 createClient pattern
    ✓ Noted deprecated HMSET → use HSET instead
    ✓ Added retry strategy configuration
    ✓ Validation: PASSED

AI: "Proposal ready. Key updates:
     - Connection pooling requirement added (not in specs)
     - Redis v4 patterns (differs from v3 in LLM training)
     - Deprecated HMSET flagged → use HSET
     - Graceful degradation when Redis unavailable"
```

## Open Questions

1. **Context7 API integration**: Exact endpoint and authentication?
   - Use environment variables for flexibility

2. **Blast radius depth**: How deep to analyze dependencies?
   - Start with one level, expand based on feedback

3. **Audit iteration**: Running audit multiple times?
   - Preserve previous augmentations, only add new findings

4. **Conflict resolution**: Research contradicts existing design?
   - Flag conflicts, require manual resolution

5. **Beyond-LLM identification**: How to detect new information?
   - Look for version markers, deprecation notices, recent dates

## Files in This Change

```
openspec/changes/add-research-capability/
├── proposal.md                           # Why, what, impact (refactored)
├── tasks.md                              # 145-item implementation checklist
├── design.md                             # Technical decisions (updated)
├── REQUIREMENTS_SUMMARY.md               # This file (updated)
└── specs/
    ├── agent-research/
    │   └── spec.md                       # /research slash command (NEW)
    ├── agent-audit/
    │   └── spec.md                       # /audit slash command (NEW)
    └── docs-agent-instructions/
        └── spec.md                       # Updated workflow guidance (MODIFIED)
```

## Validation Status

✅ All specs validated with `openspec validate add-research-capability --strict`

Run validation yourself:
```bash
cd OpenSpec
./bin/openspec.js validate add-research-capability --strict
```

## Next Steps

1. **Review** the three spec files for completeness and accuracy
2. **Approve** the refactored workflow approach
3. **Update** `openspec/AGENTS.md` with slash command documentation
4. **Test** with AI agents on real-world proposals (Stripe, Redis, OAuth)
5. **Iterate** based on quality of generated research and audit outputs
6. **Refine** specs based on feedback from AI agent usage