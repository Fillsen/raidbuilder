import { select, input } from "@inquirer/prompts";
import { execSync } from "child_process";

// Сначала добавляем все изменения в staging
execSync("git add -A", { stdio: "inherit" });

const type = await select({
  message: "Тип коммита:",
  choices: [
    { name: "feat", value: "feat" },
    { name: "fix", value: "fix" },
    { name: "refactor", value: "refactor" },
    { name: "docs", value: "docs" },
    { name: "test", value: "test" },
  ],
});

const scope = await input({
  message: "Scope (опционально):",
  validate: (v) => true, // можно пустой
});

const message = await input({
  message: "Описание коммита:",
  validate: (v) => (v ? true : "Нельзя пустой коммит"),
});

// убираем пробелы в scope (чтобы не ломать conventional commits)
const cleanScope = scope.trim().replace(/\s+/g, "-");

const scopePart = cleanScope ? `(${cleanScope})` : "";
const commitMessage = `${type}${scopePart}: ${message}`;

console.log("\n🚀 Commit:");
console.log(commitMessage);

// Сам коммит
execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });