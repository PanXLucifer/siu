// CRUD Portofolio Logic
const PORTOFOLIO_STORAGE_KEY = 'archihome_portofolio';

let portofolioList = [];
let editingIndex = null;

function loadPortofolio() {
  try {
    const portofolio = localStorage.getItem(PORTOFOLIO_STORAGE_KEY);
    portofolioList = portofolio ? JSON.parse(portofolio) : [];
  } catch (e) {
    portofolioList = [];
  }
}

function savePortofolio() {
  localStorage.setItem(PORTOFOLIO_STORAGE_KEY, JSON.stringify(portofolioList));
}

function renderPortofolioGrid() {
  const grid = document.getElementById('portofolioGrid');
  const badge = document.getElementById('portofolioCountBadge');
  
  if (!grid) return;

  if (portofolioList.length === 0) {
    grid.innerHTML = '<div class="col-12 text-center">Tidak ada data</div>';
  } else {
    grid.innerHTML = portofolioList.map((item, index) => `
      <div class="col-md-6 mb-4">
        <div class="card">
          <img src="${item.gambar || 'https://via.placeholder.com/400x300'}" class="card-img-top" alt="${item.judul}" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${item.judul}</h5>
            <p class="card-text text-muted">${item.lokasi}</p>
            <p class="card-text">${item.deskripsi}</p>
            <div class="btn-group">
              <button class="btn btn-sm btn-primary" onclick="editPortofolio(${index})">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn btn-sm btn-danger" onclick="deletePortofolio(${index})">
                <i class="fas fa-trash"></i> Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  if (badge) {
    badge.textContent = `${portofolioList.length} portofolio`;
  }
}

function resetForm() {
  document.getElementById('portofolioForm').reset();
  document.getElementById('portofolioId').value = '';
  editingIndex = null;
}

function editPortofolio(index) {
  const item = portofolioList[index];
  if (!item) return;

  editingIndex = index;
  document.getElementById('portofolioId').value = index;
  document.getElementById('judulPortofolio').value = item.judul || '';
  document.getElementById('lokasiPortofolio').value = item.lokasi || '';
  document.getElementById('deskripsiPortofolio').value = item.deskripsi || '';
  document.getElementById('gambarPortofolio').value = item.gambar || '';

  // Scroll to form
  document.getElementById('portofolioForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function deletePortofolio(index) {
  if (!confirm('Yakin ingin menghapus portofolio ini?')) return;

  portofolioList.splice(index, 1);
  savePortofolio();
  renderPortofolioGrid();
  resetForm();
}

document.addEventListener('DOMContentLoaded', function() {
  loadPortofolio();
  renderPortofolioGrid();

  const form = document.getElementById('portofolioForm');
  const resetBtn = document.getElementById('resetPortofolioBtn');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const judul = document.getElementById('judulPortofolio').value.trim();
      const lokasi = document.getElementById('lokasiPortofolio').value.trim();
      const deskripsi = document.getElementById('deskripsiPortofolio').value.trim();
      const gambar = document.getElementById('gambarPortofolio').value.trim();

      if (!judul || !lokasi || !deskripsi || !gambar) {
        alert('Semua field wajib diisi!');
        return;
      }

      const portofolioData = {
        judul,
        lokasi,
        deskripsi,
        gambar,
        createdAt: new Date().toISOString()
      };

      if (editingIndex !== null) {
        // Update
        portofolioList[editingIndex] = portofolioData;
      } else {
        // Create
        portofolioList.push(portofolioData);
      }

      savePortofolio();
      renderPortofolioGrid();
      resetForm();

      alert(editingIndex !== null ? 'Portofolio berhasil diupdate!' : 'Portofolio berhasil ditambahkan!');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetForm);
  }
});
// Make functions global for onclick handlers
window.editPortofolio = editPortofolio;
window.deletePortofolio = deletePortofolio;

