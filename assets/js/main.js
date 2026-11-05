/**
 * Merdiye Hocam - LGS Matematik Web Platformu
 * Ana JavaScript Mantığı & Etkileşim Motoru
 * Kurallar: Axiom Zero Bloat, Katı O(1)/O(n) Algoritma, İçsel Emniyet (No NaN, No Crash)
 * Tasarım: Beyaz & Lila Modern Eğitim Estetiği
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. PDF Kataloğu Veri Havuzu (Dahili Fallback & O(1) Indeksleme)
  const PDF_CATALOG = [
    {
      id: "pdf-01",
      unit: "1. Ünite",
      term: "1. Dönem",
      category: "term1",
      title: "Çarpanlar ve Katlar & EBOB - EKOK",
      subtitle: "Asal Çarpanlara Ayırma, Aralarında Asallık ve Yeni Nesil Problemler",
      difficulty: "Temel - Orta - Sınav Ayarı",
      filename: "01_Carpanlar_ve_Katlar_EBOB_EKOK.pdf",
      fileUrl: "assets/pdf/01_Carpanlar_ve_Katlar_EBOB_EKOK.pdf",
      fileSize: "105 KB",
      badge: "MEB Kazanım Uyumlu",
      popular: true,
      topics: ["Asal Çarpanlar", "EBOB", "EKOK", "Aralarında Asal", "Bölünebilme"]
    },
    {
      id: "pdf-02",
      unit: "1. Ünite",
      term: "1. Dönem",
      category: "term1",
      title: "Üslü İfadeler ve Bilimsel Gösterim",
      subtitle: "Negatif Üs, Üslü Sayılarda Çarpma/Bölme, Çözümleme ve Bilimsel Gösterim",
      difficulty: "Yeni Nesil Mantık & Muhakeme",
      filename: "02_Uslu_Ifadeler_Hap_Bilgiler_ve_Sorular.pdf",
      fileUrl: "assets/pdf/02_Uslu_Ifadeler_Hap_Bilgiler_ve_Sorular.pdf",
      fileSize: "105 KB",
      badge: "Çok Çıkan Konu",
      popular: true,
      topics: ["Negatif Üs", "Üssün Üssü", "Çözümleme", "Bilimsel Gösterim", "Basamak Sayısı"]
    },
    {
      id: "pdf-03",
      unit: "2. Ünite",
      term: "1. Dönem",
      category: "term1",
      title: "Kareköklü İfadeler & Yaklaşık Değer",
      subtitle: "Tam Kareler, a√b Yazımı, Köklü Sayılarda 4 İşlem ve Gerçek Sayılar",
      difficulty: "LGS Standart & Üst Seviye",
      filename: "03_Karekoklu_Ifadeler_Yeni_Nesil.pdf",
      fileUrl: "assets/pdf/03_Karekoklu_Ifadeler_Yeni_Nesil.pdf",
      fileSize: "105 KB",
      badge: "LGS Banko 3 Soru",
      popular: true,
      topics: ["Tam Kare Sayılar", "Yaklaşık Değer", "a√b Yazımı", "Kökten Kurtarma", "Gerçek Sayılar"]
    },
    {
      id: "pdf-04",
      unit: "2. Ünite",
      term: "1. Dönem",
      category: "term1",
      title: "Veri Analizi & Grafik Dönüşümleri",
      subtitle: "Çizgi, Sütun ve Daire Grafikleri Arası Dönüşüm & Merkez Açı Orantısı",
      difficulty: "Grafik Okuma & Yorumlama",
      filename: "04_Veri_Analizi_Grafik_Yorumlama.pdf",
      fileUrl: "assets/pdf/04_Veri_Analizi_Grafik_Yorumlama.pdf",
      fileSize: "104 KB",
      badge: "Kolay Net Fırsatı",
      popular: false,
      topics: ["Daire Grafiği", "Sütun Grafiği", "Çizgi Grafiği", "Merkez Açı", "Oran-Orantı"]
    },
    {
      id: "pdf-05",
      unit: "3. Ünite",
      term: "1. Dönem",
      category: "term1",
      title: "Basit Olayların Olma Olasılığı",
      subtitle: "Olası Durumlar, İstenen Olay, Kesin & İmkansız Olay ve Olasılık Hesabı",
      difficulty: "Yeni Nesil Kurgulu Sorular",
      filename: "05_Basit_Olaylarin_Olma_Olasiligi.pdf",
      fileUrl: "assets/pdf/05_Basit_Olaylarin_Olma_Olasiligi.pdf",
      fileSize: "104 KB",
      badge: "MEB Soru Formatı",
      popular: false,
      topics: ["Olası Durumlar", "İstenen Olay", "Kesin Olay", "İmkansız Olay", "Eş Olasılık"]
    },
    {
      id: "pdf-06",
      unit: "3. Ünite",
      term: "1. Dönem",
      category: "term1",
      title: "Cebirsel İfadeler ve Özdeşlikler",
      subtitle: "İki Kare Farkı, Tam Kare Özdeşlikleri ve Geometrik Alan Modelleme",
      difficulty: "LGS Banko 2 Soru",
      filename: "06_Cebirsel_Ifadeler_ve_Ozdeslikler.pdf",
      fileUrl: "assets/pdf/06_Cebirsel_Ifadeler_ve_Ozdeslikler.pdf",
      fileSize: "104 KB",
      badge: "Altın Konu",
      popular: true,
      topics: ["(a+b)²", "(a-b)²", "a²-b²", "Ortak Çarpan", "Geometrik Modelleme"]
    },
    {
      id: "pdf-07",
      unit: "4. Ünite",
      term: "2. Dönem",
      category: "term2",
      title: "Doğrusal Denklemler & Eğim",
      subtitle: "Koordinat Sistemi, Doğru Grafikleri, Eğim (m = dikey/yatay) ve Problemler",
      difficulty: "Analitik & Grafik Becerisi",
      filename: "07_Dogrusal_Denklemler_ve_Egim.pdf",
      fileUrl: "assets/pdf/07_Dogrusal_Denklemler_ve_Egim.pdf",
      fileSize: "104 KB",
      badge: "LGS 2. Dönem",
      popular: true,
      topics: ["Koordinat Sistemi", "Doğru Grafiği", "Eğim Hesabı", "Rampa Soruları", "Doğrusal İlişki"]
    },
    {
      id: "pdf-08",
      unit: "4. Ünite",
      term: "2. Dönem",
      category: "term2",
      title: "Eşitsizlikler ve Sayı Doğrusu",
      subtitle: "Eşitsizliklerin Çözümü, Sayı Doğrusunda Gösterim ve Günlük Hayat Problemleri",
      difficulty: "LGS Yeni Nesil Mantık",
      filename: "08_Esitsizlikler_Soru_Foyu.pdf",
      fileUrl: "assets/pdf/08_Esitsizlikler_Soru_Foyu.pdf",
      fileSize: "104 KB",
      badge: "Tuzak Sorular",
      popular: false,
      topics: ["Eşitsizlik Sembolleri", "Negatif Çarpım Kuralı", "Sayı Doğrusu", "Tarife Problemleri"]
    },
    {
      id: "pdf-09",
      unit: "5. Ünite",
      term: "2. Dönem",
      category: "term2",
      title: "Üçgenler ve Yardımcı Elemanlar",
      subtitle: "Kenarortay, Açıortay, Yükseklik, Üçgen Eşitsizliği ve Açı-Kenar Bağıntıları",
      difficulty: "Geometrik Çizim & Kurgu",
      filename: "09_Ucgenler_ve_Bagintilar.pdf",
      fileUrl: "assets/pdf/09_Ucgenler_ve_Bagintilar.pdf",
      fileSize: "104 KB",
      badge: "Geometri Temeli",
      popular: false,
      topics: ["Kenarortay", "Açıortay", "Yükseklik", "Üçgen Eşitsizliği", "Açı-Kenar İlişkisi"]
    },
    {
      id: "pdf-10",
      unit: "5. Ünite",
      term: "2. Dönem",
      category: "term2",
      title: "Pisagor Bağıntısı ve Özel Üçgenler",
      subtitle: "Dik Üçgende a²+b²=c², Özel Dik Üçgenler (3-4-5, 5-12-13, 8-15-17) ve Katlama",
      difficulty: "LGS Sınav Favorisi",
      filename: "10_Pisagor_Bagintisi_ve_Ozel_Ucgenler.pdf",
      fileUrl: "assets/pdf/10_Pisagor_Bagintisi_ve_Ozel_Ucgenler.pdf",
      fileSize: "105 KB",
      badge: "En Çok Soru Çıkan",
      popular: true,
      topics: ["Pisagor Bağıntısı", "3-4-5 Üçgeni", "5-12-13", "8-15-17", "7-24-25", "Merdiven Soruları"]
    },
    {
      id: "pdf-11",
      unit: "5. Ünite",
      term: "2. Dönem",
      category: "term2",
      title: "Eşlik ve Benzerlik Kuralları",
      subtitle: "Benzerlik Oranı (k), Çevreler Oranı (k), Alanlar Oranı (k²) ve Gölge Soruları",
      difficulty: "Yeni Nesil Şekil Modelleme",
      filename: "11_Eslik_ve_Benzerlik.pdf",
      fileUrl: "assets/pdf/11_Eslik_ve_Benzerlik.pdf",
      fileSize: "104 KB",
      badge: "Şekil Yorumlama",
      popular: false,
      topics: ["Eşlik Sembolü", "Benzerlik Oranı k", "Çevre Oranı", "Alan Oranı k²", "Ölçek"]
    },
    {
      id: "pdf-12",
      unit: "6. Ünite",
      term: "2. Dönem",
      category: "term2",
      title: "Geometrik Cisimler (Prizma, Silindir, Koni)",
      subtitle: "Dik Prizmalar, Silindirin Açınımı, Alan & Hacim, Dik Piramit ve Koni Bağıntısı",
      difficulty: "3 Boyutlu Düşünme & Sınav Soruları",
      filename: "12_Geometrik_Cisimler.pdf",
      fileUrl: "assets/pdf/12_Geometrik_Cisimler.pdf",
      fileSize: "105 KB",
      badge: "LGS Son Ünite",
      popular: false,
      topics: ["Prizmalar", "Silindir Açınımı", "Yanal Alan 2πrh", "Hacim πr²h", "Koni r/l=α/360"]
    },
    {
      id: "pdf-13",
      unit: "Tüm Konular",
      term: "Genel Tekrar",
      category: "summary",
      title: "LGS Matematik Altın Formüller & Sınav Taktikleri",
      subtitle: "8. Sınıf Müfredatının Eksiksiz Formül Özeti, Hızlı Çözüm İpuçları ve Zaman Yönetimi",
      difficulty: "Tüm Öğrenciler İçin Başvuru",
      filename: "13_LGS_Matematik_Altin_Formuller_Kitapcigi.pdf",
      fileUrl: "assets/pdf/13_LGS_Matematik_Altin_Formuller_Kitapcigi.pdf",
      fileSize: "106 KB",
      badge: "⭐ EN ÇOK İNDİRİLEN",
      popular: true,
      topics: ["Tüm Formüller", "Hızlı Taktikler", "Süre Yönetimi", "Turlama Tekniği", "Hap Notlar"]
    },
    {
      id: "pdf-14",
      unit: "Genel Deneme",
      term: "Deneme Sınavı",
      category: "trial",
      title: "LGS Matematik Yeni Nesil Pro Deneme - 1",
      subtitle: "MEB Sınav Formatına %100 Uyumlu, Beceri Temelli 20 Soru & Ayrıntılı Cevap Anahtarı",
      difficulty: "LGS Gerçek Sınav Provası",
      filename: "14_LGS_Matematik_Yeni_Nesil_Pro_Deneme_1.pdf",
      fileUrl: "assets/pdf/14_LGS_Matematik_Yeni_Nesil_Pro_Deneme_1.pdf",
      fileSize: "104 KB",
      badge: "🔥 2025/2026 PROVA",
      popular: true,
      topics: ["20 Yeni Nesil Soru", "Cevap Anahtarı", "Optik Form Rehberi", "Net Skalası", "MEB Uyum"]
    }
  ];

  let activeCatalog = [...PDF_CATALOG];

  // DOM Elements
  const pdfGrid = document.getElementById("pdfGrid");
  const pdfSearchInput = document.getElementById("pdfSearchInput");
  const filterTabs = document.querySelectorAll(".filter-tab");
  const pdfCountBadge = document.getElementById("pdfCountBadge");
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  const modalOverlay = document.getElementById("pdfModal");
  const modalClose = document.getElementById("modalClose");
  const toastContainer = document.getElementById("toastContainer");

  let currentCategory = "all";
  let searchQuery = "";

  // 2. Dynamic Fetch & Sync with Server or LocalStorage
  async function syncCatalog() {
    try {
      const res = await fetch("/api/pdfs");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          activeCatalog = data.map(item => ({
            ...item,
            fileUrl: item.file_url || item.fileUrl || `assets/pdf/${item.filename}`,
            fileSize: item.file_size || item.fileSize || "105 KB"
          }));
          renderPDFs();
          return;
        }
      }
    } catch (e) {
      // Offline or static fallback
    }

    // Static GitHub Pages fallback
    try {
      const resJson = await fetch("assets/data/pdfs.json");
      if (resJson.ok) {
        const data = await resJson.json();
        if (Array.isArray(data) && data.length > 0) {
          activeCatalog = data.map(item => ({
            ...item,
            fileUrl: item.file_url || item.fileUrl || `assets/pdf/${item.filename}`,
            fileSize: item.file_size || item.fileSize || "105 KB"
          }));
          renderPDFs();
          return;
        }
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem("merdiye_custom_pdfs");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          activeCatalog = parsed;
          renderPDFs();
        }
      }
    } catch (e) {}
  }

  // 3. Visitor Ping
  function pingVisitor() {
    try {
      fetch("/api/analytics/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: window.location.pathname, referrer: document.referrer })
      }).catch(() => {});
    } catch (e) {}
  }

  // 4. PDF Rendering Engine (O(N) Filtreleme)
  function renderPDFs() {
    if (!pdfGrid) return;

    const query = searchQuery.trim().toLowerCase();
    const filtered = activeCatalog.filter(item => {
      const matchCat =
        currentCategory === "all" ? true :
        currentCategory === "popular" ? item.popular :
        item.category === currentCategory;

      if (!matchCat) return false;

      if (!query) return true;
      const titleMatch = (item.title || "").toLowerCase().includes(query);
      const subMatch = (item.subtitle || "").toLowerCase().includes(query);
      const unitMatch = (item.unit || "").toLowerCase().includes(query);
      const topicMatch = Array.isArray(item.topics) && item.topics.some(t => t.toLowerCase().includes(query));
      return titleMatch || subMatch || unitMatch || topicMatch;
    });

    if (pdfCountBadge) {
      pdfCountBadge.textContent = String(filtered.length);
    }

    if (filtered.length === 0) {
      pdfGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px dashed var(--border-color);">
          <div style="font-size: 2.8rem; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">Aradığınız kriterde föy bulunamadı</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Lütfen arama terimini değiştirin veya kategori filtresini sıfırlayın.</p>
          <button id="resetSearchBtn" class="btn btn-secondary btn-sm" style="margin-top: 16px;">Tüm Föyleri Göster</button>
        </div>
      `;
      const resetBtn = document.getElementById("resetSearchBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          searchQuery = "";
          currentCategory = "all";
          if (pdfSearchInput) pdfSearchInput.value = "";
          filterTabs.forEach(t => t.classList.toggle("active", t.dataset.category === "all"));
          renderPDFs();
        });
      }
      return;
    }

    pdfGrid.innerHTML = filtered.map(item => {
      const isGold = (item.badge || "").includes("⭐") || (item.badge || "").includes("Altın") || (item.badge || "").includes("🔥");
      const badgeClass = isGold ? "pdf-badge gold" : "pdf-badge";
      const topicsHtml = (item.topics || []).slice(0, 4).map(t => `<span class="pdf-tag">#${t}</span>`).join("");
      const fileLink = item.fileUrl || item.file_url || `assets/pdf/${item.filename}`;

      return `
        <article class="pdf-card" data-id="${item.id}">
          <div>
            <div class="pdf-card-top">
              <span class="${badgeClass}">${item.badge || "MEB Uyumlu"}</span>
              <span class="pdf-unit">${item.unit || "8. Sınıf"} &bull; ${item.term || "Dönem"}</span>
            </div>

            <h3 class="pdf-title">${item.title}</h3>
            <p class="pdf-subtitle">${item.subtitle || ""}</p>

            <div class="pdf-meta">
              ${topicsHtml}
            </div>
          </div>

          <div class="pdf-card-bottom">
            <div class="pdf-info-txt">
              <span>📄 ${item.pages || "1 Sayfa"}</span> &bull; 
              <span>💾 ${item.fileSize || item.file_size || "105 KB"}</span>
            </div>

            <div class="pdf-btn-group">
              <button class="btn btn-secondary btn-sm preview-btn" data-id="${item.id}" title="Önizle ve Konuları Gör">
                👁️ İncele
              </button>
              <a href="${fileLink}" download="${item.filename}" class="btn btn-primary btn-sm download-btn" data-id="${item.id}">
                📥 İndir
              </a>
            </div>
          </div>
        </article>
      `;
    }).join("");

    attachCardEvents();
  }

  // 5. Card Events & Modal
  function attachCardEvents() {
    const previewBtns = document.querySelectorAll(".preview-btn");
    previewBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        openPDFModal(id);
      });
    });

    const downloadBtns = document.querySelectorAll(".download-btn");
    downloadBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        showToast("PDF başarıyla indiriliyor! İyi çalışmalar dileriz 🚀", "success");
        try {
          fetch("/api/analytics/visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_download: true, pdf_id: id })
          }).catch(() => {});
        } catch (e) {}
      });
    });
  }

  function openPDFModal(id) {
    const item = activeCatalog.find(p => p.id === id);
    if (!item || !modalOverlay) return;

    const modalBody = document.getElementById("modalBody");
    const fileLink = item.fileUrl || item.file_url || `assets/pdf/${item.filename}`;
    const topicsList = (item.topics || []).map(t => `<li style="margin-bottom: 6px;">🔹 <b>${t}</b></li>`).join("");

    modalBody.innerHTML = `
      <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px;">
        <span class="pdf-badge gold">${item.badge || "MEB Uyumlu"}</span>
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--secondary);">${item.unit} &bull; ${item.term}</span>
      </div>
      
      <h2 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin-bottom: 8px;">${item.title}</h2>
      <p style="font-size: 0.98rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">${item.subtitle || ""}</p>
      
      <div style="background: var(--primary-soft); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; margin-bottom: 24px;">
        <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--primary); margin-bottom: 10px;">📌 Föy İçeriğinde Neler Var?</h4>
        <ul style="list-style: none; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
          ${topicsList}
        </ul>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; border-top: 1px solid var(--border-color); padding-top: 18px;">
        <div style="font-size: 0.88rem; color: var(--text-dim); font-weight: 700;">
          <span>Zorluk: <b>${item.difficulty || "LGS Ayarı"}</b></span> &bull; 
          <span>Boyut: <b>${item.fileSize || item.file_size || "105 KB"}</b></span>
        </div>
        <div style="display: flex; gap: 10px;">
          <a href="${fileLink}" target="_blank" class="btn btn-secondary btn-sm">Tarayıcıda Aç</a>
          <a href="${fileLink}" download="${item.filename}" class="btn btn-primary btn-sm">📥 Hemen İndir</a>
        </div>
      </div>
    `;

    modalOverlay.classList.add("active");
  }

  if (modalClose && modalOverlay) {
    modalClose.addEventListener("click", () => modalOverlay.classList.remove("active"));
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove("active");
    });
  }

  // Search & Filter Listeners
  if (pdfSearchInput) {
    pdfSearchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderPDFs();
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategory = tab.dataset.category;
      renderPDFs();
    });
  });

  // 6. Toast Notification Helper
  function showToast(message, type = "info") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 7. LGS Geri Sayım Motoru
  function initCountdown() {
    const targetDate = new Date("2026-06-14T09:30:00+03:00").getTime();
    const daysEl = document.getElementById("countdownDays");
    const hoursEl = document.getElementById("countdownHours");
    const minutesEl = document.getElementById("countdownMinutes");
    const secondsEl = document.getElementById("countdownSeconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function update() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }

  // 8. LGS Matematik Net & Puan Hesaplayıcı (İçsel Emniyet: Asla NaN üretmez)
  function initCalculator() {
    const correctInput = document.getElementById("calcCorrect");
    const wrongInput = document.getElementById("calcWrong");
    const netDisplay = document.getElementById("calcNetDisplay");
    const scoreDisplay = document.getElementById("calcScoreDisplay");
    const adviceDisplay = document.getElementById("calcAdvice");
    const recDisplay = document.getElementById("calcRecommendation");

    if (!correctInput || !wrongInput || !netDisplay) return;

    function recalculate() {
      let correct = parseInt(correctInput.value, 10);
      let wrong = parseInt(wrongInput.value, 10);

      if (isNaN(correct) || correct < 0) correct = 0;
      if (isNaN(wrong) || wrong < 0) wrong = 0;

      if (correct > 20) {
        correct = 20;
        correctInput.value = 20;
      }
      if (correct + wrong > 20) {
        wrong = 20 - correct;
        wrongInput.value = wrong;
      }

      const netRaw = correct - (wrong / 3.0);
      const net = Math.max(0.0, parseFloat(netRaw.toFixed(2)));
      const estimatedMathScore = parseFloat((net * 4.3).toFixed(1));

      netDisplay.textContent = net.toFixed(2);
      if (scoreDisplay) {
        scoreDisplay.textContent = `+${estimatedMathScore} Puan LGS Etkisi`;
      }

      if (adviceDisplay && recDisplay) {
        if (net >= 18) {
          adviceDisplay.textContent = "🏆 Muazzam Performans! Galatasaray, Kabataş ve Fen Liseleri kapılarını aralıyorsun. Soru kaçırma payını sıfıra indirmek için 'Yeni Nesil Pro Deneme' ve zaman turlaması yap.";
          recDisplay.innerHTML = "🎯 <b>Önerilen Föy:</b> <a href='assets/pdf/14_LGS_Matematik_Yeni_Nesil_Pro_Deneme_1.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>LGS Yeni Nesil Pro Deneme-1</a>";
        } else if (net >= 14) {
          adviceDisplay.textContent = "⭐ Çok Başarılı! Nitelikli liseler için sağlam bir konumdasın. 20'de 20'ye ulaşmak için şekil ve modelleme sorularına (Cebirsel İfadeler & Geometrik Cisimler) odaklan.";
          recDisplay.innerHTML = "🎯 <b>Önerilen Föy:</b> <a href='assets/pdf/06_Cebirsel_Ifadeler_ve_Ozdeslikler.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>Cebirsel İfadeler ve Özdeşlikler Föyü</a>";
        } else if (net >= 8) {
          adviceDisplay.textContent = "📈 Yükseliş Potansiyeli Yüksek! Temel kazanımların var ancak yeni nesil paragraf sorularında tuzaklara düşüyorsun. 'Kareköklü İfadeler' ve 'Eğim' taktiklerini gözden geçir.";
          recDisplay.innerHTML = "🎯 <b>Önerilen Föy:</b> <a href='assets/pdf/03_Karekoklu_Ifadeler_Yeni_Nesil.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>Kareköklü İfadeler & Yaklaşık Değer</a>";
        } else {
          adviceDisplay.textContent = "💪 Harekete Geçme Zamanı! Korkacak hiçbir şey yok; matematikte doğru metot ve birebir takip ile 3-4 ayda 12-15 nete çıkmak mümkün. Temel kamp föylerinden başla ve özel ders desteği al.";
          recDisplay.innerHTML = "🎯 <b>Önerilen Föy:</b> <a href='assets/pdf/01_Carpanlar_ve_Katlar_EBOB_EKOK.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>Çarpanlar ve Katlar & EBOB-EKOK Temel Föyü</a>";
        }
      }
    }

    correctInput.addEventListener("input", recalculate);
    wrongInput.addEventListener("input", recalculate);
    recalculate();
  }

  // 9. Özel Ders Ön Başvuru Formu & Akıllı WhatsApp Entegrasyonu
  function initTutoringForm() {
    const form = document.getElementById("tutoringForm");
    const sendWhatsappBtn = document.getElementById("sendWhatsappBtn");

    function getFormData() {
      const name = document.getElementById("formName")?.value.trim() || "";
      const role = document.getElementById("formRole")?.value || "Öğrenci";
      const phone = document.getElementById("formPhone")?.value.trim() || "";
      const city = document.getElementById("formCity")?.value.trim() || "";
      const currentNet = document.getElementById("formCurrentNet")?.value || "0-5 Net";
      const targetSchool = document.getElementById("formTargetSchool")?.value.trim() || "Fen Lisesi";
      const notes = document.getElementById("formNotes")?.value.trim() || "";

      return { name, role, phone, city, currentNet, targetSchool, notes };
    }

    function buildWhatsAppUrl(data) {
      const phoneNum = "905300000000";
      const text = 
        `*Merdiye Hocam - LGS Özel Ders & Koçluk Başvurusu*\n\n` +
        `👤 *Ad Soyad:* ${data.name}\n` +
        `🏷️ *Başvuran:* ${data.role}\n` +
        `📞 *İletişim Tel:* ${data.phone}\n` +
        `📍 *Şehir / İlçe:* ${data.city || 'Belirtilmedi'}\n` +
        `📊 *Mevcut Matematik Neti:* ${data.currentNet}\n` +
        `🎯 *Hedef Lise:* ${data.targetSchool}\n` +
        `📝 *Ek Bilgi / Not:* ${data.notes || 'Yok'}\n\n` +
        `LGS Matematik 1'e 1 özel ders süreci ve uygun saatler hakkında bilgi almak istiyorum. Teşekkürler!`;

      return `https://wa.me/${phoneNum}?text=${encodeURIComponent(text)}`;
    }

    if (sendWhatsappBtn) {
      sendWhatsappBtn.addEventListener("click", () => {
        const data = getFormData();
        if (!data.name || !data.phone) {
          showToast("Lütfen Ad Soyad ve Telefon alanlarını doldurunuz.", "info");
          document.getElementById("formName")?.focus();
          return;
        }

        const url = buildWhatsAppUrl(data);
        window.open(url, "_blank");
        showToast("WhatsApp uygulamasına yönlendiriliyorsunuz...", "success");
      });
    }

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = getFormData();

        if (!data.name || !data.phone) {
          showToast("Lütfen zorunlu alanları doldurunuz.", "info");
          return;
        }

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });

          if (response.ok) {
            showToast("Başvurunuz başarıyla iletildi! En kısa sürede aranacaksınız.", "success");
            form.reset();
          } else {
            saveLocalLead(data);
            showToast("Başvurunuz kaydedildi! WhatsApp ile de anında mesaj atabilirsiniz.", "success");
            form.reset();
          }
        } catch (err) {
          saveLocalLead(data);
          showToast("Başvurunuz kaydedildi! WhatsApp üzerinden iletişime geçebilirsiniz.", "success");
        }
      });
    }

    function saveLocalLead(data) {
      try {
        const existing = JSON.parse(localStorage.getItem("merdiye_leads") || "[]");
        existing.push({ ...data, date: new Date().toISOString() });
        localStorage.setItem("merdiye_leads", JSON.stringify(existing));
      } catch (e) {}
    }
  }

  // 10. FAQ Accordion Manager
  function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
      const question = item.querySelector(".faq-question");
      if (question) {
        question.addEventListener("click", () => {
          const isOpen = item.classList.contains("open");
          faqItems.forEach(other => other.classList.remove("open"));
          if (!isOpen) {
            item.classList.add("open");
          }
        });
      }
    });
  }

  // 11. Mobil Hamburger Menü
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const isOpen = navMenu.classList.contains("open");
      mobileToggle.textContent = isOpen ? "✕" : "☰";
    });

    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileToggle.textContent = "☰";
      });
    });
  }

  // 12. Başlatma
  renderPDFs();
  syncCatalog();
  pingVisitor();
  initCountdown();
  initCalculator();
  initTutoringForm();
  initFAQ();
});
