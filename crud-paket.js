// CRUD Paket Logic
const PAKET_STORAGE_KEY = 'archihome_paket';

let paketList = [];
let editingIndex = null;

function loadPaket() {
  try {
    const paket = localStorage.getItem(PAKET_STORAGE_KEY);
    paketList = paket ? JSON.parse(paket) : [];
  } catch (e) {
    paketList = [];
  }
}

function savePaket() {
  localStorage.setItem(PAKET_STORAGE_KEY, JSON.stringify(paketList));
}

function renderPaketTable() {
  const tbody = document.getElementById('paketTableBody');
  const badge = document.getElementById('paketCountBadge');
  
  if (!tbody) return;

  if (paketList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada data</td></tr>';
  } else {
    tbody.innerHTML = paketList.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>
          ${item.gambar ? `<img src="${item.gambar}" alt="${item.nama}" class="img-thumbnail" style="width: 60px; height: 60px; object-fit: cover;">` : '<span class="text-muted">No Image</span>'}
        </td>
        <td>${item.nama}</td>
        <td>Rp ${Number(item.harga || 0).toLocaleString('id-ID')}</td>
        <td>${item.deskripsi}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-primary" onclick="editPaket(${index})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deletePaket(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  if (badge) {
    badge.textContent = `${paketList.length} paket`;
  }
}

function resetForm() {
  document.getElementById('paketForm').reset();
  document.getElementById('paketId').value = '';
  editingIndex = null;
}

function editPaket(index) {
  const item = paketList[index];
  if (!item) return;

  editingIndex = index;
  document.getElementById('paketId').value = index;
  document.getElementById('namaPaket').value = item.nama || '';
  document.getElementById('hargaPaket').value = item.harga || '';
  document.getElementById('deskripsiPaket').value = item.deskripsi || '';
  document.getElementById('gambarPaket').value = item.gambar || '';

  // Scroll to form
  document.getElementById('paketForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function deletePaket(index) {
  if (!confirm('Yakin ingin menghapus paket ini?')) return;

  paketList.splice(index, 1);
  savePaket();
  renderPaketTable();
  resetForm();
}

document.addEventListener('DOMContentLoaded', function() {
  loadPaket();
  renderPaketTable();

  const form = document.getElementById('paketForm');
  const resetBtn = document.getElementById('resetPaketBtn');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const nama = document.getElementById('namaPaket').value.trim();
      const harga = document.getElementById('hargaPaket').value.trim();
      const deskripsi = document.getElementById('deskripsiPaket').value.trim();
      const gambar = document.getElementById('gambarPaket').value.trim();

      if (!nama || !harga || !deskripsi) {
        alert('Semua field wajib diisi!');
        return;
      }

      const paketData = {
        nama,
        harga: Number(harga),
        deskripsi,
        gambar: gambar || null,
        createdAt: new Date().toISOString()
      };

      if (editingIndex !== null) {
        // Update
        paketList[editingIndex] = paketData;
      } else {
        // Create
        paketList.push(paketData);
      }

      savePaket();
      renderPaketTable();
      resetForm();

      alert(editingIndex !== null ? 'Paket berhasil diupdate!' : 'Paket berhasil ditambahkan!');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetForm);
  }
});
// Make functions global for onclick handlers
window.editPaket = editPaket;
window.deletePaket = deletePaket;

