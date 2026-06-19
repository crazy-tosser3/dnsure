# dnsure

Распределённая система мониторинга доступности хостов. Позволяет регистрировать удалённых агентов и запускать через них сетевые проверки (HTTP/HTTPS, Ping, TCP, Traceroute) с единого управляющего сервера.

---

## Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                     Пользователь                        │
└────────────────────────┬────────────────────────────────┘
                         │  HTTP
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Frontend  (React + Vite)                   │
│                     :80                                 │
└────────────────────────┬────────────────────────────────┘
                         │  REST API
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Backend   (FastAPI / Python)                │
│                     :8000                               │
│  /api/agent_add   /api/agent_del   /api/get_agents      │
│  /api/start_check                                       │
└────────┬────────────────────────────────────────────────┘
         │  PostgreSQL                  │  HTTP
         ▼                             ▼
┌─────────────────┐        ┌──────────────────────────────┐
│   PostgreSQL    │        │   Agent  (FastAPI / Python)   │
│      :5432      │        │          :8001                │
└─────────────────┘        │  /api/heartbeat               │
                           │  /api/start_check             │
                           └──────────────────────────────┘
```

### Компоненты

| Компонент    | Описание |
|-------------|----------|
| **Frontend** | React-приложение — управление агентами, запуск проверок, просмотр результатов |
| **Backend**  | Центральный FastAPI-сервер — регистрация агентов в БД, оркестрация проверок |
| **Agent**    | Удалённый FastAPI-сервис — выполнение сетевых диагностик (ping, HTTP, TCP, traceroute) |
| **PostgreSQL** | Хранение списка зарегистрированных агентов |

---

## Технологии

### Backend (`/backend`)
| Технология | Версия | Назначение |
|------------|--------|-----------|
| Python | ≥ 3.14 | Язык |
| FastAPI | 0.137+ | REST API фреймворк |
| asyncpg | 0.31+ | Асинхронный PostgreSQL-клиент |
| Pydantic | 2.x | Валидация данных |
| Uvicorn | 0.49+ | ASGI-сервер |
| psycopg2-binary | 2.9+ | PostgreSQL-драйвер |
| python-dotenv | 1.x | Загрузка переменных окружения |

### Agent (`/agents`)
| Технология | Назначение |
|------------|-----------|
| FastAPI / Python | API агента |
| pythonping | ICMP ping-проверки |
| Scapy | UDP Traceroute |
| requests | HTTP/HTTPS-проверки |
| socket | TCP-проверки |

### Frontend (`/client`)
| Технология | Версия | Назначение |
|------------|--------|-----------|
| React | 19 | UI-фреймворк |
| TypeScript | ~6.0 | Типизация |
| Vite | 8.x | Сборщик / dev-сервер |
| TailwindCSS | 4.x | Стилизация |
| React Router | 7.x | Маршрутизация |
| TanStack Query | 5.x | Управление состоянием сервера / кэширование |
| Zustand | 5.x | Глобальный стейт |
| Framer Motion | 12.x | Анимации |
| Axios | 1.x | HTTP-клиент |
| Nginx | — | Раздача статики в Docker |

### Инфраструктура
| Технология | Назначение |
|------------|-----------|
| Docker | Контейнеризация |
| Docker Compose | Оркестрация контейнеров |
| PostgreSQL 16 | База данных |

---

## Структура проекта

```
dnsure/
├── backend/          # Центральный API-сервер (FastAPI)
│   ├── main.py       # Точка входа, API-эндпоинты
│   ├── schema.py     # Pydantic-схемы
│   ├── init.sql      # Начальная схема БД
│   ├── requirements.txt
│   └── Dockerfile
├── agents/           # Агент проверок (FastAPI)
│   ├── main.py       # Точка входа, эндпоинты агента
│   ├── agent_utils.py # Логика проверок (ping, http, tcp, traceroute)
│   ├── schemas.py
│   ├── requirements.txt
│   └── Dockerfile
├── client/           # Веб-интерфейс (React + Vite)
│   ├── src/
│   │   ├── app/      # Корень приложения, роутинг
│   │   ├── pages/    # Страницы
│   │   ├── components/
│   │   ├── widgets/
│   │   ├── stores/   # Zustand-сторы
│   │   └── shared/   # Утилиты, хуки, типы
│   ├── package.json
│   └── Dockerfile
├── manage/           # Документация / ERD
│   ├── ERD.png
│   └── arch.txt
├── docker-compose.yml
└── env_docker        # Переменные окружения для Docker
```

---

## Запуск

### Быстрый старт через Docker Compose (рекомендуется)

> **Требования:** [Docker](https://docs.docker.com/get-docker/) и [Docker Compose](https://docs.docker.com/compose/) установлены.

**1. Настройте переменные окружения**

Отредактируйте файл `env_docker` в корне проекта:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=database
POSTGRES_PORT=5432
POSTGRES_DB=postgres
```

**2. Укажите адрес своего сервера в `docker-compose.yml`**

В секции `frontend` замените IP на адрес вашего сервера:

```yaml
environment:
  - VITE_API_URL=http://<ваш-IP>:8000/api
```

**3. Запустите все сервисы**

```bash
docker compose up -d --build
```

После запуска:
- **Frontend** → http://localhost (порт 80)
- **Backend API** → http://localhost:8000
- **Swagger UI** → http://localhost:8000/docs

**Остановка:**
```bash
docker compose down
```

---

### Запуск для разработки (без Docker)

#### Backend

```bash
cd backend

# Создать виртуальное окружение
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Убедитесь, что PostgreSQL запущен и настроен в env_docker
# Запустить сервер
fastapi dev main.py
```

Backend будет доступен на http://localhost:8000

#### Agent

```bash
cd agents

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

# Запустить агента (по умолчанию порт 8001)
fastapi run --port 8001
```

> ⚠️ Агент использует Scapy и pythonping, которые могут требовать прав суперпользователя:
> ```bash
> sudo fastapi run --port 8001
> ```

#### Frontend

```bash
cd client

npm install

# Dev-сервер с hot reload
npm run dev
```

Frontend будет доступен на http://localhost:5173

---

## API

### Backend REST API

| Метод | Эндпоинт | Описание |
|-------|----------|---------|
| `POST` | `/api/agent_add` | Зарегистрировать агента |
| `DELETE` | `/api/agent_del` | Удалить агента |
| `GET` | `/api/get_agents` | Получить список агентов |
| `POST` | `/api/start_check` | Запустить проверку через агента |

### Agent API

| Метод | Эндпоинт | Описание |
|-------|----------|---------|
| `POST` | `/api/heartbeat` | Проверка доступности агента |
| `POST` | `/api/start_check` | Выполнить сетевую проверку |

### Поддерживаемые типы проверок

| Тип | Описание | Результат |
|-----|----------|-----------|
| `HTTP` / `HTTPS` | Проверка доступности по HTTP(S) | Время ответа (мс) или `false` |
| `PING` | ICMP-пинг (3 пакета) | Средний RTT (мс) или `false` |
| `TCP` | Проверка доступности TCP-порта | Время соединения (мс) или `false` |
| `TRACEROUTE` | UDP traceroute до хоста | Список IP-адресов хопов |

---

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|-------------|
| `POSTGRES_USER` | Пользователь PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL | — |
| `POSTGRES_HOST` | Хост PostgreSQL | `database` |
| `POSTGRES_PORT` | Порт PostgreSQL | `5432` |
| `POSTGRES_DB` | Имя базы данных | `postgres` |
| `VITE_API_URL` | URL бэкенд API для фронтенда | — |
