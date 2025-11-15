import { SlashCommandConfigurator } from "./base.js";
import { SlashCommandId } from "../../templates/index.js";

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: ".clinerules/workflows/openspec-proposal.md",
  apply: ".clinerules/workflows/openspec-apply.md",
  archive: ".clinerules/workflows/openspec-archive.md",
  research: ".clinerules/workflows/openspec-research.md",
  audit: ".clinerules/workflows/openspec-audit.md",
};

export class ClineSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = "cline";
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    const descriptions: Record<SlashCommandId, string> = {
      proposal: "Scaffold a new OpenSpec change and validate strictly.",
      apply: "Implement an approved OpenSpec change and keep tasks in sync.",
      archive: "Archive a deployed OpenSpec change and update specs.",
      research:
        "Research external dependencies and generate implementation guides.",
      audit: "Validate and augment specs against research findings.",
    };
    const description = descriptions[id];
    return `# OpenSpec: ${id.charAt(0).toUpperCase() + id.slice(1)}\n\n${description}`;
  }
}
