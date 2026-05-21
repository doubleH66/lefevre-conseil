-- Comptes créés avant le passage au statut Actif par défaut
update public.client_accounts
set status = 'Actif'
where status = 'En attente';
