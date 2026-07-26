-- 0005_harden_onboarding.sql — Defense in depth.
-- Postgres gir EXECUTE til PUBLIC som standard. Funksjonen avviser allerede
-- uinnloggede (auth.uid() is null → exception), men vi fjerner PUBLIC-tilgangen
-- så kun innloggede (`authenticated`) i det hele tatt kan kalle den.

revoke execute on function onboard_organization(text, text) from public;
grant execute on function onboard_organization(text, text) to authenticated;
