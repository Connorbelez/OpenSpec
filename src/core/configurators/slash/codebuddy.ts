import { SlashCommandConfigurator } from "./base.js";
import { SlashCommandId } from "../../templates/index.js";

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: ".codebuddy/commands/openspec/proposal.md",
  apply: ".codebuddy/commands/openspec/apply.md",
  archive: ".codebuddy/commands/openspec/archive.md",
  research: ".codebuddy/commands/openspec/research.md",
  audit: ".codebuddy/commands/openspec/audit.md",
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: OpenSpec: Proposal
description: Scaffold a new OpenSpec change and validate strictly.
category: OpenSpec
tags: [openspec, change]
---`,
  apply: `---
name: OpenSpec: Apply
description: Implement an approved OpenSpec change and keep tasks in sync.
category: OpenSpec
tags: [openspec, apply]
---`,
  archive: `---
name: OpenSpec: Archive
description: Archive a deployed OpenSpec change and update specs.
category: OpenSpec
tags: [openspec, archive]
---`,
  research: `---
name: OpenSpec: Research
description: Research external dependencies and generate implementation guides.
category: OpenSpec
tags: [openspec, research]
---`,
  audit: `---
name: OpenSpec: Audit
description: Validate and augment specs against research findings.
category: OpenSpec
tags: [openspec, audit]
---`,
};

export class CodeBuddySlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = "codebuddy";
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
