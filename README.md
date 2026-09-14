# Domineering Minimax

See on kooliprojekt, mis rakendab 4 × 4 mängulaual mängu Domineering.
Mängija 0 on inimene ja mängija 1 on arvuti.

## Kuidas mängu avada ja mängida

Projekt kasutab ainult HTML-i, CSS-i ja JavaScripti ning väliseid teeke ei ole
vaja.

Mängu saab avada otse brauseris:

1. Ava fail `index.html`.
2. Vali rippmenüüst arvuti otsingumeetod:
   - **Minimax**
   - **Minimax koos alfa-beeta kärpimisega**
3. Klõpsa kahel järjestikusel vabal lahtril samas veerus, et teha mängija 0
   vertikaalne käik.
4. Arvuti mõtleb hetke ja teeb mängija 1 horisontaalse käigu.
5. Arvuti käigu järel kuvatakse valitud käik, otsingu sügavus, kontrollitud
   mänguseisude arv ja kulunud aeg millisekundites.
6. Uue mängu alustamiseks vajuta nuppu **New Game** või mängu lõpus nuppu
   **Play Again**. Võidu korral kuvatakse mängulaua kohal võitja ülekate.
   Inimese võidu korral mängib lühikest aega konfetti.

Soovi korral võib käivitada ka kohaliku veebiserveri:

```bash
python3 -m http.server 8000
```

Seejärel ava brauseris http://localhost:8000.

## Domineeringu reeglid

- Mängulaud on 4 × 4 ehk sellel on 16 lahtrit.
- Mängija 0 on inimene ja asetab vertikaalseid 1 × 2 nuppe.
- Mängija 1 on arvuti ja asetab horisontaalseid 1 × 2 nuppe.
- Vertikaalne nupp katab kaks järjestikust vaba lahtrit samas veerus.
- Horisontaalne nupp katab kaks järjestikust vaba lahtrit samas reas.
- Nuppu ei saa asetada hõivatud lahtritele.
- Mängija kaotab, kui tal ei ole enam ühtegi seaduslikku käiku.

## Minimax-algoritm

Arvuti otsib maksimaalselt 5 käiku ette. Minimax käsitleb arvutit mängijana,
kes püüab võita, ja inimest vastasena, kes püüab võita. Iga võimaliku käigu
järel simuleeritakse vastase käike ning seejärel uusi arvuti käike.

Kui mäng lõpeb otsingu ajal, saab arvuti võit väga suure positiivse skoori ja
inimese võit väga väikese negatiivse skoori. Mitte-lõplike seisude hindamisel
lahutatakse mängija 0 võimalike vertikaalsete käikude arv mängija 1 võimalike
horisontaalsete käikude arvust:

```text
hind = mängija 1 horisontaalsete käikude arv
       − mängija 0 vertikaalsete käikude arv
```

Arvuti valib käigu, mille minimax-hinnang on talle kõige kasulikum.

## Alfa-beeta kärpimine

Alfa-beeta kärpimine kasutab sama mänguseisu, sama hindamisfunktsiooni ja sama
otsingu sügavust nagu tavaline minimax. See jätab vahele harud, mille tulemus
ei saa enam senist parimat valikut parandada.

Seetõttu kontrollitakse vähem mänguseise ja otsing võib olla kiirem, kuid
valitud käik ja mängu käitumine jäävad samaks. Rippmenüü abil saab võrrelda
tavalist minimaxi ja alfa-beeta kärpimisega minimaxi.

## Jõudluse tulemused

Tulemused sõltuvad brauserist ja arvutist. Sama algse mänguseisu ja sügavuse
5 korral võib tulemused märkida näiteks järgmiselt:

| Meetod | Otsingu sügavus | Kontrollitud seisud | Aeg |
|---|---:|---:|---:|
| Minimax | 5 | `[täida siia]` | `[täida siia] ms` |
| Minimax koos alfa-beeta kärpimisega | 5 | `[täida siia]` | `[täida siia] ms` |

Alfa-beeta kärpimise eelis on tavaliselt väiksem kontrollitud seisude arv,
sest mittevajalikud otsinguharud jäetakse läbi vaatamata.

## Failid

- `AGENTS.md` — projekti juhised ja arendusnõuded.
- `index.html` — lehe struktuur, mängu olek, otsingumeetodi valik, mängulaud ja
  uue mängu nupp.
- `style.css` — lehe, mängulaua, nuppude ja mängunuppude kujundus.
- `script.js` — mängulaua loomine, käikude kontrollimine, minimax,
  alfa-beeta kärpimine, võidutuvastus, arvuti käigud ja lähtestamine.

## GitHubi repositoorium

https://github.com/MarcusPuust/Domineering-minimax

## Projekti päevik

### 1. Projekti loomine

- **Kasutaja ülesanne:** Loo projekt „Domineering Minimax”, kasutades ainult
  HTML-i, CSS-i ja JavaScripti. Loo esialgu ainult pealkirja ja mängu
  lühikirjeldusega leht.
- **Tulemus:** Loodi algne staatiline leht ja projekti juhised.
- **Muudetud failid:** `AGENTS.md`, `index.html`, `style.css`, `script.js`,
  `README.md`.
- **Parandatud probleem:** Projekti kaust ei olnud veel Git-repositoorium.
  Git lähtestati ja projekt avaldati GitHubis.

### 2. 4 × 4 mängulaua lisamine

- **Kasutaja ülesanne:** Loo CSS Grid abil 4 × 4 mängulaud 16 klikitava
  lahtriga ja lisa mängu olek.
- **Tulemus:** Lisati nelja rea ja nelja veeruga mängulaud.
- **Muudetud failid:** `index.html`, `style.css`, `script.js`, `README.md`.
- **Testimine:** Kontrolliti, et brauseris on 16 lahtrit ning CSS Grid annab
  neli veergu ja neli rida.
- **Parandatud probleem:** Selle sammu käigus probleeme ei leitud.

### 3. Mängija 0 vertikaalsed käigud

- **Kasutaja ülesanne:** Lisa mängija 0 reegel, mille järgi tuleb valida kaks
  järjestikust lahtrit samas veerus.
- **Tulemus:** Õige käik värvib lahtrid siniseks ja kuvab mõlemas tähe `V`.
  Vigane valik jätab laua muutmata ja kuvab veateate.
- **Muudetud failid:** `index.html`, `style.css`, `script.js`, `README.md`.
- **Testimine:** Kontrolliti üht vigast ja üht kehtivat valikut.
- **Parandatud probleem:** Selle sammu käigus probleeme ei leitud.

### 4. Mängija 1 horisontaalsed käigud

- **Kasutaja ülesanne:** Lisa mängija 1 reegel, mille järgi tuleb valida kaks
  järjestikust lahtrit samas reas.
- **Tulemus:** Lisati oranžid `H`-lahtrid, mängijate vaheldumine ja
  mängija-põhised veateated.
- **Muudetud failid:** `script.js`, `style.css`, `README.md`.
- **Testimine:** Kontrolliti mõlema mängija kehtivat ja vigast käiku.
- **Parandatud probleem:** Kehtiva käigu järel ei tühjendatud valitud lahtrite
  loendit. Loend tühjendatakse nüüd pärast iga kehtivat käiku.

### 5. Võidutuvastus ja uus mäng

- **Kasutaja ülesanne:** Kontrolli pärast iga käiku, kas järgmisel mängijal on
  seaduslik käik. Lisa võiduteade ja nupp **New Game**.
- **Tulemus:** Mäng lõpeb, kui järgmisel mängijal ei ole võimalik käiku teha,
  ning kõik lahtrid keelatakse. Uue mängu nupp taastab algseisu.
- **Muudetud failid:** `index.html`, `style.css`, `script.js`, `README.md`.
- **Testimine:** Mängiti mäng võiduni ja kontrolliti laua lähtestamist.
- **Parandatud probleem:** Selle sammu käigus eraldi probleeme ei leitud.

### 6. Lihtne arvutivastane

- **Kasutaja ülesanne:** Muuda mäng inimese ja arvuti vaheliseks. Arvuti peab
  valima esimese leitud seadusliku horisontaalse käigu.
- **Tulemus:** Mängija 0 teeb käigu hiirega ja mängija 1 teeb pärast lühikest
  mõtlemisteadet automaatse käigu.
- **Muudetud failid:** `script.js`, `README.md`.
- **Testimine:** Mängiti täielik inimene-arvuti mäng võiduni.
- **Parandatud probleem:** Selle sammu käigus probleeme ei leitud.

### 7. Minimax-algoritm

- **Kasutaja ülesanne:** Asenda esimese seadusliku käigu valik sügavuseni 5
  töötava minimax-algoritmiga ja kuva jõudlusmõõdikud.
- **Tulemus:** Arvuti valib minimaxi abil käigu ning kuvab sügavuse,
  kontrollitud seisude arvu ja aja.
- **Muudetud failid:** `script.js`, `README.md`.
- **Testimine:** Mängiti täielik mäng ja kontrolliti otsingumõõdikuid.
- **Parandatud probleem:** Vertikaalse käigu indeksiarvutus kasutas vale
  sammu. See parandati nii, et järgmine lahter asub samas veerus järgmises reas.

### 8. Alfa-beeta kärpimine

- **Kasutaja ülesanne:** Lisa võimalus võrrelda tavalist minimaxi ja
  alfa-beeta kärpimisega minimaxi.
- **Tulemus:** Lisati otsingumeetodi valik ja alfa-beeta kärpimise algoritm.
  Mõlemad kasutavad sügavust 5 ning kuvavad seisude arvu ja aja.
- **Muudetud failid:** `index.html`, `style.css`, `script.js`, `README.md`.
- **Testimine:** Sama mänguseisu korral valisid mõlemad meetodid sama käigu.
  Tavaline minimax kontrollis 4107 seisundit ja alfa-beeta kärpimine 1346
  seisundit.
- **Parandatud probleem:** Selle sammu käigus probleeme ei leitud.

### 9. README tõlkimine eesti keelde

- **Kasutaja ülesanne:** Dokumenteeri mäng, algoritmid, jõudlus ja arendusajalugu
  eesti keeles.
- **Tulemus:** README sisaldab nüüd mängujuhiseid, reegleid, algoritmide
  selgitusi, jõudlustabeli kohatäiteid ja täielikku projekti päevikut.
- **Muudetud failid:** `README.md`.
- **Testimine:** Kontrolliti, et ainult dokumentatsioon muutus ja mängukoodi ei
  muudetud.
- **Parandatud probleem:** Varasem README oli inglise keeles ega sisaldanud
  kõiki nõutud eestikeelseid selgitusi.

### 10. Mängu lõpu kasutajakogemuse parandamine

- **Kasutaja ülesanne:** Lisa mängu lõppedes keskne võitja ülekate tekstiga
  **You win!** või **Computer wins!**, **Play Again** nupp ja konfetti ainult
  inimese võidu korral. Mängureegleid ja minimaxi loogikat ei tohi muuta.
- **Tulemus:** Mängu lõppedes kuvatakse laua kohal võitja ülekate. **Play Again**
  alustab uue mängu. Inimese võidu korral luuakse ilma välise teegita lühike
  konfeti animatsioon, mis eemaldatakse automaatselt.
- **Muudetud failid:** `index.html`, `style.css`, `script.js`, `README.md`.
- **Testimine:** Kontrolliti arvuti võidu ja inimese võidu ülekatet,
  **Play Again** nuppu, konfetti eemaldamist ning olemasoleva **New Game** nupu
  toimimist.
- **Parandatud probleem:** Konfeti jaoks lisati lühike ajapiirang ja
  `pointer-events: none`, et animatsioon ei segaks **Play Again** nuppu.
