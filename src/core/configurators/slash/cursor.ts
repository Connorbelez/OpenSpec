import { SlashCommandConfigurator } from "./base.js";
import { SlashCommandId } from "../../templates/index.js";

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: ".cursor/commands/openspec-proposal.md",
  apply: ".cursor/commands/openspec-apply.md",
  archive: ".cursor/commands/openspec-archive.md",
  research: ".cursor/commands/openspec-research.md",
  audit: ".cursor/commands/openspec-audit.md",
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: /openspec-proposal
id: openspec-proposal
category: OpenSpec
description: Scaffold a new OpenSpec change and validate strictly.
---`,
  apply: `---
name: /openspec-apply
id: openspec-apply
category: OpenSpec
description: Implement an approved OpenSpec change and keep tasks in sync.
---`,
  archive: `---
name: /openspec-archive
id: openspec-archive
category: OpenSpec
description: Archive a deployed OpenSpec change and update specs.
---`,
  research: `---
name: /openspec-research
id: openspec-research
category: OpenSpec
description: Research external dependencies and generate implementation guides.
---`,
  audit: `---
name: /openspec-audit
id: openspec-audit
category: OpenSpec
description: Validate and augment specs against research findings.
---`,
};

export class CursorSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = "cursor";
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
