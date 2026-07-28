-- 0011_report_fields.sql — Utvider dagsrapporten med kundens felt (v1).
-- delays/delay_reason, hse_notes/hse_severity, weather finnes fra 0001.
-- Legger til kvalitet, bas-kommentar og fritt notat.

alter table daily_reports add column if not exists quality_notes text;
alter table daily_reports add column if not exists supervisor_comment text;
alter table daily_reports add column if not exists notes text;
