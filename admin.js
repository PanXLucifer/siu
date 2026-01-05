// Admin Dashboard Logic
const PAKET_STORAGE_KEY = 'archihome_paket';
const PEMESANAN_STORAGE_KEY = 'archihome_pemesanan';
const PORTOFOLIO_STORAGE_KEY = 'archihome_portofolio';

function getPaket() {
  try {
    const paket = localStorage.getItem(PAKET_STORAGE_KEY);
    return paket ? JSON.parse(paket) : [];
  } catch (e) {
    return [];
  }
}

function getPemesanan() {
  try {
    const pemesanan = localStorage.getItem(PEMESANAN_STORAGE_KEY);
    return pemesanan ? JSON.parse(pemesanan) : [];
  } catch (e) {
    return [];
  }
}

function getPortofolio() {
  try {
    const portofolio = localStorage.getItem(PORTOFOLIO_STORAGE_KEY);
    return portofolio ? JSON.parse(portofolio) : [];
  } catch (e) {
    return [];
  }
}

function getUsers() {
  try {
    const users = localStorage.getItem('archihome_users');
    return users ? JSON.parse(users) : [];
  } catch (e) {
    return [];
  }
}

// Update dashboard statistics
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('/admin/index.html')) {
    const paket = getPaket();
    const pemesanan = getPemesanan();
    const portofolio = getPortofolio();
    const users = getUsers();

    // Update stats
    document.getElementById('totalPaket').textContent = paket.length;
    document.getElementById('totalPemesanan').textContent = pemesanan.length;
    document.getElementById('totalPortofolio').textContent = portofolio.length;
    document.getElementById('totalUser').textContent = users.length;

    // Show recent pemesanan
    const recentPemesanan = pemesanan.slice(-5).reverse();
    const tbody = document.getElementById('recentPemesanan');
    if (tbody) {
      if (recentPemesanan.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Tidak ada data</td></tr>';
      } else {
        tbody.innerHTML = recentPemesanan.map((p, index) => `
          <tr>
            <td>${p.nama || '-'}</td>
            <td>${p.paket || '-'}</td>
            <td><span class="badge badge-info">Baru</span></td>
            <td>${new Date(p.tanggal || Date.now()).toLocaleDateString('id-ID')}</td>
          </tr>
        `).join('');
      }
    }
  }
});
