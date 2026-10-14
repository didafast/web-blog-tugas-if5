"use strict";

// Mobile navigation
const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Buka menu" : "Tutup menu");
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Buka menu");
      mainNav.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Buka menu");
      mainNav.classList.remove("is-open");
    }
  });
}

// Search and category filters work together.
const storyCards = Array.from(document.querySelectorAll(".story-card"));
const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));
const searchInput = document.querySelector("#story-search");
const emptyState = document.querySelector("#empty-state");
let activeCategory = "all";

function updateStories() {
  if (!storyCards.length) return;
  const query = searchInput ? searchInput.value.trim().toLocaleLowerCase("id") : "";
  let visibleCount = 0;

  storyCards.forEach((card) => {
    const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
    const searchableText = `${card.dataset.search || ""} ${card.textContent}`.toLocaleLowerCase("id");
    const matchesSearch = !query || searchableText.includes(query);
    const isVisible = matchesCategory && matchesSearch;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  if (emptyState) emptyState.hidden = visibleCount > 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.filter || "all";
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    updateStories();
  });
});

if (searchInput) searchInput.addEventListener("input", updateStories);

// Open the full sample posts in a native, keyboard accessible dialog.
const storyDialog = document.querySelector("#story-reader");
const dialogTitle = document.querySelector("#dialog-title");
const dialogCategory = document.querySelector("#dialog-category");
const dialogBody = document.querySelector("#dialog-body");
const dialogClose = document.querySelector(".dialog-close");
const stories = {
  mountain: {
    category: "PERJALANAN · 6 MENIT BACA",
    title: "Jalan pulang dari gunung: tentang berani berjalan pelan",
    paragraphs: [
      "Ada sesuatu yang berubah ketika kita mulai mendaki sebelum matahari terbit. Jalanan masih gelap, langkah pertama terasa berat, dan pikiran sibuk menghitung seberapa jauh lagi kita harus berjalan.",
      "Tapi lama-lama, suara langkah sendiri jadi lebih jelas daripada suara khawatir. Kita mulai memperhatikan hal kecil: udara dingin yang masuk ke paru-paru, teman yang menunggu di tikungan, dan warna langit yang pelan-pelan berganti.",
      "Pemandangan dari atas memang luar biasa. Meski begitu, yang paling kuingat justru perjalanan pulangnya. Kami melangkah pelan, saling mengingatkan untuk hati-hati, dan berhenti ketika perlu. Tidak ada yang meminta kami berlari.",
      "Mungkin hidup juga seperti itu. Sampai tujuan memang menyenangkan, tetapi cara kita berjalan dan orang-orang yang menemani sepanjang jalan juga pantas disyukuri."
    ]
  },
  "little-things": {
    category: "REFLEKSI · 4 MENIT BACA",
    title: "Hal-hal kecil yang ternyata penting",
    paragraphs: [
      "Belakangan ini aku mencoba memperhatikan hari dengan lebih pelan. Ternyata banyak hal baik tidak datang dengan suara besar. Kadang bentuknya cuma secangkir kopi yang masih hangat saat pagi terasa dingin.",
      "Ada juga pesan singkat dari rumah, obrolan sebentar sebelum kelas dimulai, atau langit sore yang kebetulan cantik di perjalanan pulang. Momen-momen ini biasanya lewat begitu saja kalau pikiranku sudah berlari ke urusan berikutnya.",
      "Aku belum selalu berhasil memperlambat diri. Tapi setiap kali ingat untuk berhenti sebentar, rasanya ada ruang baru untuk bernapas. Hal sederhana tidak menyelesaikan semua masalah, tapi mengingatkanku bahwa hari ini juga punya sesuatu yang baik."
    ]
  },
  learning: {
    category: "BELAJAR · 5 MENIT BACA",
    title: "Belajar web dari nol, satu baris demi satu baris",
    paragraphs: [
      "Pertama kali membuka file HTML, aku melihat banyak tanda kurung sudut dan belum tahu harus mulai dari mana. CSS terasa seperti daftar aturan yang panjang, sementara JavaScript seperti teka-teki yang jawabannya selalu kurang satu titik koma.",
      "Pelan-pelan aku sadar belajar web bukan soal langsung hafal semuanya. Aku mulai dari satu bagian: bikin judul, mengatur warna, lalu mencoba tombol kecil. Kalau tampilannya berantakan, aku cari tahu bagian mana yang perlu diperbaiki.",
      "Proyek sederhana ini salah satu hasil proses itu. Masih banyak yang bisa dikembangkan, tapi melihat halaman kosong berubah jadi sesuatu yang bisa dibuka dan dijelajahi rasanya menyenangkan. Satu baris kode memang kecil, tapi lama-lama bisa jadi tempat bercerita."
    ]
  }
};

if (storyDialog && dialogTitle && dialogCategory && dialogBody) {
  document.querySelectorAll("[data-story]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const story = stories[link.dataset.story];
      if (!story) return;
      event.preventDefault();
      dialogCategory.textContent = story.category;
      dialogTitle.textContent = story.title;
      dialogBody.replaceChildren(...story.paragraphs.map((paragraph) => {
        const element = document.createElement("p");
        element.textContent = paragraph;
        return element;
      }));
      storyDialog.showModal();
    });
  });

  if (dialogClose) dialogClose.addEventListener("click", () => storyDialog.close());
  storyDialog.addEventListener("click", (event) => {
    if (event.target === storyDialog) storyDialog.close();
  });
}

