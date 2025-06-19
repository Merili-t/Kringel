# Kringel 🥨
<img src="images/banner.png" alt="Kringel" width="300">
korralikult vormistatud lähtekood; NB! Lisa kindlasti GitHubi README.md:
README.md fail peab sisaldama järgmist:
- projekti või lahenduse (toote/teenuse) nime;
- ekraanipilti või eraldi loodud pilti lahendusest – ekraanipilt peab olema samas repos, et nad üks hetk ära ei
kaoks (ära tee väga suuri pilte!);
- eesmärki ja lühikirjeldust (3-4 lauset, mis probleemi rakendus lahendab);
- viidet instituudile ja paar sõna sellest, mille raames projekt loodud (tehtud selle ja selle raames....);
- kasutatud tehnoloogiad ja nende versioonid(!);
- projekti autorite nimed;
- selgeid paigaldusjuhiseid ja arenduskeskkonna ülesseadmise juhised, et kes iganes saaks selle
vajadusel käima (näiteks andmebaasi tabelid jm info peaks olema teksti kujul, et saaks kopeerida, aga
loomulikult ei saa suure andmebaasi loomise skript tervikuna README-failis olla), juhendi abil saab
"toote" peale koodi allalaadimist sobilikus kohas käima panna;
- viidet litsentsile ning litsentsifail oleks repositooriumis (soovitavalt MIT litsents).
Vaata ka siit häid näiteid: https://github.com/matiassingers/awesome-readme

## Pildid

## Eesmärk
Oleme loomas rakendust, mis võimaldab koostada ja lahendada teste kindlate kriteeriumite alusel. Eesmärk on pakkuda paindlikku ja funktsionaalset lahendust nii õpetajatele kui ka õppijatele.
Testide sees peab olema võimalik:
- lahendada keemiaülesandeid, sh reaktsioonivõrrandite tasakaalustamine,
- visuaalselt kuvada keemilisi ahelaid,
- kasutada spetsiaalset sümbolitega klaviatuuri füüsikaülesannete lahendamiseks.

Lisaks rakenduvad testidele ajapiirangud – nii testi kättesaadavusele (millal test on nähtav) kui ka lahendamise ajale.

## Instituut

## Kasutatud tehnoloogiad ja nende versioonid
- [Vite](https://vite.dev/) – Esipaneeli arendustööriist, mis võimaldab kiiret arendust ja optimeeritud build’e
  *Kasutatud projekti frontend’i kiireks arendamiseks ja build’imiseks.*
- [Express.js](https://expressjs.com/) – Node.js-i veebiraamistik
  *Kasutatud backend-serveri loomiseks ja API otspunktide haldamiseks.*
- [DrizzleORM](https://orm.drizzle.team/) – ORM SQL-andmebaasidele
  *Kasutatud andmemudelite defineerimiseks ja turvaliste SQL-päringute kirjutamiseks.*
- [MinIO](https://min.io/) – Objektihoidla, mis ühildub Amazon S3 API-ga
  *Kasutatud failide salvestamiseks.*
- [MySQL](https://www.mysql.com/) – Relatsiooniline andmebaasihaldussüsteem
  *Kasutatud struktureeritud andmete salvestamiseks.*
- [Zod](https://zod.dev/) – TypeScripti-sõbralik skeemi valideerimise teek
  *Kasutatud sisendi valideerimiseks (nt API päringud ja vormid), tagades andmete korrektsuse juba enne serverisse jõudmist.*


## Autorid

## Paigaldusjuhised arenduseks
1. Paigalda Docker (Paigaldusprotsess oleneb operatsioonisüsteemist — vt [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/))

2. Klooni fail `.env.example` ja nimeta see ümber `.env`-iks, seejärel muuda väärtusi vastavalt vajadusele (vaikimisi väärtused on mõeldud kohaliku andmebaasi jaoks).

   2.1. Tokeni genereerimiseks käivita: `npm run token` backend kaustas. See tagastab juhuslikult genereeritud tokeni **Base64** formaadis.

3. Liigu terminalis projekti kausta ja käivita:

   3.1 Kui soovid kasutada kohalikku andmebaasi: `docker compose --profile app_dev up -w --build`

   3.2 Kui soovid kasutada välist andmebaasi: `docker compose --profile app up -w --build`

4. Dockeri peatamiseks:

   * Vajuta `Ctrl+C`
   * Seejärel käivita: `docker compose --profile (app_dev või app) down`

## 
