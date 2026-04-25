import { select, input } from "@inquirer/prompts";
import { execSync } from "child_process";

// 🔥 проверка: есть ли staged изменения
try {
  execSync("git diff --cached --quiet");
  console.log("😴 Нет изменений для коммита");
  process.exit(0);
} catch {}

// Сначала добавляем все изменения в staging
execSync("git add -A", { stdio: "inherit" });

const type = await select({
  message: "🧩 Тип коммита:",
  choices: [
    { name: "✨ feat", value: "feat" },
    { name: "🐛 fix", value: "fix" },
    { name: "♻️ refactor", value: "refactor" },
    { name: "📚 docs", value: "docs" },
    { name: "🧪 test", value: "test" },
  ],
});

const scope = await input({
  message: "📦 Scope (опционально):",
  validate: (v) => true,
});

const message = await input({
  message: "✏️ Описание коммита:",
  validate: (v) => (v ? true : "❌ Нельзя пустой коммит"),
});

// убираем пробелы в scope (чтобы не ломать conventional commits)
const cleanScope = scope.trim().replace(/\s+/g, "-");

const scopePart = cleanScope ? `(${cleanScope})` : "";
const commitMessage = `${type}${scopePart}: ${message}`;

console.log("\n🚀 Коммит:");
console.log(`👉 ${commitMessage}`);

// Сам коммит
execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });