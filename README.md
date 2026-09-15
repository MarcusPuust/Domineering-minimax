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
3. Vali enne esimest käiku, kas sinu klotsid on vertikaalsed või
   horisontaalsed. Arvuti kasutab vastassuunda.
4. Klõpsa kahel sobival järjestikusel vabal lahtril, et teha oma käik.
5. Arvuti mõtleb hetke ja teeb vastassuunalise käigu.
5. Arvuti käigu järel kuvatakse valitud käik, otsingu sügavus, kontrollitud
   mänguseisude arv, hinnanguline olekuandmete maht ja kulunud aeg
   millisekundites.
6. Uue mängu alustamiseks vajuta nuppu **New Game** või mängu lõpus nuppu
   **Play Again**. Võidu korral kuvatakse mängulaua kohal võitja ülekate.
   Inimese võidu korral mängib lühikest aega konfetti.

Soovi korral võib käivitada ka kohaliku veebiserveri:

```bash
python3 -m http.server 8000
```

Seejärel ava brauseris http://localhost:8000.

Mängu võib avada ka otse failist `index.html`, sest projekt ei vaja
ehitusprotsessi ega serveripoolset koodi.

## Domineeringu reeglid

- Mängulaud on 4 × 4 ehk sellel on 16 lahtrit.
- Mängija 0 on inimene ja asetab valitud suunaga 1 × 2 nuppe.
- Mängija 1 on arvuti ja asetab inimese valitud suunale vastassuunalisi
  1 × 2 nuppe.
- Vertikaalne nupp katab kaks järjestikust vaba lahtrit samas veerus.
- Horisontaalne nupp katab kaks järjestikust vaba lahtrit samas reas.
- Nuppu ei saa asetada hõivatud lahtritele.
- Inimene teeb esimese käigu vertikaalse klotsiga ja arvuti vastab
  horisontaalse klotsiga.
- Mängija kaotab ja teine mängija võidab, kui tal ei ole enam ühtegi
  seaduslikku käiku.

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

## Võitja ja mängu lõpp

Kui järgmisel mängijal ei ole enam seaduslikku käiku, mäng lõpeb. Inimese
võidu korral kuvatakse mängulaua kohal **You win!** ja arvuti võidu korral
**Computer wins!**. Võiduülekattes olev **Play Again** nupp alustab kohe uue
mängu. Lehe all olev **New Game** nupp teeb sama ka mängu ajal.

Inimese võidu tähistamiseks kuvatakse lühike isetehtud konfeti animatsioon.
Konfetti ei kasuta välist teeki, kestab ainult lühikest aega ega takista
võiduülekatte nuppude kasutamist.

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

| Meetod | Otsingu sügavus | Kontrollitud seisud | Hinnanguline olekuandmed | Aeg |
|---|---:|---:|---:|---:|
| Minimax | 5 | 4107 | 64.2 KB | 4 ms |
| Minimax koos alfa-beeta kärpimisega | 5 | 1346 | 21.0 KB | 2 ms |

Alfa-beeta kärpimise eelis on tavaliselt väiksem kontrollitud seisude arv,
sest mittevajalikud otsinguharud jäetakse läbi vaatamata.

### Hinnanguline mälu

Brauser ei anna selle staatilise lehe jaoks usaldusväärset ja üheselt
võrreldavat täpse RAM-i kasutuse mõõdikut. Seetõttu kuvab mäng arvuti käigu
järel hinnangulise otsingu olekuandmete mahu:

```text
kontrollitud seisud × 16 lahtrit × 1 bait
```

See on 4 × 4 laua andmete lihtsustatud hinnang, mitte JavaScripti heap'i täpne
RAM-i kasutus. Tegelik mälu sõltub brauserist ja JavaScripti mootorist ning
objektide, massiivide ja ajutiste andmete lisakulust. Näiteks 4107 kontrollitud
seisu korral on hinnanguline olekuandmete maht 64.2 KB.

## Failid

- `AGENTS.md` — projekti juhised ja arendusnõuded.
- `index.html` — lehe struktuur, mängu olek, otsingumeetodi valik, mängulaud ja
  uue mängu nupp.
- `style.css` — lehe, mängulaua, nuppude ja mängunuppude kujundus.
- `script.js` — mängulaua loomine, käikude kontrollimine, minimax,
  alfa-beeta kärpimine, võidutuvastus, arvuti käigud ja lähtestamine.

## GitHubi repositoorium

https://github.com/MarcusPuust/Domineering-minimax

## GitHub Pages

GitHub Pagesi avaldatud mängu link:

https://marcuspuust.github.io/Domineering-minimax/

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

### 11. Täielik mängu testimine

- **Kasutaja ülesanne:** Kontrolli kehtivaid ja vigaseid inimkäike, arvuti
  automaatseid käike, võidutuvastust, mõlemat lähtestusnuppu, mõlemat otsingumeetodit
  ning jõudlusmõõdikute kuvamist. Paranda ainult selged vead ja lisa üks
  jõudlustulemus kummagi meetodi kohta.
- **Tulemus:** Täielik testimine läbis kõik kontrollid. Vigane horisontaalne
  valik lükati inimese käiguna tagasi, kehtiv vertikaalne käik käivitas arvuti
  automaatse horisontaalse käigu ning mõlemad meetodid näitasid sügavust 5,
  kontrollitud seisude arvu, hinnangulist olekuandmete mahtu ja aega.
- **Testitud võidud ja lähtestamised:** Kontrolliti arvuti võitu, inimese võitu,
  **Play Again** nuppu ja **New Game** nuppu. Mõlema võidu korral ilmus õige
  ülekate; inimese võidu korral ilmus konfetti ja see eemaldus automaatselt.
- **Jõudlustulemus samast algseisust:** Tavaline minimax kontrollis 4107 seisundit
  4 ms jooksul. Alfa-beeta kärpimine kontrollis 1346 seisundit 2 ms jooksul.
  Mõlemad valisid sama käigu sügavusel 5.
- **Muudetud failid:** `README.md`.
- **Parandatud probleem:** Testimise käigus selget mängukoodi viga ei leitud.

### 12. Hinnangulise mälu näitaja lisamine

- **Kasutatud viip:** „Lisa projektile hinnanguline otsingu mälu mõõdik, sest
  täpset brauseri RAM-i kasutust ei saa usaldusväärselt mõõta.”
- **Tulemus:** Arvuti käigu sõnum sisaldab nüüd hinnangulist olekuandmete mahtu
  kilobaitides. Hinnang põhineb kontrollitud seisude arvul ja 16 lahtriga
  mängulaual.
- **Muudetud failid:** `script.js`, `README.md`.
- **Testimine:** Kontrolliti, et arvuti käigu sõnum sisaldab otsingu sügavust,
  kontrollitud seisude arvu, hinnangulist mälu ja aega.
- **Parandatud probleem:** Täpse RAM-i mõõtmise asemel dokumenteeriti ausalt
  lihtsustatud hinnang ja selle piirangud.

### 13. Inimese klotsi suuna valimine

- **Kasutatud viip:** „Lisa enne mängu valik, kas inimene soovib paigutada
  horisontaalseid või vertikaalseid klotse.”
- **Tulemus:** Enne esimest käiku saab valida inimese klotsi suuna. Arvuti
  kasutab automaatselt vastassuunda ning valik lukustub mängu ajaks.
- **Muudetud failid:** `index.html`, `style.css`, `script.js`, `README.md`.
- **Testimine:** Kontrolliti mõlemat suunavalikut, automaatset vastassuunalist
  arvuti käiku ja mängu lähtestamist.
- **Parandatud probleem:** README päeviku etapid olid järjestamata: etapp 14
  paiknes enne etappi 12 ja 13. Nummerdus on nüüd järjestikune.

### 14. Lõpetatud mängu dokumenteerimine

- **Kasutatud viip:** „Update README.md in Estonian to reflect the completed
  game. Include game setup, Domineeringu reeglid, 4 × 4 laud, inimese ja
  arvuti klotsid, võitja selgitus, minimax, alfa-beeta kärpimine, jõudlustabel,
  võiduoverlay, konfetti efekt, arenduspäevik ning GitHubi ja GitHub Pagesi
  lingi koht. Ära muuda mängukoodi.”
- **Tulemus:** README kirjeldab nüüd lõpetatud mängu avamist, käivitamist,
  reegleid, mängijaid, võitja määramist, algoritme, jõudlust, mängu lõpu
  kasutajaliidest ning avaldamise linke.
- **Muudetud failid:** `README.md`.
- **Parandatud probleem:** Varasem dokumentatsioon ei rõhutanud piisavalt,
  et inimene kasutab vertikaalseid ja arvuti horisontaalseid klotse, ega
  sisaldanud eraldi GitHub Pagesi lingi kohta.

### 15. GitHub Pagesis avaldamine

- **Kasutatud viip:** „Tahan avaldada GitHub Pages näol. Kontrolli, et
  README oleks ajakohane ja avalik mäng töötaks.”
- **Tulemus:** Lisati `.github/workflows/deploy-pages.yml`, mis avaldab
  staatilised failid GitHub Pagesi kaudu. Avalik mäng töötab aadressil
  https://marcuspuust.github.io/Domineering-minimax/.
- **Muudetud failid:** `.github/workflows/deploy-pages.yml`, `README.md`.
- **Testimine:** Kontrolliti avalikku GitHub Pagesi URL-i ja kinnitati, et
  mängulaud, otsingumeetodi valik ja **New Game** nupp laadivad.
- **Parandatud probleem:** Esimene Pagesi töövoog vajati GitHubi Pagesi
  seadistuse aktiveerimist. Pärast **Settings → Pages → GitHub Actions**
  valimist avaldus leht õigel URL-il.

### 16. Valikute muutmine raadionuppudeks

- **Kasutatud viip:** „Muuda otsingumeetodi ja klotsisuuna rippmenüüd
  raadionuppudeks ning sobita need paremini kujundusega.”
- **Tulemus:** Otsingumeetodi ja inimese klotsisuuna valikud kuvatakse nüüd
  selgete raadionuppude rühmadena.
- **Muudetud failid:** `index.html`, `style.css`, `script.js`, `README.md`.
- **Testimine:** Kontrolliti, et mõlemad raadionupurühmad kuvatakse, otsingumeetod
  valitakse õigesti ning vertikaalne ja horisontaalne mängusuund töötavad.
- **Parandatud probleem:** Rippmenüüde vana JavaScripti viited asendati valitud
  raadionupu väärtuse lugemisega.
