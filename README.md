# Agilno

## Upute

#### Postavljanje

Potrebno je instalirati i pokrenuti samo React aplikaciju. Baza podataka i nodejs su postavljeni na serveru. Naravno, sve se može postaviti i posebno na lokalu, a za to je potrebno postaviti **postgresql** bazu (u folderu "database" se nazali skripta za postavljanje). Također, ako se ide na opciju postavljanja na localhost, treba zamijeniti API link u react aplikaciji `/src/config/index.js`, te uspostaviti vezu između nodejs servera i nove baze: `/database/connect.js`.

#### Registracija

Dodavanje novog korisnika odvija se na način da se u headeru klikne na **Login**, nakon čega se otvara Login/Register popup. Za registraciju je potrebnu pri dnu stisnuti na **Register**. Ne mogu postojati 2 korisnika sa istim mailom. Nakon unošenja podataka za novog korisnika, na unesenu adresu se šalje mail za potvrdu. Iz tog razloga sam stavio nodejs na server kako bi za simulaciju bilo moguće potvrdit mail i sa mobitela. Naravno u pravome svijetu neće se potvrđivati direktno na API-ju, ali u ovom slučaju, kada kliknete u mail-u "potvrdi moj email", preusmjerit će Vas na link koji će samo vratiti odgovor `OK`, odnosno status `200`. Nakon toga, moguće se logirati.

Nakon logiranja, korisnik svoje ime može promijeniti pod stavkom **"My profile"**.

#### Klađenje i račun

Na početnoj stranici prikazuju se neodigrani događaji na koje se može kladiti. U slučaju kada neka kvota ne postoji, na njenom mjestu prikazan je lokot (tj. znači samo da u admin panelu nije definirana kvota za taj rezultat). Klikom na kvotu, dodaje se novi par u tiketu. Za jedan događaj moguće je odabrati samo jednu kvotu.

Također postoje dvije opcije klađenja **single** i **multiple**. `Single` je svaki par za sebe i svaki par ima svoj ulog, dok `multiple` množi sve kvote te one imaju zajednički ulog. Da bi single tiket bio dobitan, dovoljno je da jedan par prođe jer se već tada može novac isplatiti. Da bi multiple tiket bio dobitan, trebaju svi parovi proći. Unosom uloga unutar tiketa automatski se računa potencijalna dobit prolaskom tiketa.

Tiket se ne može odigrati ako na računu nema dovoljno novaca. Potrebno je položiti novac na račun. Jedini način za polaganje novca je putem sljedeće kartice: 

```
CARD NUMBER:  5524 5086 1722 8117
CARD EXPIRE:  05/26
   CARD CVV:  280
```

Kartica je namjenjena samo za simulaciju, te zbog toga nema polja "Cardholder name, surname". U simulaciji služi samo kao šifa, tj. neograničen je polog. Bitno je samo kod unosa kartice da se broj kartice unese bez razmaka, te da se napiše "slash"(/) između mjeseca i godine isteka jer nisam imao vremena za radit parsiranje.

Nakon što se tiket odigra, moguće ga je vidjeti pod stavkom **"My bets"**. Ukoliko nakon odigravanja svih događaja tiket bude dobitan, moguće ga je isplatiti pritiskom na **Cashout**. Dakle, cashout se ne odvija automatski, nego korisnik treba isplatiti tiket koji želi.

Povratak na početnu stranicu moguć je iz headera pod stavkom **Sports**. Stavka "Live sports" nema funkciju.

#### Admin panel

Admin panelu može pristupiti samo jedan korisnik. Taj korisnik nema pravo na korištenje početnog dahboard-a i klađenje. Njegove mogućnosti su dodavanje i brisanje **sportova**, **natjecanja**, **događaja**, **kvota**, **timova** i **igrača**. Sve stavke su povezane i poredane po redu. Dakle, potrebno je prvo dodati sportove, pa natjecaja, pa događaj povezati sa natjecanjem i timovima, itd. (npr. za dodavanje kvote potrebno je odabrati ID događaja, te se po tome dalje znaju kvote koje se mogu odabrati jer događaj sadrži natjecanje, natjecanje sadrži sport, a sport ima moguće rezultate. Također prilikom stvaranja natjecanja bitno treba obratiti pozornost na tip natjecanja("national", "club", "individual"), jer se kod dodavanja događaja po tome filtriraju kandidati za domaćina i gosta.) Na backendu je bio pripremljen i drugačiji pristup sa mnogo više funkcionalnosti, međutim za izvesti to na frontend-u nisam imao vremena.

U admin panelu u headeru se nalazi botun **Završi sve događaje** koji odigra sve neodigrane događaje te im dodijeli random rezultat. Nakon dodjele rezultata, kontroliraju se svi tiketi (single i multiple odvojeno jer imaju drugačiju logiku). Nakon što su događaji odigrani, u admin panelu postat će zeleni, te se više neće prikazivati za obične korisnike.

#### Korisnički računi

```json
{
  "role": "admin",
  "email": "jakov@pragmatic.hr",
  "password": "test"
}
```
```json
{
  "role": "user",
  "email": "jakov.melvan@gmail.com",
  "password": "test"
}
```