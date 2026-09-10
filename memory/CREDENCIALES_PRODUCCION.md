# CREDENCIALES REALES — ORÍGENES (USO INTERNO)

> Este archivo NO se sube a GitHub (`memory/` está en `.gitignore`).
> Copia estos valores a mano en Railway/Render (backend) y Vercel (frontend).
> Rota `ADMIN_PASSWORD` y `JWT_SECRET` inmediatamente después del primer deploy.

## Backend (Railway / Render → Variables)

| Variable | Valor actual |
|---|---|
| MONGO_URL | (crear cluster en MongoDB Atlas y pegar la URI `mongodb+srv://...`) — en preview es `mongodb://localhost:27017` |
| DB_NAME | `origenes_prod` (en preview: `test_database`) |
| CORS_ORIGINS | `https://TU-APP.vercel.app,https://www.origeneskhachi.org` |
| GMAIL_USER | `gerencia@origeneskhachi.org` |
| GMAIL_APP_PASSWORD | (PENDIENTE — App Password de 16 caracteres de Gmail) |
| GA_MEASUREMENT_ID | (PENDIENTE — `G-XXXXXXXXXX`) |
| ROBOFLOW_API_KEY | `NDLLuR8nj4xCRXJKjvCL` |
| ROBOFLOW_MODEL_ID | `origenes/4` |
| ROBOFLOW_API_URL | `https://detect.roboflow.com` |
| PLANET_API_KEY | `PLAK5ee68deaddf845b39e008238e1b94c54` |
| JWT_SECRET | `abd41c89a45e0729599ffbadd48e38dab887e335d3cc125e6b5f75e6d1467c60` (ROTAR) |
| ADMIN_EMAIL | `gerencia@origeneskhachi.org` |
| ADMIN_PASSWORD | `Origenes2026$Sec` (PROVISIONAL — ROTAR) |

## Frontend (Vercel → Environment Variables)

| Variable | Valor |
|---|---|
| REACT_APP_BACKEND_URL | URL pública del backend (ej. `https://origenes-api.up.railway.app`) — sin `/` final |
| REACT_APP_GA_MEASUREMENT_ID | (PENDIENTE — `G-XXXXXXXXXX`) |

No pongas `PLANET_API_KEY` en Vercel: el frontend consume Planet a través del backend.

## Panel administrativo
- URL: `https://TU-DOMINIO/admin`
- Usuario: `gerencia@origeneskhachi.org`
- Contraseña: la definida en `ADMIN_PASSWORD` del backend.

## Rotación de secretos
```bash
# Nuevo JWT_SECRET
python3 -c "import secrets; print(secrets.token_hex(32))"
```
Cambia `ADMIN_PASSWORD` en las variables del backend y redeploy: el usuario admin se re-siembra con el nuevo hash al arrancar.
