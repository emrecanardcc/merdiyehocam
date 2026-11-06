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
      badge: " EN ÇOK İNDİRİLEN",
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
      badge: " 2025/2026 PROVA",
      popular: true,
      topics: ["20 Yeni Nesil Soru", "Cevap Anahtarı", "Optik Form Rehberi", "Net Skalası", "MEB Uyum"]
    }
  ];

  let activeCatalog = [];
  const pdfMap = new Map();

  function setCatalog(items) {
    pdfMap.clear();
    activeCatalog = (items || []).map(item => {
      const topics = Array.isArray(item.topics) ? item.topics : [];
      const topicsStr = topics.join(" ");
      const searchCorpus = (
        (item.title || "") + " " +
        (item.subtitle || "") + " " +
        (item.unit || "") + " " +
        topicsStr
      ).toLowerCase();

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
          activeCatalog = dbCatalog.map(item => ({
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

    const query = searchQuery.trim().toLowerCase();
    const hasQuery = query.length > 0;
    const isAll = currentCategory === "all";
    const isPopular = currentCategory === "popular";

    const filtered = [];
    for (let i = 0; i < activeCatalog.length; i++) {
      const item = activeCatalog[i];
      const matchCat = isAll ? true : (isPopular ? item.popular : item.category === currentCategory);
      if (!matchCat) continue;
      if (hasQuery && item._searchCorpus.indexOf(query) === -1) continue;
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
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--primary); margin-bottom: 10px;"> Bu Föyde Öğreneceğiniz MEB Kazanımları:</h4>
          <ul style="list-style: none; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7;">
            ${topicsList}
          </ul>
        </div>
      </div>

      <!-- Tab 3: Örnek Soru & Taktik -->
      <div id="modalTabSample" class="pdf-modal-content-panel" style="display: none;">
        <div style="background: #FAF8FE; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; margin-bottom: 18px;">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;"> Tipik Sınav Sorusu Modeli:</h4>
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
          <a href="${fileLink}" download="${item.filename}" class="btn btn-primary btn-sm"> Hemen İndir</a>
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
    const icon = type === "success" ? "" : type === "error" ? "" : "ℹ";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
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
      if (typeof renderSchoolSimulator === "function") {
        renderSchoolSimulator(net);
      }

      if (adviceDisplay && recDisplay) {
        if (net >= 18) {
          adviceDisplay.textContent = " Muazzam Performans! Galatasaray, Kabataş ve Fen Liseleri kapılarını aralıyorsun. Soru kaçırma payını sıfıra indirmek için 'Yeni Nesil Pro Deneme' ve zaman turlaması yap.";
          recDisplay.innerHTML = " <b>Önerilen Föy:</b> <a href='assets/pdf/14_LGS_Matematik_Yeni_Nesil_Pro_Deneme_1.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>LGS Yeni Nesil Pro Deneme-1</a>";
        } else if (net >= 14) {
          adviceDisplay.textContent = " Çok Başarılı! Nitelikli liseler için sağlam bir konumdasın. 20'de 20'ye ulaşmak için şekil ve modelleme sorularına (Cebirsel İfadeler & Geometrik Cisimler) odaklan.";
          recDisplay.innerHTML = " <b>Önerilen Föy:</b> <a href='assets/pdf/06_Cebirsel_Ifadeler_ve_Ozdeslikler.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>Cebirsel İfadeler ve Özdeşlikler Föyü</a>";
        } else if (net >= 8) {
          adviceDisplay.textContent = " Yükseliş Potansiyeli Yüksek! Temel kazanımların var ancak yeni nesil paragraf sorularında tuzaklara düşüyorsun. 'Kareköklü İfadeler' ve 'Eğim' taktiklerini gözden geçir.";
          recDisplay.innerHTML = " <b>Önerilen Föy:</b> <a href='assets/pdf/03_Karekoklu_Ifadeler_Yeni_Nesil.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>Kareköklü İfadeler & Yaklaşık Değer</a>";
        } else {
          adviceDisplay.textContent = " Harekete Geçme Zamanı! Korkacak hiçbir şey yok; matematikte doğru metot ve birebir takip ile 3-4 ayda 12-15 nete çıkmak mümkün. Temel kamp föylerinden başla ve özel ders desteği al.";
          recDisplay.innerHTML = " <b>Önerilen Föy:</b> <a href='assets/pdf/01_Carpanlar_ve_Katlar_EBOB_EKOK.pdf' download style='color: var(--primary); text-decoration: underline; font-weight: 800;'>Çarpanlar ve Katlar & EBOB-EKOK Temel Föyü</a>";
        }
      }
    }

    correctInput.addEventListener("input", recalculate);
    wrongInput.addEventListener("input", recalculate);
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
        statusText = " Kazanabilirsin! Puanın Yeterli";
      } else if (diff <= 12.0) {
        const neededNet = Math.max(1, Math.ceil(diff / 5.0));
        statusClass = "borderline";
        statusText = ` Sınırda (${neededNet} Matematik Neti Daha Gerekli)`;
      } else {
        const neededNet = Math.max(1, Math.ceil(diff / 5.0));
        statusClass = "need-work";
        statusText = ` +${neededNet} Matematik Neti Gelişim Şart`;
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
  let activeQuizList = [...QUIZ_QUESTIONS];

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
    const stepBtns = document.querySelectorAll(".quiz-step-btn");

    if (!questionText || !optionsGrid) return;

    optionsGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".quiz-option-card");
      if (!card || card.classList.contains("disabled")) return;
      const allCards = optionsGrid.children;
      for (let i = 0; i < allCards.length; i++) allCards[i].classList.remove("selected");
      card.classList.add("selected");
      selectedOptionIndex = parseInt(card.dataset.optindex, 10);
      if (statusMsg) statusMsg.textContent = "Şıkkı işaretlediniz. 'Cevabı Kontrol Et' butonuna basınız.";
    });

    // Günlük soruları dinamik olarak API'den veya Supabase'den çek
    try {
      if (window.MH_DB && typeof window.MH_DB.getQuizQuestions === "function") {
        const dbQuestions = await window.MH_DB.getQuizQuestions();
        if (Array.isArray(dbQuestions) && dbQuestions.length > 0) {
          activeQuizList = dbQuestions.slice(0, 5).map((q, idx) => ({
            id: q.id || idx + 1,
            unit: q.unit || `Soru ${idx + 1}`,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            solution: q.solution || q.explanation || "Doğru seçenek formül ve işlem adımlarıyla doğrulanmıştır.",
            tactic: q.tactic || "Merdiye Hoca Uyarısı: Soru kökünü ve verilen sayısal değerleri ilk adımda belirleyin!"
          }));
        }
      }

      if (activeQuizList.length === 0) {
        const res = await fetch("/api/quiz-questions/daily");
        if (res.ok) {
          const dailyQuestions = await res.json();
          if (Array.isArray(dailyQuestions) && dailyQuestions.length > 0) {
            activeQuizList = dailyQuestions.map((q, idx) => ({
              id: q.id || idx + 1,
              unit: q.unit || `Soru ${idx + 1}`,
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              solution: q.solution || q.explanation || "Doğru seçenek formül ve işlem adımlarıyla doğrulanmıştır.",
              tactic: q.tactic || "Merdiye Hoca Uyarısı: Soru kökünü ve verilen sayısal değerleri ilk adımda belirleyin!"
            }));
          }
        }
      }
    } catch (e) {
      // Çevrimdışı / GitHub Pages için güne göre deterministik soru seçimi
      const todayStr = new Date().toISOString().slice(0, 10);
      let hash = 0;
      for (let i = 0; i < todayStr.length; i++) {
        hash = (hash << 5) - hash + todayStr.charCodeAt(i);
        hash |= 0;
      }
      activeQuizList = [...QUIZ_QUESTIONS].sort((a, b) => {
        const hA = (a.id * 9301 + hash) % 49297;
        const hB = (b.id * 9301 + hash) % 49297;
        return hA - hB;
      }).slice(0, 5);
    }

    let selectedOptionIndex = null;

    function renderQuestion(idx) {
      currentQuizIndex = idx;
      const q = activeQuizList[idx] || QUIZ_QUESTIONS[idx];
      selectedOptionIndex = userAnswers[idx]?.selectedIndex ?? null;

      stepBtns.forEach((btn, bIdx) => {
        btn.classList.toggle("active", bIdx === idx);
        const ans = userAnswers[bIdx];
        if (ans) {
          btn.classList.toggle("correct", ans.isCorrect);
          btn.classList.toggle("wrong", !ans.isCorrect);
          const iconSpan = btn.querySelector("span");
          if (iconSpan) iconSpan.textContent = ans.isCorrect ? " [Doğru]" : " [Yanlış]";
        } else {
          btn.classList.remove("correct", "wrong");
          const iconSpan = btn.querySelector("span");
          if (iconSpan) iconSpan.textContent = "";
        }
      });

      const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
      const answeredCount = Object.keys(userAnswers).length;
      const score = correctCount * 20;
      const rate = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
      if (scoreBadge) {
        scoreBadge.innerHTML = `Puan: <b style="color: var(--primary);">${score} / 100</b> &bull; Başarı: <b>%${rate}</b>`;
      }

      if (topicBadge) topicBadge.textContent = q.unit;
      if (questionText) questionText.textContent = q.question;

      const letters = ["A", "B", "C", "D"];
      const isAlreadyAnswered = userAnswers[idx] !== undefined;

      optionsGrid.innerHTML = q.options.map((opt, oIdx) => {
        let cardClass = "quiz-option-card";
        if (selectedOptionIndex === oIdx) cardClass += " selected";
        if (isAlreadyAnswered) {
          cardClass += " disabled";
          if (oIdx === q.correctIndex) cardClass += " correct-answer";
          else if (selectedOptionIndex === oIdx && !userAnswers[idx].isCorrect) cardClass += " wrong-answer";
        }

        return `
          <div class="${cardClass}" data-optindex="${oIdx}">
            <div class="quiz-option-letter">${letters[oIdx]}</div>
            <div style="font-weight: 700; font-size: 0.95rem;">${opt.replace(/^[A-D]\)\s*/, "")}</div>
          </div>
        `;
      }).join("");

      // Option click handled by Event Delegation on optionsGrid

      if (isAlreadyAnswered) {
        const isCorr = userAnswers[idx].isCorrect;
        if (solutionBox) solutionBox.style.display = "block";
        if (solutionText) solutionText.innerHTML = q.solution;
        if (tacticText) tacticText.textContent = q.tactic;
        if (resultHeading) {
          resultHeading.textContent = isCorr ? "Doğru Cevap" : "Yanlış Cevap - Detaylı Çözümü İnceleyin";
          resultHeading.style.color = isCorr ? "#059669" : "#DC2626";
        }
        if (resultPill) {
          resultPill.textContent = `Doğru Şık: ${letters[q.correctIndex]}`;
          resultPill.className = isCorr ? "pdf-badge" : "pdf-badge gold";
        }
        if (checkBtn) checkBtn.style.display = "none";
        if (nextBtn) {
          nextBtn.style.display = idx < activeQuizList.length - 1 ? "inline-block" : "none";
        }
        if (statusMsg) {
          statusMsg.textContent = isCorr ? "Tebrikler! Doğru çözdünüz (+20 Puan)." : "Bu soruda takıldınız. Taktik notunu inceleyin.";
        }

        const allDone = Object.keys(userAnswers).length === activeQuizList.length;
        if (allDone) {
          renderQuizCompletion(score, correctCount);
        }
      } else {
        if (solutionBox) solutionBox.style.display = "none";
        if (checkBtn) checkBtn.style.display = "inline-block";
        if (nextBtn) nextBtn.style.display = "none";
        if (statusMsg) statusMsg.textContent = "Bir şık seçin ve 'Cevabı Kontrol Et' butonuna tıklayın.";
      }
    }

    function renderQuizCompletion(score, correctCount) {
      const completionCard = document.getElementById("quizCompletionCard");
      if (!completionCard) return;

      const scoreVal = document.getElementById("completionScoreVal");
      const correctVal = document.getElementById("completionCorrectVal");
      const levelVal = document.getElementById("completionLevelVal");
      const iconEl = document.getElementById("completionIcon");
      const titleEl = document.getElementById("completionTitle");
      const adviceBox = document.getElementById("completionAdviceBox");
      const emailBtn = document.getElementById("quizShareEmailBtn");

      if (scoreVal) scoreVal.textContent = `${score} / 100`;
      if (correctVal) correctVal.textContent = `${correctCount} / 5 Doğru`;

      let levelText = "";
      let adviceHtml = "";
      let icon = "";

      if (score === 100) {
        levelText = "Galatasaray & Fen Liseleri";
        icon = "";
        adviceHtml = `
          <div style="background: #ECFDF5; border: 1.5px solid #A7F3D0; border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; color: #065F46; line-height: 1.6;">
            <b>Muhteşem Başarı! 5'te 5 Yaptınız (%100).</b><br>
            Tüm temel ve yeni nesil MEB kazanımlarına tam hakimsiniz. LGS'de 20'de 20 için sınav anındaki süre turlamasını korumanız yeterli. Liselerinizin simülasyonunu aşağıdan inceleyebilirsiniz.
          </div>
        `;
      } else if (score >= 80) {
        levelText = "Nitelikli Fen Lisesi";
        icon = "";
        adviceHtml = `
          <div style="background: #FAF8FE; border: 1.5px solid var(--primary-border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; color: var(--text-main); line-height: 1.6;">
            <b>Tebrikler! Güçlü Bir Fen Lisesi Adayısınız (%${score}).</b><br>
            Sadece 1 soruda küçük bir takılma yaşadınız. Taktik çözüm notlarını gözden geçirerek 20'de 20 seviyesine kolayca ulaşabilirsiniz.
          </div>
        `;
      } else if (score >= 60) {
        levelText = "Nitelikli Anadolu Lisesi";
        icon = "";
        adviceHtml = `
          <div style="background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; color: #92400E; line-height: 1.6;">
            <b>İyi Bir Temeliniz Var, Gelişim Alanları Mevcut (%${score}).</b><br>
            Yeni nesil modelleme ve şekil sorularında pratik eksikliği görünüyor. Düzenli soru föyü tekrarı ve soru çözüm koçluğu ile netlerinizi hızla 16-18 bandına çıkarabilirsiniz.
          </div>
        `;
      } else {
        levelText = "Gelişim Desteği Gerekli";
        icon = "";
        adviceHtml = `
          <div style="background: #FEF2F2; border: 1.5px solid #FECACA; border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; color: #991B1B; line-height: 1.6;">
            <b>Temel Konuları Güçlendirme Zamanı (%${score})!</b><br>
            Bazı kazanımlarda açıklar görünüyor. Korkmayın; haftalık planlı 1'e 1 özel ders desteği ve özet föy çalışmaları ile 2 ayda 12-14 nete ulaşmak çok kolay.
          </div>
        `;
      }

      if (levelVal) levelVal.textContent = levelText;
      if (iconEl) iconEl.textContent = icon;
      if (titleEl) titleEl.textContent = `Tebrikler! Mini Deneme Tamamlandı: %${score} Başarı`;
      if (adviceBox) adviceBox.innerHTML = adviceHtml;

      if (emailBtn) {
        const subject = encodeURIComponent(`LGS Mini Deneme Sonucum (${score}/100)`);
        const body = encodeURIComponent(`Merhaba Merdiye Hocam,\n\nWeb sitenizdeki LGS mini denemesini tamamladım.\nSkorum: ${score}/100 (${correctCount}/5 Doğru).\nEksik konularım ve 1'e 1 özel ders koçluğunuz hakkında bilgi alabilir miyim?`);
        emailBtn.href = `mailto:merdiyehocam@gmail.com?subject=${subject}&body=${body}`;
        emailBtn.textContent = "Sonucumu E-posta ile Danış";
      }

      completionCard.style.display = "block";
    }

    const simBtn = document.getElementById("quizApplyToSimBtn");
    if (simBtn) {
      simBtn.addEventListener("click", () => {
        const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
        const projectedMathNet = Math.max(8.0, Math.min(20.0, parseFloat((correctCount * 3.8).toFixed(1))));
        const correctInput = document.getElementById("calcCorrect");
        const wrongInput = document.getElementById("calcWrong");
        if (correctInput) correctInput.value = Math.round(projectedMathNet);
        if (wrongInput) wrongInput.value = Math.max(0, 20 - Math.round(projectedMathNet));
        
        const tabSchool = document.getElementById("tabModeSchool");
        const tabCalc = document.getElementById("tabModeCalc");
        const calcView = document.getElementById("calcView");
        const schoolView = document.getElementById("schoolView");
        if (tabSchool && tabCalc && calcView && schoolView) {
          tabSchool.classList.add("active");
          tabCalc.classList.remove("active");
          calcView.style.display = "none";
          schoolView.style.display = "block";
          renderSchoolSimulator(projectedMathNet);
        }
        document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
        showToast(`Tahmini ${projectedMathNet} net ile liseler simüle edildi!`, "success");
      });
    }

    const leadBtn = document.getElementById("quizTransferToLeadBtn");
    if (leadBtn) {
      leadBtn.addEventListener("click", () => {
        const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
        const score = correctCount * 20;
        const notesEl = document.getElementById("formNotes");
        if (notesEl) {
          notesEl.value = `Mini LGS Deneme Skoru: ${score}/100 (${correctCount}/5 Doğru). Hedef kazanım analizi ve özel ders planı talep ediyorum.`;
        }
        const netEl = document.getElementById("formCurrentNet");
        if (netEl) {
          if (score >= 80) netEl.value = "17 - 20 Net";
          else if (score >= 60) netEl.value = "12 - 16 Net";
          else if (score >= 40) netEl.value = "6 - 11 Net";
          else netEl.value = "0 - 5 Net";
        }
        document.getElementById("tutoring")?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("formName")?.focus();
        showToast("Mini deneme sonucunuz ön başvuru formuna aktarıldı!", "info");
      });
    }

    if (checkBtn) {
      checkBtn.addEventListener("click", () => {
        if (selectedOptionIndex === null) {
          showToast("Lütfen önce bir şık seçiniz!", "info");
          return;
        }

        const q = activeQuizList[currentQuizIndex] || QUIZ_QUESTIONS[currentQuizIndex];
        const isCorrect = selectedOptionIndex === q.correctIndex;
        userAnswers[currentQuizIndex] = { selectedIndex: selectedOptionIndex, isCorrect };

        if (isCorrect) {
          showToast("Tebrikler, doğru cevap! +20 Puan kazandınız ", "success");
        } else {
          showToast("Yanlış cevap. Çözüm taktiğini mutlaka inceleyin ", "info");
        }

        renderQuestion(currentQuizIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (currentQuizIndex < activeQuizList.length - 1) {
          renderQuestion(currentQuizIndex + 1);
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        for (const k in userAnswers) delete userAnswers[k];
        const completionCard = document.getElementById("quizCompletionCard");
        if (completionCard) completionCard.style.display = "none";
        showToast("Test sıfırlandı. İyi denemeler!", "info");
        renderQuestion(0);
      });
    }

    stepBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const qIdx = parseInt(btn.dataset.qindex, 10);
        renderQuestion(qIdx);
      });
    });

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

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = getFormData();

        if (!data.name || !data.phone) {
          showToast("Lütfen zorunlu alanları doldurunuz.", "info");
          return;
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
    if (!mobileBar) return;

    const items = mobileBar.querySelectorAll(".mobile-bar-item");
    const sections = ["hero", "pdf-portal", "mini-quiz", "calculator", "tutoring"];
    const sectionEls = sections.map(id => document.getElementById(id)).filter(Boolean);

    mobileBar.addEventListener("click", (e) => {
      const item = e.target.closest(".mobile-bar-item");
      if (!item) return;
      items.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;
            items.forEach(item => {
              item.classList.toggle("active", item.getAttribute("data-tab") === currentId);
            });
          }
        });
      }, { threshold: 0.35 });

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
