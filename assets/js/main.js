/**
 * Merdiye Hocam - LGS Matematik Web Platformu
 * Ana JavaScript Mantığı & Etkileşim Motoru
 * Kurallar: Axiom Zero Bloat, Katı O(1)/O(n) Algoritma, İçsel Emniyet (No NaN, No Crash)
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

  // 2. PDF Rendering Engine (O(N) Filtreleme)
  function renderPDFs() {
    if (!pdfGrid) return;

    const query = searchQuery.trim().toLowerCase();
    const filtered = PDF_CATALOG.filter(item => {
      // Kategori filtresi denetimi
      const matchCat =
        currentCategory === "all" ? true :
        currentCategory === "popular" ? item.popular :
        item.category === currentCategory;

      if (!matchCat) return false;

      // Metin arama denetimi
      if (!query) return true;
      const combined = `${item.title} ${item.subtitle} ${item.unit} ${item.topics.join(" ")}`.toLowerCase();
      return combined.includes(query);
    });

    if (pdfCountBadge) {
      pdfCountBadge.textContent = `${filtered.length} Föy Gösteriliyor`;
    }

    if (filtered.length === 0) {
      pdfGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">Aradığınız kriterlere uygun föy bulunamadı</h3>
          <p style="font-size: 0.95rem;">Lütfen farklı bir anahtar kelime deneyin veya filtreyi "Tümü" olarak değiştirin.</p>
        </div>
      `;
      return;
    }

    pdfGrid.innerHTML = filtered.map(item => `
      <article class="pdf-card" data-id="${item.id}">
        <span class="pdf-card-badge ${item.popular ? 'popular' : ''}">${item.badge}</span>
        <div class="pdf-card-unit">${item.unit} &bull; ${item.term}</div>
        <h3 class="pdf-card-title">${item.title}</h3>
        <p class="pdf-card-desc">${item.subtitle}</p>
        
        <div class="pdf-topics-list">
          ${item.topics.map(t => `<span class="pdf-topic-chip">${t}</span>`).join("")}
        </div>

        <div class="pdf-card-footer">
          <div class="pdf-meta">
            <span>📄 ${item.fileSize}</span>
            <span>⭐ ${item.difficulty.split(" ")[0]}</span>
          </div>
          <div class="pdf-actions">
            <button class="btn btn-secondary btn-sm preview-btn" data-id="${item.id}" title="Önizle">
              Detay
            </button>
            <a href="${item.fileUrl}" download="${item.filename}" class="btn btn-primary btn-sm download-btn" data-name="${item.filename}">
              📥 İndir
            </a>
          </div>
        </div>
      </article>
    `).join("");

    // Event listener binding for rendered cards
    pdfGrid.querySelectorAll(".preview-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const found = PDF_CATALOG.find(p => p.id === id);
        if (found) openPreviewModal(found);
      });
    });

    pdfGrid.querySelectorAll(".download-btn").forEach(link => {
      link.addEventListener("click", () => {
        const name = link.getAttribute("data-name");
        showToast(`"${name}" başarıyla indiriliyor!`, "success");
      });
    });
  }

  // 3. Search & Filter Tab Listeners
  if (pdfSearchInput) {
    let debounceTimer = null;
    pdfSearchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value;
        renderPDFs();
      }, 150);
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategory = tab.getAttribute("data-category") || "all";
      renderPDFs();
    });
  });

  // 4. Preview Modal Operations
  function openPreviewModal(item) {
    if (!modalOverlay) return;

    const modalBody = document.getElementById("modalBody");
    if (modalBody) {
      const youtubeSearchUrl = `https://www.youtube.com/@MerdiyeHocam/search?query=${encodeURIComponent(item.title)}`;

      modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
          <span class="pdf-card-badge ${item.popular ? 'popular' : ''}" style="position: static; margin-bottom: 10px; display: inline-block;">${item.badge}</span>
          <div style="font-size: 0.85rem; color: #38BDF8; font-weight: 700; text-transform: uppercase;">${item.unit} &bull; ${item.term}</div>
          <h2 style="font-size: 1.5rem; font-weight: 800; margin: 8px 0; color: #FFFFFF;">${item.title}</h2>
          <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.5;">${item.subtitle}</p>
        </div>

        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
          <h4 style="font-size: 0.85rem; font-weight: 700; color: #FBBF24; text-transform: uppercase; margin-bottom: 10px;">📌 Föy İçeriğinde Neler Var?</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem; color: var(--text-main);">
            <li>✅ <b>Kazanım Hap Bilgileri:</b> Konunun en can alıcı formül ve pratik kuralları.</li>
            <li>✅ <b>LGS Tuzakları & Uyarılar:</b> MEB'in çeldirdiği kritik noktalar.</li>
            <li>✅ <b>Yeni Nesil Model Soru:</b> Adım adım paragraf ve şekil analizi çözümü.</li>
            <li>✅ <b>Pekiştirme Soruları:</b> Cevap anahtarlı sınav ayarında alıştırmalar.</li>
          </ul>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
          ${item.topics.map(t => `<span class="pdf-topic-chip" style="font-size: 0.82rem; padding: 4px 10px;">#${t}</span>`).join("")}
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-light); padding-top: 20px;">
          <div style="font-size: 0.85rem; color: var(--text-dim);">
            Dosya Boyutu: <b>${item.fileSize}</b> | Format: <b>PDF (A4 Baskıya Uygun)</b>
          </div>
          <div style="display: flex; gap: 10px;">
            <a href="${youtubeSearchUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              📺 Çözüm Videosu
            </a>
            <a href="${item.fileUrl}" download="${item.filename}" class="btn btn-primary btn-sm modal-download-btn">
              📥 Hemen İndir
            </a>
          </div>
        </div>
      `;

      modalBody.querySelector(".modal-download-btn").addEventListener("click", () => {
        showToast(`"${item.filename}" indiriliyor!`, "success");
      });
    }

    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("open")) {
      closeModal();
    }
  });

  // 5. Toast Notification Manager
  function showToast(message, type = "info") {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    toast.innerHTML = `
      <span style="font-size: 1.1rem;">${type === 'success' ? '✅' : 'ℹ️'}</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(120%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // 6. LGS 2026 Geri Sayım Sayacı
  function initCountdown() {
    const daysEl = document.getElementById("countdownDays");
    const hoursEl = document.getElementById("countdownHours");
    const minutesEl = document.getElementById("countdownMinutes");
    const secondsEl = document.getElementById("countdownSeconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Hedef LGS Tarihi (Tahmini 2. Pazar Haziran 2026: 14 Haziran 2026, 09:30)
    const targetDate = new Date("2026-06-14T09:30:00+03:00").getTime();

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

  // 7. LGS Matematik Net & Puan Hesaplayıcı (İçsel Emniyet: Asla NaN üretmez)
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

      // Safe guards
      if (isNaN(correct) || correct < 0) correct = 0;
      if (isNaN(wrong) || wrong < 0) wrong = 0;

      // 20 Soru LGS Matematik Sınırı
      if (correct > 20) {
        correct = 20;
        correctInput.value = 20;
      }
      if (correct + wrong > 20) {
        wrong = 20 - correct;
        wrongInput.value = wrong;
      }

      const netRaw = correct - (wrong / 3);
      const net = Math.max(0, parseFloat(netRaw.toFixed(2)));
      // LGS Matematik Katkısı (Takribi standart katsayı ve baz etki ~4.2 - 4.6 puan / net)
      const estimatedMathScore = parseFloat((net * 4.3).toFixed(1));

      netDisplay.textContent = net.toFixed(2);
      if (scoreDisplay) {
        scoreDisplay.textContent = `+${estimatedMathScore} Puan LGS Etkisi`;
      }

      if (adviceDisplay && recDisplay) {
        if (net >= 18) {
          adviceDisplay.textContent = "🏆 Muazzam Performans! Galatasaray, Kabataş ve Fen Liseleri kapılarını aralıyorsun. Soru kaçırma payını sıfıra indirmek için 'Yeni Nesil Pro Deneme' ve zaman turlaması yap.";
          recDisplay.innerHTML = "🎯 <b>Önerilen Föy:</b> <a href='assets/pdf/14_LGS_Matematik_Yeni_Nesil_Pro_Deneme_1.pdf' download style='color: #FBBF24; text-decoration: underline;'>LGS Yeni Nesil Pro Deneme-1</a>";
        } else if (net >= 14) {
          adviceDisplay.textContent = "⭐ Çok Başarılı! Nitelikli liseler için sağlam bir konumdasın. 20'de 20'ye ulaşmak için şekil ve modelleme sorularına (Cebirsel İfadeler & Geometrik Cisimler) odaklan.";
          recDisplay.innerHTML = "🎯 <b>Önerilen Föy:</b> <a href='assets/pdf/06_Cebirsel_Ifadeler_ve_Ozdeslikler.pdf' download style='color: #FBBF24; text-decoration: underline;'>Cebirsel İfadeler ve Özdeşlikler Föyü</a>";
        } else if (net >= 8) {
          adviceDisplay.textContent = "📈 Yükseliş Potansiyeli Yüksek! Temel kazanımların var ancak yeni nesil paragraf sorularında tuzaklara düşüyorsun. 'Kareköklü İfadeler' ve 'Eğim' taktiklerini gözden geçir.";
          recDisplay.innerHTML = "🎯 <b>Önerilen Föy:</b> <a href='assets/pdf/03_Karekoklu_Ifadeler_Yeni_Nesil.pdf' download style='color: #FBBF24; text-decoration: underline;'>Kareköklü İfadeler & Yaklaşık Değer</a>";
        } else {
          adviceDisplay.textContent = "💪 Harekete Geçme Zamanı! Korkacak hiçbir şey yok; matematikte doğru metot ve birebir takip ile 3-4 ayda 12-15 nete çıkmak mümkün. Temel kamp föylerinden başla ve özel ders desteği al.";
          recDisplay.innerHTML = "🎯 <b>Önerilen Föy:</b> <a href='assets/pdf/01_Carpanlar_ve_Katlar_EBOB_EKOK.pdf' download style='color: #FBBF24; text-decoration: underline;'>Çarpanlar ve Katlar & EBOB-EKOK Temel Föyü</a>";
        }
      }
    }

    correctInput.addEventListener("input", recalculate);
    wrongInput.addEventListener("input", recalculate);
    recalculate();
  }

  // 8. Özel Ders Ön Başvuru Formu & Akıllı WhatsApp Entegrasyonu
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
      // Merdiye Hoca WhatsApp İletişim Hattı
      const phoneNum = "905300000000"; // Merdiye Hoca Destek Hattı
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
      sendWhatsappBtn.addEventListener("click", (e) => {
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
          // Backend API varsa POST et
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });

          if (response.ok) {
            showToast("Başvurunuz başarıyla iletildi! En kısa sürede aranacaksınız.", "success");
            form.reset();
          } else {
            // Local fallback
            saveLocalLead(data);
            showToast("Başvurunuz kaydedildi! WhatsApp ile de anında mesaj atabilirsiniz.", "success");
            form.reset();
          }
        } catch (err) {
          // Offline / static hosting fallback
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
      } catch (e) {
        // Safe fail
      }
    }
  }

  // 9. FAQ Accordion Manager
  function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
      const question = item.querySelector(".faq-question");
      if (question) {
        question.addEventListener("click", () => {
          const isOpen = item.classList.contains("open");
          // Diğerlerini kapat
          faqItems.forEach(other => other.classList.remove("open"));
          if (!isOpen) {
            item.classList.add("open");
          }
        });
      }
    });
  }

  // 10. Mobil Hamburger Menü
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

  // 11. Başlatma
  renderPDFs();
  initCountdown();
  initCalculator();
  initTutoringForm();
  initFAQ();
});
