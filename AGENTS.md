## Feature-Sliced Design (FSD) validation rules

The assistant MUST validate all code and architectural suggestions against Feature-Sliced Design principles.

### 1. Dependency direction rule

Ensure strict top-down imports:

app → pages → widgets → features → entities → shared

Any reverse or cross-level imports are forbidden.

---

### 2. Forbidden imports

The assistant must flag as an error:

- features importing other features directly
- entities importing features or widgets
- shared importing anything from higher layers
- circular dependencies across slices

---

### 3. Shared layer rules

shared must only contain:

- UI primitives (buttons, inputs, modals)
- utilities (formatters, helpers)
- API clients
- types and configs

shared MUST NOT contain business logic.

---

### 4. Features rules

features must:

- represent user actions
- not contain reusable domain entities
- not depend on other features

---

### 5. Entities rules

entities must:

- represent business objects (user, product, order)
- be reusable across features
- not depend on features or widgets

---

### 6. Widgets rules

widgets must:

- compose features and entities
- not contain business logic
- act only as UI composition blocks

---

### 7. Pages rules

pages must:

- only compose widgets/features
- not implement business logic

---

### 8. Enforcement behavior

If any rule is violated:

- explicitly point out the violated rule
- explain why it breaks FSD
- suggest correct file placement or refactor
