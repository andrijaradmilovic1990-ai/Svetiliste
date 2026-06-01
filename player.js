/* =========================================================
   SVETILIŠTE — PLEJER
   ---------------------------------------------------------
   Ovaj fajl je mozak plejera. Radi na SVAKOJ strani.
   Pamti koja pesma svira i gde je stala, pa kad otvoriš
   novu priču — nastavlja odatle (treba samo jednom kliknuti
   play jer browser ne da da zvuk krene sam od sebe).

   >>> DODAVANJE NOVE PESME <<<
   Samo dopiši jednu liniju u listu 'playlista' ispod
   i ubaci mp3 fajl u repo. Pesma se pojavi na celom sajtu —
   i u plejeru i u listi pesama.

   >>> LISTA PESAMA <<<
   Klik na strelicu (gore) otvara listu svih pesama.
   Klik na pesmu — pušta je odmah.
   ========================================================= */

const playlista = [
  { naslov: "Creedence",            fajl: "creedence.mp3?v=3" },
  { naslov: "Sound of Silence",     fajl: "sound-of-silence.mp3" },
  { naslov: "Fake Plastic Trees",   fajl: "Radiohead_-_Fake_Plastic_Trees.mp3" },
  { naslov: "How to Save a Life",   fajl: "The_Fray_-_How_To_Save_A_Life__Official_Video_.mp3" },
  { naslov: "House of the Rising Sun", fajl: "house-of-the-rising-sun.mp3" },
  { naslov: "Into My Arms",         fajl: "into-my-arms.mp3" },
  { naslov: "Roads",                fajl: "portishead-roads.mp3" },
  { naslov: "Tom Traubert's Blues", fajl: "tom-traubert.mp3" },
  { naslov: "Hurt",                 fajl: "johnny-cash-hurt.mp3" }
];

/* ---------- ispod ovoga ne treba ništa da diraš ---------- */

// Plejer sam ubacuje svoj HTML u stranu, da ne moraš da ga lepiš svuda
(function ubaciPlejerHTML() {
  const div = document.createElement('div');
  div.className = 'music-player-wrap';
  div.innerHTML = `
    <div id="playlist-panel" class="playlist-panel hidden">
      <div class="playlist-head">PESME</div>
      <div id="playlist-items"></div>
    </div>
    <div class="music-player">
      <div id="vinyl-icon" class="w-8 h-8 border-2 border-white/20 rounded-full flex items-center justify-center relative bg-zinc-900">
        <div class="w-2 h-2 bg-white rounded-full"></div>
        <div class="absolute inset-0 border border-white/5 rounded-full"></div>
      </div>
      <div class="flex flex-col">
        <span id="song-title" class="text-[10px] font-bold text-white leading-tight uppercase tracking-tighter"></span>
        <span id="player-status">Pritisni za ton</span>
      </div>
      <div class="flex items-center gap-2 ml-2 text-white">
        <div id="list-btn" class="cursor-pointer hover:text-gray-300" title="Lista pesama">
          <svg id="list-svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z"/></svg>
        </div>
        <div id="play-pause-icon" class="cursor-pointer hover:text-gray-300">
          <svg id="play-svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
          <svg id="pause-svg" class="w-5 h-5 hidden" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"></path></svg>
        </div>
        <div id="next-btn" class="cursor-pointer hover:text-gray-300">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653zM15 5a1 1 0 012 0v10a1 1 0 11-2 0V5z"/></svg>
        </div>
      </div>
      <audio id="bg-audio" preload="auto"></audio>
    </div>
  `;
  document.body.appendChild(div);

  // CSS plejera (da ne moraš da ga držiš u svakom fajlu)
  const css = document.createElement('style');
  css.textContent = `
    .music-player-wrap{position:fixed;bottom:2rem;right:2rem;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:.5rem;}
    .music-player{background:rgba(18,18,18,.95);border:1px solid rgba(255,255,255,.1);padding:.75rem 1.25rem;border-radius:50px;display:flex;align-items:center;gap:.75rem;backdrop-filter:blur(10px);box-shadow:0 10px 40px rgba(0,0,0,.8);cursor:pointer;pointer-events:auto;}
    .vinyl-spin{animation:spin 3s linear infinite;}
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    #player-status{font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#666;}
    .playlist-panel{background:rgba(18,18,18,.97);border:1px solid rgba(255,255,255,.1);border-radius:18px;backdrop-filter:blur(10px);box-shadow:0 10px 40px rgba(0,0,0,.8);overflow:hidden;min-width:220px;max-height:280px;overflow-y:auto;}
    .playlist-panel.hidden{display:none;}
    .playlist-head{font-size:9px;text-transform:uppercase;letter-spacing:.15em;color:#666;padding:.75rem 1.25rem .4rem;}
    .playlist-item{padding:.55rem 1.25rem;font-size:12px;color:#bbb;cursor:pointer;display:flex;align-items:center;gap:.5rem;border-top:1px solid rgba(255,255,255,.04);transition:background .15s,color .15s;}
    .playlist-item:hover{background:rgba(255,255,255,.06);color:#fff;}
    .playlist-item.active{color:#fff;font-weight:700;}
    .playlist-item .dot{width:6px;height:6px;border-radius:50%;background:transparent;flex:none;}
    .playlist-item.active .dot{background:#fff;}
  `;
  document.head.appendChild(css);
})();

const audio       = document.getElementById('bg-audio');
const vinylIcon   = document.getElementById('vinyl-icon');
const playSvg     = document.getElementById('play-svg');
const pauseSvg    = document.getElementById('pause-svg');
const statusText  = document.getElementById('player-status');
const songTitle   = document.getElementById('song-title');
const panel       = document.getElementById('playlist-panel');
const panelItems  = document.getElementById('playlist-items');

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

// Napravi listu pesama u panelu
function nacrtajListu() {
  panelItems.innerHTML = '';
  playlista.forEach((pesma, i) => {
    const item = document.createElement('div');
    item.className = 'playlist-item' + (i === trenutnaPesma ? ' active' : '');
    item.innerHTML = `<span class="dot"></span><span>${pesma.naslov}</span>`;
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      pustiPesmu(i);
    });
    panelItems.appendChild(item);
  });
}
nacrtajListu();

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

// Pusti pesmu po indexu (iz liste ili preko next-a)
function pustiPesmu(i) {
  trenutnaPesma = ((i % playlista.length) + playlista.length) % playlista.length;
  audio.src = playlista[trenutnaPesma].fajl;
  songTitle.innerText = playlista[trenutnaPesma].naslov;
  localStorage.setItem('svet_pesma', trenutnaPesma);
  localStorage.setItem('svet_vreme', 0);
  statusText.innerText = "Učitavam...";
  nacrtajListu();
  audio.play().then(prikaziSvira).catch(() => { statusText.innerText = "Greška"; });
}

function sledecaPesma() {
  pustiPesmu(trenutnaPesma + 1);
}

function toggleLista() {
  panel.classList.toggle('hidden');
}

audio.addEventListener('ended', sledecaPesma);

// Klikovi
vinylIcon.addEventListener('click', toggleMuzika);
songTitle.parentElement.addEventListener('click', toggleMuzika);
document.getElementById('play-pause-icon').addEventListener('click', toggleMuzika);
document.getElementById('next-btn').addEventListener('click', function(e){ e.stopPropagation(); sledecaPesma(); });
document.getElementById('list-btn').addEventListener('click', function(e){ e.stopPropagation(); toggleLista(); });
