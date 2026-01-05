// Frontend Script with Tailwind CSS
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Tahun di footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  // Validasi dan submit form pemesanan
  const form = document.getElementById("orderForm");
  const successMsg = document.getElementById("formSuccess");
  const PEMESANAN_STORAGE_KEY = 'archihome_pemesanan';

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let isValid = true;
      const requiredFields = ["nama", "whatsapp", "lokasi", "luas", "paket", "kebutuhan"];

      // Clear previous errors
      form.querySelectorAll('.error-msg').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
      });
      form.querySelectorAll('input, select, textarea').forEach(el => {
        el.classList.remove('border-red-500');
      });

      // Validate required fields
      requiredFields.forEach((id) => {
        const field = form.querySelector("#" + id);
        if (!field) return;
        
        const errorEl = field.parentElement.querySelector('.error-msg');

        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('border-red-500');
          if (errorEl) {
            errorEl.classList.remove('hidden');
            errorEl.textContent = "Bagian ini wajib diisi.";
          }
        }
      });

      // Validate email if provided
      const emailInput = form.querySelector("#email");
      if (emailInput && emailInput.value.trim()) {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
        if (!emailValid) {
          isValid = false;
          emailInput.classList.add('border-red-500');
          const errorEl = emailInput.parentElement.querySelector('.error-msg');
          if (errorEl) {
            errorEl.classList.remove('hidden');
            errorEl.textContent = "Format email tidak valid.";
          }
        }
      }

      if (!isValid) {
        // Scroll to first error
        const firstError = form.querySelector('.border-red-500');
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          firstError.focus();
        }
        return;
      }

      // Save to localStorage
      const pemesananData = {
        nama: form.querySelector("#nama").value.trim(),
        email: form.querySelector("#email").value.trim() || null,
        whatsapp: form.querySelector("#whatsapp").value.trim(),
        lokasi: form.querySelector("#lokasi").value.trim(),
        luas: form.querySelector("#luas").value.trim(),
        paket: form.querySelector("#paket").value,
        kebutuhan: form.querySelector("#kebutuhan").value.trim(),
        tanggal: new Date().toISOString(),
        status: 'baru'
      };

      try {
        const existingPemesanan = localStorage.getItem(PEMESANAN_STORAGE_KEY);
        const pemesananList = existingPemesanan ? JSON.parse(existingPemesanan) : [];
        pemesananList.push(pemesananData);
        localStorage.setItem(PEMESANAN_STORAGE_KEY, JSON.stringify(pemesananList));
      } catch (e) {
        console.error('Error saving pemesanan:', e);
      }

      // Reset form and show success
      form.reset();
      if (successMsg) {
        successMsg.classList.remove("hidden");
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          successMsg.classList.add("hidden");
        }, 5000);
      }

      // Optional: Show alert
      alert('Terima kasih! Data Anda sudah kami terima. Kami akan menghubungi Anda maksimal 1x24 jam.');
    });
  }
});
