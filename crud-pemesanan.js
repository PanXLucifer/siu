// CRUD Pemesanan Logic
const PEMESANAN_STORAGE_KEY = 'archihome_pemesanan';

function loadPemesanan() {
  try {
    const pemesanan = localStorage.getItem(PEMESANAN_STORAGE_KEY);
    return pemesanan ? JSON.parse(pemesanan) : [];
  } catch (e) {
    return [];
  }
}

function renderPemesananTable() {
  const tbody = document.getElementById('pemesananTableBody');
  if (!tbody) return;

  const pemesanan = loadPemesanan();

  if (pemesanan.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center">Tidak ada data</td></tr>';
  } else {
    tbody.innerHTML = pemesanan.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.nama || '-'}</td>
        <td>${item.email || '-'}</td>
        <td>${item.whatsapp || '-'}</td>
        <td>${item.paket || '-'}</td>
        <td>${item.lokasi || '-'}</td>
        <td><span class="badge badge-info">Baru</span></td>
        <td>${new Date(item.tanggal || Date.now()).toLocaleDateString('id-ID')}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-info" onclick="viewPemesanan(${index})" title="Lihat Detail">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deletePemesanan(${index})" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }
}

function viewPemesanan(index) {
  const pemesanan = loadPemesanan();
  const item = pemesanan[index];
  if (!item) return;

  const detail = `
Nama: ${item.nama}
Email: ${item.email || '-'}
WhatsApp: ${item.whatsapp}
Lokasi: ${item.lokasi}
Luas Tanah: ${item.luas || '-'}
Paket: ${item.paket}
Kebutuhan: ${item.kebutuhan || '-'}
  `;

  alert(detail);
}

function deletePemesanan(index) {
  if (!confirm('Yakin ingin menghapus pemesanan ini?')) return;

  const pemesanan = loadPemesanan();
  pemesanan.splice(index, 1);
  localStorage.setItem(PEMESANAN_STORAGE_KEY, JSON.stringify(pemesanan));
  renderPemesananTable();
}

document.addEventListener('DOMContentLoaded', function() {
  renderPemesananTable();
});

// Make functions global for onclick handlers
window.viewPemesanan = viewPemesanan;
window.deletePemesanan = deletePemesanan;
