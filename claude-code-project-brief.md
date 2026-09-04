# Project Brief: Web App Template to Replace Power Apps / MS Forms

Use this document as project context. Do not generate a full application yet — start by proposing an architecture and folder structure based on the requirements below, and confirm it before writing implementation code.

## 1. Developer Environment Prerequisites

Assumes **VS Code** (not the full Visual Studio IDE) paired with the **Claude Code** extension, since that's what integrates with Claude and the rest of this stack — flag if a different setup is intended. Anyone building on this template should have the following set up before starting:

**Accounts / access**
- GitHub account with access to the template repo
- SQL Server dev instance/credentials (or access to wherever the shared dev DB lives)

**Tooling**
- **Git** — to clone the repo and push changes
- **VS Code** — with the **Claude Code extension** installed
- **Node.js (LTS) + npm** — to run/build the React/Vite frontend (Section 8)
- **Python 3.x + pip** — to run the FastAPI backend (Section 8)
- **Docker Desktop** — to run the backend service locally the same way it deploys (Section 8)
- **ODBC Driver for SQL Server** — required by `pyodbc`/SQLAlchemy to connect to SQL Server locally (Section 8)

**Recommended VS Code extensions**
- Python (Microsoft)
- ESLint + Prettier (frontend linting/formatting)
- Tailwind CSS IntelliSense

## 2. Project Purpose

Our data analysis team (~25 people, mixed technical skill levels) currently builds internal tools using Power Apps and Microsoft Forms. We are replacing this with a **reusable web app template** for two main reasons:

1. **No tenant/licensing lock-in** — Power Apps requires users to be inside our Microsoft tenant. We now need external users (e.g., truck drivers from outside our company) to use these tools, which Power Apps licensing doesn't support well.
2. **Low barrier to entry** — the template must let team members with basic technical knowledge build new form-based tools without deep backend expertise, similar to how Power Apps let non-developers build apps.

We currently have 5-6 Power Apps in production covering use cases like: temperature logging, security walkthrough feedback, and driver cargo check-ins. These will be migrated/replaced over time using this template.

The template will be hosted on **GitHub** so any team member can clone/download it as a starting point for a new tool.

## 3. Core Architecture Concept

- **Config-driven, multi-screen forms.** A builder defines a new tool primarily via a config file (JSON), not by writing UI code. The config lists screens, and each screen lists fields.
- **Mental model borrowed from Power Apps** to ease the learning curve: Screens ≈ Power Apps Screens, Fields ≈ Controls, Validation rules ≈ Formulas (simplified to config flags), Data source ≈ backend API + database table.
- **One shared backend service** for all apps built from the template (not a separate backend per app). Each form/app gets its own database table and corresponding API routes within the shared service.
- Builders should ideally only need to touch the config file (and maybe a title/description) — validation logic, styling, submission handling, and backend wiring should be pre-built and reused automatically.

## 4. Frontend Requirements

### 4.1 Structure
- Config-driven, multi-screen forms
- **Auto-generated progress indicator** (e.g., "Step 2 of 4"), derived automatically from the number of screens in the config — not manually configured
- **Optional review/confirmation screen** before final submit — toggle per app via config (e.g., `"includeReviewScreen": true`)
- **Back-and-forth navigation** between screens, with form state persisted across the whole session (user can go back and change earlier answers without losing later ones)
- Navigation via **Next / Back arrow buttons** (◀ Back / Next ▶), not just text links
- **Fully responsive** across desktop, tablet, and phone — this means adaptive rearrangement (fields stack vertically on mobile, touch-friendly tap targets, readable text without zooming), NOT the same fixed layout simply scaled down. This is a hard requirement — the team has had bad past experiences with Power Apps screens becoming unusable on mobile.

> **Status note (2026-09-04):** resolved — published, end-user forms need to be bilingual, not just the builder tool. Implemented end-to-end: every author-facing string in the config schema (`FieldConfig.label`/`placeholder`/`helpText`/`options`, `ScreenConfig.title`/`description`, `ActionConfig.label`, `FormConfig.title`/`description`) is now `{ en: string; es: string }` instead of a plain string, mirrored in `frontend/src/types/config.ts` and `backend/app/models/schemas.py`. The real app resolves the active locale via a new `LocaleContext` (`frontend/src/context/LocaleContext.tsx`) and a `LanguageToggle` in the form header/Home screen; `FieldRenderer` resolves a field's localized strings once via `resolveField()` (`frontend/src/lib/i18n.ts`) before handing plain strings down to the individual field components, so most of them needed no logic changes beyond a type import. Static UI chrome (Next/Back/Submit, "Review your answers", confirmation messages, etc.) is also bilingual via a small `UI_STRINGS` table in the same file. The Form Builder mockup was updated to match: every translatable property now has paired EN/ES inputs in the properties panel, and its own EN/ES canvas toggle now previews the *authored form content* bilingually (previously it only re-rendered the builder's own chrome).

### 4.2 Field Types

**Core (build first):**
`text`, `textarea`, `number`, `select`/`dropdown`, `date`, `datetime`, `checkbox`, `radio`, `toggle`

**High priority (real use cases depend on these):**
- `signature` — canvas-based pen input (touch on mobile/tablet, mouse-draw on desktop), stored as an image
- `rating` — star/icon-based rating input
- `photo` — capture via device camera (mobile) or file upload (desktop); need to clarify with team whether live capture-only or gallery upload is also allowed, and whether multiple photos per field are needed
- `qrscan` / `barcode` — opens device camera, scans a QR/barcode, and uses the decoded value to perform a **real-time backend lookup**, auto-filling other fields in the current screen (e.g., scan equipment QR → auto-fill serial number, warehouse assignment, etc.)

**Enhanced (later phase):**
`combobox`, `listbox`, `slider`

**Layout / content field types (emerged from Form Builder design work, not in the original spec):**
- `button` — a screen-level action control (Next / Back / Submit / Reset / Jump-to-screen), rendered above the automatic Back/Next row. **Implemented** in the real frontend: `ActionConfig` in `frontend/src/types/config.ts`, dispatched by `ScreenActions`/`FormApp.tsx`. Also implemented as a *content-block* field (`FieldConfig.type === 'button'`) for a button nested inside an accordion — see below.
- `image` — a decorative image/logo block (URL, alt text, alignment, width). **Implemented** in the real frontend: `ImageField.tsx`, rendered by `FieldRenderer`.
- `accordion` (Collapsible section) — an expandable header with optional intro text and nested fields, one level deep (accordion-in-accordion not supported). **Implemented**: `AccordionField.tsx` recursively renders `FieldConfig.children` (including nested `button`/`image` fields) via `FieldRenderer` itself. `FieldConfig.children?: FieldConfig[]` is the nested shape that was an open question below — resolved by just extending the existing flat type with an optional self-referencing array, no separate schema needed.

> **Status note (2026-09-04):** resolved — all three types above, the per-field background-color/text-color/font-size/width/hideLabel/disabled controls (Section 5), and the form-level header logo/background wallpaper are now implemented in the real frontend, not just the Form Builder mockup. See `frontend/src/types/config.ts` for the full field shape, `frontend/src/lib/fieldStyle.ts` for the swatch-key → CSS-value maps (the Form Builder stores a swatch *key* like `"beige"`, not a resolved color), and `frontend/src/components/FieldRenderer.tsx` (wraps every field in a `<fieldset disabled>` so the `disabled` flag actually disables inputs natively, applies `hideLabel` as `sr-only` rather than removing the label, for screen readers).

### 4.3 Dynamic Dropdown Data Sources
Dropdown options can be:
- **Static** — hardcoded in the config (`"options": ["A", "B"]`)
- **Dynamic** — pulled live from a data source at screen load time. Support:
  - **SQL Server** — default/preferred source for all new apps going forward
  - **Excel** (via Microsoft Graph API) — supported for legacy apps whose source data isn't migrated yet
  - **SharePoint Lists** (via Microsoft Graph API) — same, for legacy compatibility

Note: Excel/SharePoint List connectors reintroduce tenant dependency for that specific data — acceptable for legacy support, but not the target pattern for new apps.

> **Status note (2026-09-04):** SQL Server dropdowns are real, but not via raw SQL — the backend (`backend/app/datasources/sql_source.py`) only ever executes a small hardcoded allowlist of developer-registered queries (`REGISTERED_QUERIES`), keyed by name, to rule out SQL injection from a form author. The Form Builder mirrors this: its "SQL query" option is a dropdown of registered query names (`REGISTERED_SQL_QUERIES` in the mockup, kept in sync with the backend list by hand), not a free-text SQL box. Adding a new dropdown query means a developer registers it in `sql_source.py` first. Excel/SharePoint were removed from the Form Builder's Options-source picker entirely for now — they need real Microsoft Graph API credentials (Azure AD app registration) that this project doesn't have configured yet; `excel_source.py`/`sharepoint_source.py` still raise `NotImplementedError` and the schema still recognizes `"excel"`/`"sharepoint"` as valid `DropdownSource.kind` values for forward-compat, but nothing in the builder can produce one. Revisit once Graph credentials exist.

### 4.4 QR Code Generator (separate utility, not part of a form)
- Standalone tool: given equipment data (serial number, warehouse assignment, etc. — this is new data, no existing system to migrate from), generate a printable/downloadable QR code
- QR code should encode a **reference ID**, not the full data payload (so if equipment data changes later, the scan-and-lookup stays accurate rather than embedding stale data)

### 4.5 Submission Behavior
- **No partial/autosave.** Form data lives in local/session state across all screens as the user navigates. Nothing is sent to the backend until the user hits final Submit.
- One API call at final submit, sending the complete payload (including any photos, signature image, QR-linked data) to be written to the database.
- **No offline support needed** — stable connectivity is assumed for the current phase.

## 5. Design System (must be applied automatically via a shared theme — builders should not need to touch this)

**Colors** (brand palette, in priority order):
| Role | Name | Hex |
|---|---|---|
| Primary (buttons, headers, progress bar, active states) | Morado | `#545386` |
| Accent (highlights, secondary emphasis, error/warning state) | Rosado Claro | `#F4C7CE` |
| Secondary (info backgrounds, success state) | Azul Claro | `#C2DFEA` |
| Text / dark UI elements | Gris | `#383A35` |
| Subtle backgrounds, cards, borders | Beige | `#D8D2C4` |
| Page background | White | `#FFFFFF` |

Status colors intentionally stay within the brand palette rather than introducing generic red/green:
- Success → Azul Claro
- Error/Warning → Rosado Claro (consider a deepened/higher-contrast derivative for text/icons/borders on error states so they read as sufficiently urgent — flag this as a design detail to refine during implementation)

> **Status note (2026-09-02, resolved 2026-09-04):** the Form Builder mockup adds a per-field background-color picker (swatch choices: None, White, Beige, Azul, Rosado, Morado — constrained to this palette, not a free color input) so a builder can tint an individual field's card, plus a text-color and font-size picker. All three are now applied for real by `FieldRenderer` via `frontend/src/lib/fieldStyle.ts`'s swatch-key maps — still constrained to the same fixed palette, so this doesn't reopen "builders should not need to touch this" into a free-color picker.

**Fonts:**
- Primary: **Montserrat** (headings, buttons, emphasis)
- Secondary: **Roboto** (body text, labels, inputs)

## 6. Backend / Data (high-level — still being finalized, treat as directional not final)

- **One shared backend service** for all apps/forms (not a backend per app)
- Each form/app has its own database table; naming/routing convention still TBD
- **SQL Server** is the default database for new apps and new dynamic dropdown/reference data
- Backend needs to support:
  - **Write**: one "create submission" endpoint per form type, handling full payload including files (photos, signature images)
  - **Read**: dynamic dropdown lookups (SQL Server primarily; Excel/SharePoint via Graph API for legacy), QR-scan-to-record lookups, small contextual chart data queries
  - **Generate**: QR code generation utility endpoint
- **File storage** needed for photos and signature images (not just structured DB rows) — approach TBD (blob storage, filesystem, etc.)
- **Hosting/infrastructure**: not yet decided (could be Azure, on-prem, or elsewhere) — do not assume a specific cloud provider yet
- **Backend ownership model**: not yet finalized — current leaning is that a smaller subset of more technical team members would maintain the shared backend/database, while most builders only touch frontend config files. Do not hardcode assumptions here; keep the backend cleanly separated from frontend config so this can be decided later without a rework.
- **Backend authentication (generic/service-level)**: The frontend stays fully open/link-based with no end-user login (per Section 7). The backend service itself, however, should require generic authentication (e.g., a shared API key or service credential) to access the database/tables — this protects the shared backend and data from unauthorized direct access, independent of and orthogonal to end-user auth. Specific mechanism TBD, but the frontend-open / backend-protected split should be assumed going forward.

## 7. Explicitly Out of Scope (for now)
- Offline mode / sync
- Partial/autosave of in-progress forms
- Complex end-user auth (tenant-based login) — frontend access is meant to be open/link-based, no Microsoft tenant dependency. This does not preclude generic service-level authentication on the backend (see Section 6).
- Sensitive data handling / compliance features (current data is not considered sensitive)

## 8. Proposed Tech Stack (draft — for review)

**Frontend**
- **React + TypeScript**, built with **Vite**
- **Tailwind CSS**, themed with the brand tokens from Section 5 so builders never touch CSS directly
- A single generic `FieldRenderer` component that switches on `field.type` from the config — this is what makes the "builder only edits JSON" model in Section 3 work, rather than a form-generator library that fights the config-driven approach
- Cross-screen state: **React Context + sessionStorage** (no server round-trips until final submit, matching Section 4.5's "no autosave" requirement)
- Signature field: `react-signature-canvas`
- QR/barcode scanning: `html5-qrcode` (pure browser camera access — no app install needed, important for external users like truck drivers)
- QR code generation: `qrcode` (npm)

**Backend**
- **Python + FastAPI** — async, auto-generated OpenAPI docs (useful documentation for the "smaller technical subset" from Section 6 maintaining the shared service), and Pydantic models give the same runtime validation benefit the Node option had via TypeScript
- Note: this trades away frontend/backend type-sharing (the React client stays TypeScript) — mitigate by keeping the field/config schema defined once as JSON Schema, with Pydantic validating it on the backend and generated TS types validating it on the frontend, so the two don't drift independently
- **SQL Server** as the default DB (per Section 4.3/6), accessed via `SQLAlchemy` + `pyodbc` — one metadata table describing each form's config, plus one data table per form (naming convention still TBD)
- Legacy dropdown sources (Excel/SharePoint) go through the **Microsoft Graph SDK for Python**, hidden behind a common `DataSource` interface (`sql | excel | sharepoint`) so the frontend config only ever sees a `"source"` flag — keeps the tenant-dependent bits isolated and swappable later
- File storage (photos, signatures): behind a small storage interface (local disk for dev, swappable for Azure Blob/S3 later) since hosting isn't decided yet (Section 6)
- Access: no auth system — open/link-based per form as scoped in Section 7, optionally a signed link token for minimal tamper-resistance

**Infra**
- **Docker** for the backend so it can deploy to Azure App Service, on-prem, or elsewhere without rework, matching the "hosting not yet decided" note in Section 6
- **Two deployed environments: dev and production.** Same codebase/config, deployed separately (e.g., two Azure App Service instances, or two URLs) so new tools/changes can be tested in dev before going live in production. Scoped to hosting/deployment only for now — database, git branching, and config/secrets strategy per environment are not addressed yet and can be decided later.

## 9. What to do with this brief

Please:
1. Propose a high-level architecture (frontend framework, backend framework/language, folder structure) that satisfies the "config-driven, low-code-for-builders" goal described in Section 3.
2. Propose how a new form's config file would be structured (building on the JSON examples implied in Section 4).
3. Flag any requirement above that seems to conflict with another, or where you'd want more detail before implementation.
4. Do NOT start writing full implementation code yet — confirm the architecture and config schema with me first.
