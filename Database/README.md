## Database for online casino

#### Relations:
**Users**(<ins>email</ins>, name, surname, password, salt, saldo, validate_hash, validated, role)<br/>
**Betslip**(<ins>ID</ins>, user_email, stake, type, status)<br/>
**Quota**(<ins>ID</ins>, event_id, type, value)<br/>
**Betslip_bet**(betslip_id, quota_id, stake, status)<br/>
**Event**(<ins>ID</ins>, host_id, guest_id, start_time, end_time, competition_id)<br/>
**Sport**(<ins>name</ins>, type, result)<br/>
**Competition**(<ins>ID</ins>, name, type, sport_name)<br/>
**Team**(<ins>ID</ins>, name, type, img, sport_name, country)<br/>
**Player**(<ins>ID</ins>, name, surname, img, club_id, sport_name, country)<br/>

#### Important!

Nakon što se postavi baza podataka (izvršavanje skripte), treba dodati agregatnu funkciju koja služi za množenje realnih brojeva između redova kada se koristi `GROUP BY`. Potrebno je izvršiti sljedeći kod:

```sql
CREATE FUNCTION mulReal(real, real) RETURNS real
    AS 'select $1 * $2;'
    LANGUAGE SQL
    IMMUTABLE
    RETURNS NULL ON NULL INPUT;

CREATE AGGREGATE mul_real(real) ( SFUNC = mulReal, STYPE=real )
```

#### Long queries explained

1. Provjera koliko parova je prošlo za vrstu tiketa **multiple**

```sql
SELECT betslip.id,
(SELECT count(*) FROM betslip_bet JOIN betslip as b2 ON b2.id=betslip_id WHERE betslip_id=betslip.id) as total_bets,
(SELECT count(*) FROM betslip_bet LEFT JOIN quota as q2 ON betslip_bet.quota_id=q2.id LEFT JOIN event as e2 ON q2.event_id=e2.id WHERE betslip_id=betslip.id AND e2.win=q2.type) as total_wins 
FROM betslip 
WHERE status='unprocessed' AND betslip.type='multiple'
```

> Ovaj request vraća: (betslip_id, broj ukupnih parova u tiketu, broj parova koji su prošli)

Daljnja provjera se izvršava na način da se usporedi ukupni broj parova u tiketu i broj parova koji su prošli. Pošto je vrsta tiketa **multiple**, tiket je pobjednički samo ako su svi parovi prošli, dakle jednakost mora biti zadovoljena. U suprotnom, tiket je gubitnički.

2. Dostupni iznos isplate za pojedini tiket vrste **multiple**

```sql
SELECT betslip.id as betslip_id, user_email, mul_real(quota.value)*betslip.stake as cashout FROM betslip 
RIGHT JOIN betslip_bet ON betslip_bet.betslip_id=betslip.id 
JOIN quota ON betslip_bet.quota_id=quota.id 
WHERE betslip.type='multiple' AND betslip.id=$1 AND user_email=$2 GROUP BY betslip.id, user_email
```

> Ovaj request vraća (betslip_id, korisnički email, ukupnu kvotu tiketa pomnoženu ulogom)

3. Provjera koliko parova je prošlo za vrstu tiketa **single**

```sql
SELECT betslip.id as betslip_id, user_email, quota.id as quota_id FROM betslip 
LEFT JOIN betslip_bet ON betslip_bet.betslip_id=betslip.id
LEFT JOIN quota ON betslip_bet.quota_id=quota.id
LEFT JOIN event ON quota.event_id=event.id
WHERE betslip.status='unprocessed' AND betslip.type='single' AND event.win=quota.type
```

> Ovaj request vraća (betslip_id, korisnički email, quota_id)

Daljnji proces je da se svaki par (betslip_id, quota_id) u tablici betslip_bet označi kao pobjednički, te da se svaki jedinstveni betslip od betslip_id označi kao pobjednički. Pošto je vrsta tiketa **single**, za bilo kakvu isplatu je dovoljan samo jedan prođeni tiket.

4. Dostupni iznos isplate za pojedini tiket vrste **single**

```sql
SELECT betslip.id as betslip_id, betslip.user_email, sum(quota.value*betslip_bet.stake) as cashout FROM betslip 
LEFT JOIN betslip_bet ON betslip_bet.betslip_id=betslip.id 
LEFT JOIN quota ON betslip_bet.quota_id=quota.id 
WHERE betslip.id=$1 AND user_email=$2 AND betslip.type='single' AND betslip_bet.status='win' 
GROUP BY betslip.id, betslip.user_email
```

> Ovaj request vraća (betslip_id, korisnički email, pojedinačnu kvotu para pomnoženu sa pojedinačnim ulogom na par)