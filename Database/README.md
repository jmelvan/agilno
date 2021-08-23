## Database for online casino

Relations:
**Users**(<ins>ID</ins>, name, surname, email, password, salt, saldo)
**Betslip**(<ins>ID</ins>, user_id, stake)
**Quota**(<ins>ID</ins>, event_id, type, value)
**Betslip_bet**(betslip_id, quota_id, stake)
**Event**(<ins>ID</ins>, sport_id, host_id, guest_id)
**Sport**(<ins>ID</ins>, name, type)
**Club**(<ins>ID</ins>, name, img)
**Player**(<ins>ID</ins>, name, surname, club_id)
