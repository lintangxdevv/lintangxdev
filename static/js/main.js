const menu = document.querySelector('.menu');
const geser = document.querySelector('.geser');
const tabs = [...document.querySelectorAll('[data-tab]')];
const panels = [...document.querySelectorAll('.panel')];
const pilihan = document.querySelectorAll('[data-bukti]');
const bukti = document.querySelectorAll('.bukti');
let timer = null;
let tujuan = null;

function letakkanGeser(nama) {
  const tombol = tabs.find(t => t.dataset.tab === nama);
  if (!tombol) return;
  geser.style.width = tombol.offsetWidth + 'px';
  geser.style.transform = 'translateX(' + (tombol.offsetLeft - 5) + 'px)';
}

function bukaTab(nama, animasi) {
  const ke = document.getElementById(nama);
  if (!ke || !ke.classList.contains('panel')) return bukaTab('home', animasi);

  clearTimeout(timer);
  if (tujuan) {
    panels.forEach(p => {
      p.classList.remove('keluar', 'masuk');
      p.hidden = p.id !== tujuan;
    });
    tujuan = null;
  }

  tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.tab === nama));
  letakkanGeser(nama);

  const dari = panels.find(p => !p.hidden);
  if (dari === ke) return;

  if (!dari || !animasi) {
    panels.forEach(p => p.hidden = p !== ke);
    return;
  }

  const arah = tabs.findIndex(t => t.dataset.tab === nama) > tabs.findIndex(t => t.dataset.tab === dari.id) ? 1 : -1;
  dari.style.setProperty('--arah', arah);
  ke.style.setProperty('--arah', arah);
  dari.classList.add('keluar');
  tujuan = nama;

  timer = setTimeout(() => {
    dari.hidden = true;
    dari.classList.remove('keluar');
    ke.hidden = false;
    ke.classList.remove('masuk');
    void ke.offsetWidth;
    ke.classList.add('masuk');
    tujuan = null;
  }, 200);
}

function bukaBukti(nama) {
  bukti.forEach(b => {
    const aktif = b.id === nama;
    if (aktif && b.hidden) {
      b.hidden = false;
      b.classList.remove('tampil');
      void b.offsetWidth;
      b.classList.add('tampil');
    } else if (!aktif) {
      b.hidden = true;
    }
  });
  pilihan.forEach(p => p.setAttribute('aria-selected', p.dataset.bukti === nama));
}

tabs.forEach(t => t.addEventListener('click', () => {
  bukaTab(t.dataset.tab, true);
  location.hash = t.dataset.tab;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}));
pilihan.forEach(p => p.addEventListener('click', () => bukaBukti(p.dataset.bukti)));
window.addEventListener('hashchange', () => bukaTab(location.hash.slice(1), true));
window.addEventListener('resize', () => {
  const aktif = tabs.find(t => t.getAttribute('aria-selected') === 'true');
  if (aktif) letakkanGeser(aktif.dataset.tab);
});

let menunggu = false;
window.addEventListener('pointermove', e => {
  if (menunggu) return;
  menunggu = true;
  requestAnimationFrame(() => {
    document.body.style.setProperty('--x', e.clientX + 'px');
    document.body.style.setProperty('--y', e.clientY + 'px');
    menunggu = false;
  });
});

bukaTab(location.hash.slice(1) || 'home', false);
bukaBukti('prestasi');
window.addEventListener('load', () => {
  const aktif = tabs.find(t => t.getAttribute('aria-selected') === 'true');
  if (aktif) letakkanGeser(aktif.dataset.tab);
  requestAnimationFrame(() => menu.classList.remove('diam'));
});

document.querySelectorAll('.foto img').forEach(img => {
  const hilang = () => img.remove();
  const ada = () => img.parentElement.classList.add('ada');
  img.addEventListener('error', hilang);
  img.addEventListener('load', ada);
  if (img.complete) {
    if (img.naturalWidth) ada();
    else hilang();
  }
});

document.querySelectorAll('.logo-kecil').forEach(img => {
  const hilang = () => img.remove();
  img.addEventListener('error', hilang);
  if (img.complete && !img.naturalWidth) hilang();
});
