---
name: deploy-check
description: Проверяет DEI перед деплоем на Vercel — TypeScript, Next.js build, импорты, console.log, TODO
disable-model-invocation: false
---

# Deploy Check — DEI

Запусти полную проверку проекта DEI перед деплоем. Выполни по порядку:

## 1. TypeScript

```bash
cd C:\Users\Name\Documents\GitHub\dei && npx tsc --noEmit 2>&1
```

Если ошибки — покажи их и исправь.

## 2. Next.js Build

```bash
cd C:\Users\Name\Documents\GitHub\dei && npx next build 2>&1 | tail -40
```

Смотри на ERROR и WARNING. Page size > 500kB — предупреди.

## 3. Забытые console.log

```bash
grep -rn "console\.log" C:\Users\Name\Documents\GitHub\dei\src --include="*.tsx" --include="*.ts"
```

Найденные — удали (кроме тех что в комментарии `// dev only`).

## 4. TODO/FIXME в коде

```bash
grep -rn "TODO\|FIXME\|HACK\|XXX" C:\Users\Name\Documents\GitHub\dei\src --include="*.tsx" --include="*.ts"
```

Перечисли найденные — пользователь решает что делать.

## 5. Мёртвые импорты

Проверь `src/app/page.tsx`, `src/app/layout.tsx` и все компоненты в `src/components/` на неиспользуемые импорты.

## 6. Отчёт

После всех проверок выдай:

```
✅ TypeScript: OK / ❌ N ошибок
✅ Next.js build: OK / ❌ ошибка
✅ console.log: нет / ⚠️ N найдено (удалены)
✅ TODO/FIXME: нет / ⚠️ N штук (список)
✅ Импорты: OK / ⚠️ N неиспользуемых

Готов к деплою: ДА / НЕТ
```

Если "НЕТ" — исправь все автоисправляемые проблемы, затем скажи что осталось на пользователе.
