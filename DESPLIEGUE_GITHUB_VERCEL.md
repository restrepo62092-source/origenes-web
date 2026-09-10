# Despliegue de ORÍGENES — GitHub + Vercel + Backend

Este documento describe la arquitectura completa y el paso a paso para llevar el
proyecto a producción fuera de Emergent.

---

## 1. Arquitectura real del proyecto

```
origenes/
├── frontend/                 → React 19 (CRA + CRACO + Tailwind + shadcn/ui)
│   ├── vercel.json           → configuración de build/SPA para Vercel
│   ├── .env.example
│   └── src/
│       ├── App.js            → BrowserRouter: "/" landing, "/admin" panel
│       ├── components/       → Hero, Services, Cultures, Technologies,
│       │                       RoboflowAnalyzer, PlanetMonitoring, Contact,
│       │                       AdminLogin, AdminDashboard, WhatsAppButton, ...
│       └── utils/analytics.js → Google Analytics por env var
│
├── backend/                  → FastAPI + Motor (MongoDB async)
│   ├── server.py             → app, /api, /api/health, lifespan + keep-alive
│   ├── routes/
│   │   ├── contact.py        → POST/GET consultas
│   │   ├── roboflow.py       → diagnóstico por imagen (Roboflow)
│   │   ├── planet.py         → búsqueda de escenas + thumbnails (Planet Data API)
│   │   ├── auth.py           → login JWT, /me, anti fuerza bruta, seed_admin
│   │   └── admin.py          → stats, listado, estados, borrado, export CSV
│   ├── services/email_service.py → plantillas institucionales SMTP Gmail
│   ├── models/contact.py
│   ├── Procfile              → comando de arranque (Railway/Render/Heroku)
│   ├── railway.json
│   └── .env.example
│
└── render.yaml               → blueprint alternativo (Render)
```

**Importante:** Vercel **no** puede correr FastAPI como servicio persistente.
El frontend va a Vercel; el backend va a **Railway** o **Render** (ambos soportan
Python/uvicorn). MongoDB va en **MongoDB Atlas** (free tier M0 es suficiente).

```
Vercel (React)  ──HTTPS──►  Railway/Render (FastAPI)  ──►  MongoDB Atlas
      │                              │
      │                              ├──► Planet Data API (escenas + thumbnails)
      │                              ├──► Roboflow (detección en imágenes)
      └──► WhatsApp wa.me            └──► SMTP Gmail (notificaciones)
```

---

## 2. Subir el código a GitHub

1. En la barra del chat de Emergent usa **Save → Save to GitHub**, conecta tu
   cuenta y elige/crea el repositorio (ej. `origenes-web`) y la rama.
2. Clónalo en tu equipo:
   ```bash
   git clone https://github.com/TU-USUARIO/origenes-web.git
   cd origenes-web
   ```
3. Los archivos `.env` **no** se suben (están en `.gitignore`). Los valores reales
   están en `memory/CREDENCIALES_PRODUCCION.md` (tampoco se sube) y en la pestaña
   **Secrets** de Emergent.

---

## 3. MongoDB Atlas (base de datos)

1. Crea cuenta en https://cloud.mongodb.com → **Create Cluster** (M0 Free).
2. **Database Access** → crea usuario y contraseña.
3. **Network Access** → añade `0.0.0.0/0` (o los rangos de Railway/Render).
4. **Connect → Drivers** → copia la URI:
   `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Esa URI es tu `MONGO_URL`. Usa `DB_NAME=origenes_prod`.

---

## 4. Backend en Railway (recomendado)

1. https://railway.app → **New Project → Deploy from GitHub repo**.
2. En el servicio: **Settings → Root Directory** = `backend`.
3. Railway detecta Python y usa el `Procfile` / `railway.json`:
   `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. **Variables** → pega todas las del backend (tabla en
   `memory/CREDENCIALES_PRODUCCION.md` o `backend/.env.example`).
5. **Settings → Networking → Generate Domain**. Obtendrás algo como
   `https://origenes-api.up.railway.app`.
6. Verifica:
   ```bash
   curl https://origenes-api.up.railway.app/api/health
   # {"status":"active","database":"connected","timestamp":"..."}
   ```

### Alternativa: Render
**New → Blueprint**, apunta al repo y Render leerá `render.yaml`
(rootDir `backend`, healthcheck `/api/health`). Rellena las variables marcadas
`sync: false`.

---

## 5. Frontend en Vercel

1. https://vercel.com → **Add New → Project → Import Git Repository**.
2. Configuración del proyecto:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`
   (ya viene definido en `frontend/vercel.json`)
3. **Environment Variables** (Production + Preview):
   | Nombre | Valor |
   |---|---|
   | `REACT_APP_BACKEND_URL` | `https://origenes-api.up.railway.app` (sin `/` final) |
   | `REACT_APP_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` cuando Google lo libere |
4. **Deploy**. Obtendrás `https://origenes-web.vercel.app`.
5. Vuelve al backend y actualiza:
   ```
   CORS_ORIGINS=https://origenes-web.vercel.app,https://www.origeneskhachi.org
   ```
   y redespliega el backend (sin esto el navegador bloqueará las peticiones).

> Las variables `REACT_APP_*` se incrustan en el build: cada cambio requiere un
> **Redeploy** en Vercel.

---

## 6. Dominio propio

En Vercel → **Settings → Domains** → añade `origeneskhachi.org` y
`www.origeneskhachi.org`, y crea en tu proveedor DNS:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Añade el dominio final a `CORS_ORIGINS` del backend.

---

## 7. Monitoreo (evitar “sitio caído”)

El backend expone `GET /api/health` (verifica MongoDB) y hace ping interno a la
base cada 4 minutos. Configura en https://uptimerobot.com un monitor HTTP(s)
cada 5 minutos hacia `https://TU-BACKEND/api/health` con alerta al correo
corporativo. Vercel sirve el frontend como estático: no se duerme.

---

## 8. Checklist final

- [ ] Código en GitHub
- [ ] Cluster de MongoDB Atlas creado y `MONGO_URL` configurada
- [ ] Backend desplegado y `/api/health` responde `database: connected`
- [ ] `CORS_ORIGINS` con el dominio de Vercel y el dominio propio
- [ ] Frontend en Vercel con `REACT_APP_BACKEND_URL` correcto
- [ ] Formulario de contacto guarda consultas (verificar en `/admin`)
- [ ] Login admin funciona y **contraseña rotada**
- [ ] `JWT_SECRET` rotado en producción
- [ ] `GMAIL_APP_PASSWORD` configurada (notificaciones por email)
- [ ] `REACT_APP_GA_MEASUREMENT_ID` configurado (Analytics)
- [ ] Monitor UptimeRobot activo

---

## 9. Endpoints del API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/` | — | Estado del API |
| GET | `/api/health` | — | Health check + estado MongoDB |
| POST | `/api/contact` | — | Crear consulta (formulario) |
| GET | `/api/contact` | — | Listar consultas |
| POST | `/api/roboflow/analyze` | — | Diagnóstico de imagen del cultivo |
| GET | `/api/planet/search` | — | Escenas satelitales reales |
| GET | `/api/planet/thumbnail/{id}` | — | Thumbnail de escena |
| POST | `/api/auth/login` | — | Login corporativo (JWT) |
| GET | `/api/auth/me` | Bearer | Usuario autenticado |
| GET | `/api/admin/stats` | Bearer | Métricas del dashboard |
| GET | `/api/admin/contacts` | Bearer | Consultas con filtros |
| PATCH | `/api/admin/contacts/{id}/status` | Bearer | Cambiar estado |
| DELETE | `/api/admin/contacts/{id}` | Bearer | Eliminar consulta |
| GET | `/api/admin/export/csv` | Bearer | Exportar CSV |

---

## 10. Correr el proyecto localmente

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env       # rellena los valores
uvicorn server:app --reload --port 8001

# Frontend
cd ../frontend
yarn install
cp .env.example .env       # REACT_APP_BACKEND_URL=http://localhost:8001
yarn start
```
