# Kringel

## How to Run

1. Install Docker (The installation process varies by operating system — see https://docs.docker.com/get-docker/)

2. Clone `.env.example` and rename it to `.env`, then change the values if needed (the default values are set for local database use).

3. Navigate to the project folder in the terminal and run:

    3.1 If you want to use a local database: `docker compose --profile app_dev up -w`
    3.2 If you want to use an external database: `docker compose --profile app up -w`

4. To stop Docker:

    - Use `Ctrl+C`
    - Then run: `docker compose --profile (app_dev or app) down`

## For Development

Use Docker for development, as it is set up to automatically update the code (refer to the previous section).
It is recommended to also install dependencies locally for better autocompletion.
To do this, run `npm install` in both the frontend and backend folders.

### Useful resources

*The files are located in folders matching their name*

- backend.md - contains info about backend and explains some useful commands.
- database.md - containd the structure of the database.

## Developer Scratchpad

- git add .
- git commit -m""
- git pull
- git config pull rebase false 
- pane ristist kinni leht mis avanes
- git pull
- git push 

Typescript faili kompileerimine
- Kui soovid, et oleks typescriptile sarnane js fail (puhtam js kood):
 1. Mine  terminalis kausta kus su failid on (cd folder/)
 2. Kirjuta npx tsc (see compilib kõik sinu ts failid samasse kausta js failideks)
 väike update: pead kõige pealt enda main kausta lisama tsconfig.json faili, et see töötaks.git 

 !! Ühe faili (npx tsc filename.ts) ei soovita kasutada, sest see ignoreerib tsconfig faili olulisi seadeid,
 mille tulemusena tuleb commonjs kujul compile.
 commonjs kujul ei pruugi veebilehel kõik alati töötada ja on üldiselt vanem.


### Outdated

NODE versioon
- Vaadake üle mis teie node versioon ja vajadusel updatei
nvm install     # Paigaldab automaatselt versiooni .nvmrc alusel (kui ei siis vaata versiooni sealt failist)
nvm use         # Kasutab seda versioonig
