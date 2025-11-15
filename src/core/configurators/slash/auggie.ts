import { SlashCommandConfigurator } from "./base.js";
import { SlashCommandId } from "../../templates/index.js";

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: ".augment/commands/openspec-proposal.md",
  apply: ".augment/commands/openspec-apply.md",
  archive: ".augment/commands/openspec-archive.md",
  research: ".augment/commands/openspec-research.md",
  audit: ".augment/commands/openspec-audit.md",
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
description: Scaffold a new OpenSpec change and validate strictly.
argument-hint: feature description or request
---`,
  apply: `---
description: Implement an approved OpenSpec change and keep tasks in sync.
argument-hint: change-id
---`,
  archive: `---
description: Archive a deployed OpenSpec change and update specs.
argument-hint: change-id
---`,
  research: `---
description: Research external dependencies and generate implementation guides.
argument-hint: dependency or topic
---`,
  audit: `---
description: Validate and augment specs against research findings.
argument-hint: spec or change-id
---`,
};

export class AuggieSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = "auggie";
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
