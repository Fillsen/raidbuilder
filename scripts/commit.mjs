import { select, input } from "@inquirer/prompts";
import { execSync } from "child_process";

const type = await select({
  message: "Тип коммита:",
  choices: [
    { name: "feat → новая фича", value: "feat" },
    { name: "fix → багфикс", value: "fix" },
    { name: "refactor → рефакторинг", value: "refactor" },
    { name: "chore → тех. задачи", value: "chore" },
    { name: "docs → документация", value: "docs" },
  ],
});

const scope = await input({
  message: "Scope (опционально):",
});

const message = await input({
  message: "Описание коммита:",
  validate: (v) => (v ? true : "Нельзя пустой коммит"),
});

const scopePart = scope ? `(${scope})` : "";
const commitMessage = `${type}${scopePart}: ${message}`;

console.log("\n🚀 Commit:");
console.log(commitMessage);

execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });