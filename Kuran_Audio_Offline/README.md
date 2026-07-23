# Kur'an Audio Offline - Moderna PWA Aplikacija 📖🎧

Vrhunska, responzivna i modernizovana **PWA (Progressive Web App)** aplikacija za slušanje učenja Kur'ana Časnog u MP3 formatu sa **100% OFFLINE** radom na mobilnim telefonima, tabletima i računarima.

---

## 🌟 Glavne Karakteristike:

1. **Smirujući & Premium Dizajn**:
   - Duboka tamnozelena pozadina (`#0d3c26`), zlatni akcenti (`#d4af37`), prljavo-bijela pozadina za čitanje, zaobljene ivice i meke sjenke po uzoru na aplikaciju "99 Allahovih Imena".
   - Elegantni arapski kaligrafski prikazi sa `Amiri` i `Outfit` tipografijom.

2. **Responzivni Split-Screen Plejer**:
   - **Desktop**: Lijeve strane fiksna lista sa svih 114 sura, brzim pretraživanjem i filterima (Mekka/Medina/Omiljene). Desne strane visoko-funkcionalan audio plejer sa kontrolom brzine, ponavljanjem (loop), premotavanjem, izborom učača i offline alatom.
   - **Mobile**: Lista preko cijelog ekrana sa ljepljivim mini-plejerom na dnu koji omogućava pretraživanje tokom slušanja, te punim overlay plejerom na dodir.

3. **100% Offline PWA & Service Worker**:
   - Automatsko keširanje svih HTML, CSS, JS i MP3 zvučnih zapisa u pretraživač.
   - Integrisana podrška za puštanje lokalnih MP3 fajlova iz foldera `audio/` (`001.mp3`, `002.mp3`, ... `114.mp3`).
   - Mogućnost otvaranja i puštanja vlastitih MP3 fajlova sa uređaja.

4. **Samostalni Paket za WhatsApp**:
   - `Kuran_Audio_Offline.html` – Jedinstveni fajl sa ugrađenim svim resursima spreman za direktno slanje preko WhatsApp-a ili otvaranje bez instalacije.

---

## 📁 Struktura Projekta:

```text
Kuran_Audio_Offline/
├── index.html                   # Glavna PWA aplikacija
├── Kuran_Audio_Offline.html     # Samostalni HTML fajl pogodan za WhatsApp
├── manifest.json                # PWA Manifest specifikacija
├── sw.js                        # Service Worker za offline keširanje
├── surahs.json                  # Baza podataka sa 114 sura (Arapski, Transkripcija, Prevod, Broj ajeta)
├── icon.svg                     # Vektorska ikona aplikacije sa zlatnom kaligrafijom
├── audio/                       # Folder za lokalne MP3 snimke (001.mp3 - 114.mp3)
│   └── README.md                # Uputstvo za dodavanje i preuzimanje MP3 snimaka
└── README.md                    # Dokumentacija projekta
```

---

## 🚀 Objavljivanje na GitHub Pages (`asketron-corp`):

Aplikaciju možete sinhronizovati i objaviti na Vašem nalogu `asketron-corp`:

1. Inicijalizujte Git repozitorijum (ako već nije inicijalizovan u sklopu projekta):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Kuran Audio Offline PWA"
   ```
2. Povežite sa GitHub repozitorijumom:
   ```bash
   git remote add origin https://github.com/asketron-corp/Kuran_Audio_Offline.git
   git branch -M main
   git push -u origin main
   ```
3. U postavkama repozitorijuma na GitHub-u (**Settings -> Pages**), izaberite `main` granu za objavljivanje.
4. Vaša aplikacija će biti dostupna na linku: `https://asketron-corp.github.io/Kuran_Audio_Offline/`

---

## 🎧 Učači i Zvučni Zapisi:

Aplikacija dolazi sa podrškom za zvanične online recitacije vrhunskih učača:
- **Mishary Rashid Alafasy**
- **Abdul Basit Abdul Samad**
- **Saad Al-Ghamdi**
- **Mohamed Siddiq El-Minshawi**
- **Lokalni MP3 snimci** (`./audio/001.mp3` do `./114.mp3`)
