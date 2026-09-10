# PRD — ORÍGENES: Nutrición y Precisión

## Problema original
Landing page profesional para **ORÍGENES – Nutrición y Precisión** (consultoría agrícola,
Colombia) con captación de clientes, diagnóstico de cultivos por imagen (Roboflow),
monitoreo satelital real (Planet), panel administrativo seguro, Google Analytics,
conversión por WhatsApp, exportación CSV y notificaciones por email institucionales.

Idioma del usuario: **español**. Identidad visual obligatoria: verde `#2d5016`, `#4a7c2c`,
naranja/marrón `#d97706`, blanco.

## Arquitectura
- **Frontend:** React 19 (CRA + CRACO), Tailwind, shadcn/ui, react-router-dom
  (`/` landing, `/admin` panel), leaflet/react-leaflet para mapa satelital.
- **Backend:** FastAPI + Motor (MongoDB async). Rutas: `contact`, `roboflow`, `planet`,
  `auth` (JWT), `admin`. `services/email_service.py` (SMTP Gmail con plantillas
  institucionales). `GET /api/health` + keep-alive interno cada 4 min.
- **DB:** MongoDB (`MONGO_URL`, `DB_NAME`).

## Implementado

### Junio 2026 y anterior
- Landing completa: Hero, Servicios, Cultivos, Tecnologías, Experiencia, Biofactoría,
  Formulación magistral, Testimonios, FAQ, Footer.
- Contacto corporativo: `gerencia@origeneskhachi.org`, +57 300 558 2757 y +57 313 338 4608.
- Roboflow: diagnóstico por imagen (claves en variables de entorno).
- Planet: `routes/planet.py` con **Data API + thumbnails reales** (Basemaps/tiles NO
  autorizados por la credencial actual — no reintentar).
- Auth JWT restringida al correo corporativo + anti fuerza bruta; panel admin con stats,
  filtros, búsqueda, cambio de estado, borrado y **exportación CSV**.
- Botón flotante WhatsApp (`WhatsAppButton.jsx`).
- Google Analytics preparado por `REACT_APP_GA_MEASUREMENT_ID` (pendiente el ID real).
- Secretos fuera del código (solo variables de entorno). `deployment_agent`: PASS.
- Health check `/api/health` verificado externamente.

### 10 de septiembre de 2026 — Entrega de código y despliegue externo
- `DESPLIEGUE_GITHUB_VERCEL.md`: guía completa GitHub → MongoDB Atlas → Railway/Render
  (backend) → Vercel (frontend), DNS, endpoints y checklist.
- `frontend/vercel.json` (build CRA + rewrites SPA), `backend/Procfile`,
  `backend/railway.json`, `render.yaml`, `.env.example` de front y back.
- `memory/CREDENCIALES_PRODUCCION.md` con todos los valores reales (no se sube a GitHub).
- Paquete descargable: `frontend/public/proyecto_origenes.tar.gz`.

### 10 de septiembre de 2026 — Portal de Auditoría Santuario-Cronos
- Hero: CTA ahora **"Solicitar Auditoría Santuario-Cronos"** (`mock.js: heroData.ctaText`)
  con scroll suave al ancla `#auditoria` (`Hero.jsx`, `data-testid="hero-audit-cta-btn"`).
- `Contact.jsx` reemplazado por el **Portal de Auditoría Santuario-Cronos**:
  título "Solicitar Auditoría Bio-Agronómica Inicial: Santuario-Cronos", subtítulo con
  Ley de Trofobiosis / Efecto Rovira, campos requeridos (productor/empresa, correo,
  teléfono-WhatsApp, departamento, municipio, cultivo, hectáreas, síntomas) y opcionales
  (CE del suelo dS/m, pH del suelo). Botón "Enviar Datos para Auditoría Fisiometabólica".
  Panel de confirmación en pantalla: "Solicitud registrada con éxito. La Dirección Técnica
  de Orígenes Khachi emitirá el dictamen preliminar en menos de 24 horas."
- `models/contact.py`: nuevos campos `municipality`, `soil_ec`, `soil_ph`; `hectares` float;
  mensaje hasta 2000 caracteres (compatible con payloads antiguos).
- `services/email_service.py`: notificación con asunto "Auditoría Santuario-Cronos",
  filas de municipio/hectáreas/CE/pH y destinatario `NOTIFICATION_EMAIL`
  (por defecto `gerencia@origeneskhachi.org`).
- `routes/admin.py`: CSV con columnas Municipio, CE Suelo (dS/m), pH Suelo.
- **Validado:** POST `/api/contact/` 201 con y sin campos nuevos, CSV con nuevas columnas,
  flujo UI completo (CTA → scroll → formulario → confirmación) y `yarn build` exit 0.

## Backlog
### P0
- Deploy de producción y validación de `/api/health` desde el dominio final.
- **Rotar** `ADMIN_PASSWORD` y `JWT_SECRET` tras el deploy.
- Monitor externo (UptimeRobot) contra `/api/health` — a cargo de la infraestructura del usuario.

### P1
- `GMAIL_APP_PASSWORD` para activar el envío real de correos (hoy se omite con warning).
- `REACT_APP_GA_MEASUREMENT_ID` (`G-XXXXXXXXXX`) cuando Google Enterprise lo libere.

### P2
- Mostrar municipio, CE y pH en la tabla/detalle del panel admin.
- Gráficos de tendencias temporales en el dashboard.
- Filtro de exportación CSV por rango de fechas.
- Dictamen preliminar automático (scoring) a partir de CE/pH y síntomas.
