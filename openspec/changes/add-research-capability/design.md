# Design: Research and Audit Capabilities

## Context

OpenSpec currently supports a linear workflow: create proposal → validate → implement → archive. When features involve external libraries, SDKs, APIs, or frameworks, AI agents often lack structured guidance on integration patterns, common pitfalls, and codebase impact. Additionally, AI agents may rely on outdated patterns from their training data when current best practices have evolved.

This design introduces two slash command capabilities for AI agents: `/research` and `/audit`. These enable systematic investigation of external dependencies and validation/augmentation of specs to reflect current best practices beyond LLM training data.

## Goals / Non-Goals

### Goals
- Provide `/research` and `/audit` slash commands for AI agents
- Support multiple documentation sources with single command invocation
- Automatically fetch and analyze external documentation
- Generate three distinct research files: implementation guide, blast radius analysis, and footguns
- Validate specs against research findings and augment with missing requirements
- Update design.md with current API patterns and code snippets beyond LLM training data
- Integrate with Context7 for package documentation lookup
- Maintain explicit, manual invocation (not automatic)

### Non-Goals
- Automatic research/audit without AI agent explicit invocation
- Real-time documentation updates during implementation
- Automated version tracking and re-research on dependency updates
- AI code generation/implementation from research (research informs only)
- Structured validation schema for research artifacts (HITL approval is gate)
- User-facing CLI commands (these are AI agent capabilities only)

## Decisions

### Research File Structure

**Decision**: Create three separate markdown files in `changes/<change-id>/research/`

**Rationale**:
- Separation of concerns: implementation patterns vs. codebase impact vs. pitfalls
- Easier to navigate and reference during implementation
- Clear ownership of content (research.md for "how", blastradius.md for "where", footguns.md for "watch out")
- Allows parallel generation and updates

**Alternatives considered**:
- Single research.md file: Too monolithic, harder to navigate
- Integrate into design.md: Pollutes design decisions with external reference material
- Subdirectory per dependency: Over-engineering for initial version

### File Naming and Sections

**research.md** structure:
```markdown
# Research: <Feature Name>

## External Dependencies
[List with versions, documentation links]

## Architecture Patterns
[How the library/SDK expects integration]

## Authentication & Configuration
[API keys, config files, initialization]

## Best Practices
[Patterns from official docs with citations]

## Code Examples
[Relevant snippets with source links]

## Testing Approach
[How docs recommend testing]

## Migration Considerations
[If updating existing integration]

## References
[Full list of sources consulted]
```

**blastradius.md** structure:
```markdown
# Blast Radius: <Feature Name>

## Integration Points
[Where code changes will occur]

## Affected Modules
[List with impact level: high/medium/low]

## Dependency Graph
[What depends on changes, what changes depend on]

## Data Model Impact
[Schema changes, migrations needed]

## API Surface Changes
[Public interfaces affected]

## Configuration Changes
[Environment variables, config files]

## Breaking Changes
[What existing code will break]

## Risk Assessment
[High-risk areas requiring extra care]
```

**footguns.md** structure:
```markdown
# Footguns: <Feature Name>

## Common Mistakes

### 1. [Mistake Name]
- **Problem**: [What goes wrong]
- **Why it happens**: [Root cause]
- **Solution**: [How to avoid]
- **Source**: [Citation link]

## Gotchas

### 1. [Gotcha Name]
- **Description**: [Unexpected behavior]
- **Impact**: [What breaks]
- **Workaround**: [How to handle]
- **Source**: [Citation link]

## Version-Specific Issues
[Known problems in specific versions]

## Performance Pitfalls
[Common performance mistakes]

## Security Concerns
[Security-related gotchas]

## Deprecation Warnings
[What to avoid for future compatibility]
```

### Slash Command Design

**Decision**: Two AI agent slash commands: `/research <resources>` and `/audit`

**Rationale**:
- AI agents invoke explicitly as part of proposal workflow
- No user-facing CLI commands needed
- Multiple resources passed as arguments in single invocation
- Automatic resource type classification (URL, GitHub, file, package)
- Sequential workflow: research → audit → approval

**Command signatures**:
```
/research <resource1> <resource2> ... <resourceN>
/audit
```

**Resource classification patterns**:
- URL: Starts with `http://` or `https://`
- GitHub: Matches `owner/repo` pattern (single slash, no protocol)
- Local file: Ends with `.md` or contains path separators
- Package: Anything else (attempt Context7 lookup)

**Workflow**:
```
1. AI creates proposal/tasks/design/specs
2. AI invokes: /research https://example.com/docs pkg/repo ./local.md
3. AI agent:
   - Classifies each resource
   - Fetches all resources
   - Generates research/, blastradius.md, footguns.md
4. AI invokes: /audit
5. AI agent:
   - Validates specs against research
   - Adds missing requirements
   - Augments design.md with current patterns
   - Re-runs validation
6. Proposal ready for approval
```

**Error handling**:
- No resources provided: Error with usage example
- Network failure: Retry once, continue with partial results
- Context7 unavailable: Attempt inference, fallback gracefully
- All fetches fail: Error, don't create research files
- Audit without research: Error prompting to run /research first

### Documentation Fetching Strategy

**Decision**: Fetch all references upfront, then analyze in batch

**Rationale**:
- Allows progress indication during fetching
- Can aggregate information from multiple sources
- Easier to handle partial failures
- Better user feedback

**Fetching logic**:
- URLs: Use native fetch with 30s timeout
- Local files: Read with fs.readFile (UTF-8)
- Package names: Call Context7 API endpoint
- GitHub repos: Fetch README.md from main/master branch
- Store fetched content in memory with metadata (source URL, fetch time)

### Context7 Integration

**Decision**: Optional dependency with graceful degradation

**Implementation**:
- Check for Context7 availability via environment variable or config
- If available, use API to fetch package documentation
- If unavailable, prompt user to provide URL manually as fallback
- Don't block research generation on Context7 failures

**API pattern** (assumed):
```typescript
interface Context7Response {
  package: string;
  version?: string;
  documentation: string; // Markdown content
  url: string;
}
```

### AI Analysis Behavior

**Decision**: AI agent performs analysis and generates files

**Agent responsibilities**:
1. Parse fetched documentation for key sections
2. Extract integration patterns and examples
3. Identify explicit warnings, notes, and gotchas
4. Map integration points to existing codebase structure
5. Generate three files with citations back to source
6. Ensure consistent markdown formatting

**Analysis patterns**:
- Look for: "Warning", "Note", "Important", "Gotcha", "Common mistake"
- Extract code blocks with language hints
- Identify configuration examples
- Map terminology to codebase equivalents
- Highlight version-specific information

### Integration with Audit and Design.md

**Decision**: `/audit` augments design.md with research-backed patterns

**Relationship**:
- `/research` generates research artifacts first
- `/audit` reads research and existing proposal artifacts
- Audit validates specs against research findings
- Audit augments design.md with current API patterns, code snippets, and deprecations
- Focus on information beyond LLM training data
- research/ files remain as supporting documentation

**Workflow**:
```
1. AI creates proposal.md + tasks.md + design.md + specs
2. AI invokes: /research <sources>
3. Research artifacts generated
4. AI invokes: /audit
5. Audit augments design.md with:
   - Current API integration patterns
   - Version-specific code snippets
   - Deprecated methods to avoid
   - Security implementation patterns
   - Configuration examples
6. Audit adds missing requirements to specs
7. Validation re-run
```

**Augmentation focus**:
- Current methods/patterns not in LLM training
- Explicit deprecation warnings with replacements
- Version-specific code examples (e.g., "Requires v12.0+")
- Non-obvious integration patterns
- Security considerations from official docs

## Risks / Trade-offs

### Risk: Network dependency for URL fetching
- **Mitigation**: Retry logic, timeout handling, continue with partial results
- **Trade-off**: Research quality depends on successful fetches

### Risk: AI hallucination in analysis
- **Mitigation**: Require citations for all claims, HITL approval step
- **Trade-off**: Manual review required before trusting research

### Risk: Outdated documentation
- **Mitigation**: Include fetch timestamp, focus on version-specific patterns
- **Trade-off**: No automatic refresh mechanism

### Risk: Context7 unavailability
- **Mitigation**: Graceful degradation, attempt URL inference from package registries
- **Trade-off**: Reduced convenience for package documentation

### Risk: Large documentation sets
- **Mitigation**: Focus on key sections (Getting Started, Deprecations, Security)
- **Trade-off**: May miss edge case information

### Risk: Blast radius analysis requires codebase understanding
- **Mitigation**: AI uses existing codebase context, include disclaimer if limited
- **Trade-off**: Quality depends on AI's codebase knowledge

### Risk: Audit augmentation conflicts with existing design
- **Mitigation**: Preserve existing content, flag conflicts, require manual resolution
- **Trade-off**: May require manual intervention to resolve contradictions

### Risk: Over-reliance on research in specs
- **Mitigation**: Audit adds requirements, doesn't replace human judgment
- **Trade-off**: HITL review still critical for final approval

## Migration Plan

This is a new capability with no code implementation required (AI agent behaviors defined via specifications).

**Rollout**:
1. Update AGENTS.md with `/research` and `/audit` documentation
2. Add complete workflow examples (Stripe, Redis, OAuth)
3. Test with AI agents on real-world proposals
4. Iterate on spec wording based on AI agent interpretation
5. Monitor quality of generated research and audit outputs
6. Refine specs based on feedback

**Rollback**:
- If research/audit generate low-quality output, AI can simply skip these steps
- No breaking changes to existing workflow
- Update AGENTS.md to discourage usage if needed
- Specs can be marked deprecated without code changes

## Open Questions

1. **Context7 API details**: What is the exact API endpoint and authentication method?
   - Resolution: Use environment variables for flexibility, document in AGENTS.md

2. **Blast radius depth**: How deep should the codebase analysis go?
   - Resolution: Start with direct dependencies (one level), expand based on feedback

3. **Research file versioning**: Should research/ be tracked in git?
   - Resolution: Yes, track as source of truth for implementation decisions

4. **Multi-library research**: How to handle proposals with multiple external dependencies?
   - Resolution: Pass all sources as arguments to single `/research` invocation

5. **Audit iteration**: What if audit is run multiple times?
   - Resolution: Preserve previous augmentations, only add new findings

6. **Conflict resolution**: How to handle research contradicting existing design?
   - Resolution: Audit flags conflicts, requires manual resolution

7. **Beyond-LLM focus**: How to identify what's beyond LLM training data?
   - Resolution: Look for version markers (e.g., "new in v3.0"), deprecation notices, and recent release dates

8. **Validation rules**: What makes research/audit output "valid"?
   - Resolution: Require citations, proper formatting, HITL approval as final gate