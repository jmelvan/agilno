## Database for online casino

#### Relations:
**Users**(<ins>email</ins>, name, surname, password, salt, saldo)<br/>
**Betslip**(<ins>ID</ins>, user_email, stake)<br/>
**Quota**(<ins>ID</ins>, event_id, type, value)<br/>
**Betslip_bet**(betslip_id, quota_id, stake)<br/>
**Event**(<ins>ID</ins>, sport_id, host_id, guest_id)<br/>
**Sport**(<ins>ID</ins>, name, type)<br/>
**Club**(<ins>ID</ins>, name, img)<br/>
**Player**(<ins>ID</ins>, name, surname, club_id)<br/>
