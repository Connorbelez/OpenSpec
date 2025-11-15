import { SlashCommandConfigurator } from "./base.js";
import { SlashCommandId } from "../../templates/index.js";

const NEW_FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: ".roo/commands/openspec-proposal.md",
  apply: ".roo/commands/openspec-apply.md",
  archive: ".roo/commands/openspec-archive.md",
  research: ".roo/commands/openspec-research.md",
  audit: ".roo/commands/openspec-audit.md",
};

export class RooCodeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = "roocode";
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return NEW_FILE_PATHS[id];
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
