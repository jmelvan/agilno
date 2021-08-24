## Database for online casino

#### Relations:
**Users**(<ins>email</ins>, name, surname, password, salt, saldo, validate_hash, validated, role)<br/>
**Betslip**(<ins>ID</ins>, user_email, stake)<br/>
**Quota**(<ins>ID</ins>, event_id, type, value)<br/>
**Betslip_bet**(betslip_id, quota_id, stake, processed)<br/>
**Event**(<ins>ID</ins>, sport_name, host_id, guest_id, start_time, end_time)<br/>
**Sport**(<ins>name</ins>, type)<br/>
**Competition**(<ins>ID</ins>, name, type, sport_name)<br/>
**Team**(<ins>ID</ins>, name, type, img, sport_name)<br/>
**Player**(<ins>ID</ins>, name, surname, club_id, sport_name)<br/>
