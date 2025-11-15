import { SlashCommandConfigurator } from "./base.js";
import { SlashCommandId } from "../../templates/index.js";

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: ".windsurf/workflows/openspec-proposal.md",
  apply: ".windsurf/workflows/openspec-apply.md",
  archive: ".windsurf/workflows/openspec-archive.md",
  research: ".windsurf/workflows/openspec-research.md",
  audit: ".windsurf/workflows/openspec-audit.md",
};

export class WindsurfSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = "windsurf";
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
    return `---\ndescription: ${description}\nauto_execution_mode: 3\n---`;
  }
}
