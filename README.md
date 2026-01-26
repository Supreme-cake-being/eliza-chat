# Eliza Chat

## Технології

- **Vue 3** (Composition API)
- **TypeScript**
- **Vite**
- **ConnectRPC**
- **ESLint v9**

## Встановлення

1. Клонувати репозиторій:

```bash
git clone https://github.com/<your-username>/eliza-chat.git
```

2. Встановити залежності:

```bash
npm install
```

## Запуск проєкту

### Режим розробки

```bash
npm run dev
```

Після цього застосунок буде доступний за адресою:

```
http://localhost:5173
```

### Білд

```bash
npm run build
```

### Старт

```bash
npm run start
```

## Перевірка коду з ESLint

Запуск ESLint:

```bash
npm run lint
```

Якщо помилок немає, виведеться повідомлення:

```
ESLint: no errors found
```

## Структура проєкту

```
src/
├─ assets/            # Ресурси
├─ components/        # Vue компоненти (Chat, Message, Input)
├─ rpc/               # RPC клієнт
├─ services/          # Робота з ConnectRPC API
├─ types/             # Типи
├─ App.vue
├─ main.ts
└─ style.css
```
