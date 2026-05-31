/* =========================================================
   SVETILIŠTE — PLEJER
   ---------------------------------------------------------
   Ovaj fajl je mozak plejera. Radi na SVAKOJ strani.
   Pamti koja pesma svira i gde je stala, pa kad otvoriš
   novu priču — nastavlja odatle (treba samo jednom kliknuti
   play jer browser ne da da zvuk krene sam od sebe).

   >>> DODAVANJE NOVE PESME <<<
   Samo dopiši jednu liniju u listu 'playlista' ispod
   i ubaci mp3 fajl u repo. Pesma se pojavi na celom sajtu.
   ========================================================= */

const playlista = [
  { naslov: "Creedence",          fajl: "creedence.mp3?v=3" },
  { naslov: "Sound of Silence",   fajl: "sound-of-silence.mp3" },
  { naslov: "Fake Plastic Trees", fajl: "Radiohead_-_Fake_Plastic_Trees.mp3" },
  { naslov: "How to Save a Life", fajl: "The_Fray_-_How_To_Save_A_Life__Official_Video_.mp3" }
];

/* ---------- ispod ovoga ne treba ništa da diraš ---------- */

// Plejer sam ubacuje svoj HTML u stranu, da ne moraš da ga lepiš svuda
(function ubaciPlejerHTML() {
  const div = document.createElement('div');
  div.className = 'music-player';
  div.innerHTML = `
    <div id="vinyl-icon" class="w-8 h-8 border-2 border-white/20 rounded-full flex items-center justify-center relative bg-zinc-900">
      <div class="w-2 h-2 bg-white rounded-full"></div>
      <div class="absolute inset-0 border border-white/5 rounded-full"></div>
    </div>
    <div class="flex flex-col">
      <span id="song-title" class="text-[10px] font-bold text-white leading-tight uppercase tracking-tighter"></span>
      <span id="player-status">Pritisni za ton</span>
    </div>
    <div class="flex items-center gap-2 ml-2 text-white">
      <div id="play-pause-icon" class="cursor-pointer hover:text-gray-300">
        <svg id="play-svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
        <svg id="pause-svg" class="w-5 h-5 hidden" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"></path></svg>
      </div>
      <div id="next-btn" class="cursor-pointer hover:text-gray-300">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653zM15 5a1 1 0 012 0v10a1 1 0 11-2 0V5z"/></svg>
      </div>
    </div>
    <audio id="bg-audio" preload="auto"></audio>
  `;
  document.body.appendChild(div);

  // CSS plejera (da ne moraš da ga držiš u svakom fajlu)
  const css = document.createElement('style');
  css.textContent = `
    .music-player{position:fixed;bottom:2rem;right:2rem;z-index:9999;background:rgba(18,18,18,.95);border:1px solid rgba(255,255,255,.1);padding:.75rem 1.25rem;border-radius:50px;display:flex;align-items:center;gap:.75rem;backdrop-filter:blur(10px);box-shadow:0 10px 40px rgba(0,0,0,.8);cursor:pointer;pointer-events:auto;}
    .vinyl-spin{animation:spin 3s linear infinite;}
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    #player-status{font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#666;}
  `;
  document.head.appendChild(css);
})();

const audio       = document.getElementById('bg-audio');
const vinylIcon   = document.getElementById('vinyl-icon');
const playSvg     = document.getElementById('play-svg');
const pauseSvg    = document.getElementById('pause-svg');
const statusText  = document.getElementById('player-status');
const songTitle   = document.getElementById('song-title');

let trenutnaPesma = 0;
let isPlaying     = false;

// Učitaj zapamćeno stanje sa prethodne strane
const sacuvanIndex = parseInt(localStorage.getItem('svet_pesma'));
const sacuvanoVreme = parseFloat(localStorage.getItem('svet_vreme'));
if (!isNaN(sacuvanIndex) && playlista[sacuvanIndex]) {
  trenutnaPesma = sacuvanIndex;
}

audio.src = playlista[trenutnaPesma].fajl;
songTitle.innerText = playlista[trenutnaPesma].naslov;

// Vrati pesmu na sekundu na kojoj je stala
audio.addEventListener('loadedmetadata', function() {
  if (!isNaN(sacuvanoVreme) && sacuvanoVreme < audio.duration) {
    audio.currentTime = sacuvanoVreme;
  }
}, { once: true });

// Pamti poziciju dok svira, da je druga strana može pokupiti
audio.addEventListener('timeupdate', function() {
  localStorage.setItem('svet_pesma', trenutnaPesma);
  localStorage.setItem('svet_vreme', audio.currentTime);
});

function prikaziSvira() {
  playSvg.classList.add('hidden');
  pauseSvg.classList.remove('hidden');
  vinylIcon.classList.add('vinyl-spin');
  statusText.innerText = "Slušaš";
  isPlaying = true;
}
function prikaziPauza() {
  playSvg.classList.remove('hidden');
  pauseSvg.classList.add('hidden');
  vinylIcon.classList.remove('vinyl-spin');
  isPlaying = false;
}

function toggleMuzika() {
  if (!isPlaying) {
    statusText.innerText = "Učitavam...";
    const p = audio.play();
    if (p !== undefined) {
      p.then(prikaziSvira).catch(err => {
        statusText.innerText = "Nedostaje fajl";
        console.error("Audio error:", err);
        isPlaying = false;
      });
    }
  } else {
    audio.pause();
    prikaziPauza();
    statusText.innerText = "Pauzirano";
  }
}

function sledecaPesma() {
  trenutnaPesma = (trenutnaPesma + 1) % playlista.length;
  audio.src = playlista[trenutnaPesma].fajl;
  songTitle.innerText = playlista[trenutnaPesma].naslov;
  localStorage.setItem('svet_pesma', trenutnaPesma);
  localStorage.setItem('svet_vreme', 0);
  statusText.innerText = "Učitavam...";
  audio.play().then(prikaziSvira).catch(() => { statusText.innerText = "Greška"; });
}

audio.addEventListener('ended', sledecaPesma);

// Klikovi
vinylIcon.addEventListener('click', toggleMuzika);
songTitle.parentElement.addEventListener('click', toggleMuzika);
document.getElementById('play-pause-icon').addEventListener('click', toggleMuzika);
document.getElementById('next-btn').addEventListener('click', function(e){ e.stopPropagation(); sledecaPesma(); });
