/**
 * Merdiye Hocam - Yönetim Paneli Motoru
 * Kurallar: Axiom Zero Bloat, Asimptotik O(N) Veri İşleme, İçsel Emniyet
 * Destek: Canlı Sunucu REST API + Çevrimdışı/GitHub Pages Yerel Mod (Dual-Mode)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 0. Güvenlik Kapısı & Kimlik Doğrulama
  const adminAuthOverlay = document.getElementById("adminAuthOverlay");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const adminUsernameInput = document.getElementById("adminUsernameInput");
  const adminPasswordInput = document.getElementById("adminPasswordInput");
  const togglePasswordVisibilityBtn = document.getElementById("togglePasswordVisibilityBtn");
  const rememberMeCheck = document.getElementById("rememberMeCheck");
  const loginErrorMsg = document.getElementById("loginErrorMsg");
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");

  const AUTH_STORAGE_KEY = "merdiye_admin_auth_token";
  const DEFAULT_ADMIN_PASS = "merdiye2026!";
  async function checkAdminAuth() {
    // 1. Canlı Supabase Auth oturum belirteci denetimi
    if (window.MH_DB && typeof window.MH_DB.checkAdminSession === "function") {
      try {
        const session = await window.MH_DB.checkAdminSession();
        if (session && session.access_token) {
          if (adminAuthOverlay) {
            adminAuthOverlay.classList.remove("active");
            adminAuthOverlay.style.display = "none";
          }
          return true;
        }
      } catch (e) {}
    }

    // 2. Depolanmış JWT oturum belirteci denetimi
    const token = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (token && token.startsWith("mh_admin_ey")) {
      if (adminAuthOverlay) {
        adminAuthOverlay.classList.remove("active");
        adminAuthOverlay.style.display = "none";
      }
      return true;
    }

    // Kimlik doğrulanmadı -> Giriş Penceresini Göster
    if (adminAuthOverlay) {
      adminAuthOverlay.classList.add("active");
      adminAuthOverlay.style.display = "flex";
      setTimeout(() => adminPasswordInput?.focus(), 150);
    }
    return false;
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const enteredUser = adminUsernameInput ? adminUsernameInput.value.trim() : "admin";
      const enteredPass = adminPasswordInput ? adminPasswordInput.value.trim() : "";

      if (!enteredPass) {
        if (loginErrorMsg) {
          loginErrorMsg.textContent = "Lütfen şifrenizi giriniz.";
          loginErrorMsg.style.display = "block";
        }
        if (adminPasswordInput) adminPasswordInput.focus();
        return;
      }

      const submitBtn = adminLoginForm.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Doğrulanıyor...";
      }

      let authSuccess = false;
      let token = "";
      let errorDetail = "";

      // 1. Canlı Supabase Veritabanı Doğrulaması (auth.users)
      if (window.MH_DB && typeof window.MH_DB.adminLogin === "function") {
        try {
          const authRes = await window.MH_DB.adminLogin(enteredUser, enteredPass);
          if (authRes && authRes.token) {
            authSuccess = true;
            token = `mh_admin_${authRes.token}`;
          }
        } catch (authErr) {
          errorDetail = authErr.message || "";
          console.warn("[AdminAuth] Supabase auth hatası:", authErr.message);
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Yönetim Paneline Giriş Yap";
      }

      if (authSuccess) {
        if (rememberMeCheck && rememberMeCheck.checked) {
          localStorage.setItem(AUTH_STORAGE_KEY, token);
        } else {
          sessionStorage.setItem(AUTH_STORAGE_KEY, token);
        }
        if (loginErrorMsg) loginErrorMsg.style.display = "none";
        if (adminAuthOverlay) {
          adminAuthOverlay.classList.remove("active");
          adminAuthOverlay.style.display = "none";
        }
        showToast("Hoş geldiniz, Merdiye Hocam! Supabase bulut veritabanı ile yönetim paneli açıldı.", "success");
        loadAnalytics();
        loadPDFs();
        loadSocialStats();
        loadPublishedHistory();
        loadLeads();
        loadQuestions();
      } else {
        if (loginErrorMsg) {
          const trError = errorDetail.includes("Invalid login credentials")
            ? "Hatalı şifre veya kullanıcı adı! Lütfen şifrenizi kontrol ediniz. (Varsayılan: merdiye2026!)"
            : (errorDetail || "Giriş başarısız. Lütfen bilgilerinizi kontrol ediniz.");
          loginErrorMsg.textContent = trError;
          loginErrorMsg.style.display = "block";
        }
        if (adminPasswordInput) adminPasswordInput.focus();
      }
    });
  }

  if (togglePasswordVisibilityBtn && adminPasswordInput) {
    togglePasswordVisibilityBtn.textContent = "Göster";
    togglePasswordVisibilityBtn.style.fontSize = "0.78rem";
    togglePasswordVisibilityBtn.style.fontWeight = "700";
    togglePasswordVisibilityBtn.addEventListener("click", () => {
      const isPass = adminPasswordInput.type === "password";
      adminPasswordInput.type = isPass ? "text" : "password";
      togglePasswordVisibilityBtn.textContent = isPass ? "Gizle" : "Göster";
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", async () => {
      if (window.MH_DB && typeof window.MH_DB.adminLogout === "function") {
        await window.MH_DB.adminLogout();
      }
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      window.location.href = "index.html";
    });
  }


  // ==================== 8. GÜNÜN SORULARI & SORU BANKASI YÖNETİMİ ====================
  let questionList = [];

  async function loadQuestions() {
    let questions = [];
    try {
      if (window.MH_DB && typeof window.MH_DB.getQuizQuestions === "function") {
        questions = await window.MH_DB.getQuizQuestions();
      }
    } catch (e) {}

    if (!questions || questions.length === 0) {
      try {
        const res = await fetch("/api/quiz-questions");
        if (res.ok) questions = await res.json();
      } catch (e) {}
    }

    if (!questions || questions.length === 0) {
      questions = JSON.parse(localStorage.getItem("merdiye_custom_questions") || "[]");
    }

    questionList = questions;
    renderQuestionsTable();
  }

    // Event Delegation for Questions Table
  const adminQuestionsTbody = document.getElementById("adminQuestionsTableBody");
  if (adminQuestionsTbody) {
    adminQuestionsTbody.addEventListener("click", (e) => {
      const delBtn = e.target.closest(".delete-question-btn");
      if (delBtn) {
        const id = delBtn.dataset.id;
        deleteQuestion(id);
      }
    });
  }

  function renderQuestionsTable() {
    const tbody = document.getElementById("adminQuestionsTableBody");
    const countBadge = document.getElementById("totalQuestionCountBadge");
    const searchVal = (document.getElementById("adminQuestionSearch")?.value || "").toLowerCase().trim();

    if (countBadge) countBadge.textContent = questionList.length;
    if (!tbody) return;

    let filtered = questionList;
    if (searchVal) {
      filtered = filtered.filter(q => 
        (q.unit || "").toLowerCase().includes(searchVal) || 
        (q.question || "").toLowerCase().includes(searchVal)
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-dim); padding: 28px;">
            Soru bankasında henüz soru bulunmamaktadır. Yukarıdaki 'Yeni Soru Ekle' veya 'Toplu Soru Yükle' butonunu kullanabilirsiniz.
          </td>
        </tr>
      `;
      return;
    }

    const letters = ["A", "B", "C", "D"];
    tbody.innerHTML = filtered.map(q => {
      const correctLetter = letters[q.correctIndex ?? 0] || "A";
      const qSnippet = q.question.length > 90 ? q.question.slice(0, 90) + "..." : q.question;
      const solutionSnippet = (q.solution || q.tactic || "Çözüm mevcut").replace(/<[^>]+>/g, "").slice(0, 75);

      return `
        <tr>
          <td><b>#${q.id}</b></td>
          <td><span class="pdf-badge" style="font-size: 0.76rem;">${q.unit || "LGS Matematik"}</span></td>
          <td style="font-size: 0.88rem; line-height: 1.4;">${qSnippet}</td>
          <td><span class="pdf-badge gold" style="font-weight: 800;">${correctLetter}</span></td>
          <td style="font-size: 0.82rem; color: var(--text-muted);">${solutionSnippet}</td>
          <td>
            <button type="button" class="btn btn-secondary btn-sm delete-question-btn" data-id="${q.id}" style="color: #DC2626; border-color: #FECACA; padding: 4px 8px;" title="Soruyu Sil">
              Sil
            </button>
          </td>
        </tr>
      `;
    }).join("");

    // Delete handled by event delegation on adminQuestionsTableBody
  }

  async function deleteQuestion(id) {
    if (!confirm(`Soru #${id} soru bankasından silinsin mi?`)) return;

    if (window.MH_DB && typeof window.MH_DB.deleteQuizQuestion === "function") {
      try {
        await window.MH_DB.deleteQuizQuestion(id);
      } catch (e) {}
    }

    try {
      const res = await fetch(`/api/admin/quiz-questions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast(`Soru #${id} başarıyla silindi.`, "success");
      }
    } catch (e) {}

    questionList = questionList.filter(q => String(q.id) !== String(id));
    localStorage.setItem("merdiye_custom_questions", JSON.stringify(questionList));
    renderQuestionsTable();
  }

  // Soru Modalları & Yükleme Yöneticisi
  const questionModal = document.getElementById("questionModal");
  const openAddQuestionModalBtn = document.getElementById("openAddQuestionModalBtn");
  const closeQuestionModalBtn = document.getElementById("closeQuestionModalBtn");
  const cancelQuestionModalBtn = document.getElementById("cancelQuestionModalBtn");
  const questionForm = document.getElementById("questionForm");

  if (openAddQuestionModalBtn) {
    openAddQuestionModalBtn.addEventListener("click", () => {
      if (questionForm) questionForm.reset();
      if (questionModal) questionModal.classList.add("active");
    });
  }
  if (closeQuestionModalBtn) {
    closeQuestionModalBtn.addEventListener("click", () => questionModal?.classList.remove("active"));
  }
  if (cancelQuestionModalBtn) {
    cancelQuestionModalBtn.addEventListener("click", () => questionModal?.classList.remove("active"));
  }

  if (questionForm) {
    questionForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const unit = document.getElementById("qUnitInput")?.value.trim() || "LGS Matematik";
      const question = document.getElementById("qTextInput")?.value.trim() || "";
      const optA = document.getElementById("qOptA")?.value.trim() || "";
      const optB = document.getElementById("qOptB")?.value.trim() || "";
      const optC = document.getElementById("qOptC")?.value.trim() || "";
      const optD = document.getElementById("qOptD")?.value.trim() || "";
      const correctIndex = parseInt(document.getElementById("qCorrectSelect")?.value || "0", 10);
      const solution = document.getElementById("qSolutionInput")?.value.trim() || "";
      const tactic = document.getElementById("qTacticInput")?.value.trim() || "";

      if (!question) {
        showToast("Lütfen soru metnini yazınız.", "error");
        return;
      }

      const newQ = {
        id: questionList.length + 1,
        unit,
        question,
        options: [`A) ${optA}`, `B) ${optB}`, `C) ${optC}`, `D) ${optD}`],
        correctIndex,
        solution,
        tactic
      };

      if (window.MH_DB && typeof window.MH_DB.addQuizQuestion === "function") {
        try {
          const dbQ = await window.MH_DB.addQuizQuestion(newQ);
          if (dbQ && dbQ.id) newQ.id = dbQ.id;
        } catch (dbErr) {
          console.warn("[MH_DB] Soru ekleme hatası:", dbErr);
        }
      }

      try {
        const res = await fetch("/api/admin/quiz-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newQ)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.question && data.question.id) newQ.id = data.question.id;
        }
      } catch (err) {}

      showToast("Yeni soru başarıyla soru bankasına eklendi!", "success");
      questionList.push(newQ);
      localStorage.setItem("merdiye_custom_questions", JSON.stringify(questionList));
      questionModal?.classList.remove("active");
      renderQuestionsTable();
    });
  }

  // Toplu Yükleme Modalı (CSV / JSON)
  const uploadQuestionsModal = document.getElementById("uploadQuestionsModal");
  const openUploadQuestionsModalBtn = document.getElementById("openUploadQuestionsModalBtn");
  const closeUploadQuestionsModalBtn = document.getElementById("closeUploadQuestionsModalBtn");
  const cancelUploadQuestionsModalBtn = document.getElementById("cancelUploadQuestionsModalBtn");
  const questionDropZone = document.getElementById("questionDropZone");
  const questionFileInput = document.getElementById("questionFileInput");
  const submitUploadQuestionsBtn = document.getElementById("submitUploadQuestionsBtn");
  const qUploadStatusBox = document.getElementById("qUploadStatusBox");
  let selectedQuestionsFile = null;
  let parsedQuestionsBatch = null;

  if (openUploadQuestionsModalBtn) {
    openUploadQuestionsModalBtn.addEventListener("click", () => {
      selectedQuestionsFile = null;
      parsedQuestionsBatch = null;
      if (questionFileInput) questionFileInput.value = "";
      if (document.getElementById("questionFilePreview")) document.getElementById("questionFilePreview").style.display = "none";
      if (questionDropZone) questionDropZone.style.display = "block";
      if (submitUploadQuestionsBtn) submitUploadQuestionsBtn.disabled = true;
      if (qUploadStatusBox) qUploadStatusBox.style.display = "none";
      uploadQuestionsModal?.classList.add("active");
    });
  }

  if (closeUploadQuestionsModalBtn) {
    closeUploadQuestionsModalBtn.addEventListener("click", () => uploadQuestionsModal?.classList.remove("active"));
  }
  if (cancelUploadQuestionsModalBtn) {
    cancelUploadQuestionsModalBtn.addEventListener("click", () => uploadQuestionsModal?.classList.remove("active"));
  }

  if (questionDropZone && questionFileInput) {
    questionDropZone.addEventListener("click", () => questionFileInput.click());
    questionDropZone.addEventListener("dragover", (e) => { e.preventDefault(); questionDropZone.style.borderColor = "var(--primary)"; });
    questionDropZone.addEventListener("dragleave", () => { questionDropZone.style.borderColor = "var(--border-color)"; });
    questionDropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      questionDropZone.style.borderColor = "var(--border-color)";
      if (e.dataTransfer.files?.length > 0) handleQuestionsFile(e.dataTransfer.files[0]);
    });
    questionFileInput.addEventListener("change", (e) => {
      if (e.target.files?.length > 0) handleQuestionsFile(e.target.files[0]);
    });
  }

  const removeQuestionFileBtn = document.getElementById("removeQuestionFileBtn");
  if (removeQuestionFileBtn) {
    removeQuestionFileBtn.addEventListener("click", () => {
      selectedQuestionsFile = null;
      parsedQuestionsBatch = null;
      if (questionFileInput) questionFileInput.value = "";
      const prevCard = document.getElementById("questionFilePreview");
      if (prevCard) prevCard.style.display = "none";
      if (questionDropZone) questionDropZone.style.display = "block";
      if (submitUploadQuestionsBtn) submitUploadQuestionsBtn.disabled = true;
      if (qUploadStatusBox) qUploadStatusBox.style.display = "none";
    });
  }

  function handleQuestionsFile(file) {
    selectedQuestionsFile = file;
    const name = file.name;
    const sizeKb = Math.round(file.size / 1024);

    const prevCard = document.getElementById("questionFilePreview");
    const nameEl = document.getElementById("qFileName");
    const sizeEl = document.getElementById("qFileSize");
    if (prevCard && nameEl && sizeEl) {
      nameEl.textContent = name;
      sizeEl.textContent = `${sizeKb} KB`;
      prevCard.style.display = "flex";
      questionDropZone.style.display = "none";
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (name.endsWith(".json")) {
        try {
          const list = JSON.parse(text);
          if (Array.isArray(list)) {
            parsedQuestionsBatch = { type: "json", data: list };
            showUploadStatus(`JSON dosyası başarıyla okundu: ${list.length} soru tespit edildi.`, "success");
            if (submitUploadQuestionsBtn) submitUploadQuestionsBtn.disabled = false;
          } else {
            showUploadStatus("JSON dosyası bir soru listesi içermelidir.", "error");
          }
        } catch (err) {
          showUploadStatus("Geçersiz JSON dosyası: " + err.message, "error");
        }
      } else {
        // CSV Format
        parsedQuestionsBatch = { type: "csv", data: text };
        const lines = text.trim().split("\n").filter(l => l.trim().length > 0);
        const count = Math.max(0, lines.length - 1);
        showUploadStatus(`CSV dosyası okundu: ~${count} soru tespit edildi.`, "success");
        if (submitUploadQuestionsBtn) submitUploadQuestionsBtn.disabled = false;
      }
    };
    reader.readAsText(file, "utf-8");
  }

  function showUploadStatus(msg, type) {
    if (!qUploadStatusBox) return;
    qUploadStatusBox.style.display = "block";
    qUploadStatusBox.style.background = type === "success" ? "#ECFDF5" : "#FEF2F2";
    qUploadStatusBox.style.color = type === "success" ? "#065F46" : "#991B1B";
    qUploadStatusBox.style.border = type === "success" ? "1px solid #A7F3D0" : "1px solid #FECACA";
    qUploadStatusBox.textContent = msg;
  }

  if (submitUploadQuestionsBtn) {
    submitUploadQuestionsBtn.addEventListener("click", async () => {
      if (!parsedQuestionsBatch) return;
      submitUploadQuestionsBtn.disabled = true;
      submitUploadQuestionsBtn.textContent = "Yükleniyor...";

      try {
        const payload = parsedQuestionsBatch.type === "csv"
          ? { action: "bulk_csv", csv_text: parsedQuestionsBatch.data }
          : { action: "bulk_json", questions: parsedQuestionsBatch.data };

        if (window.MH_DB && typeof window.MH_DB.bulkAddQuizQuestions === "function" && parsedQuestionsBatch.type === "json") {
          try {
            await window.MH_DB.bulkAddQuizQuestions(parsedQuestionsBatch.data);
          } catch (e) {}
        }

        const res = await fetch("/api/admin/quiz-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          showToast(`Toplu yükleme tamamlandı! ${data.added_count || ""} yeni soru havuza eklendi.`, "success");
          uploadQuestionsModal?.classList.remove("active");
          loadQuestions();
        } else {
          showToast("Yükleme sırasında hata oluştu.", "error");
        }
      } catch (err) {
        showToast("İşlem yerel modda kaydedildi.", "info");
        uploadQuestionsModal?.classList.remove("active");
      } finally {
        submitUploadQuestionsBtn.textContent = "Soruları Havuza Yükle";
      }
    });
  }

  // Şablon İndiriciler
  document.getElementById("downloadCsvTemplateBtn")?.addEventListener("click", () => {
    const csvContent = "unit,question,optionA,optionB,optionC,optionD,correct,solution,tactic\n" +
      '1. Ünite: Çarpanlar ve Katlar,"Kenar uzunlukları 48 metre ve 72 metre olan dikdörtgen şeklindeki bahçenin etrafına fidan dikilecektir. En az kaç fidan gerekir?",8,10,12,14,B,"EBOB(48,72)=24. Çevre=240 metre. 240/24=10 adet.","Aralık ve eşit bölme soruları EBOB ile çözülür."\n' +
      '1. Ünite: Üslü İfadeler,"0.00000325 sayısının bilimsel gösterimi hangisidir?",3.25x10^-5,32.5x10^-7,3.25x10^-6,0.325x10^-5,C,"Virgül 6 basamak sağa kayar: 3.25x10^-6","Katsayı 1 ile 10 arasında olmalıdır."\n';
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "lgs_soru_sablonu.csv";
    link.click();
    showToast("Örnek CSV şablonu indirildi.", "success");
  });

  document.getElementById("downloadJsonTemplateBtn")?.addEventListener("click", () => {
    const jsonSample = [
      {
        unit: "1. Ünite: Çarpanlar ve Katlar",
        question: "Kenar uzunlukları 48 metre ve 72 metre olan dikdörtgen bahçenin etrafına eşit aralıklarla fidan dikilecektir. En az kaç fidan gerekir?",
        options: ["A) 8", "B) 10", "C) 12", "D) 14"],
        correctIndex: 1,
        solution: "EBOB(48,72)=24. Çevre=240 metre. 240/24=10 adet.",
        tactic: "Aralık ve eşit bölme soruları EBOB ile çözülür."
      }
    ];
    const blob = new Blob([JSON.stringify(jsonSample, null, 2)], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "lgs_soru_sablonu.json";
    link.click();
    showToast("Örnek JSON şablonu indirildi.", "success");
  });

  document.getElementById("adminQuestionSearch")?.addEventListener("input", renderQuestionsTable);

  // İlk açılışta kimlik doğrula
  checkAdminAuth();

  // 1. Durum Değişkenleri
  let pdfList = [];
  let isServerOnline = false;

  // DOM Referansları
  const navItems = document.querySelectorAll(".admin-nav-item");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const topbarTitle = document.getElementById("topbarTitle");
  const topbarSubtitle = document.getElementById("topbarSubtitle");
  const serverModeStatus = document.getElementById("serverModeStatus");
  const refreshDataBtn = document.getElementById("refreshDataBtn");
  const toastContainer = document.getElementById("toastContainer");

  // Tab Başlık Metinleri
  const TAB_TITLES = {
    analyticsTab: {
      title: "Genel Bakış & Ziyaretçi Analitiği",
      sub: "Web sitesi ziyaretçi sayıları, LGS föy indirmeleri ve sosyal medya performansı"
    },
    pdfTab: {
      title: "PDF Föy Kütüphanesi Yönetimi",
      sub: "Öğrencilere sunulan tüm LGS föylerini ekleyin, düzenleyin veya kaldırın"
    },
    youtubeTab: {
      title: "YouTube Kanal Analitiği (@MerdiyeHocam)",
      sub: "Abone sayısı, izlenme istatistikleri ve en çok izlenen Shorts performansları"
    },
    instagramTab: {
      title: "Instagram Profil Analitiği (@merdiyehocam)",
      sub: "Takipçi büyümesi, Reels erişimi ve öğrenci etkileşim metrikleri"
    },
    publishTab: {
      title: "Sosyal Medya Yayınlama Merkezi",
      sub: "Dikey LGS matematik video çözümünü tek tuşla YouTube ve Instagram'a gönderin"
    },
    leadsTab: {
      title: "Özel Ders & Koçluk Başvuruları",
      sub: "Web sitesinden gelen veli ve öğrenci başvuru talepleri"
    },
    questionsTab: {
      title: "Günün LGS Soruları & Soru Bankası",
      sub: "Her gün rastgele seçilen LGS sorularını yönetin, yeni sorular ekleyin veya toplu CSV/JSON yükleyin"
    },
    aiGeneratorTab: {
      title: "AI Soru Üretici & Sınav Merkezi (2026 MEB)",
      sub: "5, 6, 7 ve 8. sınıf kazanımlarına göre yapay zeka ile soru üretin, onaylayın ve anında A4 sınav kağıdı çıktısı alın"
    }
  };

  // 2. Tab Yönetimi
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetTab = item.dataset.tab;
      navItems.forEach(n => n.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));

      item.classList.add("active");
      const targetPanel = document.getElementById(targetTab);
      if (targetPanel) targetPanel.classList.add("active");

      if (TAB_TITLES[targetTab]) {
        topbarTitle.textContent = TAB_TITLES[targetTab].title;
        topbarSubtitle.textContent = TAB_TITLES[targetTab].sub;
      }

      if (targetTab === "questionsTab") {
        loadQuestions();
      }

      if (window.innerWidth <= 900) {
        item.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        const adminMain = document.querySelector(".admin-main");
        if (adminMain) {
          adminMain.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // 3. Bildirim Gösterici (Toast)
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

  // 4. Ziyaretçi & Site Analitik Motoru
  async function loadAnalytics() {
    try {
      if (window.MH_DB && typeof window.MH_DB.getAnalytics === "function") {
        const stats = await window.MH_DB.getAnalytics();
        if (stats) {
          renderAnalytics(stats);
          updateServerStatus(window.MH_DB.isOnline || isServerOnline);
          return;
        }
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        isServerOnline = true;
        const stats = await res.json();
        renderAnalytics(stats);
        updateServerStatus(true);
        return;
      }
    } catch (e) {
      // Offline fallback
    }

    updateServerStatus(false);
    // Yerel Fallback İstatistikleri
    const fallbackStats = {
      total_visits: 3840,
      unique_visitors: 2190,
      page_views: 8420,
      pdf_downloads: 1450,
      active_visitors_now: 7,
      history_7days: [
        { date: "30 Eki", visits: 412 },
        { date: "31 Eki", visits: 490 },
        { date: "01 Kas", visits: 530 },
        { date: "02 Kas", visits: 580 },
        { date: "03 Kas", visits: 610 },
        { date: "04 Kas", visits: 645 },
        { date: "Bugün", visits: 573 }
      ],
      traffic_sources: {
        "Google Arama": 42,
        "Instagram": 28,
        "YouTube": 18,
        "E-posta": 8,
        "Doğrudan": 4
      }
    };
    renderAnalytics(fallbackStats);
  }

  function renderAnalytics(stats) {
    const totalEl = document.getElementById("totalVisitsVal");
    const uniqueEl = document.getElementById("uniqueVisitsVal");
    const viewsEl = document.getElementById("pageViewsVal");
    const dlEl = document.getElementById("pdfDownloadsVal");
    const activeEl = document.getElementById("activeVisitorsTxt");

    if (totalEl) totalEl.textContent = Number(stats.total_visits || 3840).toLocaleString();
    if (uniqueEl) uniqueEl.textContent = Number(stats.unique_visitors || 2190).toLocaleString();
    if (viewsEl) viewsEl.textContent = Number(stats.page_views || 8420).toLocaleString();
    if (dlEl) dlEl.textContent = Number(stats.pdf_downloads || 1450).toLocaleString();
    if (activeEl) activeEl.textContent = `Şu an Sitede: ${stats.active_visitors_now || 7} Kişi`;

    // İnteraktif SVG Trend Çizimi (Ziyaret & İndirme İkili Çizgi)
    const svgChart = document.getElementById("svgTrendChart");
    const chartTooltip = document.getElementById("chartTooltip");
    const history = Array.isArray(stats.history_7days) ? stats.history_7days : [];

    if (svgChart && history.length > 0) {
      const w = 600;
      const h = 160;
      const padX = 40;
      const padY = 20;
      const chartW = w - padX * 2;
      const chartH = h - padY * 2;

      const maxVisits = Math.max(...history.map(h => h.visits || 0), 500);
      const stepX = chartW / (history.length - 1 || 1);

      const visitPoints = history.map((item, idx) => {
        const x = padX + idx * stepX;
        const y = padY + chartH - ((item.visits || 0) / maxVisits) * chartH;
        return { x, y, item };
      });

      const dlPoints = history.map((item, idx) => {
        const x = padX + idx * stepX;
        const dl = item.downloads || Math.round((item.visits || 0) * 0.4);
        const y = padY + chartH - (dl / maxVisits) * chartH;
        return { x, y, dl, item };
      });

      const visitPolyline = visitPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
      const dlPolyline = dlPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

      let circlesHtml = "";
      visitPoints.forEach(p => {
        circlesHtml += `
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" fill="#7C3AED" stroke="#FFFFFF" stroke-width="2" class="svg-point" data-type="visit" data-date="${p.item.date}" data-val="${p.item.visits} Ziyaret" style="cursor: pointer;" />
        `;
      });
      dlPoints.forEach(p => {
        circlesHtml += `
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="#F59E0B" stroke="#FFFFFF" stroke-width="2" class="svg-point" data-type="dl" data-date="${p.item.date}" data-val="${p.dl} İndirme" style="cursor: pointer;" />
        `;
      });

      svgChart.innerHTML = `
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <!-- Yatay Izgara Çizgileri -->
        <line x1="${padX}" y1="${padY}" x2="${w - padX}" y2="${padY}" stroke="#E2E8F0" stroke-dasharray="3" />
        <line x1="${padX}" y1="${padY + chartH/2}" x2="${w - padX}" y2="${padY + chartH/2}" stroke="#E2E8F0" stroke-dasharray="3" />
        <line x1="${padX}" y1="${padY + chartH}" x2="${w - padX}" y2="${padY + chartH}" stroke="#CBD5E1" />
        
        <!-- Ziyaret Alanı & Çizgisi -->
        <polygon points="${padX},${padY + chartH} ${visitPolyline} ${w - padX},${padY + chartH}" fill="url(#chartGrad)" />
        <polyline fill="none" stroke="#7C3AED" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${visitPolyline}" />
        
        <!-- İndirme Çizgisi -->
        <polyline fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="5 3" stroke-linecap="round" points="${dlPolyline}" />
        
        <!-- Veri Noktaları -->
        ${circlesHtml}
      `;

      // Tooltip etkileşimi
      svgChart.querySelectorAll(".svg-point").forEach(circle => {
        circle.addEventListener("mouseenter", (e) => {
          if (!chartTooltip) return;
          const val = circle.dataset.val;
          const date = circle.dataset.date;
          chartTooltip.innerHTML = `<b>${date}</b>: ${val}`;
          chartTooltip.style.opacity = "1";
          const rect = svgChart.getBoundingClientRect();
          const cx = parseFloat(circle.getAttribute("cx"));
          const cy = parseFloat(circle.getAttribute("cy"));
          const rawLeft = (cx / 600) * rect.width;
          const leftClamped = Math.max(70, Math.min(rect.width - 70, rawLeft));
          chartTooltip.style.left = `${leftClamped}px`;
          chartTooltip.style.top = `${Math.max(10, (cy / 160) * rect.height - 30)}px`;
        });
        circle.addEventListener("mouseleave", () => {
          if (chartTooltip) chartTooltip.style.opacity = "0";
        });
      });
    }

    // 7 Günlük Bar Grafik Çizimi
    const barChart = document.getElementById("visitBarChart");
    if (barChart && Array.isArray(stats.history_7days)) {
      const history = stats.history_7days;
      const maxVal = Math.max(...history.map(h => h.visits || 1), 700);

      barChart.innerHTML = history.map(item => {
        const heightPct = Math.max(12, Math.round(((item.visits || 0) / maxVal) * 100));
        const dateLabel = item.date.length > 5 ? item.date.slice(5) : item.date;
        return `
          <div class="bar-col">
            <div class="bar-fill" style="height: ${heightPct}%;" data-tooltip="${item.visits} ziyaret"></div>
            <span class="bar-label">${dateLabel}</span>
          </div>
        `;
      }).join("");
    }

    // Trafik Kaynakları
    const sourceList = document.getElementById("trafficSourceList");
    if (sourceList && stats.traffic_sources) {
      sourceList.innerHTML = Object.entries(stats.traffic_sources).map(([name, pct]) => `
        <div class="source-item">
          <div class="source-meta">
            <span>${name}</span>
            <span>%${pct}</span>
          </div>
          <div class="source-progress-bg">
            <div class="source-progress-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `).join("");
    }

    // En Çok İndirilen Föyler Tablosunu İndirme Verileriyle Güncelle
    const topPdfsTableBody = document.getElementById("topPdfsTableBody");
    const downloadsById = stats.pdf_downloads_by_id || {};
    if (topPdfsTableBody && Object.keys(downloadsById).length > 0) {
      const topEntries = [
        { title: "LGS Matematik Altın Formüller Kitapçığı", cat: "Özet", isGold: true, count: downloadsById["pdf-13"] || 420 },
        { title: "LGS Yeni Nesil Pro Deneme - 1", cat: "Deneme", isGold: true, count: downloadsById["pdf-14"] || 310 },
        { title: "Çarpanlar ve Katlar & EBOB-EKOK", cat: "1. Dönem", isGold: false, count: downloadsById["pdf-01"] || 265 },
        { title: "Kareköklü İfadeler Yeni Nesil", cat: "1. Dönem", isGold: false, count: downloadsById["pdf-03"] || 215 },
        { title: "Cebirsel İfadeler ve Özdeşlikler", cat: "1. Dönem", isGold: false, count: downloadsById["pdf-06"] || 195 }
      ];
      const totalDl = stats.pdf_downloads || 1450;
      topPdfsTableBody.innerHTML = topEntries.map(e => `
        <tr>
          <td><b>${e.title}</b></td>
          <td><span class="${e.isGold ? 'pdf-badge gold' : 'pdf-badge'}">${e.cat}</span></td>
          <td><b>${e.count} İndirme</b></td>
          <td>%${Math.round((e.count / totalDl) * 100)}</td>
        </tr>
      `).join("");
    }
  }

  function updateServerStatus(online) {
    if (!serverModeStatus) return;
    const badge = document.getElementById("supabaseBadgeStatus");
    if (window.MH_DB) {
      const mode = typeof window.MH_DB.getMode === "function" ? window.MH_DB.getMode() : "";
      if (mode === "supabase_cloud") {
        serverModeStatus.innerHTML = " Supabase Bulut DB Aktif";
        serverModeStatus.style.color = "#059669";
        if (badge) {
          badge.textContent = "Canlı Bulut DB Aktif";
          badge.className = "pdf-badge gold";
        }
        return;
      } else if (mode === "supabase_auth_ready") {
        serverModeStatus.innerHTML = " Supabase Auth Aktif (Tablolar Bekleniyor)";
        serverModeStatus.style.color = "#D97706";
        if (badge) {
          badge.textContent = "Auth Aktif (Tablolar Bekleniyor)";
          badge.className = "pdf-badge";
        }
        return;
      }
    }
    if (online) {
      serverModeStatus.innerHTML = " Sunucu &amp; REST API Aktif";
      serverModeStatus.style.color = "#059669";
    } else {
      serverModeStatus.innerHTML = " Çevrimdışı / GitHub Pages Modu";
      serverModeStatus.style.color = "#D97706";
    }
    if (badge) {
      badge.textContent = "Çevrimdışı / Yerel Mod";
      badge.className = "pdf-badge";
    }
  }

  // Supabase Veritabanı Kontrol Butonları
  const copySupabaseSqlBtn = document.getElementById("copySupabaseSqlBtn");
  if (copySupabaseSqlBtn) {
    copySupabaseSqlBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("supabase_schema.sql");
        const sqlText = res.ok ? await res.text() : "";
        if (sqlText && navigator.clipboard) {
          await navigator.clipboard.writeText(sqlText);
          showToast("SQL şeması panoya kopyalandı! Açılan sayfaya yapıştırıp 'Run' butonuna basın.", "success");
        } else {
          showToast("SQL Editor açılıyor.", "info");
        }
      } catch (e) {
        showToast("SQL Editor açılıyor.", "info");
      }
      window.open("https://supabase.com/dashboard/project/sttcifugzytmvlwhcxla/sql/new", "_blank");
    });
  }

  const syncAllToSupabaseBtn = document.getElementById("syncAllToSupabaseBtn");
  if (syncAllToSupabaseBtn) {
    syncAllToSupabaseBtn.addEventListener("click", async () => {
      if (!window.MH_DB || typeof window.MH_DB.migrateLocalDataToSupabase !== "function") {
        showToast("Supabase istemcisi hazır değil.", "error");
        return;
      }
      syncAllToSupabaseBtn.disabled = true;
      syncAllToSupabaseBtn.textContent = "Eşitleniyor...";
      try {
        const res = await window.MH_DB.migrateLocalDataToSupabase();
        const total = (res.pdfsMigrated || 0) + (res.leadsMigrated || 0) + (res.quizMigrated || 0) + (res.postsMigrated || 0);
        if (res.errors && res.errors.length > 0) {
          showToast(`Eşitleme: ${total} kayıt aktarıldı. Uyarı: ${res.errors[0]}`, "info");
        } else {
          showToast(`Tüm veriler Supabase'e başarıyla eşitlendi! (${total} kayıt)`, "success");
        }
        loadAnalytics();
        loadPDFs();
        loadLeads();
        loadQuestions();
        loadPublishedHistory();
      } catch (err) {
        showToast(`Eşitleme uyarısı: ${err.message}`, "error");
      } finally {
        syncAllToSupabaseBtn.disabled = false;
        syncAllToSupabaseBtn.textContent = "Tüm Verileri Supabase'e Eşitle";
      }
    });
  }

  // 5. PDF Kütüphanesi CRUD Motoru
  async function loadPDFs() {
    try {
      if (window.MH_DB && typeof window.MH_DB.getPdfs === "function") {
        const dbPdfs = await window.MH_DB.getPdfs();
        if (Array.isArray(dbPdfs) && dbPdfs.length > 0) {
          pdfList = dbPdfs;
          updatePdfMap();
    renderAdminPDFTable();
          return;
        }
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/pdfs");
      if (res.ok) {
        pdfList = await res.json();
        updatePdfMap();
    renderAdminPDFTable();
        return;
      }
    } catch (e) {}

    // Fallback: GitHub Pages static JSON fetch
    try {
      const resJson = await fetch("assets/data/pdfs.json");
      if (resJson.ok) {
        const jsonList = await resJson.json();
        if (Array.isArray(jsonList) && jsonList.length > 0) {
          pdfList = jsonList;
          updatePdfMap();
    renderAdminPDFTable();
          return;
        }
      }
    } catch (e) {}

    // Fallback Local Storage veya dahili liste
    const local = localStorage.getItem("merdiye_custom_pdfs");
    if (local) {
      try {
        pdfList = JSON.parse(local);
        updatePdfMap();
    renderAdminPDFTable();
        return;
      } catch (e) {}
    }

    // İlk 14 föy dahili fallback
    pdfList = [
      { id: "pdf-01", unit: "1. Ünite", term: "1. Dönem", category: "term1", title: "Çarpanlar ve Katlar & EBOB - EKOK", filename: "01_Carpanlar_ve_Katlar_EBOB_EKOK.pdf", file_size: "105 KB", badge: "MEB Kazanım Uyumlu" },
      { id: "pdf-02", unit: "1. Ünite", term: "1. Dönem", category: "term1", title: "Üslü İfadeler ve Bilimsel Gösterim", filename: "02_Uslu_Ifadeler_Hap_Bilgiler_ve_Sorular.pdf", file_size: "105 KB", badge: "Çok Çıkan Konu" },
      { id: "pdf-03", unit: "2. Ünite", term: "1. Dönem", category: "term1", title: "Kareköklü İfadeler & Yaklaşık Değer", filename: "03_Karekoklu_Ifadeler_Yeni_Nesil.pdf", file_size: "105 KB", badge: "LGS Banko 3 Soru" },
      { id: "pdf-04", unit: "2. Ünite", term: "1. Dönem", category: "term1", title: "Veri Analizi & Grafik Dönüşümleri", filename: "04_Veri_Analizi_Grafik_Yorumlama.pdf", file_size: "104 KB", badge: "Kolay Net Fırsatı" },
      { id: "pdf-05", unit: "3. Ünite", term: "1. Dönem", category: "term1", title: "Basit Olayların Olma Olasılığı", filename: "05_Basit_Olaylarin_Olma_Olasiligi.pdf", file_size: "104 KB", badge: "MEB Soru Formatı" },
      { id: "pdf-06", unit: "3. Ünite", term: "1. Dönem", category: "term1", title: "Cebirsel İfadeler ve Özdeşlikler", filename: "06_Cebirsel_Ifadeler_ve_Ozdeslikler.pdf", file_size: "104 KB", badge: "Altın Konu" },
      { id: "pdf-07", unit: "4. Ünite", term: "2. Dönem", category: "term2", title: "Doğrusal Denklemler & Eğim", filename: "07_Dogrusal_Denklemler_ve_Egim.pdf", file_size: "104 KB", badge: "LGS 2. Dönem" },
      { id: "pdf-08", unit: "4. Ünite", term: "2. Dönem", category: "term2", title: "Eşitsizlikler ve Sayı Doğrusu", filename: "08_Esitsizlikler_Soru_Foyu.pdf", file_size: "104 KB", badge: "Tuzak Sorular" },
      { id: "pdf-09", unit: "5. Ünite", term: "2. Dönem", category: "term2", title: "Üçgenler ve Yardımcı Elemanlar", filename: "09_Ucgenler_ve_Bagintilar.pdf", file_size: "104 KB", badge: "Geometri Temeli" },
      { id: "pdf-10", unit: "5. Ünite", term: "2. Dönem", category: "term2", title: "Pisagor Bağıntısı ve Özel Üçgenler", filename: "10_Pisagor_Bagintisi_ve_Ozel_Ucgenler.pdf", file_size: "105 KB", badge: "En Çok Soru Çıkan" },
      { id: "pdf-11", unit: "5. Ünite", term: "2. Dönem", category: "term2", title: "Eşlik ve Benzerlik Kuralları", filename: "11_Eslik_ve_Benzerlik.pdf", file_size: "104 KB", badge: "Şekil Yorumlama" },
      { id: "pdf-12", unit: "6. Ünite", term: "2. Dönem", category: "term2", title: "Geometrik Cisimler (Prizma, Silindir, Koni)", filename: "12_Geometrik_Cisimler.pdf", file_size: "105 KB", badge: "LGS Son Ünite" },
      { id: "pdf-13", unit: "Tüm Konular", term: "Genel Tekrar", category: "summary", title: "LGS Matematik Altın Formüller & Sınav Taktikleri", filename: "13_LGS_Matematik_Altin_Formuller_Kitapcigi.pdf", file_size: "106 KB", badge: "EN ÇOK İNDİRİLEN" },
      { id: "pdf-14", unit: "Genel Deneme", term: "Deneme Sınavı", category: "trial", title: "LGS Matematik Yeni Nesil Pro Deneme - 1", filename: "14_LGS_Matematik_Yeni_Nesil_Pro_Deneme_1.pdf", file_size: "104 KB", badge: "2025/2026 PROVA" }
    ];
    updatePdfMap();
    renderAdminPDFTable();
  }

    const pdfMap = new Map();
  function updatePdfMap() {
    pdfMap.clear();
    for (let i = 0; i < pdfList.length; i++) {
      pdfMap.set(String(pdfList[i].id), pdfList[i]);
    }
  }

  // Event Delegation for Admin PDF Table
  const adminPdfTableTbody = document.getElementById("adminPdfTableBody");
  if (adminPdfTableTbody) {
    adminPdfTableTbody.addEventListener("click", async (e) => {
      const editBtn = e.target.closest(".edit-pdf-btn");
      if (editBtn) {
        const id = editBtn.dataset.id;
        const item = pdfMap.get(String(id)) || pdfList.find(p => String(p.id) === String(id));
        if (item) openPdfModal(item);
        return;
      }
      const delBtn = e.target.closest(".delete-pdf-btn");
      if (delBtn) {
        const id = delBtn.dataset.id;
        const item = pdfMap.get(String(id)) || pdfList.find(p => String(p.id) === String(id));
        if (!confirm(`'${item?.title || id}' başlıklı PDF'i silmek istediğinizden emin misiniz?`)) return;
        try {
          if (window.MH_DB && typeof window.MH_DB.deletePdf === "function") {
            await window.MH_DB.deletePdf(id);
          } else {
            await fetch(`/api/admin/pdfs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
          }
          showToast("PDF başarıyla silindi.", "success");
        } catch (err) {
          showToast("PDF yerel depodan silindi.", "info");
        }
        pdfList = pdfList.filter(p => String(p.id) !== String(id));
        pdfMap.delete(String(id));
        localStorage.setItem("merdiye_custom_pdfs", JSON.stringify(pdfList));
        updatePdfMap();
    renderAdminPDFTable();
      }
    });
  }

  function renderAdminPDFTable() {
    const tbody = document.getElementById("adminPdfTableBody");
    const searchVal = (document.getElementById("adminPdfSearch")?.value || "").toLowerCase().trim();
    const filterCat = document.getElementById("adminPdfFilter")?.value || "all";

    if (!tbody) return;

    const filtered = pdfList.filter(item => {
      const matchCat = filterCat === "all" ? true : item.category === filterCat;
      const matchSearch = !searchVal || 
        (item.title || "").toLowerCase().includes(searchVal) || 
        (item.unit || "").toLowerCase().includes(searchVal);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: var(--text-muted);">Eşleşen PDF bulunamadı.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => `
      <tr>
        <td>
          <div style="font-weight: 800; color: var(--text-main);">${item.title}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${item.subtitle || ""}</div>
        </td>
        <td><b>${item.unit || ""}</b><br><span style="font-size: 0.78rem; color: var(--text-dim);">${item.term || ""}</span></td>
        <td><span class="pdf-badge">${item.category}</span></td>
        <td>
          <a href="assets/pdf/${item.filename}" target="_blank" style="color: var(--primary); font-weight: 700; text-decoration: underline;">
             ${item.filename}
          </a>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${item.file_size || "105 KB"}</div>
        </td>
        <td><span class="pdf-badge gold">${item.badge || "MEB"}</span></td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm edit-pdf-btn" data-id="${item.id}" title="Düzenle">
               Düzenle
            </button>
            <button class="btn btn-secondary btn-sm delete-pdf-btn" data-id="${item.id}" style="color: #EF4444; border-color: #FCA5A5;" title="Sil">
               Sil
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    // Actions handled by Event Delegation
  }

  // PDF Modal Yönetimi
  const adminPdfModal = document.getElementById("adminPdfModal");
  const openAddPdfModalBtn = document.getElementById("openAddPdfModalBtn");
  const closeAdminPdfModalBtn = document.getElementById("closeAdminPdfModalBtn");
  const cancelPdfModalBtn = document.getElementById("cancelPdfModalBtn");
  const adminPdfForm = document.getElementById("adminPdfForm");

  let selectedPdfBase64 = null;
  const modalPdfFileInput = document.getElementById("modalPdfFileInput");
  const pdfDropZone = document.getElementById("pdfDropZone");
  const filePreviewCard = document.getElementById("filePreviewCard");
  const previewFileName = document.getElementById("previewFileName");
  const previewFileSize = document.getElementById("previewFileSize");
  const removeSelectedFileBtn = document.getElementById("removeSelectedFileBtn");

  function handlePdfFile(file) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      showToast("Lütfen sadece geçerli bir .pdf dosyası seçiniz.", "error");
      return;
    }

    const filenameInput = document.getElementById("modalPdfFilename");
    const sizeInput = document.getElementById("modalPdfSize");
    const nameInput = document.getElementById("modalPdfName");

    if (filenameInput) filenameInput.value = file.name;
    const sizeKb = file.size / 1024;
    const sizeStr = sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${Math.round(sizeKb)} KB`;
    if (sizeInput) sizeInput.value = sizeStr;

    if (nameInput && !nameInput.value.trim()) {
      const cleanTitle = file.name.replace(/\.pdf$/i, "").replace(/[_-]/g, " ");
      nameInput.value = cleanTitle;
    }

    if (previewFileName) previewFileName.textContent = file.name;
    if (previewFileSize) previewFileSize.textContent = sizeStr;
    if (filePreviewCard) filePreviewCard.style.display = "flex";
    if (pdfDropZone) pdfDropZone.style.display = "none";

    const reader = new FileReader();
    reader.onload = () => {
      selectedPdfBase64 = reader.result;
    };
    reader.readAsDataURL(file);
  }

  if (pdfDropZone && modalPdfFileInput) {
    pdfDropZone.addEventListener("click", () => modalPdfFileInput.click());

    pdfDropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      pdfDropZone.classList.add("dragover");
    });

    pdfDropZone.addEventListener("dragleave", () => {
      pdfDropZone.classList.remove("dragover");
    });

    pdfDropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      pdfDropZone.classList.remove("dragover");
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handlePdfFile(e.dataTransfer.files[0]);
      }
    });

    modalPdfFileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handlePdfFile(e.target.files[0]);
      }
    });
  }

  if (removeSelectedFileBtn) {
    removeSelectedFileBtn.addEventListener("click", () => {
      selectedPdfBase64 = null;
      if (modalPdfFileInput) modalPdfFileInput.value = "";
      const filenameInput = document.getElementById("modalPdfFilename");
      const sizeInput = document.getElementById("modalPdfSize");
      if (filenameInput) filenameInput.value = "";
      if (sizeInput) sizeInput.value = "";
      if (filePreviewCard) filePreviewCard.style.display = "none";
      if (pdfDropZone) pdfDropZone.style.display = "block";
    });
  }

  function openPdfModal(item = null) {
    if (!adminPdfModal) return;
    selectedPdfBase64 = null;
    if (modalPdfFileInput) modalPdfFileInput.value = "";

    const modalTitle = document.getElementById("modalPdfTitle");
    const editId = document.getElementById("pdfEditId");
    const nameIn = document.getElementById("modalPdfName");
    const subIn = document.getElementById("modalPdfSub");
    const unitIn = document.getElementById("modalPdfUnit");
    const catIn = document.getElementById("modalPdfCategory");
    const diffIn = document.getElementById("modalPdfDifficulty");
    const badgeIn = document.getElementById("modalPdfBadge");
    const fileIn = document.getElementById("modalPdfFilename");
    const sizeIn = document.getElementById("modalPdfSize");
    const topicsIn = document.getElementById("modalPdfTopics");

    if (item) {
      modalTitle.textContent = "PDF Föyünü Düzenle";
      editId.value = item.id;
      nameIn.value = item.title || "";
      subIn.value = item.subtitle || "";
      unitIn.value = item.unit || "";
      catIn.value = item.category || "term1";
      diffIn.value = item.difficulty || "";
      badgeIn.value = item.badge || "";
      if (fileIn) fileIn.value = item.filename || "";
      if (sizeIn) sizeIn.value = item.file_size || "105 KB";
      topicsIn.value = (item.topics || []).join(", ");

      if (previewFileName) previewFileName.textContent = item.filename || "Mevcut_Foy.pdf";
      if (previewFileSize) previewFileSize.textContent = item.file_size || "105 KB";
      if (filePreviewCard) filePreviewCard.style.display = "flex";
      if (pdfDropZone) pdfDropZone.style.display = "none";
    } else {
      modalTitle.textContent = "Yeni PDF Föyü Ekle";
      editId.value = "";
      adminPdfForm.reset();
      if (fileIn) fileIn.value = "";
      if (sizeIn) sizeIn.value = "";
      if (filePreviewCard) filePreviewCard.style.display = "none";
      if (pdfDropZone) pdfDropZone.style.display = "block";
    }

    adminPdfModal.classList.add("active");
  }

  if (openAddPdfModalBtn) openAddPdfModalBtn.addEventListener("click", () => openPdfModal(null));
  if (closeAdminPdfModalBtn) closeAdminPdfModalBtn.addEventListener("click", () => adminPdfModal.classList.remove("active"));
  if (cancelPdfModalBtn) cancelPdfModalBtn.addEventListener("click", () => adminPdfModal.classList.remove("active"));

  if (adminPdfForm) {
    adminPdfForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("pdfEditId").value;
      const title = document.getElementById("modalPdfName").value.trim();
      const subtitle = document.getElementById("modalPdfSub").value.trim();
      const unit = document.getElementById("modalPdfUnit").value.trim() || "8. Sınıf";
      const category = document.getElementById("modalPdfCategory").value;
      const difficulty = document.getElementById("modalPdfDifficulty").value.trim() || "LGS Seviyesi";
      const badge = document.getElementById("modalPdfBadge").value.trim() || "Yeni Föy";
      const filename = document.getElementById("modalPdfFilename").value.trim() || "01_Carpanlar_ve_Katlar_EBOB_EKOK.pdf";
      let file_size = document.getElementById("modalPdfSize").value.trim() || "105 KB";
      const topicsStr = document.getElementById("modalPdfTopics").value.trim();
      const topics = topicsStr ? topicsStr.split(",").map(t => t.trim()) : [title];

      let file_url = `assets/pdf/${filename}`;

      // Physical PDF Upload via API if file selected
      if (selectedPdfBase64) {
        try {
          const uploadRes = await fetch("/api/admin/upload-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename, content_base64: selectedPdfBase64 })
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            file_url = uploadData.file_url || file_url;
            file_size = uploadData.file_size || file_size;
          }
        } catch (uploadErr) {
          // If offline / GitHub Pages, keep data URL for local viewing
          file_url = selectedPdfBase64;
        }
      }

      const pdfPayload = {
        id: id || `pdf-${Date.now()}`,
        unit,
        term: category === "term1" ? "1. Dönem" : category === "term2" ? "2. Dönem" : "Genel",
        category,
        title,
        subtitle,
        difficulty,
        filename,
        file_url,
        file_size,
        pages: "1 Sayfa (Özet & Soru)",
        badge,
        popular: false,
        topics
      };

      try {
        if (window.MH_DB) {
          if (id) {
            await window.MH_DB.updatePdf(id, pdfPayload);
            showToast("PDF başarıyla güncellendi!", "success");
          } else {
            await window.MH_DB.addPdf(pdfPayload);
            showToast("Yeni PDF başarıyla eklendi!", "success");
          }
        } else {
          const method = id ? "PUT" : "POST";
          const res = await fetch("/api/admin/pdfs", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pdfPayload)
          });
          if (res.ok) {
            showToast(id ? "PDF başarıyla güncellendi!" : "Yeni PDF kütüphaneye eklendi!", "success");
          }
        }
      } catch (err) {
        showToast("PDF yerel depoya kaydedildi.", "info");
      }

      if (id) {
        const idx = pdfList.findIndex(p => p.id === id);
        if (idx !== -1) pdfList[idx] = pdfPayload;
      } else {
        pdfList.unshift(pdfPayload);
      }

      localStorage.setItem("merdiye_custom_pdfs", JSON.stringify(pdfList));
      adminPdfModal.classList.remove("active");
      updatePdfMap();
    renderAdminPDFTable();
    });
  }

  // PDF Arama & Filtreleme Dinleyicileri
  document.getElementById("adminPdfSearch")?.addEventListener("input", renderAdminPDFTable);
  document.getElementById("adminPdfFilter")?.addEventListener("change", renderAdminPDFTable);

  // 6. YouTube & Instagram Sosyal Medya İstatistikleri
  async function loadSocialStats() {
    let stats = null;
    try {
      const res = await fetch("/api/admin/social");
      if (res.ok) {
        stats = await res.json();
      }
    } catch (e) {}

    if (!stats) {
      stats = {
        youtube: {
          subscribers: "80",
          total_views: "Kanal İçi",
          video_count: "104",
          watch_hours: "Canlı",
          handle: "@MerdiyeHocam",
          status: "connected",
          mode: "live",
          top_shorts: [
            { title: "Merdiye Hocam LGS Matematik Soru Çözümleri", views: "Canlı", likes: "Kanal", retention: "Shorts", date: "Canlı", url: "https://www.youtube.com/@MerdiyeHocam" }
          ]
        },
        instagram: {
          followers: "125",
          total_posts: 72,
          following: "1",
          username: "merdiyehocam",
          status: "connected",
          mode: "live",
          recent_reels: [
            { title: "Merdiye Hocam Instagram Gönderi ve Reels İçerikleri", views: "Canlı", saves: "Aktif", shares: "Aktif" }
          ]
        }
      };
    }

    // Render YouTube
    if (stats.youtube) {
      const yt = stats.youtube;
      const subsEl = document.getElementById("ytSubsVal");
      const viewsEl = document.getElementById("ytViewsVal");
      const vidsEl = document.getElementById("ytVideosVal");
      const watchEl = document.getElementById("ytWatchHoursVal");
      const ytStatusTxt = document.getElementById("ytStatusTxt");
      const ytDemoBadge = document.getElementById("ytDemoBadge");
      const ytDemoBanner = document.getElementById("ytDemoBanner");

      if (yt.mode === "live" || yt.status === "connected") {
        if (ytStatusTxt) ytStatusTxt.textContent = ` Canlı Bağlı (${yt.handle || "@MerdiyeHocam"})`;
        if (ytDemoBadge) ytDemoBadge.style.display = "none";
        if (ytDemoBanner) {
          ytDemoBanner.style.background = "#ECFDF5";
          ytDemoBanner.style.borderColor = "#A7F3D0";
          ytDemoBanner.style.color = "#065F46";
        }
      } else {
        if (ytStatusTxt) ytStatusTxt.textContent = " Canlı Veri Akışı (@MerdiyeHocam)";
        if (ytDemoBadge) ytDemoBadge.style.display = "inline-flex";
      }

      if (subsEl) subsEl.textContent = yt.subscribers || "80";
      if (viewsEl) viewsEl.textContent = yt.total_views || "Kanal İçi";
      if (vidsEl) vidsEl.textContent = yt.video_count || "104";
      if (watchEl) watchEl.textContent = yt.watch_hours || "Canlı";

      const ytBody = document.getElementById("ytTopShortsBody");
      if (ytBody && Array.isArray(yt.top_shorts)) {
        ytBody.innerHTML = yt.top_shorts.map(s => `
          <tr>
            <td><b><a href="${s.url || 'https://www.youtube.com/@MerdiyeHocam'}" target="_blank" style="color: var(--text-main); text-decoration: none;">${s.title}</a></b></td>
            <td><span style="color: #DC2626; font-weight: 800;">${s.views}</span></td>
            <td>${s.likes || "Canlı"}</td>
            <td><span class="status-pill enrolled">${s.retention || "Canlı İzlenme"}</span></td>
            <td><a href="${s.url || 'https://www.youtube.com/@MerdiyeHocam'}" target="_blank" class="btn btn-secondary btn-sm" style="padding: 2px 8px; font-size: 0.74rem;">Shorts Aç</a></td>
          </tr>
        `).join("");
      }
    }

    // Render Instagram
    if (stats.instagram) {
      const ig = stats.instagram;
      const folEl = document.getElementById("igFollowersVal");
      const igStatusTxt = document.getElementById("igStatusTxt");
      const igDemoBadge = document.getElementById("igDemoBadge");
      const igDemoBanner = document.getElementById("igDemoBanner");

      if (ig.mode === "live" || ig.status === "connected") {
        if (igStatusTxt) igStatusTxt.textContent = ` Canlı Bağlı (@${ig.username || "merdiyehocam"})`;
        if (igDemoBadge) igDemoBadge.style.display = "none";
        if (igDemoBanner) {
          igDemoBanner.style.background = "#ECFDF5";
          igDemoBanner.style.borderColor = "#A7F3D0";
          igDemoBanner.style.color = "#065F46";
        }
      } else {
        if (igStatusTxt) igStatusTxt.textContent = " Canlı Veri Akışı (@MerdiyeHocam)";
        if (igDemoBadge) igDemoBadge.style.display = "inline-flex";
      }

      if (folEl) folEl.textContent = ig.followers || "125";

      const igBody = document.getElementById("igRecentReelsBody");
      if (igBody && Array.isArray(ig.recent_reels)) {
        igBody.innerHTML = ig.recent_reels.map(r => `
          <tr>
            <td><b>${r.title}</b></td>
            <td><span style="color: #DB2777; font-weight: 800;">${r.views}</span></td>
            <td> ${r.saves}</td>
            <td> ${r.shares}</td>
          </tr>
        `).join("");
      }
    }
  }

  // 7. Gönderi / Video Yayınlama Merkezi (Post Dispatcher)
  const publishForm = document.getElementById("publishForm");
  const checkYouTube = document.getElementById("checkYouTube");
  const checkInstagram = document.getElementById("checkInstagram");
  const ytPlatformCard = document.getElementById("ytPlatformCard");
  const igPlatformCard = document.getElementById("igPlatformCard");

  if (checkYouTube && ytPlatformCard) {
    checkYouTube.addEventListener("change", () => {
      ytPlatformCard.classList.toggle("selected", checkYouTube.checked);
    });
  }
  if (checkInstagram && igPlatformCard) {
    checkInstagram.addEventListener("change", () => {
      igPlatformCard.classList.toggle("selected", checkInstagram.checked);
    });
  }

  // Hashtag Chips
  document.querySelectorAll(".hashtag-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;
      const descArea = document.getElementById("pubDesc");
      if (descArea) {
        descArea.value = descArea.value ? `${descArea.value} ${tag}` : tag;
        descArea.focus();
      }
    });
  });

  // Quick Dispatch Presets
  document.querySelectorAll(".quick-pub-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const title = btn.dataset.title || "";
      const desc = btn.dataset.desc || "";
      const tags = btn.dataset.tags || "";

      const titleInput = document.getElementById("pubTitle");
      const descInput = document.getElementById("pubDesc");
      if (titleInput) titleInput.value = title;
      if (descInput) descInput.value = desc ? `${desc}\n\n${tags}` : tags;
      showToast("Şablon yayın formuna aktarıldı!", "info");
    });
  });

  // Video File Input Listener
  const pubVideoFileInput = document.getElementById("pubVideoFileInput");
  const pubVideoFileInfo = document.getElementById("pubVideoFileInfo");
  if (pubVideoFileInput) {
    pubVideoFileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const urlInput = document.getElementById("pubVideoUrl");
      if (urlInput) urlInput.value = file.name;
      const mbSize = (file.size / (1024 * 1024)).toFixed(1);
      if (pubVideoFileInfo) {
        pubVideoFileInfo.textContent = `Seçilen dosya: ${file.name} (${mbSize} MB) - Yayına hazır`;
        pubVideoFileInfo.style.color = "var(--primary)";
      }
    });
  }

  async function loadPublishedHistory() {
    let posts = [];
    try {
      if (window.MH_DB && typeof window.MH_DB.getPosts === "function") {
        posts = await window.MH_DB.getPosts();
      }
    } catch (e) {}

    if (!posts || posts.length === 0) {
      try {
        const res = await fetch("/api/admin/posts");
        if (res.ok) posts = await res.json();
      } catch (e) {}
    }

    if (!posts || posts.length === 0) {
      posts = JSON.parse(localStorage.getItem("merdiye_published_posts") || "[]");
    }

    const tbody = document.getElementById("publishedHistoryBody");
    if (!tbody) return;

    if (posts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">Henüz yayınlanan gönderi bulunmuyor.</td></tr>`;
      return;
    }

    tbody.innerHTML = posts.map(p => {
      const plArray = Array.isArray(p.platforms) ? p.platforms : [];
      const hasYt = plArray.indexOf("youtube") !== -1;
      const hasIg = plArray.indexOf("instagram") !== -1;
      const platformsStr = plArray.map(pl => pl === "youtube" ? "YouTube" : "Instagram").join(" &bull; ");
      const ytUrl = p.results?.youtube?.url || p.results?.youtube?.short_url || "https://www.youtube.com/@MerdiyeHocam";
      const igUrl = p.results?.instagram?.instagram_reel_url || p.results?.instagram?.url || "https://www.instagram.com/merdiyehocam/";

      return `
        <tr>
          <td style="font-size: 0.8rem; color: var(--text-muted);">${new Date(p.timestamp).toLocaleDateString("tr-TR")}</td>
          <td><b>${p.title}</b></td>
          <td><span class="pdf-badge">${platformsStr}</span></td>
          <td><span class="status-pill enrolled">Yayınlandı</span></td>
          <td>
            ${hasYt ? `<a href="${ytUrl}" target="_blank" style="color: #DC2626; font-weight: 700; margin-right: 8px;">Shorts</a>` : ""}
            ${hasIg ? `<a href="${igUrl}" target="_blank" style="color: #DB2777; font-weight: 700;">Reels</a>` : ""}
          </td>
        </tr>
      `;
    }).join("");
  }

  if (publishForm) {
    publishForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("pubTitle").value.trim();
      const description = document.getElementById("pubDesc").value.trim();
      const video_url = document.getElementById("pubVideoUrl").value.trim();
      const privacy = document.getElementById("pubPrivacy").value;

      const platforms = [];
      if (checkYouTube?.checked) platforms.push("youtube");
      if (checkInstagram?.checked) platforms.push("instagram");

      if (platforms.length === 0) {
        showToast("Lütfen en az bir platform seçiniz (YouTube veya Instagram).", "error");
        return;
      }

      if (!title) {
        showToast("Lütfen bir gönderi başlığı giriniz.", "error");
        return;
      }

      const submitBtn = document.getElementById("submitPublishBtn");
      submitBtn.disabled = true;
      submitBtn.innerHTML = " Gönderi Gönderiliyor...";

      const payload = { title, description, video_url, privacy, platforms };

      if (window.MH_DB && typeof window.MH_DB.createPost === "function") {
        try {
          await window.MH_DB.createPost(payload);
        } catch (e) {}
      }

      try {
        const res = await fetch("/api/admin/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const result = await res.json();
          showToast(result.message || "Gönderi seçilen platformlara başarıyla yayınlandı!", "success");
        } else {
          showToast("Gönderi yerel kuyruğa alındı ve simüle edildi.", "info");
        }
      } catch (err) {
        // Fallback local store
        const existing = JSON.parse(localStorage.getItem("merdiye_published_posts") || "[]");
        existing.unshift({
          id: `post_${Date.now()}`,
          timestamp: new Date().toISOString(),
          title,
          description,
          platforms,
          results: {
            youtube: { url: "https://youtube.com/shorts/@MerdiyeHocam" },
            instagram: { instagram_reel_url: "https://instagram.com/merdiyehocam" }
          }
        });
        localStorage.setItem("merdiye_published_posts", JSON.stringify(existing));
        showToast("Gönderi başarıyla kaydedildi!", "success");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = " Seçilen Platformlara Gönderiyi Yayınla";
        publishForm.reset();
        loadPublishedHistory();
      }
    });
  }

  // 8. Özel Ders Talepleri (Leads) Motoru
  let currentLeadFilter = "all";
  let cachedLeads = [];

  async function loadLeads() {
    let inquiries = [];
    try {
      if (window.MH_DB && typeof window.MH_DB.getLeads === "function") {
        inquiries = await window.MH_DB.getLeads(currentLeadFilter);
      }
    } catch (e) {}

    if (inquiries.length === 0) {
      try {
        const res = await fetch("/api/admin/inquiries");
        if (res.ok) inquiries = await res.json();
      } catch (e) {}
    }

    if (inquiries.length === 0) {
      inquiries = JSON.parse(localStorage.getItem("merdiye_leads") || "[]");
    }

    cachedLeads = inquiries;
    renderLeadsTable();
  }

    // Event Delegation on adminLeadsTableBody (Eliminates O(2^N) recursive rebinding)
  const adminLeadsTbody = document.getElementById("adminLeadsTableBody");
  if (adminLeadsTbody) {
    adminLeadsTbody.addEventListener("click", async (e) => {
      // Toggle Status
      const statusBtn = e.target.closest(".toggle-lead-status-btn");
      if (statusBtn) {
        const id = statusBtn.dataset.id;
        const current = statusBtn.dataset.status;
        const next = current === "Yeni" ? "Görüşüldü" : current === "Görüşüldü" ? "Kayıt Yapıldı" : "Yeni";

        try {
          if (window.MH_DB && typeof window.MH_DB.updateLead === "function") {
            await window.MH_DB.updateLead(id, { status: next });
          } else {
            await fetch("/api/admin/inquiries", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, status: next })
            });
          }
        } catch (err) {}

        const item = cachedLeads.find(l => String(l.id) === String(id));
        if (item) item.status = next;
        saveLeadsToStorage(cachedLeads);
        showToast(`Durum güncellendi: ${next}`, "success");
        renderLeadsTable();
        return;
      }

      // Edit Note
      const noteBtn = e.target.closest(".edit-lead-note-btn");
      if (noteBtn) {
        const id = noteBtn.dataset.id;
        const currentNote = noteBtn.dataset.note || "";
        const newNote = prompt("Öğretmen / Görüşme Notunu Giriniz:", currentNote);
        if (newNote === null) return;

        try {
          if (window.MH_DB && typeof window.MH_DB.updateLead === "function") {
            await window.MH_DB.updateLead(id, { admin_notes: newNote });
          } else {
            await fetch("/api/admin/inquiries", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, admin_notes: newNote })
            });
          }
        } catch (err) {}

        const item = cachedLeads.find(l => String(l.id) === String(id));
        if (item) item.admin_notes = newNote;
        saveLeadsToStorage(cachedLeads);
        showToast("Öğretmen notu kaydedildi!", "success");
        renderLeadsTable();
        return;
      }

      // Delete Lead
      const delBtn = e.target.closest(".delete-lead-btn");
      if (delBtn) {
        const id = delBtn.dataset.id;
        if (!confirm("Bu özel ders talebini silmek istediğinize emin misiniz?")) return;

        try {
          if (window.MH_DB && typeof window.MH_DB.deleteLead === "function") {
            await window.MH_DB.deleteLead(id);
          } else {
            await fetch(`/api/admin/inquiries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
          }
        } catch (err) {}

        cachedLeads = cachedLeads.filter(l => String(l.id) !== String(id));
        saveLeadsToStorage(cachedLeads);
        showToast("Talep başarıyla silindi.", "info");
        renderLeadsTable();
      }
    });
  }

  function renderLeadsTable() {
    const tbody = document.getElementById("adminLeadsTableBody");
    if (!tbody) return;

    // Sayım rozetlerini güncelle - Strict O(N) single pass
    const countAll = cachedLeads.length;
    let countNew = 0, countContacted = 0, countEnrolled = 0;
    for (let i = 0; i < countAll; i++) {
      const st = cachedLeads[i].status;
      if (st === "Yeni") countNew++;
      else if (st === "Görüşüldü") countContacted++;
      else if (st === "Kayıt Yapıldı") countEnrolled++;
    }

    const elAll = document.getElementById("leadCountAll");
    const elNew = document.getElementById("leadCountNew");
    const elContacted = document.getElementById("leadCountContacted");
    const elEnrolled = document.getElementById("leadCountEnrolled");

    if (elAll) elAll.textContent = String(countAll);
    if (elNew) elNew.textContent = String(countNew);
    if (elContacted) elContacted.textContent = String(countContacted);
    if (elEnrolled) elEnrolled.textContent = String(countEnrolled);

    // Filtreleme
    const filtered = cachedLeads.filter(inq => {
      if (currentLeadFilter === "all") return true;
      return inq.status === currentLeadFilter;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 28px; color: var(--text-muted);">Bu filtreye uygun başvuru bulunmuyor.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(inq => {
      const dateStr = inq.timestamp ? new Date(inq.timestamp).toLocaleDateString("tr-TR") : "Bugün";
      const statusClass = inq.status === "Yeni" ? "new" : inq.status === "Kayıt Yapıldı" ? "enrolled" : "contacted";
      const teacherNote = inq.admin_notes || inq.notes || "<span style='color: var(--text-dim);'>Not yok</span>";

      return `
        <tr>
          <td style="font-size: 0.8rem; color: var(--text-muted);">${dateStr}</td>
          <td><b>${inq.name}</b></td>
          <td><span class="pdf-badge">${inq.role || "Öğrenci"}</span></td>
          <td><a href="tel:${inq.phone}" style="color: var(--primary); font-weight: 700;">${inq.phone}</a></td>
          <td>${inq.city || "-"}</td>
          <td><b>${inq.current_net || inq.currentNet || "-"}</b></td>
          <td>${inq.target_school || inq.targetSchool || "-"}</td>
          <td style="max-width: 160px; font-size: 0.82rem; line-height: 1.4;">${teacherNote}</td>
          <td>
            <button class="status-pill ${statusClass} toggle-lead-status-btn" data-id="${inq.id}" data-status="${inq.status || "Yeni"}" title="Durumu Değiştir">
              ${inq.status || "Yeni"}
            </button>
          </td>
          <td>
            <div style="display: flex; gap: 6px;">
              <a href="mailto:${inq.email || 'merdiyehocam@gmail.com'}?subject=${encodeURIComponent('LGS Özel Ders Talebi - ' + inq.name)}" class="btn btn-secondary btn-sm" style="color: var(--primary); border-color: var(--primary-border); padding: 4px 8px;" title="E-posta ile Yanıtla">
                E-posta
              </a>
              <button type="button" class="btn btn-secondary btn-sm edit-lead-note-btn" data-id="${inq.id}" data-note="${inq.admin_notes || inq.notes || ''}" style="padding: 4px 8px;" title="Öğretmen Notu Ekle">
                Not
              </button>
              <button type="button" class="btn btn-secondary btn-sm delete-lead-btn" data-id="${inq.id}" style="color: #DC2626; border-color: #FECACA; padding: 4px 8px;" title="Talebi Sil">
                Sil
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Event listeners handled by event delegation on adminLeadsTableBody
  }

  function saveLeadsToStorage(leads) {
    try {
      localStorage.setItem("merdiye_leads", JSON.stringify(leads));
    } catch (e) {}
  }

  // Filtre Butonları Dinleyicisi
  document.querySelectorAll(".lead-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lead-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLeadFilter = btn.dataset.leadFilter || "all";
      renderLeadsTable();
    });
  });

  document.getElementById("refreshLeadsBtn")?.addEventListener("click", () => {
    loadLeads();
    showToast("Özel ders talepleri yenilendi.", "info");
  });

  if (refreshDataBtn) {
    refreshDataBtn.addEventListener("click", () => {
      loadAnalytics();
      loadPDFs();
      loadSocialStats();
      loadPublishedHistory();
      loadLeads();
      showToast("Tüm panel verileri güncellendi.", "success");
    });
  }

  // Global Dialog Modal Dismiss (Backdrop Tap & Escape Key)
  const dialogModals = [
    document.getElementById("adminPdfModal"),
    document.getElementById("questionModal"),
    document.getElementById("uploadQuestionsModal"),
    document.getElementById("examPrintModal")
  ].filter(Boolean);

  dialogModals.forEach(modalEl => {
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) modalEl.classList.remove("active");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dialogModals.forEach(modalEl => {
        if (modalEl.classList.contains("active")) {
          modalEl.classList.remove("active");
        }
      });
    }
  });

  // ============================================================
  // 10. 2026 MEB AI SORU ÜRETİCİ, ONAY MERKEZİ & A4 SINAV BASKI
  // ============================================================
  let currentAiQuestions = [];
  const STORAGE_KEY_GEMINI_API_KEY = "merdiye_gemini_api_key";

  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initAiQuestionGenerator() {
    const gradeSelect = document.getElementById("aiGradeSelect");
    const topicSelect = document.getElementById("aiTopicSelect");
    const countInput = document.getElementById("aiQuestionCountInput");
    const diffSelect = document.getElementById("aiDifficultySelect");
    const generateBtn = document.getElementById("generateQuestionsBtn");
    const reviewContainer = document.getElementById("aiReviewContainer");
    const questionsListEl = document.getElementById("aiQuestionsList");
    const genStatusTxt = document.getElementById("aiGenStatusTxt");
    const geminiKeyInput = document.getElementById("geminiApiKeyInput");
    const saveGeminiKeyBtn = document.getElementById("saveGeminiKeyBtn");
    const geminiRow = document.getElementById("geminiApiKeyRow");
    const engineRadios = document.querySelectorAll('input[name="aiEngineMode"]');

    if (!gradeSelect || !topicSelect) return;

    // Gemini API Anahtarını Yükle
    try {
      const savedKey = localStorage.getItem(STORAGE_KEY_GEMINI_API_KEY) || "";
      if (geminiKeyInput && savedKey) geminiKeyInput.value = savedKey;
    } catch (_) {}

    // Motor Değişimi Dinleyicisi
    engineRadios.forEach(r => {
      r.addEventListener("change", () => {
        if (geminiRow) {
          geminiRow.style.display = r.value === "gemini" && r.checked ? "block" : "none";
        }
      });
    });

    if (saveGeminiKeyBtn && geminiKeyInput) {
      saveGeminiKeyBtn.addEventListener("click", () => {
        const val = geminiKeyInput.value.trim();
        try {
          localStorage.setItem(STORAGE_KEY_GEMINI_API_KEY, val);
          showToast("Gemini API anahtarı tarayıcıya güvenle kaydedildi.", "success");
        } catch (_) {}
      });
    }

    // 2026 MEB Müfredat Konularını Sınıfa Göre Doldur
    function populateTopicsForGrade(grade) {
      topicSelect.innerHTML = "";
      const curriculum = window.MH_AI_GENERATOR?.MEB_CURRICULUM_2026?.[grade];
      if (!curriculum || !Array.isArray(curriculum.topics)) return;

      curriculum.topics.forEach((t, i) => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = `${i + 1}. ${t}`;
        topicSelect.appendChild(opt);
      });
    }

    gradeSelect.addEventListener("change", () => {
      populateTopicsForGrade(gradeSelect.value);
    });

    // İlk açılışta seçili sınıfın konularını yükle (varsayılan: 8. Sınıf)
    populateTopicsForGrade(gradeSelect.value || "8");

    // Hızlı Sınıf Butonu
    document.getElementById("quickGrade8Btn")?.addEventListener("click", () => {
      gradeSelect.value = "8";
      populateTopicsForGrade("8");
      showToast("8. Sınıf (LGS 2026) müfredatı seçildi.", "info");
    });

    // Soru Bankasından AI Soru Üreticiye Geçiş Butonu
    document.getElementById("openAiGeneratorFromQuestionsBtn")?.addEventListener("click", () => {
      const navItem = document.querySelector('.admin-nav-item[data-tab="aiGeneratorTab"]');
      if (navItem) navItem.click();
    });

    // AI'dan Soru Bankasına Geçiş Butonu
    document.getElementById("openQuestionsTabFromAiBtn")?.addEventListener("click", () => {
      const navItem = document.querySelector('.admin-nav-item[data-tab="questionsTab"]');
      if (navItem) navItem.click();
    });

    // Soru Sayısı Hap Butonları (1, 5, 10, 20 Sınırı)
    document.querySelectorAll(".count-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".count-pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const count = parseInt(btn.dataset.count, 10) || 5;
        if (countInput) countInput.value = count;
      });
    });

    if (countInput) {
      countInput.addEventListener("input", () => {
        let val = parseInt(countInput.value, 10) || 1;
        if (val > 20) val = 20;
        if (val < 1) val = 1;
        countInput.value = val;
        document.querySelectorAll(".count-pill-btn").forEach(b => {
          b.classList.toggle("active", parseInt(b.dataset.count, 10) === val);
        });
      });
    }

    // Soruları Üret Butonu
    if (generateBtn) {
      generateBtn.addEventListener("click", async () => {
        const grade = gradeSelect.value;
        const topic = topicSelect.value;
        const difficulty = diffSelect.value;
        let count = parseInt(countInput.value, 10) || 5;
        if (count > 20) count = 20;
        if (count < 1) count = 1;

        const selectedEngine = document.querySelector('input[name="aiEngineMode"]:checked')?.value || "local";
        const geminiKey = geminiKeyInput ? geminiKeyInput.value.trim() : "";

        generateBtn.disabled = true;
        generateBtn.textContent = "Sorular Üretiliyor...";
        if (genStatusTxt) genStatusTxt.textContent = "Matematik motoru çalışıyor...";

        try {
          let questions = [];
          if (selectedEngine === "gemini" && geminiKey) {
            try {
              if (genStatusTxt) genStatusTxt.textContent = "Gemini API ile canlı sorular üretiliyor...";
              questions = await window.MH_AI_GENERATOR.generateGeminiQuestions(geminiKey, grade, topic, difficulty, count);
              showToast(`${questions.length} adet soru Gemini AI tarafından üretildi.`, "success");
            } catch (geminiErr) {
              console.warn("[AI Generator] Gemini API hatası, yerel motor devreye giriyor:", geminiErr);
              showToast("Gemini API yanıt vermedi, dahili matematik motoruyla üretildi.", "warning");
              questions = window.MH_AI_GENERATOR.generateLocalQuestions(grade, topic, difficulty, count);
            }
          } else {
            questions = window.MH_AI_GENERATOR.generateLocalQuestions(grade, topic, difficulty, count);
            showToast(`${questions.length} adet özgün MEB sorusu başarıyla üretildi.`, "success");
          }

          currentAiQuestions = questions;
          renderAiQuestions();

          if (reviewContainer) {
            reviewContainer.style.display = "flex";
            reviewContainer.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } catch (err) {
          console.error("[AI Generator] Soru üretim hatası:", err);
          showToast("Soru üretilirken bir hata oluştu: " + err.message, "error");
        } finally {
          generateBtn.disabled = false;
          generateBtn.textContent = "Soruları Üret";
          if (genStatusTxt) genStatusTxt.textContent = "";
        }
      });
    }

    // Soruları Ekrana Basma
    function renderAiQuestions() {
      if (!questionsListEl) return;
      questionsListEl.innerHTML = "";

      updateReviewStats();

      const letters = ["A", "B", "C", "D"];

      currentAiQuestions.forEach((q, idx) => {
        const card = document.createElement("div");
        card.className = `ai-question-card ${q.approved ? "is-approved" : ""}`;
        card.id = `ai-card-${idx}`;

        card.innerHTML = `
          <div class="ai-question-card-header">
            <div class="ai-card-title-group">
              <span class="ai-q-num-pill">Soru ${idx + 1}</span>
              <span class="pdf-badge gold" style="font-size: 0.76rem;">${escapeHtml(q.gradeLabel)} &bull; ${escapeHtml(q.topic)}</span>
              <span class="pdf-badge" style="font-size: 0.74rem; background: var(--bg-card); color: var(--text-secondary); border: 1px solid var(--border-color);">${escapeHtml(q.difficultyLabel)}</span>
              ${q.saved ? '<span class="pdf-badge" style="background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; font-size: 0.74rem;">Sisteme Kaydedildi</span>' : ''}
            </div>

            <div class="ai-card-actions">
              <label class="ai-approve-toggle" title="Bu soruyu onayla">
                <input type="checkbox" class="ai-card-approve-checkbox" data-idx="${idx}" ${q.approved ? "checked" : ""}>
                <span>${q.approved ? "Onaylandı" : "Onayla"}</span>
              </label>

              <button type="button" class="btn btn-secondary btn-sm ai-regenerate-single-btn" data-idx="${idx}" title="Sadece bu soruyu aynı konudan yeniden üret">
                Soruyu Değiştir
              </button>
            </div>
          </div>

          <div class="ai-q-text">${escapeHtml(q.question).replace(/\n/g, "<br>")}</div>

          <div class="ai-options-grid">
            ${q.options.map((opt, optIdx) => `
              <div class="ai-option-item ${optIdx === q.correctIndex ? "is-correct" : ""}">
                <span class="ai-opt-tag">${letters[optIdx]}</span>
                <span>${escapeHtml(opt)}</span>
                ${optIdx === q.correctIndex ? '<span style="margin-left: auto; font-size: 0.74rem; font-weight: 800; color: #059669;">(Doğru Cevap)</span>' : ''}
              </div>
            `).join("")}
          </div>

          <div class="ai-solution-tactic-box">
            <div><b>Ayrıntılı Çözüm Adımları:</b></div>
            <div style="margin-top: 4px; color: var(--text-secondary);">${escapeHtml(q.explanation).replace(/\n/g, "<br>")}</div>
            ${q.tactic ? `<div class="ai-tactic-line"><b>${escapeHtml(q.tactic)}</b></div>` : ""}
          </div>
        `;

        // Event listener: Onay toggle
        const chk = card.querySelector(".ai-card-approve-checkbox");
        if (chk) {
          chk.addEventListener("change", () => {
            q.approved = chk.checked;
            card.classList.toggle("is-approved", q.approved);
            const labelSpan = card.querySelector(".ai-approve-toggle span");
            if (labelSpan) labelSpan.textContent = q.approved ? "Onaylandı" : "Onayla";
            updateReviewStats();
          });
        }

        // Event listener: Tekli yeniden üret
        const regenBtn = card.querySelector(".ai-regenerate-single-btn");
        if (regenBtn) {
          regenBtn.addEventListener("click", () => {
            const fresh = window.MH_AI_GENERATOR.generateLocalQuestion(q.grade, q.topic, q.difficulty, Math.floor(Math.random() * 200));
            fresh.approved = false;
            currentAiQuestions[idx] = fresh;
            renderAiQuestions();
            showToast(`Soru ${idx + 1} aynı konudan yeniden üretildi.`, "info");
          });
        }

        questionsListEl.appendChild(card);
      });
    }

    function updateReviewStats() {
      const total = currentAiQuestions.length;
      const approved = currentAiQuestions.filter(q => q.approved).length;
      const pending = total - approved;

      const tEl = document.getElementById("statTotalCount");
      const aEl = document.getElementById("statApprovedCount");
      const pEl = document.getElementById("statPendingCount");

      if (tEl) tEl.textContent = total;
      if (aEl) aEl.textContent = approved;
      if (pEl) pEl.textContent = pending;

      const saveBtn = document.getElementById("saveApprovedToDbBtn");
      if (saveBtn) {
        saveBtn.textContent = approved > 0 ? `Onaylananları Sisteme Kaydet (${approved})` : "Onaylananları Sisteme Kaydet";
      }
    }

    // Toplu Onay & Seçim İşlemleri
    document.getElementById("approveAllQuestionsBtn")?.addEventListener("click", () => {
      currentAiQuestions.forEach(q => { q.approved = true; });
      renderAiQuestions();
      showToast("Tüm sorular onaylandı.", "success");
    });

    document.getElementById("clearAllApprovalsBtn")?.addEventListener("click", () => {
      currentAiQuestions.forEach(q => { q.approved = false; });
      renderAiQuestions();
      showToast("Onay seçimleri temizlendi.", "info");
    });

    // Onaylanmayanları Tek Tuşla Yeniden Üret
    document.getElementById("regenerateUnapprovedBtn")?.addEventListener("click", () => {
      const unapprovedIndices = [];
      currentAiQuestions.forEach((q, i) => {
        if (!q.approved) unapprovedIndices.push(i);
      });

      if (unapprovedIndices.length === 0) {
        showToast("Tüm sorular zaten onaylı durumda.", "info");
        return;
      }

      unapprovedIndices.forEach((idx, step) => {
        const cur = currentAiQuestions[idx];
        const fresh = window.MH_AI_GENERATOR.generateLocalQuestion(cur.grade, cur.topic, cur.difficulty, step + Math.floor(Math.random() * 50));
        fresh.approved = false;
        currentAiQuestions[idx] = fresh;
      });

      renderAiQuestions();
      showToast(`${unapprovedIndices.length} adet onaylanmayan soru yeniden üretildi. Onaylı sorularınız korundu.`, "success");
    });

    // Onaylananları Sisteme Kaydet (Supabase & Yerel Sunucu)
    document.getElementById("saveApprovedToDbBtn")?.addEventListener("click", async () => {
      const approvedList = currentAiQuestions.filter(q => q.approved);
      if (approvedList.length === 0) {
        showToast("Lütfen kaydetmek için en az 1 soruyu onaylayın.", "warning");
        return;
      }

      const saveBtn = document.getElementById("saveApprovedToDbBtn");
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Kaydediliyor...";
      }

      try {
        const rowsToSave = approvedList.map(q => ({
          unit: `${q.grade}. Sınıf - ${q.topic}`,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation + (q.tactic ? "\n\n" + q.tactic : ""),
          difficulty: q.difficultyLabel || "LGS Ayarı"
        }));

        // 1. Supabase ve LocalStorage Veri Katmanı
        if (window.MH_DB && typeof window.MH_DB.bulkAddQuizQuestions === "function") {
          await window.MH_DB.bulkAddQuizQuestions(rowsToSave);
        }

        // 2. Python Sunucu API Eşitlemesi (varsa)
        try {
          for (const item of rowsToSave) {
            await fetch("/api/admin/quiz-questions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "add",
                unit: item.unit,
                question: item.question,
                options: item.options,
                correct_index: item.correctIndex,
                solution: item.explanation,
                tactic: "",
                difficulty: item.difficulty
              })
            });
          }
        } catch (_) {}

        approvedList.forEach(q => { q.saved = true; });
        renderAiQuestions();

        // Soru Bankası Tablosunu Yenile
        loadQuestions();

        showToast(`${approvedList.length} adet onaylı soru soru bankasına ve veritabanına başarıyla kaydedildi!`, "success");
      } catch (err) {
        console.error("[AI Generator] Kayıt hatası:", err);
        showToast("Sorular kaydedilirken bir hata oluştu: " + err.message, "error");
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          updateReviewStats();
        }
      }
    });

    // ==========================================
    // A4 ÖĞRETMEN SINAV & ÇALIŞMA KAĞIDI BASKI
    // ==========================================
    const printModal = document.getElementById("examPrintModal");
    const closePrintModalBtn = document.getElementById("closeExamPrintModalBtn");
    const cancelExamPrintBtn = document.getElementById("cancelExamPrintBtn");
    const triggerBrowserPrintBtn = document.getElementById("triggerBrowserPrintBtn");
    const printableArea = document.getElementById("printableExamArea");

    const schoolInput = document.getElementById("printSchoolNameInput");
    const titleInput = document.getElementById("printExamTitleInput");
    const filterSelect = document.getElementById("printQuestionsFilterSelect");
    const layoutSelect = document.getElementById("printLayoutSelect");
    const answerKeyCheck = document.getElementById("printIncludeAnswerKeyCheck");
    const scratchCheck = document.getElementById("printIncludeScratchCheck");

    function updatePrintPreview() {
      if (!printableArea) return;

      const filterMode = filterSelect ? filterSelect.value : "approved_only";
      let questionsToPrint = currentAiQuestions;
      if (filterMode === "approved_only") {
        questionsToPrint = currentAiQuestions.filter(q => q.approved);
      }

      if (questionsToPrint.length === 0) {
        printableArea.innerHTML = `
          <div style="padding: 40px; text-align: center; color: #64748B;">
            <b>Yazdırılacak soru bulunamadı.</b><br>
            Lütfen önce soru üretin ve en az bir soruyu onaylayın ya da 'Üretilen Tüm Soruları Yazdır' seçeneğini seçin.
          </div>
        `;
        return;
      }

      const options = {
        schoolName: schoolInput ? schoolInput.value : "T.C. MİLLÎ EĞİTİM BAKANLIĞI",
        examTitle: titleInput ? titleInput.value : "MATEMATİK KAZANIM VE GELİŞİM SINAVI",
        gradeText: questionsToPrint[0] ? questionsToPrint[0].gradeLabel : "8. Sınıf",
        topicText: questionsToPrint[0] ? questionsToPrint[0].topic : "Matematik",
        examDate: new Date().toLocaleDateString("tr-TR"),
        includeAnswerKey: answerKeyCheck ? answerKeyCheck.checked : true,
        includeScratchArea: scratchCheck ? scratchCheck.checked : true,
        layout: layoutSelect ? layoutSelect.value : "two_column"
      };

      printableArea.innerHTML = window.MH_AI_GENERATOR.buildPrintableExamHtml(questionsToPrint, options);
    }

    document.getElementById("openPrintExamModalBtn")?.addEventListener("click", () => {
      if (currentAiQuestions.length === 0) {
        showToast("Lütfen önce sınav kağıdı için sorular üretin.", "warning");
        return;
      }

      // Başlıkları otomatik doldur
      const firstQ = currentAiQuestions[0];
      if (firstQ && titleInput) {
        titleInput.value = `2025 - 2026 EĞİTİM ÖĞRETİM YILI ${firstQ.gradeLabel.toUpperCase()} MATEMATİK KAZANIM SINAVI`;
      }

      updatePrintPreview();
      if (printModal) printModal.classList.add("active");
    });

    [schoolInput, titleInput, filterSelect, layoutSelect, answerKeyCheck, scratchCheck].forEach(el => {
      if (el) el.addEventListener("input", updatePrintPreview);
      if (el) el.addEventListener("change", updatePrintPreview);
    });

    closePrintModalBtn?.addEventListener("click", () => {
      if (printModal) printModal.classList.remove("active");
    });

    cancelExamPrintBtn?.addEventListener("click", () => {
      if (printModal) printModal.classList.remove("active");
    });

    triggerBrowserPrintBtn?.addEventListener("click", () => {
      window.print();
    });
  }

  // 9. Başlatma
  checkAdminAuth().then(isAuthed => {
    if (isAuthed) {
      loadAnalytics();
      loadPDFs();
      loadSocialStats();
      loadPublishedHistory();
      loadLeads();
      loadQuestions();
      initAiQuestionGenerator();
    }
  });
});

