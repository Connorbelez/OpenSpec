export type SlashCommandId =
  | "proposal"
  | "apply"
  | "archive"
  | "research"
  | "audit";

const baseGuardrails = `**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to \`openspec/AGENTS.md\` (located inside the \`openspec/\` directory—run \`ls openspec\` or \`openspec update\` if you don't see it) if you need additional OpenSpec conventions or clarifications.`;

const proposalGuardrails = `${baseGuardrails}\n- Identify any vague or ambiguous details and ask the necessary follow-up questions before editing files.`;

const proposalSteps = `**Steps**
1. Review \`openspec/project.md\`, run \`openspec list\` and \`openspec list --specs\`, and inspect related code or docs (e.g., via \`rg\`/\`ls\`) to ground the proposal in current behaviour; note any gaps that require clarification.
2. Choose a unique verb-led \`change-id\` and scaffold \`proposal.md\`, \`tasks.md\`, and \`design.md\` (when needed) under \`openspec/changes/<id>/\`.
3. Map the change into concrete capabilities or requirements, breaking multi-scope efforts into distinct spec deltas with clear relationships and sequencing.
4. Capture architectural reasoning in \`design.md\` when the solution spans multiple systems, introduces new patterns, or demands trade-off discussion before committing to specs.
5. Draft spec deltas in \`changes/<id>/specs/<capability>/spec.md\` (one folder per capability) using \`## ADDED|MODIFIED|REMOVED Requirements\` with at least one \`#### Scenario:\` per requirement and cross-reference related capabilities when relevant.
6. Draft \`tasks.md\` as an ordered list of small, verifiable work items that deliver user-visible progress, include validation (tests, tooling), and highlight dependencies or parallelizable work.
7. Validate with \`openspec validate <id> --strict\` and resolve every issue before sharing the proposal.`;

const proposalReferences = `**Reference**
- Use \`openspec show <id> --json --deltas-only\` or \`openspec show <spec> --type spec\` to inspect details when validation fails.
- Search existing requirements with \`rg -n "Requirement:|Scenario:" openspec/specs\` before writing new ones.
- Explore the codebase with \`rg <keyword>\`, \`ls\`, or direct file reads so proposals align with current implementation realities.`;

const applySteps = `**Steps**
Track these steps as TODOs and complete them one by one.
1. Read \`changes/<id>/proposal.md\`, \`design.md\` (if present), and \`tasks.md\` to confirm scope and acceptance criteria.
2. Work through tasks sequentially, keeping edits minimal and focused on the requested change.
3. Confirm completion before updating statuses—make sure every item in \`tasks.md\` is finished.
4. Update the checklist after all work is done so each task is marked \`- [x]\` and reflects reality.
5. Reference \`openspec list\` or \`openspec show <item>\` when additional context is required.`;

const applyReferences = `**Reference**
- Use \`openspec show <id> --json --deltas-only\` if you need additional context from the proposal while implementing.`;

const archiveSteps = `**Steps**
1. Determine the change ID to archive:
   - If this prompt already includes a specific change ID (for example inside a \`<ChangeId>\` block populated by slash-command arguments), use that value after trimming whitespace.
   - If the conversation references a change loosely (for example by title or summary), run \`openspec list\` to surface likely IDs, share the relevant candidates, and confirm which one the user intends.
   - Otherwise, review the conversation, run \`openspec list\`, and ask the user which change to archive; wait for a confirmed change ID before proceeding.
   - If you still cannot identify a single change ID, stop and tell the user you cannot archive anything yet.
2. Validate the change ID by running \`openspec list\` (or \`openspec show <id>\`) and stop if the change is missing, already archived, or otherwise not ready to archive.
3. Run \`openspec archive <id> --yes\` so the CLI moves the change and applies spec updates without prompts (use \`--skip-specs\` only for tooling-only work).
4. Review the command output to confirm the target specs were updated and the change landed in \`changes/archive/\`.
5. Validate with \`openspec validate --strict\` and inspect with \`openspec show <id>\` if anything looks off.`;

const archiveReferences = `**Reference**
- Use \`openspec list\` to confirm change IDs before archiving.
- Inspect refreshed specs with \`openspec list --specs\` and address any validation issues before handing off.`;

const researchSteps = `**Steps**
1. Identify the current change ID from context or by running \`openspec list\`.
2. Parse resource arguments provided by the user (URLs, GitHub repos, package names, local files).
3. Classify each resource:
   - URLs: Start with http:// or https://
   - GitHub repos: Match owner/repo pattern
   - Local files: End with .md or contain path separators
   - Package names: Attempt Context7 lookup for everything else
4. Fetch all resources in parallel with progress updates.
5. Analyze documentation for:
   - Integration patterns and architecture
   - Authentication and configuration requirements
   - Best practices from official sources with citations
   - Code examples with version annotations
   - Testing approaches and recommendations
   - Deprecated methods and migration paths
6. Identify blast radius:
   - Integration points in codebase
   - Affected modules and dependencies
   - Data model impacts
   - API surface changes
   - Configuration requirements
7. Extract footguns and gotchas:
   - Common mistakes from documentation warnings
   - Version-specific issues
   - Performance pitfalls
   - Security concerns
8. Generate three research artifacts in \`changes/<change-id>/research/\`:
   - \`research.md\` - Implementation guide with patterns, best practices, and code examples
   - \`blastradius.md\` - Codebase impact analysis with affected modules
   - \`footguns.md\` - Common mistakes, gotchas, and how to avoid them
9. Report completion with summary of findings and next steps.`;

const researchReferences = `**Reference**
- See \`openspec/AGENTS.md\` for research artifact templates and citation requirements.
- Use WebFetch for URLs, file reading for local files, and Context7 integration for packages.
- Include source citations and fetch timestamps in all research artifacts.
- Run \`/audit\` after research completes to validate specs against findings.`;

const auditSteps = `**Steps**
1. Identify the current change ID from context or by running \`openspec list\`.
2. Verify research artifacts exist in \`changes/<change-id>/research/\` (research.md, blastradius.md, footguns.md).
3. Load and parse all research artifacts.
4. Validate spec deltas in \`changes/<change-id>/specs/\` against research findings:
   - Compare requirements to documented best practices
   - Identify missing requirements from research
   - Flag deprecated methods or patterns in specs
   - Check version compatibility
   - Validate security implementation patterns
5. Identify gaps and missing requirements:
   - Authentication requirements not in specs
   - Configuration requirements not documented
   - Error handling patterns missing
   - Testing requirements not specified
   - Security considerations not addressed
6. Augment \`changes/<change-id>/design.md\` with beyond-LLM-training information:
   - Add "API Integration Patterns" section with current version patterns
   - Add "Security Implementation" section with official recommendations
   - Add "Configuration" section with environment variable examples
   - Document deprecated methods to avoid with replacements
   - Include code snippets from official documentation with version markers
7. Add missing requirements to spec deltas:
   - Create new requirements under \`## ADDED Requirements\`
   - Update existing requirements under \`## MODIFIED Requirements\`
   - Include version-specific information and research citations
8. Re-run validation: \`openspec validate <change-id> --strict\`.
9. Report audit results with summary of changes, missing requirements added, deprecated patterns fixed, and validation status.`;

const auditReferences = `**Reference**
- See \`openspec/AGENTS.md\` for design.md augmentation templates and conflict resolution guidance.
- Focus on information beyond LLM training data: recent API changes, deprecations, evolved best practices.
- Preserve existing design.md content, only add new sections or augment existing ones.
- Flag conflicts between research and existing design for manual resolution.`;

export const slashCommandBodies: Record<SlashCommandId, string> = {
  proposal: [proposalGuardrails, proposalSteps, proposalReferences].join(
    "\n\n",
  ),
  apply: [baseGuardrails, applySteps, applyReferences].join("\n\n"),
  archive: [baseGuardrails, archiveSteps, archiveReferences].join("\n\n"),
  research: [baseGuardrails, researchSteps, researchReferences].join("\n\n"),
  audit: [baseGuardrails, auditSteps, auditReferences].join("\n\n"),
};

export function getSlashCommandBody(id: SlashCommandId): string {
  return slashCommandBodies[id];
}
