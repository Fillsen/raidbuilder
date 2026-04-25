import { select, input, checkbox } from "@inquirer/prompts";
import { execSync } from "child_process";

// 🔍 проверка staged изменений
let hasStaged = true;

try {
  execSync("git diff --cached --quiet");
  hasStaged = false;
} catch {}

let filesToCommit = [];

if (!hasStaged) {
  // 📋 получить список изменённых файлов
  const statusOutput = execSync("git status --porcelain").toString();
  const untrackedOutput = execSync("git ls-files --others --exclude-standard").toString();

  const modifiedFiles = statusOutput
    .split("\n")
    .filter(Boolean)
    .map((line) => line.slice(3))
    .filter(Boolean);

  const newFiles = untrackedOutput
    .split("\n")
    .filter(Boolean);

  const allFiles = [...modifiedFiles, ...newFiles];

  if (allFiles.length === 0) {
    console.log("❌ Нет изменений для коммита");
    process.exit(0);
  }

  // 📝 выбор файлов
  if (allFiles.length === 1) {
    // Автоматически выбираем единственный файл
    filesToCommit = allFiles;
    console.log(`📄 Автоматически выбран файл: ${allFiles[0]}`);
  } else {
    const choice = await select({
      message: "😴 Нет staged изменений. Что делаем?",
      choices: [
        { name: "📦 Добавить все файлы", value: "all" },
        { name: "📋 Выбрать конкретные файлы", value: "select" },
        { name: "👋 Отмена", value: "cancel" },
      ],
    });

    if (choice === "cancel") {
      console.log("👌 Ок, выходим");
      process.exit(0);
    }

    if (choice === "all") {
      filesToCommit = allFiles;
    } else {
      // Чекбокс для выбора файлов
      const fileChoices = allFiles.map((file) => ({
        name: file,
        value: file,
        checked: false,
      }));

      filesToCommit = await checkbox({
        message: "Выбери файлы для коммита:",
        choices: fileChoices,
        validate: (answer) => (answer.length > 0 ? true : "Выбери хотя бы один файл"),
      });
    }
  }

  // Добавляем выбранные файлы
  console.log(`📦 Добавляем ${filesToCommit.length} файл(ов)...`);
  for (const file of filesToCommit) {
    execSync(`git add "${file}"`, { stdio: "inherit" });
  }
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