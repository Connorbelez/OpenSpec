# agent-research Specification

## Purpose
Defines the `/research` slash command capability for AI agents to fetch and analyze external documentation, generating structured research artifacts that inform implementation decisions.

## ADDED Requirements

### Requirement: Slash command invocation

AI agents SHALL recognize and execute the `/research` slash command with multiple resource arguments.

#### Scenario: Basic slash command syntax

- **WHEN** AI agent invokes `/research <resource1> <resource2> ... <resourceN>`
- **THEN** parse each resource argument
- **AND** classify each as URL, GitHub repository, local file, or package name
- **AND** fetch all resources
- **AND** generate three research artifact files

#### Scenario: Multiple resource types

- **WHEN** invoking `/research https://stripe.com/docs stripe/stripe-node ./local-guide.md`
- **THEN** recognize first argument as URL
- **AND** recognize second argument as GitHub repository (owner/repo pattern)
- **AND** recognize third argument as local file path
- **AND** fetch all three resources
- **AND** aggregate information into research artifacts

#### Scenario: No resources provided

- **WHEN** invoking `/research` without arguments
- **THEN** display error "No resources provided. Usage: /research <url|repo|file|package> ..."
- **AND** provide examples of valid resource formats
- **AND** do not create research files

### Requirement: Resource classification and fetching

AI agents SHALL automatically classify resource arguments and fetch content appropriately.

#### Scenario: URL resource detection

- **WHEN** argument starts with `http://` or `https://`
- **THEN** classify as URL
- **AND** make HTTP GET request with 30 second timeout
- **AND** handle HTML by extracting main content and converting to markdown
- **AND** handle markdown by preserving structure
- **AND** store content with source URL and fetch timestamp

#### Scenario: GitHub repository detection

- **WHEN** argument matches pattern `owner/repo` (single forward slash, no protocol)
- **THEN** classify as GitHub repository
- **AND** construct raw content URL for README.md from main branch
- **AND** if main branch fails, try master branch
- **AND** fetch additional docs from /docs directory if README references them
- **AND** store content with repository and branch metadata

#### Scenario: Local file detection

- **WHEN** argument ends with `.md` or contains path separators
- **THEN** classify as local file path
- **AND** read file content as UTF-8
- **AND** validate file exists and is readable
- **AND** preserve relative links if they reference other local files
- **AND** store content with file path and read timestamp

#### Scenario: Package name detection

- **WHEN** argument does not match other patterns
- **THEN** classify as package name
- **AND** attempt Context7 API lookup
- **AND** if version specified in proposal, request that version's docs
- **AND** if no version specified, request latest stable version
- **AND** store content with package name, version, and source URL

#### Scenario: Context7 unavailable fallback

- **WHEN** Context7 API is unreachable for package lookup
- **THEN** attempt to infer documentation URL (e.g., npmjs.com for npm packages)
- **AND** fetch from inferred URL if successful
- **AND** if inference fails, log warning and continue with other resources
- **AND** do not block research generation on Context7 failure

#### Scenario: Retry logic for network failures

- **WHEN** HTTP request fails due to timeout or network error
- **THEN** retry once after 2 second delay
- **AND** if retry fails, log warning with resource URL
- **AND** continue with remaining resources
- **AND** include failed resources in summary report

### Requirement: Documentation analysis and extraction

AI agents SHALL analyze fetched documentation to extract key information for research artifacts.

#### Scenario: Identifying integration patterns

- **WHEN** analyzing documentation content
- **THEN** search for sections titled "Getting Started", "Installation", "Quick Start", "Integration", "Setup"
- **AND** extract initialization code examples
- **AND** identify required configuration (API keys, environment variables, config files)
- **AND** note authentication patterns and security considerations
- **AND** extract recommended project structure or file organization
- **AND** preserve context around each pattern

#### Scenario: Extracting best practices

- **WHEN** analyzing documentation content
- **THEN** search for sections titled "Best Practices", "Recommended", "Production", "Guidelines", "Tips"
- **AND** extract bullet points and recommendations
- **AND** preserve context around each practice
- **AND** note conditional recommendations (e.g., "for production" vs "for development")
- **AND** include citations with section headings and source URLs

#### Scenario: Identifying footguns and warnings

- **WHEN** analyzing documentation content
- **THEN** search for keywords: "Warning", "Important", "Note", "Caution", "Common mistake", "Gotcha", "Pitfall", "Deprecated", "Do not"
- **AND** extract surrounding context explaining the issue
- **AND** extract recommended solutions or workarounds
- **AND** identify deprecated features, APIs, or methods
- **AND** note version-specific issues if mentioned
- **AND** categorize by severity: critical (breaks functionality), high (security/data loss), medium (performance), low (convenience)

#### Scenario: Extracting current API patterns

- **WHEN** analyzing documentation content
- **THEN** identify current method signatures and usage patterns
- **AND** note version numbers associated with each pattern
- **AND** flag deprecated methods and their replacements
- **AND** extract type signatures if available
- **AND** preserve parameter descriptions and return values

#### Scenario: Extracting code examples

- **WHEN** analyzing documentation content
- **THEN** identify code blocks with language hints
- **AND** preserve complete examples with setup and usage
- **AND** extract inline code snippets that demonstrate key concepts
- **AND** note which examples are minimal vs. complete
- **AND** preserve links to full example repositories if provided
- **AND** extract version-specific code patterns

#### Scenario: Identifying testing recommendations

- **WHEN** analyzing documentation content
- **THEN** search for sections titled "Testing", "Test", "Mocking", "Unit Tests", "Integration Tests"
- **AND** extract recommended testing approaches
- **AND** identify mock/stub patterns for external dependencies
- **AND** note any testing utilities provided by the library
- **AND** extract example test code with assertions

### Requirement: Codebase context gathering

AI agents SHALL gather relevant codebase context before performing blast radius analysis.

#### Scenario: Reading proposal context

- **WHEN** executing `/research` command
- **THEN** read `changes/<change-id>/proposal.md`
- **AND** identify mentioned external libraries, SDKs, APIs, or frameworks
- **AND** extract key integration requirements from proposal
- **AND** use context to guide documentation analysis

#### Scenario: Scanning existing codebase

- **WHEN** preparing blast radius analysis
- **THEN** search codebase for existing usage of mentioned dependencies
- **AND** identify current integration patterns in the codebase
- **AND** note existing configuration files or initialization code
- **AND** identify modules that interact with similar external services

### Requirement: Blast radius analysis

AI agents SHALL analyze the existing codebase to determine integration points and change impact.

#### Scenario: Identifying integration points

- **WHEN** performing blast radius analysis
- **THEN** search codebase for files that will import the new dependency
- **AND** identify modules that expose APIs affected by the change
- **AND** map data flow from integration point to system boundaries
- **AND** note which files will require modification vs. creation

#### Scenario: Assessing affected modules

- **WHEN** identifying affected modules
- **THEN** list each module with impact level (high/medium/low)
- **AND** categorize high impact as: changes public API, modifies data schema, or affects multiple subsystems
- **AND** categorize medium impact as: changes internal APIs, affects single subsystem, or requires configuration updates
- **AND** categorize low impact as: isolated changes, optional features, or additive changes
- **AND** provide rationale for each impact assessment

#### Scenario: Analyzing dependency graph

- **WHEN** performing blast radius analysis
- **THEN** identify modules that depend on the changed code (upstream impact)
- **AND** identify modules that the changed code depends on (downstream dependencies)
- **AND** note circular dependencies or coupling concerns
- **AND** highlight high-fanout modules that affect many other modules

#### Scenario: Identifying data model impact

- **WHEN** analyzing data model impact
- **THEN** list database schema changes required
- **AND** identify API response/request format changes
- **AND** note configuration schema updates
- **AND** flag breaking changes to data structures
- **AND** recommend migration strategies for data changes

#### Scenario: Identifying configuration impact

- **WHEN** analyzing configuration impact
- **THEN** list new environment variables required
- **AND** identify config file updates needed
- **AND** note default values and required vs. optional settings
- **AND** document secrets management considerations

#### Scenario: Risk assessment

- **WHEN** performing risk assessment
- **THEN** identify high-risk areas: authentication, data persistence, external integrations
- **AND** flag areas with insufficient test coverage
- **AND** note performance-sensitive code paths affected
- **AND** highlight security-critical changes
- **AND** recommend extra review or testing for high-risk areas

### Requirement: Research artifact generation

AI agents SHALL generate three structured markdown files with consistent formatting and citations.

#### Scenario: Creating research directory

- **WHEN** generating research artifacts
- **THEN** create `changes/<change-id>/research/` directory
- **AND** if directory already exists, overwrite existing files
- **AND** log warning if overwriting previous research

#### Scenario: Generating research.md structure

- **WHEN** generating research.md
- **THEN** include header with feature name and generation timestamp
- **AND** create "External Dependencies" section listing all dependencies with versions and documentation links
- **AND** create "Architecture Patterns" section explaining integration approach from docs
- **AND** create "Authentication & Configuration" section with setup requirements
- **AND** create "Best Practices" section with extracted recommendations and citations
- **AND** create "Code Examples" section with current, version-specific snippets and source links
- **AND** create "Testing Approach" section with testing guidance from docs
- **AND** create "Migration Considerations" section if updating existing integration
- **AND** create "References" section with full list of sources and fetch timestamps

#### Scenario: Generating blastradius.md structure

- **WHEN** generating blastradius.md
- **THEN** include header with feature name and generation timestamp
- **AND** create "Integration Points" section listing where code changes occur
- **AND** create "Affected Modules" section with impact levels and rationale
- **AND** create "Dependency Graph" section showing upstream and downstream impacts
- **AND** create "Data Model Impact" section with schema and API changes
- **AND** create "API Surface Changes" section with breaking change flags
- **AND** create "Configuration Changes" section with environment and config updates
- **AND** create "Breaking Changes" section highlighting what existing code will break
- **AND** create "Risk Assessment" section with high-risk areas and recommendations

#### Scenario: Generating footguns.md structure

- **WHEN** generating footguns.md
- **THEN** include header with feature name and generation timestamp
- **AND** create "Common Mistakes" section with Problem/Why/Solution/Source for each item
- **AND** create "Gotchas" section with Description/Impact/Workaround/Source for each item
- **AND** create "Version-Specific Issues" section with known problems per version
- **AND** create "Deprecated Methods" section listing deprecated APIs and replacements
- **AND** create "Performance Pitfalls" section with performance-related mistakes
- **AND** create "Security Concerns" section with security-related gotchas
- **AND** create "Breaking Changes in Recent Versions" section with upgrade considerations

#### Scenario: Including citations

- **WHEN** making any claim in research artifacts
- **THEN** include citation in format: `[Source: <section-title> - <url>]`
- **AND** link directly to specific sections when possible (with URL anchors)
- **AND** include fetch timestamp in References section
- **AND** note if information is inferred vs. explicitly stated in documentation

#### Scenario: Formatting code examples

- **WHEN** including code examples in research artifacts
- **THEN** use proper markdown code fences with language hints
- **AND** include brief explanation before each example
- **AND** annotate version requirements (e.g., "Requires v12.0+")
- **AND** include source citation after each example
- **AND** prefer complete, runnable examples over fragments
- **AND** highlight deprecated patterns with warnings

#### Scenario: Successful generation

- **WHEN** all three files are generated successfully
- **THEN** log "✓ research/research.md generated"
- **AND** log "✓ research/blastradius.md generated"
- **AND** log "✓ research/footguns.md generated"
- **AND** display summary: "Research artifacts ready. Run /audit to validate specs."

### Requirement: Error handling and graceful degradation

AI agents SHALL handle failures gracefully and provide actionable feedback.

#### Scenario: All documentation fetches fail

- **WHEN** all resource fetches fail
- **THEN** display error "Unable to fetch any documentation sources"
- **AND** list attempted resources and failure reasons
- **AND** do not create research files
- **AND** suggest checking URLs or network connectivity

#### Scenario: Partial fetch failures

- **WHEN** some but not all resources are fetched successfully
- **THEN** display warning listing failed sources
- **AND** continue with successfully fetched resources
- **AND** generate research artifacts with available information
- **AND** include note in each file listing missing sources

#### Scenario: Insufficient codebase context

- **WHEN** blast radius analysis lacks adequate codebase information
- **THEN** include disclaimer at top of blastradius.md: "Note: Limited codebase context. Manual verification required."
- **AND** provide general categories of likely integration points
- **AND** list questions for manual investigation
- **AND** recommend specific areas to examine

#### Scenario: No external dependencies detected

- **WHEN** proposal does not mention external dependencies
- **THEN** log warning "No external dependencies detected in proposal"
- **AND** generate research artifacts based on provided resources
- **AND** include note recommending manual review of dependency list

### Requirement: Quality validation

AI agents SHALL validate research artifacts meet quality standards before finalizing.

#### Scenario: Validating citations

- **WHEN** completing research artifact generation
- **THEN** verify every claim has a citation
- **AND** verify all citation URLs are accessible (if network available)
- **AND** verify timestamps are included
- **AND** flag any unsupported claims for manual review

#### Scenario: Validating completeness

- **WHEN** completing research artifact generation
- **THEN** verify all required sections are present in each file
- **AND** verify no sections are empty without explanation
- **AND** verify code examples are syntactically valid for their language
- **AND** verify impact levels are assigned to all affected modules

#### Scenario: Validating markdown formatting

- **WHEN** completing research artifact generation
- **THEN** verify proper heading hierarchy (# > ## > ###)
- **AND** verify code fences include language hints
- **AND** verify lists use consistent bullet styles
- **AND** verify links are properly formatted
- **AND** verify no malformed markdown structures

#### Scenario: Cross-file consistency

- **WHEN** completing research artifact generation
- **THEN** verify dependency versions are consistent across all three files
- **AND** verify terminology is consistent
- **AND** verify cross-references between files are valid
- **AND** verify no contradictory information between files

### Requirement: Integration with audit workflow

AI agents SHALL prepare research artifacts for consumption by the `/audit` command.

#### Scenario: Research output format for audit

- **WHEN** generating research artifacts
- **THEN** structure content to be easily parseable by audit process
- **AND** clearly separate current patterns from deprecated patterns
- **AND** explicitly mark version requirements for all code examples
- **AND** highlight information not likely in LLM training data
- **AND** organize footguns by actionability (can be spec'd vs. implementation concern)

#### Scenario: Completion message

- **WHEN** research generation completes successfully
- **THEN** display "Research complete. Next step: /audit"
- **AND** provide summary statistics (sources fetched, patterns extracted, footguns identified)
- **AND** note any warnings or partial failures