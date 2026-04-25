import { select, input } from "@inquirer/prompts";
import { execSync } from "child_process";

// 🔍 проверка staged изменений
let hasStaged = true;

try {
  execSync("git diff --cached --quiet");
  hasStaged = false;
} catch {}

if (!hasStaged) {
  const choice = await select({
    message: "😴 Нет staged изменений. Добавить все файлы в коммит?",
    choices: [
      { name: "👍 Да, давай", value: "yes" },
      { name: "👋 Нет, я передумал", value: "no" },
    ],
  });

  if (choice === "no") {
    console.log("👌 Ок, выходим");
    process.exit(0);
  }

  console.log("📦 Добавляем все изменения...");
  execSync("git add -A", { stdio: "inherit" });
}

// 🧩 выбор типа коммита
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

// 📦 scope
const scope = await input({
  message: "📦 Scope (опционально):",
  validate: () => true,
});

// ✏️ message
const message = await input({
  message: "✏️ Описание коммита:",
  validate: (v) => (v ? true : "❌ Нельзя пустой коммит"),
});

// 🧼 чистим scope
const cleanScope = scope.trim().replace(/\s+/g, "-");
const scopePart = cleanScope ? `(${cleanScope})` : "";

const commitMessage = `${type}${scopePart}: ${message}`;

console.log("\n🚀 Коммит:");
console.log(`👉 ${commitMessage}`);

// 🚀 commit
execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

// 🌿 текущая ветка
const branch = execSync("git branch --show-current")
  .toString()
  .trim();

// 🚀 пуш-меню
const pushChoice = await select({
  message: "🚀 Пушим изменения?",
  choices: [
    {
      name: `🚀 Да, пушим в ${branch}`,
      value: "push",
    },
    {
      name: "😌 Пока не пушим",
      value: "no",
    },
  ],
});

if (pushChoice === "push") {
  console.log(`🚀 Пушим в ${branch}...`);
  execSync(`git push origin ${branch}`, { stdio: "inherit" });
} else {
  console.log("👌 Ок, без пуша");
}