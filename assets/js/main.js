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
      badge: "EN ÇOK İNDİRİLEN",
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
      badge: "2025/2026 PROVA",
      popular: true,
      topics: ["20 Yeni Nesil Soru", "Cevap Anahtarı", "Optik Form Rehberi", "Net Skalası", "MEB Uyum"]
    }
  ];

  let activeCatalog = [];
  const pdfMap = new Map();

  function normalizeText(str) {
    return (str || "")
      .toString()
      .replace(/İ/g, "i")
      .replace(/I/g, "i")
      .toLowerCase()
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c");
  }

  function setCatalog(items) {
    pdfMap.clear();
    activeCatalog = (items || []).map(item => {
      let topics = item.topics;
      if (typeof topics === "string") {
        try { topics = JSON.parse(topics); } catch (e) { topics = [topics]; }
      }
      if (!Array.isArray(topics)) topics = [];
      const topicsStr = topics.join(" ");
      const rawCorpus = (
        (item.title || "") + " " +
        (item.subtitle || "") + " " +
        (item.unit || "") + " " +
        topicsStr
      );
      const searchCorpus = normalizeText(rawCorpus);

      const isGold = String(item.badge || "").toLowerCase().indexOf("altın") !== -1;
      const badgeClass = isGold ? "pdf-badge gold" : "pdf-badge";
      const topicsHtml = topics.slice(0, 4).map(t => `<span class="pdf-tag">#${t}</span>`).join("");
      const fileLink = item.fileUrl || item.file_url || `assets/pdf/${item.filename}`;
      const prep = {
        ...item,
        fileUrl: fileLink,
        fileSize: item.file_size || item.fileSize || "105 KB",
        _searchCorpus: searchCorpus,
        _badgeClass: badgeClass,
        _topicsHtml: topicsHtml,
        _fileLink: fileLink
      };
      if (prep.id) pdfMap.set(String(prep.id), prep);
      return prep;
    });
    renderPDFs();
  }

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

  // 2. Dynamic Fetch & Sync with Server, Supabase or LocalStorage
  async function syncCatalog() {
    try {
      if (window.MH_DB && typeof window.MH_DB.getPdfs === "function") {
        const dbCatalog = await window.MH_DB.getPdfs();
        if (Array.isArray(dbCatalog) && dbCatalog.length > 0) {
          setCatalog(dbCatalog);
          return;
        }
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/pdfs");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCatalog(data);
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
          setCatalog(data);
          return;
        }
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem("merdiye_custom_pdfs");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCatalog(parsed);
        }
      }
    } catch (e) {}
  }

  // 3. Visitor Ping
  function pingVisitor() {
    try {
      if (window.MH_DB && typeof window.MH_DB.recordVisit === "function") {
        window.MH_DB.recordVisit();
      }
    } catch (e) {}

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

    const query = normalizeText(searchQuery.trim());
    const hasQuery = query.length > 0;
    const isAll = currentCategory === "all";
    const isPopular = currentCategory === "popular";

    const filtered = [];
    for (let i = 0; i < activeCatalog.length; i++) {
      const item = activeCatalog[i];
      const matchCat = isAll ? true : (isPopular ? item.popular : item.category === currentCategory);
      if (!matchCat) continue;
      const corpus = item._searchCorpus || normalizeText((item.title || "") + " " + (item.subtitle || "") + " " + (item.unit || ""));
      if (hasQuery && corpus.indexOf(query) === -1) continue;
      filtered.push(item);
    }

    if (pdfCountBadge) {
      pdfCountBadge.textContent = String(filtered.length);
    }

    if (filtered.length === 0) {
      pdfGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px dashed var(--border-color);">
          <div style="font-size: 2.8rem; margin-bottom: 12px;"></div>
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

    const cardsHtml = [];
    for (let i = 0; i < filtered.length; i++) {
      const item = filtered[i];
      cardsHtml.push(`
        <article class="pdf-card" data-id="${item.id}">
          <div>
            <div class="pdf-card-top">
              <span class="${item._badgeClass}">${item.badge || "MEB Uyumlu"}</span>
              <span class="pdf-unit">${item.unit || "8. Sınıf"} &bull; ${item.term || "Dönem"}</span>
            </div>

            <h3 class="pdf-title">${item.title}</h3>
            <p class="pdf-subtitle">${item.subtitle || ""}</p>

            <div class="pdf-meta">
              ${item._topicsHtml}
            </div>
          </div>

          <div class="pdf-card-bottom">
            <div class="pdf-info-txt">
              <span>${item.pages || "1 Sayfa"}</span> &bull; 
              <span>${item.fileSize}</span>
            </div>

            <div class="pdf-btn-group">
              <button class="btn btn-secondary btn-sm preview-btn" data-id="${item.id}" title="Önizle ve Canlı İncele">
                İncele
              </button>
              <a href="mailto:?subject=${encodeURIComponent(item.title + ' - LGS Matematik Föyü')}&body=${encodeURIComponent('Merhaba, Merdiye Hocam LGS Matematik föyünü inceleyebilirsin: ' + new URL(item._fileLink, window.location.href).href)}" class="btn btn-secondary btn-sm" title="E-posta ile Paylaş" style="padding: 6px 10px; color: var(--primary); border-color: var(--primary-border);">
                E-posta
              </a>
              <a href="${item._fileLink}" download="${item.filename}" class="btn btn-primary btn-sm download-btn" data-id="${item.id}">
                İndir
              </a>
            </div>
          </div>
        </article>
      `);
    }

    pdfGrid.innerHTML = cardsHtml.join("");
  }

  // 5. Card Events & Modal
  // Event Delegation on pdfGrid attached once
  if (pdfGrid) {
    pdfGrid.addEventListener("click", (e) => {
      const previewBtn = e.target.closest(".preview-btn");
      if (previewBtn) {
        const id = previewBtn.getAttribute("data-id");
        openPDFModal(id);
        return;
      }
      const dlBtn = e.target.closest(".download-btn");
      if (dlBtn) {
        const id = dlBtn.getAttribute("data-id");
        showToast("PDF başarıyla indiriliyor! İyi çalışmalar dileriz", "success");
        try {
          if (window.MH_DB && typeof window.MH_DB.recordPdfDownload === "function") {
            window.MH_DB.recordPdfDownload(id);
          }
        } catch (err) {}
        try {
          fetch("/api/analytics/visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_download: true, pdf_id: id })
          }).catch(() => {});
        } catch (err) {}
      }
    });
  }

  function openPDFModal(id) {
    const item = pdfMap.get(String(id)) || activeCatalog.find(p => String(p.id) === String(id));
    if (!item || !modalOverlay) return;

    const modalBody = document.getElementById("modalBody");
    const fileLink = item.fileUrl || item.file_url || `assets/pdf/${item.filename}`;
    const topicsList = (item.topics || []).map(t => `<li style="margin-bottom: 6px;"> <b>${t}</b></li>`).join("");
    const fullFileUrl = new URL(fileLink, window.location.href).href;

    modalBody.innerHTML = `
      <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px;">
        <span class="pdf-badge gold">${item.badge || "MEB Uyumlu"}</span>
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--secondary);">${item.unit} &bull; ${item.term}</span>
      </div>
      
      <h2 style="font-size: 1.45rem; font-weight: 900; color: var(--text-main); margin-bottom: 6px;">${item.title}</h2>
      <p style="font-size: 0.94rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">${item.subtitle || ""}</p>

      <!-- Modal Tab Başlıkları -->
      <div class="pdf-modal-tabs">
        <button class="pdf-modal-tab active" data-modaltab="preview"> Canlı Föy Önizleme</button>
        <button class="pdf-modal-tab" data-modaltab="topics"> Kazanım &amp; Konular</button>
        <button class="pdf-modal-tab" data-modaltab="sample"> Örnek Soru &amp; Taktik</button>
      </div>

      <!-- Tab 1: Canlı Önizleme -->
      <div id="modalTabPreview" class="pdf-modal-content-panel">
        <div class="pdf-embed-wrapper">
          <iframe src="${fileLink}#toolbar=0" title="PDF Önizleme"></iframe>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; margin-top: -10px; margin-bottom: 14px;">
           Tarayıcınızda doğrudan PDF görüntülenmektedir. Dosyayı cihazınıza kaydetmek için aşağıdaki indir butonunu kullanabilirsiniz.
        </p>
      </div>

      <!-- Tab 2: Konular & Kazanımlar -->
      <div id="modalTabTopics" class="pdf-modal-content-panel" style="display: none;">
        <div style="background: var(--primary-soft); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; margin-bottom: 18px;">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--primary); margin-bottom: 10px;">Bu Föyde Öğreneceğiniz MEB Kazanımları:</h4>
          <ul style="list-style: none; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7;">
            ${topicsList}
          </ul>
        </div>
      </div>

      <!-- Tab 3: Örnek Soru & Taktik -->
      <div id="modalTabSample" class="pdf-modal-content-panel" style="display: none;">
        <div style="background: #FAF8FE; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; margin-bottom: 18px;">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">Tipik Sınav Sorusu Modeli:</h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px;">
            MEB LGS sınavlarında bu üniteden gelen sorular temel işlemden ziyade <b>şekil modelleme ve metin analizi</b> üzerine kuruludur.
          </p>
          <div style="background: #FEF3C7; border: 1px solid #FCD34D; border-radius: var(--radius-sm); padding: 12px; font-size: 0.88rem; color: #92400E; font-weight: 700;">
            Merdiye Hoca Uyarısı: Soru kökünü okumadan şekle dalmayın. Sorunun sizden "en az" mı "en çok" mu istediğini ilk önce çizin!
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-top: 1px solid var(--border-color); padding-top: 16px;">
        <div style="font-size: 0.86rem; color: var(--text-dim); font-weight: 700;">
          <span>Zorluk: <b>${item.difficulty || "LGS Ayarı"}</b></span> &bull; 
          <span>Boyut: <b>${item.fileSize || item.file_size || "105 KB"}</b></span>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <a href="mailto:?subject=${encodeURIComponent(item.title + ' - LGS Matematik Föyü')}&body=${encodeURIComponent('Merhaba, Merdiye Hocam LGS Matematik föyünü inceleyebilirsin: ' + new URL(fileLink, window.location.href).href)}" class="btn btn-secondary btn-sm" style="color: var(--primary); border-color: var(--primary-border);">
            E-posta ile Paylaş
          </a>
          <a href="${fileLink}" target="_blank" class="btn btn-secondary btn-sm">Tarayıcıda Aç</a>
          <a href="${fileLink}" download="${item.filename}" class="btn btn-primary btn-sm">Hemen İndir</a>
        </div>
      </div>
    `;

    // Modal Sekme Geçişleri - Event Delegation
    const tabsContainer = modalBody.querySelector(".pdf-modal-tabs");
    if (tabsContainer) {
      tabsContainer.addEventListener("click", (e) => {
        const tab = e.target.closest(".pdf-modal-tab");
        if (!tab) return;
        const allTabs = tabsContainer.querySelectorAll(".pdf-modal-tab");
        for (let i = 0; i < allTabs.length; i++) allTabs[i].classList.remove("active");
        tab.classList.add("active");
        const target = tab.dataset.modaltab;

        const pPreview = modalBody.querySelector("#modalTabPreview");
        const pTopics = modalBody.querySelector("#modalTabTopics");
        const pSample = modalBody.querySelector("#modalTabSample");

        if (pPreview) pPreview.style.display = target === "preview" ? "block" : "none";
        if (pTopics) pTopics.style.display = target === "topics" ? "block" : "none";
        if (pSample) pSample.style.display = target === "sample" ? "block" : "none";
      });
    }

    modalOverlay.classList.add("active");
  }

  if (modalClose && modalOverlay) {
    modalClose.addEventListener("click", () => modalOverlay.classList.remove("active"));
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove("active");
    });

    const sheetHandle = modalOverlay.querySelector(".mobile-sheet-handle");
    if (sheetHandle) {
      sheetHandle.addEventListener("click", () => modalOverlay.classList.remove("active"));
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
        modalOverlay.classList.remove("active");
      }
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
    toast.innerHTML = `<span></span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 7. LGS Geri Sayım Motoru (Dinamik & Güvenli: Her zaman yaklaşan LGS'yi sayar)
  function initCountdown() {
    const daysEl = document.getElementById("countdownDays");
    const hoursEl = document.getElementById("countdownHours");
    const minutesEl = document.getElementById("countdownMinutes");
    const secondsEl = document.getElementById("countdownSeconds");
    const titleEl = document.querySelector(".countdown-title");
    const dateEl = document.querySelector(".countdown-date");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Yaklaşan LGS tarihini hesapla (Her yıl Haziran ayının sınav günü: 14 Haziran 09:30)
    function getNextLGS() {
      const now = new Date();
      let year = now.getFullYear();
      // Month 5 = Haziran (0-indexed)
      let target = new Date(year, 5, 14, 9, 30, 0);
      if (now.getTime() >= target.getTime()) {
        year += 1;
        target = new Date(year, 5, 14, 9, 30, 0);
      }
      return { targetTime: target.getTime(), year: year };
    }

    function update() {
      const now = new Date().getTime();
      const { targetTime, year } = getNextLGS();
      let distance = targetTime - now;

      if (isNaN(distance) || distance < 0) {
        distance = 0;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");

      if (titleEl && !titleEl.textContent.includes(String(year))) {
        titleEl.textContent = `LGS ${year} Sınavına Kalan Süre`;
      }
      if (dateEl) {
        dateEl.textContent = `Hedef: 14 Haziran ${year}`;
      }
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

    function recalculate(source) {
      let correct = parseInt(correctInput.value, 10);
      let wrong = parseInt(wrongInput.value, 10);

      if (isNaN(correct) || correct < 0) {
        if (!isNaN(correct) && correct < 0) correctInput.value = 0;
        correct = 0;
      }
      if (isNaN(wrong) || wrong < 0) {
        if (!isNaN(wrong) && wrong < 0) wrongInput.value = 0;
        wrong = 0;
      }

      if (correct > 20) {
        correct = 20;
        correctInput.value = 20;
      }
      if (wrong > 20) {
        wrong = 20;
        wrongInput.value = 20;
      }

      if (correct + wrong > 20) {
        if (source === "wrong") {
          correct = Math.max(0, 20 - wrong);
          correctInput.value = correct;
        } else {
          wrong = Math.max(0, 20 - correct);
          wrongInput.value = wrong;
        }
      }

      const emptyCount = Math.max(0, 20 - (correct + wrong));
      const netRaw = correct - (wrong / 3.0);
      const net = Math.max(0.0, parseFloat(netRaw.toFixed(2)));
      const estimatedMathScore = parseFloat((net * 4.3).toFixed(1));

      netDisplay.textContent = net.toFixed(2);
      if (scoreDisplay) {
        scoreDisplay.textContent = `+${estimatedMathScore} Puan LGS Etkisi (${correct} D, ${wrong} Y, ${emptyCount} B)`;
      }
      if (typeof renderSchoolSimulator === "function") {
        renderSchoolSimulator(net);
      }

      if (adviceDisplay && recDisplay) {
        if (net >= 18) {
          adviceDisplay.innerHTML = "<b>Muazzam Performans!</b> Galatasaray, Kabataş ve Fen Liseleri kapılarını aralıyorsun. Soru kaçırma payını sıfıra indirmek için Pro Deneme ve turlama taktiğini uygula.";
          recDisplay.innerHTML = "<b>Önerilen Föy:</b> <a href='assets/pdf/14_LGS_Matematik_Yeni_Nesil_Pro_Deneme_1.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>LGS Yeni Nesil Pro Deneme-1</a>";
        } else if (net >= 14) {
          adviceDisplay.innerHTML = "<b>Çok Başarılı!</b> Nitelikli liseler için sağlam bir konumdasın. 20'de 20'ye ulaşmak için şekil ve modelleme sorularına odaklan.";
          recDisplay.innerHTML = "<b>Önerilen Föy:</b> <a href='assets/pdf/06_Cebirsel_Ifadeler_ve_Ozdeslikler.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>Cebirsel İfadeler ve Özdeşlikler Föyü</a>";
        } else if (net >= 8) {
          adviceDisplay.innerHTML = "<b>Yükseliş Potansiyeli Yüksek!</b> Temel kazanımların var; kareköklü ifadeler ve eğim taktikleriyle netlerini 15+ üzerine taşıyabilirsin.";
          recDisplay.innerHTML = "<b>Önerilen Föy:</b> <a href='assets/pdf/03_Karekoklu_Ifadeler_Yeni_Nesil.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>Kareköklü İfadeler & Yaklaşık Değer</a>";
        } else {
          adviceDisplay.innerHTML = "<b>Temel Konuları Güçlendirme Zamanı!</b> Doğru metot ve birebir takip ile 3-4 ayda 12-15 nete çıkmak mümkün. Temel kamp föylerinden başla.";
          recDisplay.innerHTML = "<b>Önerilen Föy:</b> <a href='assets/pdf/01_Carpanlar_ve_Katlar_EBOB_EKOK.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>Çarpanlar ve Katlar & EBOB-EKOK Temel Föyü</a>";
        }
      }
    }

    correctInput.addEventListener("input", () => recalculate("correct"));
    wrongInput.addEventListener("input", () => recalculate("wrong"));
    recalculate();
  }

  // 8b. Hedef Lise & Taban Puan Simülatörü
  const HIGH_SCHOOLS = [
    { name: "Galatasaray Lisesi", city: "İstanbul", minScore: 500.0, percentile: "%0.04", badge: "Türkiye 1.si" },
    { name: "İstanbul Erkek Lisesi", city: "İstanbul", minScore: 496.5, percentile: "%0.06", badge: "Almanca / Sayısal" },
    { name: "Kabataş Erkek Lisesi", city: "İstanbul", minScore: 494.8, percentile: "%0.12", badge: "Fen / Sosyal" },
    { name: "Ankara Fen Lisesi", city: "Ankara", minScore: 494.2, percentile: "%0.14", badge: "Fen Lisesi" },
    { name: "İzmir Fen Lisesi", city: "İzmir", minScore: 493.5, percentile: "%0.16", badge: "Fen Lisesi" },
    { name: "Tofaş Fen Lisesi", city: "Bursa", minScore: 491.5, percentile: "%0.28", badge: "Fen Lisesi" },
    { name: "Cağaloğlu Anadolu Lisesi", city: "İstanbul", minScore: 488.4, percentile: "%0.45", badge: "Proje Okulu" },
    { name: "Kadıköy Anadolu Lisesi", city: "İstanbul", minScore: 484.2, percentile: "%0.78", badge: "Anadolu Lisesi" },
    { name: "Bursa Nilüfer Borsa İst. Fen L.", city: "Bursa", minScore: 482.0, percentile: "%0.95", badge: "Fen Lisesi" },
    { name: "Hüseyin Avni Sözen Anadolu L.", city: "İstanbul", minScore: 481.5, percentile: "%1.10", badge: "Anadolu Lisesi" },
    { name: "Beşiktaş Sakıp Sabancı Anadolu", city: "İstanbul", minScore: 479.2, percentile: "%1.35", badge: "Anadolu Lisesi" },
    { name: "Bornova Anadolu Lisesi", city: "İzmir", minScore: 478.0, percentile: "%1.50", badge: "Anadolu Lisesi" },
    { name: "Gazi Anadolu Lisesi", city: "Ankara", minScore: 475.5, percentile: "%1.75", badge: "Anadolu Lisesi" },
    { name: "Vefa Lisesi", city: "İstanbul", minScore: 474.0, percentile: "%1.90", badge: "Tarihi Lise" },
    { name: "Haydarpaşa Lisesi", city: "İstanbul", minScore: 469.0, percentile: "%2.40", badge: "Köklü Lise" },
    { name: "Ankara Atatürk Anadolu Lisesi", city: "Ankara", minScore: 465.0, percentile: "%2.85", badge: "Anadolu Lisesi" },
    { name: "Pertevniyal Lisesi", city: "İstanbul", minScore: 462.5, percentile: "%3.15", badge: "Proje Okulu" },
    { name: "Şehremini Anadolu Lisesi", city: "İstanbul", minScore: 452.0, percentile: "%4.40", badge: "Anadolu Lisesi" },
    { name: "İzmir Konak Anadolu Lisesi", city: "İzmir", minScore: 448.0, percentile: "%5.10", badge: "Anadolu Lisesi" },
    { name: "Köy Hizmetleri Anadolu Lisesi", city: "İstanbul", minScore: 442.0, percentile: "%5.90", badge: "Anadolu Lisesi" }
  ];

  let currentSchoolCity = "all";
  let lastCalculatedNet = 15.0;

  function renderSchoolSimulator(net = lastCalculatedNet) {
    lastCalculatedNet = net;
    const schoolGrid = document.getElementById("schoolGrid");
    const simNetHighlight = document.getElementById("simNetHighlight");
    const simScoreHighlight = document.getElementById("simScoreHighlight");

    if (!schoolGrid) return;

    const estimatedTotalScore = Math.min(500.0, Math.max(200.0, parseFloat((400 + (net * 5.0)).toFixed(1))));

    if (simNetHighlight) simNetHighlight.textContent = `${net.toFixed(2)} Net`;
    if (simScoreHighlight) simScoreHighlight.textContent = `${estimatedTotalScore.toFixed(1)} Puan`;

    const filteredSchools = HIGH_SCHOOLS.filter(s => currentSchoolCity === "all" || s.city === currentSchoolCity);

    schoolGrid.innerHTML = filteredSchools.map(school => {
      let statusClass = "need-work";
      let statusText = "";
      const diff = parseFloat((school.minScore - estimatedTotalScore).toFixed(1));

      if (estimatedTotalScore >= school.minScore) {
        statusClass = "qualified";
        statusText = "Kazanabilirsin! Puanın Yeterli";
      } else if (diff <= 12.0) {
        const neededNet = Math.max(1, Math.ceil(diff / 5.0));
        statusClass = "borderline";
        statusText = `Sınırda (${neededNet} Matematik Neti Daha Gerekli)`;
      } else {
        const neededNet = Math.max(1, Math.ceil(diff / 5.0));
        statusClass = "need-work";
        statusText = `+${neededNet} Matematik Neti Gelişim Şart`;
      }

      return `
        <div class="school-card">
          <div>
            <div class="school-card-top">
              <h4 class="school-card-title">${school.name}</h4>
              <span class="school-city-badge">${school.city}</span>
            </div>

            <div class="school-meta-row">
              <span>Taban: <b>${school.minScore.toFixed(1)}</b></span>
              <span>Yüzdelik: <b>${school.percentile}</b></span>
            </div>

            <div class="school-status-banner ${statusClass}">
              ${statusText}
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm plan-school-btn" data-school="${school.name}" style="width: 100%; margin-top: 10px;">
            Bu Hedefe Özel Ders Planı Yap
          </button>
        </div>
      `;
    }).join("");

    schoolGrid.querySelectorAll(".plan-school-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const schoolName = btn.dataset.school;
        const targetInput = document.getElementById("formTargetSchool");
        if (targetInput) targetInput.value = `${schoolName} (${lastCalculatedNet.toFixed(1)} Net)`;
        const tutoringSection = document.getElementById("tutoring");
        if (tutoringSection) {
          tutoringSection.scrollIntoView({ behavior: "smooth" });
          document.getElementById("formName")?.focus();
          showToast(`Hedef ${schoolName} olarak forma eklendi!`, "info");
        }
      });
    });
  }

  function initSchoolSimulator() {
    const tabCalc = document.getElementById("tabModeCalc");
    const tabSchool = document.getElementById("tabModeSchool");
    const calcView = document.getElementById("calcView");
    const schoolView = document.getElementById("schoolView");

    if (tabCalc && tabSchool && calcView && schoolView) {
      tabCalc.addEventListener("click", () => {
        tabCalc.classList.add("active");
        tabSchool.classList.remove("active");
        calcView.style.display = "block";
        schoolView.style.display = "none";
      });

      tabSchool.addEventListener("click", () => {
        tabSchool.classList.add("active");
        tabCalc.classList.remove("active");
        calcView.style.display = "none";
        schoolView.style.display = "block";
        renderSchoolSimulator(lastCalculatedNet);
      });

      [tabCalc, tabSchool].forEach(tab => {
        tab.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            tab.click();
          }
        });
      });
    }

    const schoolFilterWrap = document.querySelector(".school-filters-wrapper");
    if (schoolFilterWrap) {
      schoolFilterWrap.addEventListener("click", (e) => {
        const chip = e.target.closest(".school-filter-chip");
        if (!chip) return;
        const allChips = schoolFilterWrap.querySelectorAll(".school-filter-chip");
        for (let i = 0; i < allChips.length; i++) allChips[i].classList.remove("active");
        chip.classList.add("active");
        currentSchoolCity = chip.dataset.schoolCity || "all";
        renderSchoolSimulator(lastCalculatedNet);
      });
    } else {
      const allChips = document.querySelectorAll(".school-filter-chip");
      for (let i = 0; i < allChips.length; i++) {
        const chip = allChips[i];
        chip.addEventListener("click", () => {
          for (let k = 0; k < allChips.length; k++) allChips[k].classList.remove("active");
          chip.classList.add("active");
          currentSchoolCity = chip.dataset.schoolCity || "all";
          renderSchoolSimulator(lastCalculatedNet);
        });
      }
    }

    renderSchoolSimulator(15.0);
  }

  // 8c. Günün Sorusu & İnteraktif Mini LGS Deneme Motoru
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      unit: "1. Ünite • Çarpanlar ve Katlar & EBOB",
      question: "Kenar uzunlukları 48 metre ve 72 metre olan dikdörtgen şeklindeki bir bahçenin etrafına, köşelerine de dikilmek şartıyla eşit aralıklarla fidan dikilecektir. Bu iş için en az kaç fidana ihtiyaç vardır?",
      options: ["A) 8", "B) 10", "C) 12", "D) 14"],
      correctIndex: 1,
      solution: "1. Adım: Fidanlar arası aralık en büyük ortak bölen olmalıdır: EBOB(48, 72) = 24 metredir.<br>2. Adım: Dikdörtgen bahçenin çevresi = 2 × (48 + 72) = 2 × 120 = 240 metre.<br>3. Adım: Gerekli fidan sayısı = Çevre / EBOB = 240 / 24 = <b>10 adet</b>.",
      tactic: "Aralık / parsel / eşit bölme sorusu = EBOB! Çevreyi EBOB'a bölmek her zaman 10 saniyede net sonuç verir."
    },
    {
      id: 2,
      unit: "1. Ünite • Üslü İfadeler ve Bilimsel Gösterim",
      question: "Bir laboratuvar ortamında incelenen bir mikroorganizmanın kütlesi 0,00000325 gramdır. Bu mikroorganizmanın kütlesinin gram cinsinden bilimsel gösterimi aşağıdakilerden hangisidir?",
      options: ["A) 3,25 × 10⁻⁵", "B) 32,5 × 10⁻⁷", "C) 3,25 × 10⁻⁶", "D) 0,325 × 10⁻⁵"],
      correctIndex: 2,
      solution: "1. Adım: Bilimsel gösterimde katsayı 'a' sayısı 1 ≤ |a| < 10 aralığında olmalıdır.<br>2. Adım: Virgülü 3'ün sağına almak için 6 basamak sağa kaydırırız.<br>3. Adım: Sayı büyüdükçe 10'un üssü küçülür, sonuç: <b>3,25 × 10⁻⁶</b> olur.",
      tactic: "Virgül sağa giderse üs küçülür (eksiye doğru gider). 1 ≤ a < 10 kuralını asla unutma!"
    },
    {
      id: 3,
      unit: "2. Ünite • Kareköklü İfadeler & Yaklaşık Değer",
      question: "Sayı doğrusu üzerinde işaretlenen √85 sayısına en yakın tam sayı aşağıdakilerden hangisidir?",
      options: ["A) 9", "B) 8", "C) 10", "D) 11"],
      correctIndex: 0,
      solution: "1. Adım: 85 sayısı 81 (9²) ile 100 (10²) arasındadır: 9 < √85 < 10.<br>2. Adım: 85 - 81 = 4 birim, 100 - 85 = 15 birim uzaklıktadır.<br>3. Adım: 81'e (yani 9'a) çok daha yakın olduğu için en yakın tam sayı <b>9</b>'dur.",
      tactic: "Aralık belirle, tam karelere uzaklık farkına bak! 4 < 15 olduğu için cevap tereddütsüz 9!"
    },
    {
      id: 4,
      unit: "3. Ünite • Cebirsel İfadeler ve Özdeşlikler",
      question: "Bir kenar uzunluğu 2x cm olan kare şeklindeki bir kartonun 4 köşesinden bir kenarı y cm olan kare parçalar kesilip atılıyor. Kalan şeklin cm² cinsinden alanını veren cebirsel ifade hangisidir?",
      options: ["A) (2x - y)²", "B) (2x - 4y)²", "C) 4(x - 2y)²", "D) (2x - 2y)(2x + 2y)"],
      correctIndex: 3,
      solution: "1. Adım: Kartonun başlangıç alanı: (2x)² = 4x².<br>2. Adım: Kesilen 4 adet küçük karenin alanı = 4 × y² = 4y².<br>3. Adım: Kalan Alan = 4x² - 4y² = <b>(2x - 2y)(2x + 2y)</b> iki kare farkı özdeşliğidir.",
      tactic: "Tüm alan - Atılan alan = 4x² - 4y² = (2x - 2y)(2x + 2y). MEB alan modelleme sorularının vazgeçilmezi!"
    },
    {
      id: 5,
      unit: "5. Ünite • Pisagor Bağıntısı ve Özel Üçgenler",
      question: "Düz bir duvara yaslanmış olan bir merdivenin ayağı duvardan 6 metre uzaktadır. Merdivenin duvara değdiği noktanın yerden yüksekliği 8 metre olduğuna göre, bu merdivenin boyu kaç metredir?",
      options: ["A) 9 metre", "B) 12 metre", "C) 10 metre", "D) 14 metre"],
      correctIndex: 2,
      solution: "1. Adım: Duvar ve zemin birbirine diktir (90°). Merdiven hipotenüstür.<br>2. Adım: Pisagor: a² + b² = c² => 6² + 8² = 36 + 64 = 100 => c = √100 = <b>10 metre</b>.<br>Özel Üçgen Kuralı: 3-4-5 üçgeninin 2 katıdır (6 - 8 - 10).",
      tactic: "3-4-5, 5-12-13, 8-15-17 özel dik üçgen katlarını ezbere bil; formül yazmadan 3 saniyede çöz!"
    }
  ];

  let currentQuizIndex = 0;
  const userAnswers = {};
  const userSelections = {};
  let activeQuizList = [...QUIZ_QUESTIONS];
  let dailyQuestionsList = [...QUIZ_QUESTIONS];
  let currentQuizMode = "daily"; // "daily" (5 soru) veya "weekly" (20 soru)
  let weeklyExamTimerInterval = null;
  let weeklyExamRemainingSec = 40 * 60;

  async function initQuiz() {
    const topicBadge = document.getElementById("quizTopicBadge");
    const scoreBadge = document.getElementById("quizScoreBadge");
    const questionText = document.getElementById("quizQuestionText");
    const optionsGrid = document.getElementById("quizOptionsGrid");
    const checkBtn = document.getElementById("quizCheckBtn");
    const nextBtn = document.getElementById("quizNextBtn");
    const resetBtn = document.getElementById("quizResetBtn");
    const statusMsg = document.getElementById("quizStatusMsg");
    const solutionBox = document.getElementById("quizSolutionBox");
    const solutionText = document.getElementById("quizSolutionText");
    const tacticText = document.getElementById("quizTacticText");
    const resultHeading = document.getElementById("quizResultHeading");
    const resultPill = document.getElementById("quizResultPill");
    const modeDailyBtn = document.getElementById("quizModeDailyBtn");
    const modeWeeklyBtn = document.getElementById("quizModeWeeklyBtn");
    const printReportBtn = document.getElementById("printWeeklyReportBtn");

    if (!questionText || !optionsGrid) return;

    let selectedOptionIndex = null;

    optionsGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".quiz-option-card");
      if (!card || card.classList.contains("disabled")) return;
      const allCards = optionsGrid.children;
      for (let i = 0; i < allCards.length; i++) allCards[i].classList.remove("selected");
      card.classList.add("selected");
      selectedOptionIndex = parseInt(card.dataset.optindex, 10);
      userSelections[currentQuizIndex] = selectedOptionIndex;
      const stepBtns = document.querySelectorAll(".quiz-step-btn");
      if (stepBtns[currentQuizIndex] && !userAnswers[currentQuizIndex]) {
        stepBtns[currentQuizIndex].classList.add("has-selection");
      }
      if (statusMsg) statusMsg.textContent = "Şıkkı işaretlediniz. 'Cevabı Kontrol Et' butonuna basınız.";
    });

    function rebuildStepper(count) {
      const stepper = document.getElementById("quizStepper");
      if (!stepper) return;
      stepper.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const btn = document.createElement("button");
        btn.className = `quiz-step-btn ${i === currentQuizIndex ? "active" : ""}`;
        btn.dataset.qindex = i;
        btn.textContent = `Soru ${i + 1}`;
        btn.addEventListener("click", () => renderQuestion(i));
        stepper.appendChild(btn);
      }
    }

    // Günlük 5 soruyu dinamik olarak API'den veya Supabase'den çek
    let questionsLoaded = false;
    try {
      if (window.MH_DB && typeof window.MH_DB.getQuizQuestions === "function") {
        const dbQuestions = await window.MH_DB.getQuizQuestions();
        if (Array.isArray(dbQuestions) && dbQuestions.length >= 5) {
          dailyQuestionsList = dbQuestions.slice(0, 5).map((q, idx) => {
            const rawOpts = q.options;
            const parsedOpts = Array.isArray(rawOpts) ? rawOpts : (typeof rawOpts === "string" ? JSON.parse(rawOpts || "[]") : []);
            let cIdx = typeof q.correctIndex === "number" ? q.correctIndex : parseInt(q.correctIndex, 10);
            if (isNaN(cIdx)) {
              const map = { A: 0, B: 1, C: 2, D: 3 };
              cIdx = map[String(q.correctIndex || "").trim().toUpperCase()] ?? 0;
            }
            return {
              id: q.id || idx + 1,
              unit: q.unit || `Soru ${idx + 1}`,
              topic: q.unit || "LGS Matematik",
              question: q.question || q.question_text,
              options: parsedOpts.length === 4 ? parsedOpts : QUIZ_QUESTIONS[idx % QUIZ_QUESTIONS.length].options,
              correctIndex: cIdx,
              solution: q.solution || q.explanation || "Doğru seçenek formül ve işlem adımlarıyla doğrulanmıştır.",
              tactic: q.tactic || "Merdiye Hoca Uyarısı: Soru kökünü ve verilen sayısal değerleri ilk adımda belirleyin!",
              diagramSvg: q.diagramSvg || null,
              imageUrl: q.imageUrl || null
            };
          });
          questionsLoaded = true;
        }
      }
    } catch (e) {}

    if (!questionsLoaded) {
      try {
        const res = await fetch("/api/quiz-questions/daily");
        if (res.ok) {
          const dailyQuestions = await res.json();
          if (Array.isArray(dailyQuestions) && dailyQuestions.length >= 5) {
            dailyQuestionsList = dailyQuestions.slice(0, 5).map((q, idx) => {
              const rawOpts = q.options;
              const parsedOpts = Array.isArray(rawOpts) ? rawOpts : (typeof rawOpts === "string" ? JSON.parse(rawOpts || "[]") : []);
              let cIdx = typeof q.correctIndex === "number" ? q.correctIndex : parseInt(q.correctIndex, 10);
              if (isNaN(cIdx)) {
                const map = { A: 0, B: 1, C: 2, D: 3 };
                cIdx = map[String(q.correctIndex || "").trim().toUpperCase()] ?? 0;
              }
              return {
                id: q.id || idx + 1,
                unit: q.unit || `Soru ${idx + 1}`,
                topic: q.unit || "LGS Matematik",
                question: q.question || q.question_text,
                options: parsedOpts.length === 4 ? parsedOpts : QUIZ_QUESTIONS[idx % QUIZ_QUESTIONS.length].options,
                correctIndex: cIdx,
                solution: q.solution || q.explanation || "Doğru seçenek formül ve işlem adımlarıyla doğrulanmıştır.",
                tactic: q.tactic || "Merdiye Hoca Uyarısı: Soru kökünü ve verilen sayısal değerleri ilk adımda belirleyin!",
                diagramSvg: q.diagramSvg || null,
                imageUrl: q.imageUrl || null
              };
            });
            questionsLoaded = true;
          }
        }
      } catch (e) {}
    }

    if (!questionsLoaded) {
      const todayStr = new Date().toISOString().slice(0, 10);
      let hash = 0;
      for (let i = 0; i < todayStr.length; i++) {
        hash = (hash << 5) - hash + todayStr.charCodeAt(i);
        hash |= 0;
      }
      dailyQuestionsList = [...QUIZ_QUESTIONS].sort((a, b) => {
        const hA = (a.id * 9301 + hash) % 49297;
        const hB = (b.id * 9301 + hash) % 49297;
        return hA - hB;
      }).slice(0, 5);
    }

    activeQuizList = [...dailyQuestionsList];

    // Haftalık 20 Soruluk Denemeyi Getir
    async function fetchWeeklyExamData() {
      let weeklyData = null;
      try {
        const res = await fetch("/api/weekly-exam");
        if (res.ok) {
          weeklyData = await res.json();
        }
      } catch (_) {}

      if (!weeklyData || !Array.isArray(weeklyData.questions) || weeklyData.questions.length === 0) {
        try {
          const raw = localStorage.getItem("merdiye_weekly_exam");
          if (raw) weeklyData = JSON.parse(raw);
        } catch (_) {}
      }

      if (weeklyData && Array.isArray(weeklyData.questions) && weeklyData.questions.length > 0) {
        return weeklyData;
      }

      // Varsayılan: 2026 MEB müfredatındaki 10 konuyu kapsayan 20 soruluk deneme
      const defaultQuestions = [];
      const topics = [
        "Çarpanlar ve Katlar", "Üslü İfadeler", "Kareköklü İfadeler",
        "Veri Analizi", "Basit Olayların Olma Olasılığı", "Cebirsel İfadeler ve Özdeşlikler",
        "Doğrusal Denklemler ve Eğim", "Eşitsizlikler", "Üçgenler ve Pisagor",
        "Geometrik Cisimler"
      ];

      topics.forEach((t) => {
        if (window.MH_AI_GENERATOR && typeof window.MH_AI_GENERATOR.generateLocalQuestions === "function") {
          const qs = window.MH_AI_GENERATOR.generateLocalQuestions("8", t, "yeni_nesil", 2);
          qs.forEach(q => defaultQuestions.push(q));
        }
      });

      return {
        id: "default_weekly",
        title: "2026 MEB Uyumlu Haftalık Özel LGS Matematik Deneme Sınavı",
        difficulty: "yeni_nesil",
        durationMinutes: 40,
        questions: defaultQuestions.slice(0, 20)
      };
    }

    function startWeeklyExam(exam) {
      currentQuizMode = "weekly";
      activeQuizList = exam.questions.map((q, idx) => ({
        id: q.id || idx + 1,
        unit: q.topic || q.unit || `Soru ${idx + 1}`,
        topic: q.topic || q.unit || "LGS Matematik",
        question: q.question,
        options: Array.isArray(q.options) ? q.options : ["A", "B", "C", "D"],
        correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : (parseInt(q.correctIndex, 10) || 0),
        solution: q.solution || q.explanation || "Adım adım çözüm rehberi.",
        tactic: q.tactic || "Merdiye Hoca Sınav Taktiği: Soru kökünü ve verilen sayısal değerleri ilk adımda belirleyin!",
        diagramSvg: q.diagramSvg || null,
        imageUrl: q.imageUrl || null
      }));

      for (const k in userAnswers) delete userAnswers[k];
      for (const k in userSelections) delete userSelections[k];

      const completionCard = document.getElementById("quizCompletionCard");
      if (completionCard) completionCard.style.display = "none";

      const timerBar = document.getElementById("weeklyExamTimerBar");
      const titleLbl = document.getElementById("weeklyExamTitleLabel");
      const diffBadge = document.getElementById("weeklyExamDifficultyBadge");
      const timerCountdown = document.getElementById("weeklyExamCountdown");

      if (timerBar) timerBar.style.display = "flex";
      if (titleLbl) titleLbl.textContent = exam.title || "Haftalık Özel LGS Deneme Sınavı";
      if (diffBadge) diffBadge.textContent = exam.difficulty === "lgs_secici" ? "İleri Düzey (%1 Dilim)" : "Standart LGS Ayarı";

      if (weeklyExamTimerInterval) clearInterval(weeklyExamTimerInterval);
      weeklyExamRemainingSec = (exam.durationMinutes || exam.duration_minutes || 40) * 60;

      const updateTimerDisplay = () => {
        const mm = String(Math.floor(weeklyExamRemainingSec / 60)).padStart(2, "0");
        const ss = String(weeklyExamRemainingSec % 60).padStart(2, "0");
        if (timerCountdown) timerCountdown.textContent = `Kalan Süre: ${mm}:${ss}`;
      };
      updateTimerDisplay();

      weeklyExamTimerInterval = setInterval(() => {
        weeklyExamRemainingSec--;
        if (weeklyExamRemainingSec <= 0) {
          clearInterval(weeklyExamTimerInterval);
          weeklyExamTimerInterval = null;
          showToast("Süre doldu! Deneme sınavı sonuçlarınız ve Deneme Karneniz hazırlanıyor...", "info");
          renderQuizCompletion();
        } else {
          updateTimerDisplay();
        }
      }, 1000);

      rebuildStepper(activeQuizList.length);
      renderQuestion(0);
      showToast(`${activeQuizList.length} soruluk Haftalık Özel LGS Denemesi başladı. Başarılar! (Süre: ${exam.durationMinutes || 40} Dakika)`, "success");
    }

    function startDailyExam() {
      currentQuizMode = "daily";
      if (weeklyExamTimerInterval) {
        clearInterval(weeklyExamTimerInterval);
        weeklyExamTimerInterval = null;
      }
      const timerBar = document.getElementById("weeklyExamTimerBar");
      if (timerBar) timerBar.style.display = "none";

      for (const k in userAnswers) delete userAnswers[k];
      for (const k in userSelections) delete userSelections[k];

      const completionCard = document.getElementById("quizCompletionCard");
      if (completionCard) completionCard.style.display = "none";

      activeQuizList = [...dailyQuestionsList];
      rebuildStepper(activeQuizList.length);
      renderQuestion(0);
      showToast("Günün 5 soruluk mini sınavına geçildi.", "info");
    }

    modeDailyBtn?.addEventListener("click", () => {
      if (currentQuizMode === "daily") return;
      modeDailyBtn.classList.remove("btn-secondary");
      modeDailyBtn.classList.add("btn-primary");
      modeWeeklyBtn.classList.remove("btn-primary");
      modeWeeklyBtn.classList.add("btn-secondary");
      startDailyExam();
    });

    modeWeeklyBtn?.addEventListener("click", async () => {
      if (currentQuizMode === "weekly") return;
      modeWeeklyBtn.classList.remove("btn-secondary");
      modeWeeklyBtn.classList.add("btn-primary");
      modeDailyBtn.classList.remove("btn-primary");
      modeDailyBtn.classList.add("btn-secondary");

      const exam = await fetchWeeklyExamData();
      startWeeklyExam(exam);
    });

    function renderQuestion(idx) {
      const safeIdx = Math.max(0, Math.min(activeQuizList.length - 1, idx));
      currentQuizIndex = safeIdx;
      const q = activeQuizList[safeIdx] || QUIZ_QUESTIONS[safeIdx] || QUIZ_QUESTIONS[0];
      selectedOptionIndex = userAnswers[safeIdx]?.selectedIndex ?? (userSelections[safeIdx] ?? null);

      const allStepBtns = document.querySelectorAll(".quiz-step-btn");
      allStepBtns.forEach((btn, bIdx) => {
        btn.classList.toggle("active", bIdx === safeIdx);
        const ans = userAnswers[bIdx];
        if (ans) {
          btn.classList.toggle("correct", ans.isCorrect);
          btn.classList.toggle("wrong", !ans.isCorrect);
          btn.classList.remove("has-selection");
        } else {
          btn.classList.remove("correct", "wrong");
          btn.classList.toggle("has-selection", userSelections[bIdx] !== undefined);
        }
      });

      const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
      const wrongCount = Object.values(userAnswers).filter(a => !a.isCorrect).length;
      const totalQ = activeQuizList.length;

      if (currentQuizMode === "weekly") {
        const net = Math.max(0, correctCount - (wrongCount / 3));
        const score = Math.round(net * 5);
        if (scoreBadge) {
          scoreBadge.innerHTML = `LGS Neti: <b style="color: var(--primary);">${net.toFixed(2)} Net</b> &bull; Puan: <b>${score} / 100</b> &bull; Çözülen: <b>${Object.keys(userAnswers).length} / ${totalQ}</b>`;
        }
      } else {
        const score = correctCount * 20;
        const answeredCount = Object.keys(userAnswers).length;
        const rate = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
        if (scoreBadge) {
          scoreBadge.innerHTML = `Puan: <b style="color: var(--primary);">${score} / 100</b> &bull; Başarı: <b>%${rate}</b>`;
        }
      }

      if (topicBadge) topicBadge.textContent = q.unit;
      if (questionText) questionText.textContent = q.question;

      // Varsa SVG Görseli veya Resim
      const diagramWrap = document.getElementById("quizDiagramWrap");
      if (diagramWrap) {
        if (q.diagramSvg) {
          diagramWrap.style.display = "flex";
          diagramWrap.innerHTML = q.diagramSvg;
        } else if (q.imageUrl) {
          diagramWrap.style.display = "flex";
          diagramWrap.innerHTML = `<img src="${q.imageUrl}" style="max-height: 180px; max-width: 100%; object-fit: contain;">`;
        } else {
          diagramWrap.style.display = "none";
          diagramWrap.innerHTML = "";
        }
      }

      const letters = ["A", "B", "C", "D"];
      const isAlreadyAnswered = userAnswers[safeIdx] !== undefined;
      const cIdx = typeof q.correctIndex === "number" ? q.correctIndex : (parseInt(q.correctIndex, 10) || 0);

      optionsGrid.innerHTML = q.options.map((opt, oIdx) => {
        let cardClass = "quiz-option-card";
        if (selectedOptionIndex === oIdx) cardClass += " selected";
        if (isAlreadyAnswered) {
          cardClass += " disabled";
          if (oIdx === cIdx) cardClass += " correct-answer";
          else if (selectedOptionIndex === oIdx && !userAnswers[safeIdx].isCorrect) cardClass += " wrong-answer";
        }

        return `
          <div class="${cardClass}" data-optindex="${oIdx}">
            <div class="quiz-option-letter">${letters[oIdx] || ""}</div>
            <div style="font-weight: 700; font-size: 0.95rem;">${opt.replace(/^[A-D]\)\s*/, "")}</div>
          </div>
        `;
      }).join("");

      const allDone = Object.keys(userAnswers).length === activeQuizList.length;

      if (isAlreadyAnswered) {
        const isCorr = userAnswers[safeIdx].isCorrect;
        if (solutionBox) solutionBox.style.display = "block";
        if (solutionText) solutionText.innerHTML = q.solution || q.explanation || "";
        if (tacticText) tacticText.textContent = q.tactic || "Merdiye Hoca Uyarısı: Soru kökünü dikkatle okuyun!";
        if (resultHeading) {
          resultHeading.textContent = isCorr ? "Doğru Cevap" : "Yanlış Cevap - Detaylı Çözümü İnceleyin";
          resultHeading.style.color = isCorr ? "#059669" : "#DC2626";
        }
        if (resultPill) {
          resultPill.textContent = `Doğru Şık: ${letters[cIdx] || "A"}`;
          resultPill.className = isCorr ? "pdf-badge" : "pdf-badge gold";
        }
        if (checkBtn) checkBtn.style.display = "none";
        if (nextBtn) {
          if (safeIdx < activeQuizList.length - 1) {
            nextBtn.style.display = "inline-block";
            nextBtn.textContent = "Sonraki Soru";
          } else if (!allDone) {
            const firstUnanswered = activeQuizList.findIndex((_, i) => userAnswers[i] === undefined);
            if (firstUnanswered !== -1) {
              nextBtn.style.display = "inline-block";
              nextBtn.textContent = `Soru ${firstUnanswered + 1}'e Git`;
            } else {
              nextBtn.style.display = "none";
            }
          } else {
            nextBtn.style.display = "none";
          }
        }
        if (statusMsg) {
          statusMsg.textContent = isCorr ? "Tebrikler! Doğru çözdünüz." : "Bu soruda takıldınız. Taktik notunu inceleyin.";
        }

        if (allDone) {
          renderQuizCompletion();
        }
      } else {
        if (solutionBox) solutionBox.style.display = "none";
        if (checkBtn) checkBtn.style.display = "inline-block";
        if (nextBtn) nextBtn.style.display = "none";
        if (statusMsg) {
          statusMsg.textContent = selectedOptionIndex !== null
            ? "Şıkkı işaretlediniz. 'Cevabı Kontrol Et' butonuna basınız."
            : "Bir şık seçin ve 'Cevabı Kontrol Et' butonuna tıklayın.";
        }
      }
    }

    function renderQuizCompletion() {
      const completionCard = document.getElementById("quizCompletionCard");
      if (!completionCard) return;

      const scoreVal = document.getElementById("completionScoreVal");
      const correctVal = document.getElementById("completionCorrectVal");
      const levelVal = document.getElementById("completionLevelVal");
      const iconEl = document.getElementById("completionIcon");
      const titleEl = document.getElementById("completionTitle");
      const subtitleEl = document.getElementById("completionSubtitle");
      const adviceBox = document.getElementById("completionAdviceBox");
      const emailBtn = document.getElementById("quizShareEmailBtn");

      const totalQ = activeQuizList.length;
      const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
      const wrongCount = Object.values(userAnswers).filter(a => !a.isCorrect).length;
      const emptyCount = Math.max(0, totalQ - correctCount - wrongCount);

      if (currentQuizMode === "weekly") {
        if (printReportBtn) printReportBtn.style.display = "inline-block";
        const net = Math.max(0, correctCount - (wrongCount / 3));
        const score = Math.round(net * 5);

        if (scoreVal) scoreVal.textContent = `${net.toFixed(2)} Net (${score}/100)`;
        if (correctVal) correctVal.textContent = `${correctCount} D • ${wrongCount} Y • ${emptyCount} B`;

        let levelText = "";
        if (net >= 17) levelText = "Galatasaray & Fen Liseleri";
        else if (net >= 14) levelText = "Nitelikli Fen Lisesi";
        else if (net >= 10) levelText = "Nitelikli Anadolu Lisesi";
        else if (net >= 6) levelText = "Kazanım Pekiştirme";
        else levelText = "Temel Güçlendirme";

        if (levelVal) levelVal.textContent = levelText;
        if (iconEl) iconEl.textContent = `${net.toFixed(1)} Net`;
        if (titleEl) titleEl.textContent = "Haftalık Özel LGS Deneme Karnesi & Veli Raporu";
        if (subtitleEl) subtitleEl.textContent = "20 Soruluk Kapsamlı LGS Matematik Başarı Raporu ve Merdiye Hoca Değerlendirmesi";

        const topicStats = {};
        activeQuizList.forEach((q, idx) => {
          const t = q.topic || q.unit || "LGS Matematik";
          if (!topicStats[t]) topicStats[t] = { total: 0, correct: 0, wrong: 0, empty: 0 };
          topicStats[t].total++;
          const ans = userAnswers[idx];
          if (!ans) topicStats[t].empty++;
          else if (ans.isCorrect) topicStats[t].correct++;
          else topicStats[t].wrong++;
        });

        const topicRowsHtml = Object.entries(topicStats).map(([topicName, stat]) => {
          const tNet = Math.max(0, stat.correct - (stat.wrong / 3));
          const tPercent = Math.round((stat.correct / stat.total) * 100);
          const badgeStyle = tPercent >= 80 
            ? "background:#ECFDF5; color:#065F46; border:1px solid #A7F3D0;" 
            : (tPercent < 50 ? "background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;" : "background:#FEF3C7; color:#92400E; border:1px solid #FDE68A;");
          return `
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 8px 10px; font-weight: 700; color: var(--text-main); font-size: 0.85rem;">${escapeHtml(topicName)}</td>
              <td style="padding: 8px 10px; text-align: center; font-size: 0.85rem;">${stat.total}</td>
              <td style="padding: 8px 10px; text-align: center; color: #059669; font-weight: 800; font-size: 0.85rem;">${stat.correct}</td>
              <td style="padding: 8px 10px; text-align: center; color: #DC2626; font-weight: 800; font-size: 0.85rem;">${stat.wrong}</td>
              <td style="padding: 8px 10px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">${stat.empty}</td>
              <td style="padding: 8px 10px; text-align: center; font-weight: 800; font-size: 0.85rem;">${tNet.toFixed(2)}</td>
              <td style="padding: 8px 10px; text-align: center;">
                <span class="pdf-badge" style="${badgeStyle} font-size: 0.72rem; padding: 2px 6px;">%${tPercent}</span>
              </td>
            </tr>
          `;
        }).join("");

        const weakTopics = Object.entries(topicStats)
          .filter(([_, s]) => s.wrong > 0 || s.empty > 0)
          .map(([t, _]) => t);

        const weakNotice = weakTopics.length > 0
          ? `<div style="margin-top: 12px; padding: 10px 14px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; font-size: 0.84rem; color: #92400E;">
               <b>Öncelikli Tekrar Edilmesi Gereken Konular:</b> ${weakTopics.slice(0, 3).join(", ")}. Bu konularda formül pekiştirme ve soru turlaması yapılmalıdır.
             </div>`
          : `<div style="margin-top: 12px; padding: 10px 14px; background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 8px; font-size: 0.84rem; color: #065F46;">
               <b>Kusursuz Performans:</b> Tüm konularda tam isabet sağlandı! Mevcut çalışma disiplini korunmalıdır.
             </div>`;

        let adviceHtml = `
          <div style="background: var(--bg-white); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; margin-bottom: 16px;">
            <div style="font-weight: 900; font-size: 0.95rem; color: var(--text-main); margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <span>Öğrenci Haftalık Deneme Karnesi (Konu Dağılımı)</span>
              <span class="pdf-badge gold">LGS Kuralı: 3 Yanlış 1 Doğruyu Götürür</span>
            </div>
            
            <div style="overflow-x: auto; margin-bottom: 12px;">
              <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                  <tr style="background: var(--bg-card); border-bottom: 2px solid var(--border-color); font-size: 0.76rem; text-transform: uppercase; color: var(--text-muted);">
                    <th style="padding: 8px 10px;">LGS Konusu</th>
                    <th style="padding: 8px 10px; text-align: center;">Soru</th>
                    <th style="padding: 8px 10px; text-align: center;">Doğru</th>
                    <th style="padding: 8px 10px; text-align: center;">Yanlış</th>
                    <th style="padding: 8px 10px; text-align: center;">Boş</th>
                    <th style="padding: 8px 10px; text-align: center;">Net</th>
                    <th style="padding: 8px 10px; text-align: center;">Başarı</th>
                  </tr>
                </thead>
                <tbody>
                  ${topicRowsHtml}
                </tbody>
              </table>
            </div>

            ${weakNotice}

            <div style="margin-top: 16px; padding: 16px; background: #FAF5FF; border: 1.5px solid #E9D5FF; border-radius: 10px;">
              <div style="font-weight: 900; color: #6B21A8; font-size: 0.92rem; margin-bottom: 8px;">
                Merdiye Hoca Veli Bilgilendirme Raporu &amp; Koçluk Yorumu:
              </div>
              <div style="font-size: 0.86rem; color: #4C1D95; line-height: 1.6;">
                Öğrencimiz 20 soruluk LGS matematik deneme sınavını <b>${net.toFixed(2)} Net</b> ile tamamlamıştır.
                ${net >= 16 
                  ? "Öğrencimiz LGS'de üst dilim (%1-2 bandı) için çok güçlü bir temele sahiptir. Düzenli deneme çözümü ve süre turlaması stratejisiyle sınav anı heyecanını yönetmesi yeterli olacaktır." 
                  : (net >= 11 
                    ? "Öğrencimizin temel kavram hakimiyeti iyi seviyededir; ancak yeni nesil kurgulu ve görsel analiz gerektiren sorularda işlem adımlarını hızlandırması ve soru turlama tekniğini pekiştirmesi gerekmektedir." 
                    : "Öğrencimizin temel matematik kazanımlarında acil pekiştirme ihtiyacı bulunmaktadır. Haftalık planlı 1'e 1 özel ders koçluğu ve odaklı soru föyü takibi ile hedeflenen net sıçraması 2 ayda sağlanabilir.")}
              </div>
            </div>
          </div>
        `;

        if (adviceBox) adviceBox.innerHTML = adviceHtml;

        if (emailBtn) {
          const subject = encodeURIComponent(`Haftalık LGS Deneme Karnesi (${net.toFixed(2)} Net)`);
          const body = encodeURIComponent(`Merhaba Merdiye Hocam,\n\nWeb sitenizdeki 20 soruluk Haftalık Özel LGS Denemesini tamamladım.\nSonucum: ${net.toFixed(2)} Net (${correctCount} Doğru, ${wrongCount} Yanlış, ${emptyCount} Boş).\nDeneme Karnemi ve Veli Bilgilendirme Raporumu birlikte değerlendirmek ve 1'e 1 ders koçluğu almak istiyorum.`);
          emailBtn.href = `mailto:merdiyehocam@gmail.com?subject=${subject}&body=${body}`;
          emailBtn.textContent = "Karnemi Merdiye Hoca'ya Danış";
        }

      } else {
        if (printReportBtn) printReportBtn.style.display = "none";
        const score = correctCount * 20;
        if (scoreVal) scoreVal.textContent = `${score} / 100`;
        if (correctVal) correctVal.textContent = `${correctCount} / 5 Doğru`;

        let levelText = "";
        let adviceHtml = "";
        let icon = `${correctCount}/5`;

        if (score === 100) {
          levelText = "Galatasaray & Fen Liseleri";
          icon = "5/5";
          adviceHtml = `
            <div style="background: #ECFDF5; border: 1.5px solid #A7F3D0; border-radius: var(--radius-md); padding: 14px; margin-bottom: 14px; color: #065F46; line-height: 1.6;">
              <b>Tebrikler! 5'te 5 Tam Başarı (%100).</b><br>
              Temel ve yeni nesil MEB kazanımlarına tam hakimsin. LGS'de <b>20'de 20 net</b> için sınav anındaki süre turlamasını koruman yeterli. Aşağıdan hedef liselerin durumunu inceleyebilirsin.
            </div>
          `;
        } else if (score >= 80) {
          levelText = "Nitelikli Fen Lisesi";
          icon = "4/5";
          adviceHtml = `
            <div style="background: #FAF8FE; border: 1.5px solid var(--primary-border); border-radius: var(--radius-md); padding: 14px; margin-bottom: 14px; color: var(--text-main); line-height: 1.6;">
              <b>Güçlü Fen Lisesi Adayısın (%${score}).</b><br>
              Sadece 1 soruda takılma yaşadın. Sınav taktik çözüm adımlarını gözden geçirerek <b>20'de 20 hedefine</b> kolaylıkla ulaşabilirsin.
            </div>
          `;
        } else if (score >= 60) {
          levelText = "Nitelikli Anadolu Lisesi";
          icon = "3/5";
          adviceHtml = `
            <div style="background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: var(--radius-md); padding: 14px; margin-bottom: 14px; color: #92400E; line-height: 1.6;">
              <b>İyi Bir Temelin Var (%${score}).</b><br>
              Yeni nesil şekil ve grafik sorularında biraz pratik eksikliği görünüyor. Düzenli soru föyü çalışması ve <b>birebir soru takibi</b> ile netlerini hızla <b>16-18 bandına</b> çıkarabilirsin.
            </div>
          `;
        } else {
          levelText = "Gelişim Desteği Gerekli";
          icon = `${correctCount}/5`;
          adviceHtml = `
            <div style="background: #FEF2F2; border: 1.5px solid #FECACA; border-radius: var(--radius-md); padding: 14px; margin-bottom: 14px; color: #991B1B; line-height: 1.6;">
              <b>Temel Konuları Güçlendirme Zamanı (%${score}).</b><br>
              Kazanım eksiklerin bulunuyor. Haftalık planlı <b>1'e 1 özel ders koçluğu</b> ve özet föy çalışmaları ile 2 ayda <b>12-15 net seviyesine</b> rahatlıkla çıkabilirsin.
            </div>
          `;
        }

        if (levelVal) levelVal.textContent = levelText;
        if (iconEl) iconEl.textContent = icon;
        if (titleEl) titleEl.textContent = `Mini Deneme Sonucu: %${score} Başarı`;
        if (subtitleEl) subtitleEl.textContent = "5 Soruluk Seviye Tespit Sonucunuz ve Merdiye Hoca Değerlendirmesi";
        if (adviceBox) adviceBox.innerHTML = adviceHtml;

        if (emailBtn) {
          const subject = encodeURIComponent(`LGS Mini Deneme Sonucum (${score}/100)`);
          const body = encodeURIComponent(`Merhaba Merdiye Hocam,\n\nWeb sitenizdeki LGS mini denemesini tamamladım.\nSkorum: ${score}/100 (${correctCount}/5 Doğru).\nEksik konularım ve 1'e 1 özel ders koçluğunuz hakkında bilgi alabilir miyim?`);
          emailBtn.href = `mailto:merdiyehocam@gmail.com?subject=${subject}&body=${body}`;
          emailBtn.textContent = "Sonucumu E-posta ile Danış";
        }
      }

      completionCard.style.display = "block";
      setTimeout(() => completionCard.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }

    printReportBtn?.addEventListener("click", () => {
      window.print();
    });

    const simBtn = document.getElementById("quizApplyToSimBtn");
    if (simBtn) {
      simBtn.addEventListener("click", () => {
        const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
        const wrongCount = Object.values(userAnswers).filter(a => !a.isCorrect).length;
        const scaledCorrect = Math.max(0, Math.min(20, currentQuizMode === "weekly" ? correctCount : correctCount * 4));
        const scaledWrong = Math.max(0, Math.min(20 - scaledCorrect, currentQuizMode === "weekly" ? wrongCount : wrongCount * 4));
        const correctInput = document.getElementById("calcCorrect");
        const wrongInput = document.getElementById("calcWrong");
        if (correctInput) correctInput.value = scaledCorrect;
        if (wrongInput) wrongInput.value = scaledWrong;
        
        if (correctInput) {
          correctInput.dispatchEvent(new Event("input"));
        }
        
        const tabSchool = document.getElementById("tabModeSchool");
        const tabCalc = document.getElementById("tabModeCalc");
        const calcView = document.getElementById("calcView");
        const schoolView = document.getElementById("schoolView");
        if (tabSchool && tabCalc && calcView && schoolView) {
          tabSchool.classList.add("active");
          tabCalc.classList.remove("active");
          calcView.style.display = "none";
          schoolView.style.display = "block";
          renderSchoolSimulator(lastCalculatedNet);
        }
        document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
        showToast(`Tahmini ${lastCalculatedNet.toFixed(2)} net ile liseler simüle edildi!`, "success");
      });
    }

    const leadBtn = document.getElementById("quizTransferToLeadBtn");
    if (leadBtn) {
      leadBtn.addEventListener("click", () => {
        const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
        const totalCount = activeQuizList.length;
        const notesEl = document.getElementById("formNotes");
        if (notesEl) {
          notesEl.value = `${currentQuizMode === "weekly" ? "Haftalık 20 Soruluk Deneme" : "Mini LGS Deneme"} Skoru: ${correctCount}/${totalCount} Doğru. Hedef kazanım analizi ve özel ders planı talep ediyorum.`;
        }
        const netEl = document.getElementById("formCurrentNet");
        if (netEl) {
          if (correctCount >= 16) netEl.value = "17 - 20 Net";
          else if (correctCount >= 11) netEl.value = "12 - 16 Net";
          else if (correctCount >= 6) netEl.value = "6 - 11 Net";
          else netEl.value = "0 - 5 Net";
        }
        document.getElementById("tutoring")?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("formName")?.focus();
        showToast("Deneme sonucunuz ön başvuru formuna aktarıldı!", "info");
      });
    }

    if (checkBtn) {
      checkBtn.addEventListener("click", () => {
        if (selectedOptionIndex === null) {
          showToast("Lütfen önce bir şık seçiniz!", "info");
          return;
        }

        const q = activeQuizList[currentQuizIndex] || QUIZ_QUESTIONS[currentQuizIndex];
        const cIdx = typeof q.correctIndex === "number" ? q.correctIndex : (parseInt(q.correctIndex, 10) || 0);
        const isCorrect = selectedOptionIndex === cIdx;
        userAnswers[currentQuizIndex] = { selectedIndex: selectedOptionIndex, isCorrect };

        if (isCorrect) {
          showToast("Tebrikler, doğru cevap!", "success");
        } else {
          showToast("Yanlış cevap. Çözüm taktiğini mutlaka inceleyin.", "info");
        }

        renderQuestion(currentQuizIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (currentQuizIndex < activeQuizList.length - 1) {
          renderQuestion(currentQuizIndex + 1);
        } else {
          const firstUnanswered = activeQuizList.findIndex((_, i) => userAnswers[i] === undefined);
          if (firstUnanswered !== -1) {
            renderQuestion(firstUnanswered);
          }
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        for (const k in userAnswers) delete userAnswers[k];
        for (const k in userSelections) delete userSelections[k];
        const completionCard = document.getElementById("quizCompletionCard");
        if (completionCard) completionCard.style.display = "none";
        showToast("Test sıfırlandı. İyi denemeler!", "info");
        renderQuestion(0);
        document.getElementById("mini-quiz")?.scrollIntoView({ behavior: "smooth" });
      });
    }

    rebuildStepper(activeQuizList.length);
    renderQuestion(0);
  }

  // 8d. Öğrenci & Veli Yorumları Filtreleme Motoru
  function initTestimonialsFilter() {
    const filterButtons = document.querySelectorAll(".testi-filter-btn");
    const cards = document.querySelectorAll(".testi-card");

    if (filterButtons.length === 0 || cards.length === 0) return;

    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const category = btn.dataset.testiCat || "all";

        cards.forEach(card => {
          const cardCat = card.dataset.category || "";
          if (category === "all" || cardCat === category) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // 9. Özel Ders Ön Başvuru Formu & E-posta Bildirimi
  function initTutoringForm() {
    const form = document.getElementById("tutoringForm");
    const phoneInput = document.getElementById("formPhone");
    const nameInput = document.getElementById("formName");

    // Canlı telefon formatlama: 05XX XXX XX XX
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.startsWith("90")) val = val.slice(2);
        if (val.length > 0 && !val.startsWith("0")) val = "0" + val;
        val = val.slice(0, 11);
        let formatted = "";
        if (val.length <= 4) {
          formatted = val;
        } else if (val.length <= 7) {
          formatted = `${val.slice(0, 4)} ${val.slice(4)}`;
        } else if (val.length <= 9) {
          formatted = `${val.slice(0, 4)} ${val.slice(4, 7)} ${val.slice(7)}`;
        } else {
          formatted = `${val.slice(0, 4)} ${val.slice(4, 7)} ${val.slice(7, 9)} ${val.slice(9, 11)}`;
        }
        e.target.value = formatted;
      });
    }

    function getFormData() {
      const name = nameInput?.value.trim() || "";
      const role = document.getElementById("formRole")?.value || "Öğrenci";
      const phone = phoneInput?.value.trim() || "";
      const city = document.getElementById("formCity")?.value.trim() || "";
      const currentNet = document.getElementById("formCurrentNet")?.value || "0 - 5 Net";
      const targetSchool = document.getElementById("formTargetSchool")?.value.trim() || "Fen Lisesi";
      const notes = document.getElementById("formNotes")?.value.trim() || "";

      return { name, role, phone, city, currentNet, targetSchool, notes };
    }

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = getFormData();

        if (!data.name || data.name.length < 2) {
          showToast("Lütfen ad ve soyadınızı eksiksiz giriniz.", "info");
          nameInput?.focus();
          return;
        }

        const digits = data.phone.replace(/\D/g, "");
        const normalized = digits.startsWith("0") ? digits : "0" + digits;
        if (normalized.length !== 11 || !normalized.startsWith("05")) {
          showToast("Lütfen geçerli bir cep telefonu giriniz (Örn: 05XX XXX XX XX).", "info");
          phoneInput?.focus();
          return;
        }

        const submitBtn = form.querySelector("button[type='submit']");
        const originalBtnText = submitBtn ? submitBtn.textContent : "Başvuru Talebini Gönder";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Kaydediliyor...";
        }

        try {
          if (window.MH_DB && typeof window.MH_DB.createLead === "function") {
            const res = await window.MH_DB.createLead(data);
            if (res && res.success) {
              const msg = res.mode === "supabase"
                ? "Başvurunuz Merdiye Hoca veritabanına başarıyla kaydedildi! En kısa sürede aranacaksınız."
                : "Başvurunuz başarıyla iletildi! En kısa sürede aranacaksınız.";
              showToast(msg, "success");
              form.reset();
              return;
            }
          }

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
            showToast("Başvurunuz kaydedildi! Merdiye Hocam en kısa sürede iletişime geçecektir.", "success");
            form.reset();
          }
        } catch (err) {
          saveLocalLead(data);
          showToast("Başvurunuz kaydedildi! Merdiye Hocam en kısa sürede iletişime geçecektir.", "success");
          form.reset();
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
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
    const faqContainer = document.querySelector(".faq-accordion") || document.querySelector(".faq-grid") || document.getElementById("faq");
    if (!faqContainer) return;
    faqContainer.addEventListener("click", (e) => {
      const question = e.target.closest(".faq-question");
      if (!question) return;
      const item = question.closest(".faq-item");
      if (!item) return;
      const isOpen = item.classList.contains("open");
      const allOpen = faqContainer.querySelectorAll(".faq-item.open");
      for (let i = 0; i < allOpen.length; i++) allOpen[i].classList.remove("open");
      if (!isOpen) {
        item.classList.add("open");
      }
    });
  }

  // 11. Mobil Hamburger Menü
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const isOpen = navMenu.classList.contains("open");
      mobileToggle.innerHTML = isOpen
        ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        : '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
    });

    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileToggle.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
      });
    });
  }

  // 12. Hero Instant Email Trial Button
  const heroInstantTrialBtn = document.getElementById("heroInstantTrialBtn");
  if (heroInstantTrialBtn) {
    heroInstantTrialBtn.addEventListener("click", () => {
      showToast("LGS Pro Deneme Sınavı için e-posta açılıyor...", "success");
      try {
        fetch("/api/analytics/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_download: true, pdf_id: "pdf-14" })
        }).catch(() => {});
      } catch (e) {}
    });
  }

  // 12b. Mobile Bottom App Bar Navigation & Active Section Tracking
  function initMobileNavigation() {
    const mobileBar = document.getElementById("mobileBottomBar");
    const mobileItems = mobileBar ? mobileBar.querySelectorAll(".mobile-bar-item") : [];
    const desktopLinks = document.querySelectorAll(".nav-link");

    const sections = ["hero", "pdf-portal", "mini-quiz", "calculator", "tutoring"];
    const sectionEls = sections.map(id => document.getElementById(id)).filter(Boolean);

    let isProgrammaticScroll = false;
    let scrollTimeout = null;

    function setActiveSection(targetId) {
      if (!targetId) return;
      mobileItems.forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-tab") === targetId);
      });
      desktopLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === `#${targetId}`) {
          link.classList.add("active");
        } else if (href && href.startsWith("#")) {
          link.classList.remove("active");
        }
      });
    }

    function lockProgrammaticScroll() {
      isProgrammaticScroll = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isProgrammaticScroll = false;
      }, 750);
    }

    if (mobileBar) {
      mobileBar.addEventListener("click", (e) => {
        const item = e.target.closest(".mobile-bar-item");
        if (!item) return;
        const targetId = item.getAttribute("data-tab");
        if (targetId) {
          lockProgrammaticScroll();
          setActiveSection(targetId);
        }
      });
    }

    desktopLinks.forEach(link => {
      link.addEventListener("click", () => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const targetId = href.slice(1);
          lockProgrammaticScroll();
          setActiveSection(targetId);
        }
      });
    });

    if ("IntersectionObserver" in window && sectionEls.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        if (isProgrammaticScroll) return;
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRect.height - a.intersectionRect.height);
          const topEntry = visible[0];
          if (topEntry && topEntry.target && topEntry.target.id) {
            setActiveSection(topEntry.target.id);
          }
        }
      }, {
        rootMargin: "-15% 0px -40% 0px",
        threshold: [0.15, 0.35, 0.6]
      });

      sectionEls.forEach(sec => observer.observe(sec));
    }
  }

  // 13. Başlatma
  initMobileNavigation();
  setCatalog(PDF_CATALOG);
  syncCatalog();
  pingVisitor();
  initCountdown();
  initCalculator();
  initSchoolSimulator();
  initQuiz();
  initTestimonialsFilter();
  initTutoringForm();
  initFAQ();
});
