# Customer requirements — v1

Received from the customer 2026-07-28 after follow-up questions. Deployment:
**Somalia**, English UI, iPhone + Android. This is the authoritative v1 scope
and refines `docs/SPEC.md`.

Status legend: ✅ built · 🟡 partly built / schema ready · ⬜ not started.

## 1. Daily Reports

Predefined forms with an optional free-text notes section. Each report includes:

| Field                            | Status                                        |
| -------------------------------- | --------------------------------------------- |
| Project name                     | ✅                                            |
| Date and time                    | 🟡 (date ✅, add time)                        |
| Work completed                   | ✅                                            |
| Labour attendance                | 🟡 (`report_manpower` table exists; needs UI) |
| Equipment and machinery used     | ⬜ (needs table + UI)                         |
| Materials delivered and used     | ⬜ (needs table + UI)                         |
| Delays or issues encountered     | 🟡 (`delays`/`delay_reason` columns exist)    |
| Safety incidents or observations | 🟡 (`hse_notes`/`hse_severity` exist)         |
| Quality inspection notes         | ⬜                                            |
| Photos and videos                | ⬜ (FR-4)                                     |
| Supervisor comments              | ⬜                                            |

Export to **PDF and Excel** using a professional company template. ⬜ (FR-7)

## 2. Photo & Video Uploads

- Formats: photos JPG/JPEG/PNG, videos MP4/MOV.
- Linked to a specific project and daily report.
- Caption per file.
- Auto-save GPS location and upload time when available.

Status: ⬜ (`attachments` table exists with kind/caption/captured_at; needs
storage bucket, upload, GPS).

## 3. User Roles (detailed permissions)

- **Admin:** full control — users, projects, reports, settings, approvals.
- **Manager:** manage projects, review/approve reports, assign tasks, dashboards.
- **Engineer:** create/edit technical reports, inspections, quality records, upload docs.
- **Supervisor:** submit daily reports, attendance, equipment usage, safety, progress.
- **Worker:** view assigned tasks, mark work done, submit attendance, upload photos (if permitted).
- **Client:** view-only — progress, approved reports, photos, schedules, dashboards. No editing.

Status: ✅ coarse RLS model built and proven with pgTAP. Detailed per-action
permissions to be refined as each module lands.

## 4. Electronic Signatures (role-specific)

- **Supervisor** signs daily reports before submission.
- **Engineer** signs inspection and quality reports.
- **Manager** approves and signs final reports.
- **Client** signs completion certificates and project handover documents.
- Every signature records date, time and the user who signed.

Status: ✅ signature engine built (server-time + SHA-256 hash + immutable, with
performer/approver roles). Role-specific routing + inspection/completion document
types to be added.

## Cross-cutting

- **Modular** so features can be added in future updates. ✅ (feature-based
  architecture: `src/features/*`).
