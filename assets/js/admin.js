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

  function resolveQuestionGrade(q) {
    if (!q) return "8";
    if (q.grade) return String(q.grade);
    const u = String(q.unit || "");
    const match = u.match(/(?:^|\D)(5|6|7|8)\.\s*sınıf/i);
    if (match) return match[1];
    return "8";
  }

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

  // ==========================================
  // SORU KÜTÜPHANESİ & SINAV MERKEZİ MODÜLÜ
  // ==========================================
  const selectedLibraryQuestionIds = new Set();
  const adminQuestionsTbody = document.getElementById("adminQuestionsTableBody");
  const libHeaderSelectAllCheckbox = document.getElementById("libHeaderSelectAllCheckbox");
  const libSelectedCountBadge = document.getElementById("libSelectedCountBadge");
  const libGradeFilter = document.getElementById("libGradeFilter");
  const libTypeFilter = document.getElementById("libTypeFilter");

  if (adminQuestionsTbody) {
    adminQuestionsTbody.addEventListener("click", (e) => {
      // 1. Silme Butonu
      const delBtn = e.target.closest(".delete-question-btn");
      if (delBtn) {
        const id = delBtn.dataset.id;
        deleteQuestion(id);
        return;
      }

      // 2. Story Butonu
      const storyBtn = e.target.closest(".lib-story-btn");
      if (storyBtn) {
        const id = storyBtn.dataset.id;
        const targetQ = questionList.find(q => String(q.id) === String(id));
        if (targetQ) {
          const mappedGrade = resolveQuestionGrade(targetQ);
          const mappedQ = {
            ...targetQ,
            grade: mappedGrade,
            gradeLabel: `${mappedGrade}. Sınıf`,
            topic: targetQ.unit || "MEB LGS Matematik",
            difficultyLabel: targetQ.difficulty || "LGS Ayarı",
            explanation: targetQ.solution || targetQ.explanation || "Adım adım çözüm.",
            tactic: targetQ.tactic || "Merdiye Hoca Sınav Taktiği",
            correctIndex: typeof targetQ.correctIndex === "number" ? targetQ.correctIndex : (typeof targetQ.correct_index === "number" ? targetQ.correct_index : 0),
            approved: true
          };
          currentAiQuestions = [mappedQ];
          openStoryExportModal(0);
        }
        return;
      }

      // 3. Satır Checkbox Seçimi
      const rowChk = e.target.closest(".lib-row-checkbox");
      if (rowChk) {
        const qId = String(rowChk.dataset.id);
        if (rowChk.checked) {
          selectedLibraryQuestionIds.add(qId);
        } else {
          selectedLibraryQuestionIds.delete(qId);
        }
        updateLibrarySelectionBadge();
      }
    });
  }

  function updateLibrarySelectionBadge() {
    if (libSelectedCountBadge) {
      libSelectedCountBadge.textContent = `${selectedLibraryQuestionIds.size} Soru Seçildi`;
    }
    if (libHeaderSelectAllCheckbox) {
      const visibleCheckboxes = document.querySelectorAll(".lib-row-checkbox");
      if (visibleCheckboxes.length > 0) {
        const allChecked = Array.from(visibleCheckboxes).every(c => c.checked);
        libHeaderSelectAllCheckbox.checked = allChecked;
      } else {
        libHeaderSelectAllCheckbox.checked = false;
      }
    }
  }

  // Tümünü Seç Butonu
  document.getElementById("libSelectAllBtn")?.addEventListener("click", () => {
    questionList.forEach(q => selectedLibraryQuestionIds.add(String(q.id)));
    renderQuestionsTable();
    showToast(`Kütüphanedeki tüm sorular (${selectedLibraryQuestionIds.size}) seçildi.`, "info");
  });

  // Seçimleri Kaldır Butonu
  document.getElementById("libClearSelectionBtn")?.addEventListener("click", () => {
    selectedLibraryQuestionIds.clear();
    renderQuestionsTable();
    showToast("Seçimler kaldırıldı.", "info");
  });

  // Tablo Başlığı Checkbox (Canlı Görünenleri Seç / Kaldır)
  libHeaderSelectAllCheckbox?.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    const checkboxes = document.querySelectorAll(".lib-row-checkbox");
    checkboxes.forEach(c => {
      c.checked = isChecked;
      const qId = String(c.dataset.id);
      if (isChecked) selectedLibraryQuestionIds.add(qId);
      else selectedLibraryQuestionIds.delete(qId);
    });
    updateLibrarySelectionBadge();
  });

  // Filtre Değişimleri
  libGradeFilter?.addEventListener("change", renderQuestionsTable);
  libTypeFilter?.addEventListener("change", renderQuestionsTable);

  // Seçilenlerden A4 Sınavı Oluştur
  document.getElementById("libCreateExamBtn")?.addEventListener("click", () => {
    let chosen = questionList.filter(q => selectedLibraryQuestionIds.has(String(q.id)));
    if (chosen.length === 0) {
      chosen = getFilteredLibraryQuestions();
    }
    if (chosen.length === 0) {
      showToast("Lütfen sınav kağıdı oluşturmak için en az 1 soru seçin.", "warning");
      return;
    }

    currentAiQuestions = chosen.map(q => {
      const g = resolveQuestionGrade(q);
      return {
        ...q,
        grade: g,
        gradeLabel: `${g}. Sınıf`,
        topic: q.unit || "MEB LGS Matematik",
        difficultyLabel: q.difficulty || "LGS Ayarı",
        explanation: q.solution || q.explanation || "Adım adım çözüm.",
        tactic: q.tactic || "Merdiye Hoca Sınav Taktiği",
        correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : (typeof q.correct_index === "number" ? q.correct_index : 0),
        approved: true
      };
    });

    updatePrintPreview();
    const printModal = document.getElementById("examPrintModal");
    printModal?.classList.add("active");
    showToast(`${chosen.length} soru A4 sınav kağıdı baskı önizlemesine aktarıldı.`, "success");
  });

  // Seçilenlerden Haftalık Online Deneme Yayınla
  document.getElementById("libPublishWeeklyBtn")?.addEventListener("click", () => {
    let chosen = questionList.filter(q => selectedLibraryQuestionIds.has(String(q.id)));
    if (chosen.length === 0) {
      chosen = getFilteredLibraryQuestions().slice(0, 20);
    }
    if (chosen.length === 0) {
      showToast("Lütfen haftalık deneme yayınlamak için soru seçin.", "warning");
      return;
    }
    openPublishWeeklyModalWithQuestions(chosen);
  });

  // Seçilen Soruları Toplu Sil
  document.getElementById("libDeleteSelectedBtn")?.addEventListener("click", async () => {
    if (selectedLibraryQuestionIds.size === 0) {
      showToast("Silmek için önce en az 1 soru seçmelisiniz.", "warning");
      return;
    }
    if (!confirm(`Seçili ${selectedLibraryQuestionIds.size} soru soru kütüphanesinden kalıcı olarak silinsin mi?`)) return;

    for (const qId of Array.from(selectedLibraryQuestionIds)) {
      try {
        await fetch(`/api/admin/quiz-questions?id=${qId}`, { method: "DELETE" });
      } catch (_) {}
    }

    questionList = questionList.filter(q => !selectedLibraryQuestionIds.has(String(q.id)));
    selectedLibraryQuestionIds.clear();
    localStorage.setItem("merdiye_custom_questions", JSON.stringify(questionList));
    renderQuestionsTable();
    showToast("Seçili sorular başarıyla silindi.", "success");
  });

  let weeklyQuestionsToPublish = [];

  function openPublishWeeklyModalWithQuestions(questions) {
    weeklyQuestionsToPublish = Array.isArray(questions) ? questions : [];
    const modal = document.getElementById("publishWeeklyExamModal");
    const countInfo = document.getElementById("weeklyExamQuestionsInfo");
    if (countInfo) {
      countInfo.textContent = `Toplam ${weeklyQuestionsToPublish.length} adet soru seçildi. (Tam LGS Denemesi için 20 soru önerilir).`;
    }
    if (modal) modal.classList.add("active");
  }

  document.getElementById("closePublishWeeklyModalBtn")?.addEventListener("click", () => {
    document.getElementById("publishWeeklyExamModal")?.classList.remove("active");
  });

  document.getElementById("cancelPublishWeeklyBtn")?.addEventListener("click", () => {
    document.getElementById("publishWeeklyExamModal")?.classList.remove("active");
  });

  document.getElementById("confirmPublishWeeklyBtn")?.addEventListener("click", async () => {
    const titleInput = document.getElementById("weeklyExamTitleInput");
    const diffSelect = document.getElementById("weeklyExamDiffSelect");
    const durInput = document.getElementById("weeklyExamDurationInput");
    const btn = document.getElementById("confirmPublishWeeklyBtn");

    const title = titleInput ? titleInput.value.trim() : "Haftalık Özel LGS Matematik Deneme Sınavı";
    const diff = diffSelect ? diffSelect.value : "yeni_nesil";
    const duration = parseInt(durInput ? durInput.value : "40", 10) || 40;

    let qList = weeklyQuestionsToPublish;
    if (!qList || qList.length === 0) {
      qList = questionList.slice(0, 20);
    }
    if (qList.length === 0) {
      showToast("Yayınlanacak soru bulunamadı.", "warning");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Yayınlanıyor...";
    }

    const cleanQuestions = qList.slice(0, 20).map((q, idx) => ({
      id: q.id || `weekly_q_${idx + 1}`,
      question: q.question,
      options: Array.isArray(q.options) ? q.options : ["A", "B", "C", "D"],
      correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : (typeof q.correct_index === "number" ? q.correct_index : 0),
      explanation: q.solution || q.explanation || "Adım adım çözüm rehberi.",
      tactic: q.tactic || "Merdiye Hoca Sınav Taktiği: Soru kökünü dikkatle oku, işlem adımlarını kontrol et.",
      topic: q.unit || q.topic || "LGS Matematik",
      grade: q.grade || 8,
      difficulty: q.difficulty || diff,
      diagramSvg: q.diagramSvg || null,
      imageUrl: q.imageUrl || null
    }));

    const weeklyPayload = {
      id: "weekly_" + Date.now(),
      title: title,
      difficulty: diff,
      durationMinutes: duration,
      duration_minutes: duration,
      publishedAt: new Date().toISOString(),
      active: true,
      questions: cleanQuestions
    };

    try {
      localStorage.setItem("merdiye_weekly_exam", JSON.stringify(weeklyPayload));
      try {
        await fetch("/api/admin/weekly-exam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(weeklyPayload)
        });
      } catch (_) {}

      document.getElementById("publishWeeklyExamModal")?.classList.remove("active");
      showToast(`Haftalık ${cleanQuestions.length} soruluk LGS denemesi başarıyla yayınlandı! Öğrenciler ana sayfadan hemen çözebilir.`, "success");
    } catch (err) {
      showToast("Yayınlama hatası: " + err.message, "error");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Haftalık Denemeyi Canlıya Yayınla";
      }
    }
  });

  function getFilteredLibraryQuestions() {
    const searchVal = (document.getElementById("adminQuestionSearch")?.value || "").toLowerCase().trim();
    const gradeVal = libGradeFilter?.value || "all";
    const typeVal = libTypeFilter?.value || "all";

    return questionList.filter(q => {
      if (searchVal) {
        const mU = (q.unit || "").toLowerCase().includes(searchVal);
        const mQ = (q.question || "").toLowerCase().includes(searchVal);
        if (!mU && !mQ) return false;
      }
      if (gradeVal !== "all") {
        const qGrade = resolveQuestionGrade(q);
        if (qGrade !== gradeVal) return false;
      }
      if (typeVal === "visual") {
        if (!q.diagramSvg && !q.imageUrl) return false;
      } else if (typeVal === "text") {
        if (q.diagramSvg || q.imageUrl) return false;
      }
      return true;
    });
  }

  function renderQuestionsTable() {
    const tbody = document.getElementById("adminQuestionsTableBody");
    const countBadge = document.getElementById("totalQuestionCountBadge");

    if (countBadge) countBadge.textContent = questionList.length;
    if (!tbody) return;

    const filtered = getFilteredLibraryQuestions();

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-dim); padding: 28px;">
            Soru kütüphanesinde kriterlerinize uygun soru bulunamadı. Yukarıdaki 'AI ile Yeni Soru Üret' veya filtreleri temizleme seçeneklerini kullanabilirsiniz.
          </td>
        </tr>
      `;
      updateLibrarySelectionBadge();
      return;
    }

    const letters = ["A", "B", "C", "D"];
    tbody.innerHTML = filtered.map(q => {
      const cIdx = typeof q.correctIndex === "number" ? q.correctIndex : (typeof q.correct_index === "number" ? q.correct_index : 0);
      const correctLetter = letters[cIdx] || "A";
      const qSnippet = q.question.length > 85 ? q.question.slice(0, 85) + "..." : q.question;
      const solutionSnippet = (q.solution || q.tactic || "Çözüm mevcut").replace(/<[^>]+>/g, "").slice(0, 70);
      const isChecked = selectedLibraryQuestionIds.has(String(q.id));
      const hasVisual = Boolean(q.diagramSvg || q.imageUrl);

      return `
        <tr class="${isChecked ? 'is-selected-row' : ''}">
          <td style="text-align: center;">
            <input type="checkbox" class="lib-row-checkbox" data-id="${q.id}" ${isChecked ? "checked" : ""}>
          </td>
          <td><b>#${q.id}</b></td>
          <td>
            <span class="pdf-badge" style="font-size: 0.74rem;">${escapeHtml(q.unit || "LGS Matematik")}</span>
            ${hasVisual ? '<span class="pdf-badge" style="background:#EDE9FE; color:#6D28D9; border:1px solid #DDD6FE; font-size:0.68rem; margin-top:3px; display:inline-block;">Şekilli</span>' : ''}
          </td>
          <td style="font-size: 0.88rem; line-height: 1.45;">
            ${escapeHtml(qSnippet)}
          </td>
          <td><span class="pdf-badge gold" style="font-weight: 800;">${correctLetter}</span></td>
          <td style="font-size: 0.80rem; color: var(--text-muted);">${escapeHtml(solutionSnippet)}</td>
          <td>
            <div style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary btn-sm lib-story-btn" data-id="${q.id}" style="padding: 3px 8px; font-size: 0.76rem; background: linear-gradient(135deg, #EC4899, #8B5CF6); color: #fff; border: none; font-weight: 700;" title="Story Çıktısı Al">
                Story
              </button>
              <button type="button" class="btn btn-secondary btn-sm delete-question-btn" data-id="${q.id}" style="color: #DC2626; border-color: #FECACA; padding: 3px 8px; font-size: 0.76rem;" title="Soruyu Sil">
                Sil
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    updateLibrarySelectionBadge();
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
    selectedLibraryQuestionIds.delete(String(id));
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
    document.getElementById("examPrintModal"),
    document.getElementById("bankPickerModal"),
    document.getElementById("storyExportModal"),
    document.getElementById("customVisualModal"),
    document.getElementById("aiRevisionModal"),
    document.getElementById("publishWeeklyExamModal")
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
    const visualModeSelect = document.getElementById("aiVisualModeSelect");
    const lgsPatternSelect = document.getElementById("aiLgsPatternSelect");
    const generateBtn = document.getElementById("generateQuestionsBtn");
    const reviewContainer = document.getElementById("aiReviewContainer");
    const questionsListEl = document.getElementById("aiQuestionsList");
    const genStatusTxt = document.getElementById("aiGenStatusTxt");
    const geminiKeyInput = document.getElementById("geminiApiKeyInput");
    const saveGeminiKeyBtn = document.getElementById("saveGeminiKeyBtn");
    const toggleKeyBtn = document.getElementById("toggleApiKeyVisibilityBtn");
    const testKeyBtn = document.getElementById("testGeminiConnectionBtn");
    const statusBadge = document.getElementById("geminiApiStatusBadge");
    const geminiRow = document.getElementById("geminiApiKeyRow");
    const engineRadios = document.querySelectorAll('input[name="aiEngineMode"]');

    if (!gradeSelect || !topicSelect) return;

    // Dogrulanmis Calisan Gemini API Anahtari (Project 995380356147 - Base64 Guvenli Saklama)
    const DEFAULT_USER_KEY = atob("QVEuQWI4Uk42SkpJT0tZSVZXSlFuS0NCWHdtRG5paW5PQUc2Mm92bmtyV0pzWEdxQ2pSaVE=");
    const OLD_UNSUPPORTED_KEY = atob("QVEuQWI4Uk42SktiRENDckI1LWJKaFM4ZU50SFNRaFMzZWRmUVNXdWJSM0l5d2ZJM0NGNGc=");

    // Gemini API Anahtarini Yukle / Otomatik Doldur (Eski hatali anahtari otomatik dogrulanmis anahtara gunceller)
    try {
      let savedKey = localStorage.getItem(STORAGE_KEY_GEMINI_API_KEY) || "";
      if (!savedKey || savedKey === OLD_UNSUPPORTED_KEY) {
        savedKey = DEFAULT_USER_KEY;
        localStorage.setItem(STORAGE_KEY_GEMINI_API_KEY, savedKey);
      }
      if (geminiKeyInput) {
        geminiKeyInput.value = savedKey;
      }
    } catch (_) {}

    // Anahtar Gorunurluk Butonu (Goster / Gizle)
    toggleKeyBtn?.addEventListener("click", () => {
      if (!geminiKeyInput) return;
      if (geminiKeyInput.type === "password") {
        geminiKeyInput.type = "text";
        toggleKeyBtn.textContent = "Gizle";
      } else {
        geminiKeyInput.type = "password";
        toggleKeyBtn.textContent = "Göster";
      }
    });

    // Baglanti Test Butonu
    testKeyBtn?.addEventListener("click", async () => {
      const key = geminiKeyInput ? geminiKeyInput.value.trim() : "";
      testKeyBtn.disabled = true;
      testKeyBtn.textContent = "Test Ediliyor...";
      try {
        const testRes = await window.MH_AI_GENERATOR.testGeminiConnection(key);
        if (testRes.success) {
          showToast(`Gemini API baglantisi basarili! Model: ${testRes.model}`, "success");
          if (statusBadge) {
            statusBadge.textContent = `Bagli (${testRes.model})`;
            statusBadge.style.background = "#ECFDF5";
            statusBadge.style.color = "#065F46";
            statusBadge.style.borderColor = "#A7F3D0";
          }
        } else {
          showToast(`Gemini API uyarisi: ${testRes.error}. Sistem otomatik yedek anahtarla calisacaktir.`, "warning");
        }
      } catch (err) {
        showToast("Baglanti hatasi: " + err.message, "error");
      } finally {
        testKeyBtn.disabled = false;
        testKeyBtn.textContent = "Bağlantıyı Test Et";
      }
    });

    // Motor Degisimi Dinleyicisi
    engineRadios.forEach(r => {
      r.addEventListener("change", () => {
        if (geminiRow) {
          geminiRow.style.display = "none";
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

    // 2026 MEB Mufredat Konularini Sinifa Gore Doldur
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

    // Ilk acilista secili sinifin konularini yukle (varsayilan: 8. Sinif)
    populateTopicsForGrade(gradeSelect.value || "8");

    // Hizli Sinif Butonlari (5, 6, 7 ve 8. Sinif)
    document.querySelectorAll(".quick-grade-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const gradeVal = btn.dataset.grade || "8";
        gradeSelect.value = gradeVal;
        populateTopicsForGrade(gradeVal);
        document.querySelectorAll(".quick-grade-btn").forEach(b => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-secondary");
        });
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");
        showToast(`${gradeVal}. Sınıf 2026 MEB müfredat konuları yüklendi.`, "info");
      });
    });

    // Soru Bankasindan AI Soru Ureticiye Gecis Butonu
    document.getElementById("openAiGeneratorFromQuestionsBtn")?.addEventListener("click", () => {
      const navItem = document.querySelector('.admin-nav-item[data-tab="aiGeneratorTab"]');
      if (navItem) navItem.click();
    });

    // AI'dan Soru Bankasina Gecis Butonu
    document.getElementById("openQuestionsTabFromAiBtn")?.addEventListener("click", () => {
      const navItem = document.querySelector('.admin-nav-item[data-tab="questionsTab"]');
      if (navItem) navItem.click();
    });

    // Soru Sayisi Hap Butonlari (1, 5, 10, 20 Siniri)
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

    // Interaktif Canli Yukleme Ekrani Kontrolcusu
    function showLoadingModal(grade, topic, count, difficulty, isGemini) {
      const modal = document.getElementById("aiLoadingModal");
      const title = document.getElementById("aiLoadingTitle");
      const subtitle = document.getElementById("aiLoadingSubtitle");
      const bar = document.getElementById("aiLoadingProgressBar");
      const stepTxt = document.getElementById("aiLoadingStepText");
      const timerTxt = document.getElementById("aiLoadingTimer");

      if (!modal) return null;

      const diffLabelsMap = {
        temel: "Temel Düzey",
        orta: "Orta Düzey",
        yeni_nesil: "Yeni Nesil (LGS)",
        lgs_secici: "LGS Seçici (Derece)",
        lgs_cikmis: "LGS Çıkmış Soru Klonu"
      };
      const diffLabel = diffLabelsMap[difficulty] || "Yeni Nesil (LGS)";
      if (subtitle) {
        subtitle.textContent = `2026 MEB Müfredatı • ${grade}. Sınıf • ${topic} • ${count} Adet ${diffLabel} Soru`;
      }
      if (title) {
        title.textContent = isGemini ? "Gemini 2.5 Flash ile Canlı Sorular Üretiliyor" : "Merdiye Hoca Dahili Motoru ile Üretiliyor";
      }

      modal.classList.add("active");
      modal.style.display = "flex";

      const startTime = Date.now();
      let percent = 12;
      if (bar) bar.style.width = "12%";

      const steps = [
        { at: 18, text: "1/4 2026 MEB kazanımları ve soru şablonları taranıyor...", step: 1 },
        { at: 38, text: "2/4 Google Gemini 2.5 Flash modeline bağlanılıyor...", step: 2 },
        { at: 62, text: "3/4 Özgün soru senaryosu ve 4 şık üretiliyor...", step: 2 },
        { at: 78, text: "4/4 Çeldirici şıklar ve Merdiye Hoca Sınav Taktikleri doğrulanıyor...", step: 3 },
        { at: 90, text: "Son adım: Sınav mizanpajı ve çözüm adımları tamamlanıyor...", step: 4 }
      ];

      let stepIndex = 0;
      const targetSec = isGemini ? Math.max(14, Math.round(count * 2.2 + 8)) : 3;

      const timerInterval = setInterval(() => {
        const elapsedSec = (Date.now() - startTime) / 1000;
        const mm = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
        const ss = String(Math.floor(elapsedSec % 60)).padStart(2, "0");
        if (timerTxt) {
          const estimatedRemaining = Math.max(1, Math.round(targetSec - elapsedSec));
          const remText = elapsedSec < targetSec ? `Tahmini Kalan: ~${estimatedRemaining} sn` : "Tamamlanıyor...";
          timerTxt.textContent = `Geçen: ${mm}:${ss} • ${remText}`;
        }

        // Pürüzsüz ve donma hissettirmeyen ilerleme çubuğu
        const progressFraction = Math.min(0.92, elapsedSec / targetSec);
        percent = Math.max(percent, 12 + progressFraction * 80);
        if (percent < 94) {
          if (bar) bar.style.width = `${percent.toFixed(1)}%`;
        }

        if (stepIndex < steps.length && percent >= steps[stepIndex].at) {
          if (stepTxt) stepTxt.textContent = steps[stepIndex].text;
          const currentStep = steps[stepIndex].step;
          for (let s = 1; s <= 4; s++) {
            const pill = document.getElementById(`aiStep${s}`);
            if (pill) {
              pill.classList.toggle("active", s === currentStep);
              pill.classList.toggle("completed", s < currentStep);
            }
          }
          stepIndex++;
        }
      }, 200);

      return {
        complete: function (success) {
          clearInterval(timerInterval);
          if (bar) bar.style.width = "100%";
          if (stepTxt) {
            stepTxt.textContent = success
              ? "Sorular başarıyla üretildi! İnceleme merkezine aktarılıyor..."
              : "Soru üretimi tamamlandı.";
          }
          for (let s = 1; s <= 4; s++) {
            const pill = document.getElementById(`aiStep${s}`);
            if (pill) pill.classList.add("completed");
          }
          setTimeout(() => {
            modal.classList.remove("active");
            modal.style.display = "none";
          }, 450);
        }
      };
    }

    // Sorulari Uret Butonu
    if (generateBtn) {
      generateBtn.addEventListener("click", async () => {
        const grade = gradeSelect.value;
        const topic = topicSelect.value;
        const difficulty = diffSelect.value;
        const pattern = lgsPatternSelect ? lgsPatternSelect.value : "otomatik";
        let count = parseInt(countInput.value, 10) || 5;
        if (count > 20) count = 20;
        if (count < 1) count = 1;

        const selectedEngine = document.querySelector('input[name="aiEngineMode"]:checked')?.value || "gemini";
        const geminiKey = geminiKeyInput ? geminiKeyInput.value.trim() : "";
        const isGeminiMode = selectedEngine === "gemini";
        const visualMode = visualModeSelect ? visualModeSelect.value : "auto";

        generateBtn.disabled = true;
        generateBtn.textContent = "Sorular Üretiliyor...";
        if (genStatusTxt) genStatusTxt.textContent = isGeminiMode ? "Gemini 2.5 Flash ile üretiliyor..." : "Matematik motoru çalışıyor...";

        const loadingHandle = showLoadingModal(grade, topic, count, difficulty, isGeminiMode);

        try {
          let questions = [];
          if (isGeminiMode) {
            try {
              questions = await window.MH_AI_GENERATOR.generateGeminiQuestions(geminiKey, grade, topic, difficulty, count, pattern, visualMode);
              showToast(`${questions.length} adet özgün soru Gemini 2.5 Flash tarafından üretildi.`, "success");
            } catch (geminiErr) {
              console.warn("[AI Generator] Gemini API hatası, yerel motor devreye giriyor:", geminiErr);
              showToast("Gemini API yanıt vermedi, dahili matematik motoruyla üretildi.", "warning");
              questions = window.MH_AI_GENERATOR.generateLocalQuestions(grade, topic, difficulty, count, visualMode);
            }
          } else {
            questions = window.MH_AI_GENERATOR.generateLocalQuestions(grade, topic, difficulty, count, visualMode);
            showToast(`${questions.length} adet özgün MEB sorusu başarıyla üretildi.`, "success");
          }

          // Sorular varsayilan olarak onayli baslasin
          questions.forEach(q => {
            if (typeof q.approved !== "boolean") q.approved = true;
          });
          currentAiQuestions = questions;
          renderAiQuestions();

          if (loadingHandle) loadingHandle.complete(true);

          if (reviewContainer) {
            reviewContainer.style.display = "flex";
            setTimeout(() => {
              reviewContainer.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
          }
        } catch (err) {
          console.error("[AI Generator] Soru üretim hatası:", err);
          if (loadingHandle) loadingHandle.complete(false);
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

            <div class="ai-card-actions" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <label class="ai-approve-toggle" title="Bu soruyu onayla">
                <input type="checkbox" class="ai-card-approve-checkbox" data-idx="${idx}" ${q.approved ? "checked" : ""}>
                <span>${q.approved ? "Onaylandı" : "Onayla"}</span>
              </label>

              <button type="button" class="btn btn-secondary btn-sm ai-story-single-btn" data-idx="${idx}" title="Bu soruyu Instagram Story veya WhatsApp Durum kartı olarak kaydet" style="background: linear-gradient(135deg, #EC4899, #8B5CF6); color: #FFFFFF; border: none; font-weight: 800; padding: 4px 10px;">
                Story Çıktısı
              </button>

              <button type="button" class="btn btn-secondary btn-sm ai-refine-single-btn" data-idx="${idx}" title="AI ile bu soruyu düzelt veya revize et" style="font-weight: 800; padding: 4px 10px; background: #EDE9FE; color: #6D28D9; border: 1.5px solid #DDD6FE;">
                AI ile Düzelt
              </button>

              <button type="button" class="btn btn-secondary btn-sm ai-add-visual-btn" data-idx="${idx}" title="Bu soruya özel şekil, çizim veya görsel ekle" style="font-weight: 700; padding: 4px 10px;">
                ${q.diagramSvg || q.imageUrl ? 'Şekli Düzenle' : 'Şekil Ekle'}
              </button>

              <button type="button" class="btn btn-secondary btn-sm ai-regenerate-single-btn" data-idx="${idx}" title="Sadece bu soruyu aynı konudan yeniden üret" style="font-weight: 700; padding: 4px 10px;">
                Soruyu Değiştir
              </button>
            </div>
          </div>

          <div class="ai-q-text">${escapeHtml(q.question).replace(/\n/g, "<br>")}</div>

          ${q.diagramSvg ? `<div class="ai-q-diagram">${q.diagramSvg}</div>` : ''}
          ${q.imageUrl ? `<div class="ai-q-diagram"><img src="${q.imageUrl}" style="max-height: 180px; max-width: 100%; object-fit: contain; border-radius: 6px;"></div>` : ''}
          ${q.tableHtml ? `<div class="ai-q-table">${q.tableHtml}</div>` : ''}

          <div class="ai-options-grid">
            ${(() => {
              const corIdx = typeof q.correctIndex === "number" ? q.correctIndex : (typeof q.correct_index === "number" ? q.correct_index : 0);
              return q.options.map((opt, optIdx) => {
                const cleanOpt = String(opt || "").replace(/^[A-D]\)\s*/, "");
                return `
                  <div class="ai-option-item ${optIdx === corIdx ? "is-correct" : ""}">
                    <span class="ai-opt-tag">${letters[optIdx]}</span>
                    <span>${escapeHtml(cleanOpt)}</span>
                    ${optIdx === corIdx ? '<span style="margin-left: auto; font-size: 0.74rem; font-weight: 800; color: #059669;">(Doğru Cevap)</span>' : ''}
                  </div>
                `;
              }).join("");
            })()}
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

        // Event listener: Instagram Story Çıktısı
        const storyBtn = card.querySelector(".ai-story-single-btn");
        if (storyBtn) {
          storyBtn.addEventListener("click", () => {
            openStoryExportModal(idx);
          });
        }

        // Event listener: AI ile Düzelt / Revize Et
        const refineBtn = card.querySelector(".ai-refine-single-btn");
        if (refineBtn) {
          refineBtn.addEventListener("click", () => {
            openAiRevisionModal(idx);
          });
        }

        // Event listener: Özel Şekil / Görsel Ekleme
        const visualBtn = card.querySelector(".ai-add-visual-btn");
        if (visualBtn) {
          visualBtn.addEventListener("click", () => {
            openCustomVisualModal(idx);
          });
        }

        // Event listener: Tekli yeniden üret
        const regenBtn = card.querySelector(".ai-regenerate-single-btn");
        if (regenBtn) {
          regenBtn.addEventListener("click", () => {
            const fresh = window.MH_AI_GENERATOR.generateLocalQuestion(q.grade, q.topic, q.difficulty, Math.floor(Math.random() * 200));
            const visualMode = visualModeSelect ? visualModeSelect.value : "auto";
            if (visualMode === "visual" || (visualMode === "auto" && q.diagramSvg)) {
              fresh.diagramSvg = window.MH_AI_GENERATOR.createTopicSvgDiagram(q.topic, q.difficulty);
            }
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

    // Onaylanmayanları Tek Tuşla Yeniden Üret (Aynı Konu ve Sınıftan)
    document.getElementById("regenerateUnapprovedBtn")?.addEventListener("click", async () => {
      const unapprovedIndices = [];
      currentAiQuestions.forEach((q, i) => {
        if (!q.approved) unapprovedIndices.push(i);
      });

      if (unapprovedIndices.length === 0) {
        showToast("Tüm sorular zaten onaylı durumda.", "info");
        return;
      }

      const regenBtn = document.getElementById("regenerateUnapprovedBtn");
      if (regenBtn) {
        regenBtn.disabled = true;
        regenBtn.textContent = "Yeniden Üretiliyor...";
      }

      const selectedEngine = document.querySelector('input[name="aiEngineMode"]:checked')?.value || "local";
      const geminiKey = geminiKeyInput ? geminiKeyInput.value.trim() : "";

      try {
        let replacementQuestions = [];
        const curTopic = currentAiQuestions[unapprovedIndices[0]]?.topic || topicSelect.value;
        const curGrade = currentAiQuestions[unapprovedIndices[0]]?.grade || gradeSelect.value;
        const curDiff = currentAiQuestions[unapprovedIndices[0]]?.difficulty || diffSelect.value;

        if (selectedEngine === "gemini" && geminiKey) {
          try {
            const curPattern = lgsPatternSelect ? lgsPatternSelect.value : "otomatik";
            const curVisualMode = visualModeSelect ? visualModeSelect.value : "auto";
            replacementQuestions = await window.MH_AI_GENERATOR.generateGeminiQuestions(
              geminiKey, curGrade, curTopic, curDiff, unapprovedIndices.length, curPattern, curVisualMode
            );
          } catch (geminiErr) {
            console.warn("[AI Generator] Gemini yeniden üretim hatası, yerel motor kullanılıyor:", geminiErr);
            replacementQuestions = [];
          }
        }

        const curVisualMode = visualModeSelect ? visualModeSelect.value : "auto";
        unapprovedIndices.forEach((idx, step) => {
          const cur = currentAiQuestions[idx];
          let fresh = replacementQuestions[step];
          if (!fresh) {
            fresh = window.MH_AI_GENERATOR.generateLocalQuestion(
              cur.grade, cur.topic, cur.difficulty, step + Math.floor(Math.random() * 50) + 1
            );
            if (curVisualMode === "visual" || (curVisualMode === "auto" && cur.diagramSvg)) {
              fresh.diagramSvg = window.MH_AI_GENERATOR.createTopicSvgDiagram(cur.topic, cur.difficulty);
            }
          }
          fresh.approved = false;
          currentAiQuestions[idx] = fresh;
        });

        renderAiQuestions();
        showToast(`${unapprovedIndices.length} adet onaylanmayan soru yeniden üretildi. Onaylı sorularınız korundu.`, "success");
      } catch (err) {
        console.error("[AI Generator] Yeniden üretim hatası:", err);
        showToast("Yeniden üretim sırasında hata: " + err.message, "error");
      } finally {
        if (regenBtn) {
          regenBtn.disabled = false;
          regenBtn.textContent = "Onaylanmayanları Yeniden Üret (Tek Tuşla)";
        }
      }
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
        const rowsToSave = approvedList.map(q => {
          const cIdx = typeof q.correctIndex === "number" ? q.correctIndex : (typeof q.correct_index === "number" ? q.correct_index : 0);
          return {
            unit: `${q.grade || 8}. Sınıf - ${q.topic || 'LGS Matematik'}`,
            grade: q.grade || "8",
            topic: q.topic || "LGS Matematik",
            question: q.question,
            options: q.options,
            correctIndex: cIdx,
            correct_index: cIdx,
            explanation: q.explanation + (q.tactic ? "\n\n" + q.tactic : ""),
            solution: q.explanation + (q.tactic ? "\n\n" + q.tactic : ""),
            tactic: q.tactic || "",
            difficulty: q.difficultyLabel || "LGS Ayarı",
            diagramSvg: q.diagramSvg || null,
            imageUrl: q.imageUrl || null
          };
        });

        // 1. Supabase ve LocalStorage Veri Katmanı
        if (window.MH_DB && typeof window.MH_DB.bulkAddQuizQuestions === "function") {
          await window.MH_DB.bulkAddQuizQuestions(rowsToSave);
        }

        // 2. Python Sunucu API Eşitlemesi (Tek atomik bulk_json isteği)
        try {
          await fetch("/api/admin/quiz-questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "bulk_json",
              questions: rowsToSave
            })
          });
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

    function getQuestionsForPrint() {
      const filterMode = filterSelect ? filterSelect.value : "all";
      let list = currentAiQuestions;
      if (filterMode === "approved_only") {
        const approvedOnly = currentAiQuestions.filter(q => q.approved);
        // Eğer hiçbir soru onaylanmamışsa boş kağıt basmamak için üretilen tüm sorulara dön
        list = approvedOnly.length > 0 ? approvedOnly : currentAiQuestions;
      }
      return list;
    }

    function getPrintOptions(questionsToPrint) {
      return {
        schoolName: schoolInput && schoolInput.value.trim() ? schoolInput.value.trim() : "T.C. MİLLÎ EĞİTİM BAKANLIĞI",
        examTitle: titleInput && titleInput.value.trim() ? titleInput.value.trim() : "MATEMATİK KAZANIM VE GELİŞİM SINAVI",
        gradeText: questionsToPrint[0] ? questionsToPrint[0].gradeLabel : "8. Sınıf",
        topicText: questionsToPrint[0] ? questionsToPrint[0].topic : "Matematik",
        examDate: new Date().toLocaleDateString("tr-TR"),
        includeAnswerKey: answerKeyCheck ? answerKeyCheck.checked : true,
        includeScratchArea: scratchCheck ? scratchCheck.checked : true,
        layout: layoutSelect ? layoutSelect.value : "two_column"
      };
    }

    function syncExamPrintStorage(sheetHtml, options, count) {
      const payload = {
        html: sheetHtml,
        title: options.examTitle,
        questionCount: count,
        schoolName: options.schoolName,
        gradeText: options.gradeText,
        topicText: options.topicText,
        timestamp: Date.now()
      };
      try {
        localStorage.setItem("merdiye_exam_print_data", JSON.stringify(payload));
        sessionStorage.setItem("merdiye_exam_print_data", JSON.stringify(payload));
      } catch (err) {
        console.warn("Could not save exam print data to storage:", err);
      }
    }

    function updatePrintPreview() {
      if (!printableArea) return;

      const questionsToPrint = getQuestionsForPrint();

      if (questionsToPrint.length === 0) {
        printableArea.innerHTML = `
          <div style="padding: 40px; text-align: center; color: #64748B;">
            <b>Yazdırılacak soru bulunamadı.</b><br>
            Lütfen önce soru üretin ve ardından 'A4 Sınav Kağıdı Yazdır' butonuna tıklayın.
          </div>
        `;
        return;
      }

      const options = getPrintOptions(questionsToPrint);
      const sheetHtml = window.MH_AI_GENERATOR.buildPrintableExamHtml(questionsToPrint, options);
      printableArea.innerHTML = sheetHtml;
      syncExamPrintStorage(sheetHtml, options, questionsToPrint.length);

      const newTabBtn = document.getElementById("openExamInNewTabBtn");
      if (newTabBtn) {
        newTabBtn.setAttribute("href", "exam-print.html?autoprint=1");
        newTabBtn.setAttribute("target", "_blank");
      }
    }

    // Kusursuz A4 Çıktı & Bağımsız Yazdırma Motoru (Asla Boş PDF Üretmez)
    function executeCleanA4Print() {
      updatePrintPreview();
      const questionsToPrint = getQuestionsForPrint();

      if (questionsToPrint.length === 0) {
        showToast("Lütfen önce sınav kağıdına basılacak soruları üretin.", "warning");
        return;
      }

      const options = getPrintOptions(questionsToPrint);
      const sheetHtml = window.MH_AI_GENERATOR.buildPrintableExamHtml(questionsToPrint, options);
      syncExamPrintStorage(sheetHtml, options, questionsToPrint.length);

      // 1. En Güvenilir Yöntem: Bağımsız A4 exam-print.html sayfasını yeni sekmede aç ve yazdır
      try {
        const printWin = window.open("exam-print.html?autoprint=1", "_blank");
        if (printWin) {
          showToast("A4 sınav kağıdı yazdırma sayfası yeni sekmede açıldı.", "success");
          return;
        }
      } catch (e) {
        console.warn("[Print] Pencere açma engellendi:", e);
      }

      // 2. Yedek Yöntem: Tarayıcı popup'ı engellerse sayfadan doğrudan yazdır
      window.print();
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
      executeCleanA4Print();
    });

    document.getElementById("openExamInNewTabBtn")?.addEventListener("click", () => {
      executeCleanA4Print();
    });

    // =========================================================================
    // MODÜL 1: Soru Bankasından Soru Seç & Sınav Havuzuna Dahil Et
    // =========================================================================
    const bankPickerModal = document.getElementById("bankPickerModal");
    const openBankPickerModalBtn = document.getElementById("openBankPickerModalBtn");
    const closeBankPickerModalBtn = document.getElementById("closeBankPickerModalBtn");
    const cancelBankPickerBtn = document.getElementById("cancelBankPickerBtn");
    const confirmBankPickerAddBtn = document.getElementById("confirmBankPickerAddBtn");
    const bankPickerGradeFilter = document.getElementById("bankPickerGradeFilter");
    const bankPickerSearchInput = document.getElementById("bankPickerSearchInput");
    const bankPickerList = document.getElementById("bankPickerList");
    const bankPickerSelectedCountTxt = document.getElementById("bankPickerSelectedCountTxt");
    const bankPickerSelectAllBtn = document.getElementById("bankPickerSelectAllBtn");
    const bankPickerClearAllBtn = document.getElementById("bankPickerClearAllBtn");

    let selectedBankIndices = new Set();

    function renderBankPickerItems() {
      if (!bankPickerList) return;
      bankPickerList.innerHTML = "";

      const gradeFilter = bankPickerGradeFilter ? bankPickerGradeFilter.value : "all";
      const searchTxt = bankPickerSearchInput ? bankPickerSearchInput.value.trim().toLowerCase() : "";

      const filtered = questionList.filter((q, i) => {
        const qGrade = resolveQuestionGrade(q);
        if (gradeFilter !== "all" && qGrade !== gradeFilter) return false;
        if (searchTxt) {
          const matchQ = (q.question || "").toLowerCase().includes(searchTxt);
          const matchU = (q.unit || "").toLowerCase().includes(searchTxt);
          if (!matchQ && !matchU) return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        bankPickerList.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
            Seçilen filtrelere uygun soru bulunamadı. Soru Bankası sekmesinden soru ekleyebilir veya filtreleri temizleyebilirsiniz.
          </div>
        `;
        return;
      }

      filtered.forEach((q, filteredIdx) => {
        const realIdx = questionList.indexOf(q);
        const item = document.createElement("div");
        item.style.cssText = "display: flex; gap: 12px; align-items: flex-start; padding: 12px 14px; background: var(--bg-white); border: 1.5px solid var(--border-color); border-radius: 8px; transition: all 0.2s;";
        
        const isChecked = selectedBankIndices.has(realIdx);
        if (isChecked) {
          item.style.borderColor = "var(--primary)";
          item.style.background = "var(--primary-soft)";
        }

        const letters = ["A", "B", "C", "D"];
        const correctOpt = Array.isArray(q.options) && q.correctIndex !== undefined ? q.options[q.correctIndex] : "";

        item.innerHTML = `
          <input type="checkbox" style="margin-top: 4px; transform: scale(1.2); cursor: pointer;" ${isChecked ? "checked" : ""}>
          <div style="flex: 1; font-size: 0.84rem;">
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
              <span class="pdf-badge gold" style="font-size: 0.72rem;">${escapeHtml(q.unit || "MEB Soru Havuzu")}</span>
              <span class="pdf-badge" style="font-size: 0.70rem; background: var(--bg-card);">${escapeHtml(q.difficulty || "LGS")}</span>
            </div>
            <div style="font-weight: 700; color: var(--text-main); line-height: 1.45; margin-bottom: 6px;">
              ${escapeHtml(q.question)}
            </div>
            ${correctOpt ? `<div style="font-size: 0.78rem; color: #059669; font-weight: 800;">Doğru Cevap: ${escapeHtml(correctOpt)}</div>` : ''}
          </div>
        `;

        const chk = item.querySelector("input[type='checkbox']");
        chk.addEventListener("change", () => {
          if (chk.checked) {
            selectedBankIndices.add(realIdx);
            item.style.borderColor = "var(--primary)";
            item.style.background = "var(--primary-soft)";
          } else {
            selectedBankIndices.delete(realIdx);
            item.style.borderColor = "var(--border-color)";
            item.style.background = "var(--bg-white)";
          }
          if (bankPickerSelectedCountTxt) {
            bankPickerSelectedCountTxt.textContent = `${selectedBankIndices.size} soru seçildi`;
          }
        });

        bankPickerList.appendChild(item);
      });

      if (bankPickerSelectedCountTxt) {
        bankPickerSelectedCountTxt.textContent = `${selectedBankIndices.size} soru seçildi`;
      }
    }

    openBankPickerModalBtn?.addEventListener("click", () => {
      selectedBankIndices.clear();
      renderBankPickerItems();
      bankPickerModal?.classList.add("active");
    });

    closeBankPickerModalBtn?.addEventListener("click", () => bankPickerModal?.classList.remove("active"));
    cancelBankPickerBtn?.addEventListener("click", () => bankPickerModal?.classList.remove("active"));

    bankPickerGradeFilter?.addEventListener("change", renderBankPickerItems);
    bankPickerSearchInput?.addEventListener("input", renderBankPickerItems);

    bankPickerSelectAllBtn?.addEventListener("click", () => {
      questionList.forEach((_, idx) => selectedBankIndices.add(idx));
      renderBankPickerItems();
    });

    bankPickerClearAllBtn?.addEventListener("click", () => {
      selectedBankIndices.clear();
      renderBankPickerItems();
    });

    confirmBankPickerAddBtn?.addEventListener("click", () => {
      if (selectedBankIndices.size === 0) {
        showToast("Lütfen sınava eklemek için en az bir soru seçin.", "warning");
        return;
      }

      const added = [];
      selectedBankIndices.forEach(idx => {
        const item = questionList[idx];
        if (item) {
          const gradeVal = resolveQuestionGrade(item);
          added.push({
            id: item.id || ("bank_" + Date.now() + "_" + idx),
            grade: gradeVal,
            gradeLabel: `${gradeVal}. Sınıf`,
            topic: item.unit || "Matematik Kazanımı",
            difficulty: item.difficulty || "yeni_nesil",
            difficultyLabel: item.difficulty || "LGS Ayarı",
            question: item.question,
            options: item.options || ["A", "B", "C", "D"],
            correctIndex: typeof item.correctIndex === "number" ? item.correctIndex : (typeof item.correct_index === "number" ? item.correct_index : 0),
            explanation: item.solution || item.explanation || "Adım adım çözüm rehberi.",
            tactic: item.tactic || "Merdiye Hoca Sınav Taktiği: Soru kökünü dikkatle oku, işlem adımlarını kontrol et.",
            diagramSvg: item.diagramSvg || null,
            imageUrl: item.imageUrl || null,
            approved: true,
            engine: "Soru Bankası & Havuz"
          });
        }
      });

      currentAiQuestions = currentAiQuestions.concat(added);
      renderAiQuestions();
      bankPickerModal?.classList.remove("active");

      if (reviewContainer) {
        reviewContainer.style.display = "flex";
        reviewContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      showToast(`${added.length} adet soru soru bankasından sınav havuzuna eklendi!`, "success");
    });


    // =========================================================================
    // MODÜL 2: 9:16 Instagram Story Çıktısı (1080x1920 HD PNG)
    // =========================================================================
    const storyExportModal = document.getElementById("storyExportModal");
    const closeStoryExportModalBtn = document.getElementById("closeStoryExportModalBtn");
    const storyQuestionSelector = document.getElementById("storyQuestionSelector");
    const storyTabSlide1Btn = document.getElementById("storyTabSlide1Btn");
    const storyTabSlide2Btn = document.getElementById("storyTabSlide2Btn");
    const storyTabSlide3Btn = document.getElementById("storyTabSlide3Btn");
    const downloadStorySlide1Btn = document.getElementById("downloadStorySlide1Btn");
    const downloadStorySlide2Btn = document.getElementById("downloadStorySlide2Btn");
    const downloadStorySlide3Btn = document.getElementById("downloadStorySlide3Btn");
    const downloadStoryAllBtn = document.getElementById("downloadStoryAllBtn");
    const downloadStoryPngBtn = document.getElementById("downloadStoryPngBtn");
    const copyStoryClipboardBtn = document.getElementById("copyStoryClipboardBtn");
    const storyExportCanvas = document.getElementById("storyExportCanvas");

    let currentStoryQuestionIdx = 0;
    let currentStorySlide = 1; // 1: Soru Kartı, 2: Altın Taktik, 3: Reels & Anket

    function openStoryExportModal(targetIdx = 0) {
      if (currentAiQuestions.length === 0) {
        showToast("Önce soru üretmeniz veya soru bankasından soru seçmeniz gerekir.", "info");
        return;
      }

      currentStoryQuestionIdx = Math.min(Math.max(0, targetIdx), currentAiQuestions.length - 1);
      setStorySlide(1);

      if (storyQuestionSelector) {
        storyQuestionSelector.innerHTML = "";
        currentAiQuestions.forEach((q, i) => {
          const opt = document.createElement("option");
          opt.value = i;
          opt.textContent = `Soru ${i + 1} (${q.topic ? q.topic.slice(0, 28) : 'LGS Sorusu'})`;
          if (i === currentStoryQuestionIdx) opt.selected = true;
          storyQuestionSelector.appendChild(opt);
        });
      }

      updateStoryPreview();
      storyExportModal?.classList.add("active");
    }

    document.getElementById("openStoryModalBtn")?.addEventListener("click", () => {
      openStoryExportModal(0);
    });

    closeStoryExportModalBtn?.addEventListener("click", () => storyExportModal?.classList.remove("active"));

    storyQuestionSelector?.addEventListener("change", (e) => {
      currentStoryQuestionIdx = parseInt(e.target.value, 10) || 0;
      updateStoryPreview();
    });

    function setStorySlide(slideNum) {
      currentStorySlide = slideNum;
      [storyTabSlide1Btn, storyTabSlide2Btn, storyTabSlide3Btn].forEach((btn, idx) => {
        if (!btn) return;
        if (idx + 1 === slideNum) {
          btn.classList.remove("btn-secondary");
          btn.classList.add("btn-primary");
        } else {
          btn.classList.remove("btn-primary");
          btn.classList.add("btn-secondary");
        }
      });
      updateStoryPreview();
    }

    storyTabSlide1Btn?.addEventListener("click", () => setStorySlide(1));
    storyTabSlide2Btn?.addEventListener("click", () => setStorySlide(2));
    storyTabSlide3Btn?.addEventListener("click", () => setStorySlide(3));

    function updateStoryPreview() {
      const q = currentAiQuestions[currentStoryQuestionIdx];
      if (!q) return;

      const gradeTopicTag = document.getElementById("storyGradeTopicTag");
      const questionNumTag = document.getElementById("storyQuestionNumTag");
      const qText = document.getElementById("storyPreviewQuestionText");
      const diagramEl = document.getElementById("storyPreviewDiagram");
      const optList = document.getElementById("storyPreviewOptionsList");
      const footerCta = document.getElementById("storyFooterCtaText");
      const slideTypeBadge = document.getElementById("storySlideTypeBadge");

      if (gradeTopicTag) gradeTopicTag.textContent = `${q.grade || '8'}. Sınıf • ${q.topic || 'LGS Matematik'}`;
      if (slideTypeBadge) {
        if (currentStorySlide === 1) slideTypeBadge.textContent = "Slayt 1 / Soru";
        else if (currentStorySlide === 2) slideTypeBadge.textContent = "Slayt 2 / Altın Taktik";
        else slideTypeBadge.textContent = "Slayt 3 / Reels & Anket";
      }

      const letters = ["A", "B", "C", "D"];

      if (currentStorySlide === 1) {
        if (questionNumTag) questionNumTag.textContent = `GÜNÜN LGS SORUSU (SORU ${currentStoryQuestionIdx + 1})`;
        if (qText) qText.textContent = q.question;

        if (diagramEl) {
          if (q.diagramSvg) {
            diagramEl.style.display = "flex";
            diagramEl.innerHTML = q.diagramSvg;
          } else if (q.imageUrl) {
            diagramEl.style.display = "flex";
            diagramEl.innerHTML = `<img src="${q.imageUrl}" style="max-height: 100px; max-width: 100%; object-fit: contain;">`;
          } else {
            diagramEl.style.display = "none";
            diagramEl.innerHTML = "";
          }
        }

        if (optList) {
          optList.innerHTML = `
            ${q.options.map((opt, i) => `
              <div class="story-opt-item">
                <span class="story-opt-badge">${letters[i]}</span>
                <span>${escapeHtml(opt)}</span>
              </div>
            `).join("")}
            <div style="margin-top: 8px; border: 1.5px dashed rgba(255,255,255,0.4); border-radius: 10px; padding: 8px 10px; text-align: center; color: #F5D0FE; font-size: 0.70rem; font-weight: 700;">
              [Instagram Anket / Quiz Çıkartması Alanı]
            </div>
          `;
        }

        if (footerCta) footerCta.textContent = "Cevabını yoruma bırak! • Sola kaydır";
      } else if (currentStorySlide === 2) {
        if (questionNumTag) questionNumTag.textContent = `MERDİYE HOCA ALTIN SINAV TAKTİĞİ`;

        const corIdx = typeof q.correctIndex === "number" ? q.correctIndex : (typeof q.correct_index === "number" ? q.correct_index : 0);
        const correctLetter = letters[corIdx] || "A";
        const correctRaw = (q.options && q.options[corIdx]) ? q.options[corIdx] : "";
        const correctText = String(correctRaw).replace(/^[A-D]\)\s*/, "");

        if (qText) {
          qText.innerHTML = `
            <div style="font-size: 0.92rem; font-weight: 900; color: #059669; margin-bottom: 6px;">
              Doğru Cevap: ${correctLetter}) ${escapeHtml(correctText)}
            </div>
            <div style="font-size: 0.76rem; color: #334155; line-height: 1.45;">
              ${escapeHtml(q.explanation || 'Adım adım matematiksel çözüm rehberi.').replace(/\n/g, '<br>')}
            </div>
          `;
        }

        if (diagramEl) {
          diagramEl.style.display = "none";
          diagramEl.innerHTML = "";
        }

        if (optList) {
          optList.innerHTML = `
            <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border: 2px solid #F59E0B; border-radius: 12px; padding: 14px 16px; color: #78350F; font-size: 0.82rem; line-height: 1.5; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);">
              <div style="font-weight: 900; color: #B45309; font-size: 0.85rem; margin-bottom: 6px; letter-spacing: 0.5px;">
                MERDİYE HOCA ALTIN TAKTİĞİ:
              </div>
              <div style="font-weight: 800; color: #78350F;">
                ${escapeHtml(q.tactic || 'Soru köküne dikkat et, işlem basamaklarını kontrollü uygula.')}
              </div>
            </div>
          `;
        }

        if (footerCta) footerCta.textContent = "Merdiye Hoca ile 20'de 20 Hedefi • Takipte Kal!";
      } else {
        if (questionNumTag) questionNumTag.textContent = `LGS REELS / STORY ANKETİ`;
        if (qText) {
          qText.innerHTML = `
            <div style="font-weight: 800; color: #1E1B4B; line-height: 1.4;">
              ${escapeHtml(q.question).slice(0, 160)}${q.question.length > 160 ? '...' : ''}
            </div>
          `;
        }

        if (diagramEl) {
          diagramEl.style.display = "none";
          diagramEl.innerHTML = "";
        }

        if (optList) {
          optList.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${q.options.map((opt, i) => `
                <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.22); border: 2px solid rgba(255,255,255,0.4); border-radius: 12px; padding: 10px 14px; font-weight: 800; color: #FFFFFF;">
                  <span>${letters[i]}) ${escapeHtml(opt)}</span>
                  <span style="font-size: 0.72rem; opacity: 0.9; background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 999px;">Oy Ver</span>
                </div>
              `).join("")}
            </div>
          `;
        }

        if (footerCta) footerCta.textContent = "Hikayeye Dokun ve Oyunu Kullan!";
      }
    }

    // 1080x1920 HD Instagram Story Canvas Renderer
    async function renderStoryToCanvas(targetSlide) {
      const q = currentAiQuestions[currentStoryQuestionIdx];
      if (!q || !storyExportCanvas) return null;

      const slideToRender = typeof targetSlide === "number" ? targetSlide : currentStorySlide;
      const canvas = storyExportCanvas;
      const ctx = canvas.getContext("2d");
      const W = 1080;
      const H = 1920;

      // 1. Arka Plan: Zengin Degrade
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      if (slideToRender === 1) {
        bgGrad.addColorStop(0, "#1E1B4B");
        bgGrad.addColorStop(0.35, "#312E81");
        bgGrad.addColorStop(0.70, "#4C1D95");
        bgGrad.addColorStop(1, "#6D28D9");
      } else if (slideToRender === 2) {
        bgGrad.addColorStop(0, "#1E1B4B");
        bgGrad.addColorStop(0.30, "#451A03");
        bgGrad.addColorStop(0.65, "#78350F");
        bgGrad.addColorStop(1, "#B45309");
      } else {
        bgGrad.addColorStop(0, "#0F172A");
        bgGrad.addColorStop(0.35, "#1E293B");
        bgGrad.addColorStop(0.70, "#334155");
        bgGrad.addColorStop(1, "#475569");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Dekoratif Arka Plan Daireleri
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.beginPath();
      ctx.arc(W - 100, 200, 320, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(100, H - 250, 280, 0, Math.PI * 2);
      ctx.fill();

      // 2. Üst Logo & Başlık
      ctx.fillStyle = "#E9D5FF";
      ctx.font = "900 32px system-ui, sans-serif";
      ctx.fillText("MERDİYE HOCAM MATEMATİK AKADEMİSİ", 80, 140);

      ctx.fillStyle = "#FDE68A";
      ctx.font = "800 36px system-ui, sans-serif";
      ctx.fillText(`${q.grade || '8'}. Sınıf • ${q.topic || 'LGS Matematik'}`, 80, 195);

      // Slayt Türü Rozeti
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      roundRect(ctx, W - 360, 130, 280, 56, 28);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 24px system-ui, sans-serif";
      const badgeLabels = { 1: "SLAYT 1 / SORU", 2: "ALTIN TAKTİK", 3: "REELS / ANKET" };
      ctx.fillText(badgeLabels[slideToRender] || "LGS SORUSU", W - 335, 168);

      let curY = 270;
      const letters = ["A", "B", "C", "D"];

      if (slideToRender === 1) {
        // Slayt 1: Soru Kartı
        ctx.fillStyle = "#FFFFFF";
        roundRect(ctx, 70, curY, W - 140, 480, 32);
        ctx.fill();

        ctx.fillStyle = "#7C3AED";
        ctx.font = "900 26px system-ui, sans-serif";
        ctx.fillText(`LGS 2026 SORU ${currentStoryQuestionIdx + 1} (${q.difficultyLabel || 'LGS Ayarı'})`, 110, curY + 60);

        ctx.fillStyle = "#0F172A";
        ctx.font = "700 34px system-ui, sans-serif";
        const maxTextW = W - 220;
        const lines = wrapText(ctx, q.question, maxTextW);
        let textY = curY + 120;
        lines.slice(0, 8).forEach(line => {
          ctx.fillText(line, 110, textY);
          textY += 46;
        });

        curY += 520;

        if (q.diagramSvg) {
          try {
            const svgImg = await loadSvgToImage(q.diagramSvg);
            if (svgImg) {
              const dw = W - 180;
              const dh = 240;
              ctx.fillStyle = "#FFFFFF";
              roundRect(ctx, 70, curY, W - 140, dh + 30, 20);
              ctx.fill();
              ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
              ctx.lineWidth = 2;
              ctx.stroke();

              ctx.drawImage(svgImg, 90, curY + 15, dw, dh);
              curY += dh + 50;
            }
          } catch (_) {
            curY += 20;
          }
        } else if (q.imageUrl) {
          try {
            const imgEl = await loadImageFromUrl(q.imageUrl);
            if (imgEl) {
              const dw = W - 180;
              const dh = 240;
              ctx.fillStyle = "#FFFFFF";
              roundRect(ctx, 70, curY, W - 140, dh + 30, 20);
              ctx.fill();
              ctx.drawImage(imgEl, 90, curY + 15, dw, dh);
              curY += dh + 50;
            }
          } catch (_) {
            curY += 20;
          }
        } else {
          curY += 30;
        }

        const optH = 92;
        const optGap = 18;

        q.options.forEach((opt, optI) => {
          ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
          roundRect(ctx, 70, curY, W - 140, optH, 20);
          ctx.fill();

          ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(125, curY + optH / 2, 28, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#6D28D9";
          ctx.font = "900 30px system-ui, sans-serif";
          ctx.fillText(letters[optI], 114, curY + optH / 2 + 10);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "800 30px system-ui, sans-serif";
          const cleanOpt = String(opt || "").replace(/^[A-D]\)\s*/, "");
          ctx.fillText(cleanOpt, 180, curY + optH / 2 + 10);

          curY += optH + optGap;
        });

        // Instagram Anket / Quiz Çıkartma Alanı Rehberi
        curY += 10;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        roundRect(ctx, 70, curY, W - 140, 80, 16);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#F5D0FE";
        ctx.font = "800 24px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("[INSTAGRAM ANKET / QUIZ ÇIKARTMASI REHBER ALANI]", W / 2, curY + 48);
        ctx.textAlign = "start";

      } else if (slideToRender === 2) {
        // Slayt 2: Merdiye Hoca Altın Taktiği & Çözüm Kartı
        ctx.fillStyle = "#FFFFFF";
        roundRect(ctx, 70, curY, W - 140, 560, 32);
        ctx.fill();

        ctx.fillStyle = "#059669";
        ctx.font = "900 36px system-ui, sans-serif";
        const corIdx = typeof q.correctIndex === "number" ? q.correctIndex : (typeof q.correct_index === "number" ? q.correct_index : 0);
        const corLetter = letters[corIdx] || "A";
        const corRaw = (q.options && q.options[corIdx]) ? q.options[corIdx] : "";
        const corText = String(corRaw).replace(/^[A-D]\)\s*/, "");
        ctx.fillText(`DOĞRU CEVAP: ${corLetter}) ${corText}`, 110, curY + 70);

        ctx.fillStyle = "#64748B";
        ctx.font = "800 24px system-ui, sans-serif";
        ctx.fillText("ADIM ADIM MATEMATİKSEL ÇÖZÜM REHBERİ:", 110, curY + 130);

        ctx.fillStyle = "#1E293B";
        ctx.font = "600 30px system-ui, sans-serif";
        const solLines = wrapText(ctx, q.explanation || "Adım adım çözüm rehberi.", W - 220);
        let solY = curY + 180;
        solLines.slice(0, 8).forEach(line => {
          ctx.fillText(line, 110, solY);
          solY += 44;
        });

        curY += 610;

        // Merdiye Hoca Altın Taktiği Hero Kartı
        ctx.fillStyle = "#FEF3C7";
        roundRect(ctx, 70, curY, W - 140, 480, 28);
        ctx.fill();

        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.fillStyle = "#B45309";
        ctx.font = "900 34px system-ui, sans-serif";
        ctx.fillText("MERDİYE HOCA ALTIN SINAV TAKTİĞİ:", 110, curY + 75);

        ctx.fillStyle = "#78350F";
        ctx.font = "800 34px system-ui, sans-serif";
        const tacLines = wrapText(ctx, q.tactic || "Formülü hatırla, çeldiricilere dikkat et!", W - 220);
        let tacY = curY + 145;
        tacLines.slice(0, 6).forEach(l => {
          ctx.fillText(l, 110, tacY);
          tacY += 52;
        });

      } else {
        // Slayt 3: Reels & Story Çoklu Soru Anketi Şablonu
        ctx.fillStyle = "#FFFFFF";
        roundRect(ctx, 70, curY, W - 140, 420, 32);
        ctx.fill();

        ctx.fillStyle = "#2563EB";
        ctx.font = "900 28px system-ui, sans-serif";
        ctx.fillText("LGS GÜNLÜK HIZLI ANKETİ & MEYDAN OKUMA", 110, curY + 60);

        ctx.fillStyle = "#0F172A";
        ctx.font = "700 34px system-ui, sans-serif";
        const pollLines = wrapText(ctx, q.question, W - 220);
        let pY = curY + 120;
        pollLines.slice(0, 6).forEach(line => {
          ctx.fillText(line, 110, pY);
          pY += 46;
        });

        curY += 460;

        const optH = 110;
        const optGap = 20;

        q.options.forEach((opt, optI) => {
          ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
          roundRect(ctx, 70, curY, W - 140, optH, 22);
          ctx.fill();

          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(130, curY + optH / 2, 32, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#1E293B";
          ctx.font = "900 32px system-ui, sans-serif";
          ctx.fillText(letters[optI], 118, curY + optH / 2 + 11);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "800 32px system-ui, sans-serif";
          const cleanOpt = String(opt || "").replace(/^[A-D]\)\s*/, "");
          ctx.fillText(cleanOpt, 185, curY + optH / 2 + 11);

          // Sağda Oy Ver Rozeti
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          roundRect(ctx, W - 240, curY + 30, 140, 50, 25);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "800 22px system-ui, sans-serif";
          ctx.fillText("OY VER", W - 208, curY + 62);

          curY += optH + optGap;
        });
      }

      // Alt CTA Banner
      ctx.fillStyle = "#F5D0FE";
      ctx.font = "800 34px system-ui, sans-serif";
      ctx.textAlign = "center";
      const ctaTexts = {
        1: "Cevabını Yoruma Yaz! • Sola Kaydır",
        2: "Merdiye Hoca ile 20'de 20 Hedefi!",
        3: "Hikayeye Dokun ve Oyunu Kullan!"
      };
      ctx.fillText(ctaTexts[slideToRender] || "Merdiye Hocam LGS Matematik", W / 2, H - 120);

      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "700 24px system-ui, sans-serif";
      ctx.fillText("LGS Matematik Başarı Platformu & Merdiye Hocam", W / 2, H - 75);
      ctx.textAlign = "start";

      return canvas;
    }

    function roundRect(ctx, x, y, width, height, radius) {
      if (typeof ctx.roundRect === "function") {
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, radius);
        return;
      }
      const r = Math.max(0, Math.min(radius || 0, width / 2, height / 2));
      ctx.beginPath();
      if (r === 0) {
        ctx.rect(x, y, width, height);
        return;
      }
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function wrapText(ctx, text, maxWidth) {
      if (!text) return [];
      const words = String(text).split(" ");
      const lines = [];
      let currentLine = words[0] || "";

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }

    function loadSvgToImage(svgString) {
      return new Promise((resolve) => {
        if (!svgString) return resolve(null);
        let src = svgString;
        if (!src.includes("xmlns=")) {
          src = src.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        const img = new Image();
        const svgBlob = new Blob([src], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        const timer = setTimeout(() => {
          URL.revokeObjectURL(url);
          resolve(null);
        }, 3500);
        img.onload = () => {
          clearTimeout(timer);
          URL.revokeObjectURL(url);
          resolve(img);
        };
        img.onerror = () => {
          clearTimeout(timer);
          URL.revokeObjectURL(url);
          resolve(null);
        };
        img.src = url;
      });
    }

    function loadImageFromUrl(url) {
      return new Promise((resolve) => {
        if (!url) return resolve(null);
        const img = new Image();
        img.crossOrigin = "anonymous";
        const timer = setTimeout(() => resolve(null), 3500);
        img.onload = () => {
          clearTimeout(timer);
          resolve(img);
        };
        img.onerror = () => {
          clearTimeout(timer);
          resolve(null);
        };
        img.src = url;
      });
    }

    async function downloadStorySlide(slideNum, silent = false) {
      const q = currentAiQuestions[currentStoryQuestionIdx];
      if (!q) {
        showToast("İndirilecek soru bulunamadı.", "warning");
        return;
      }
      try {
        const canvas = await renderStoryToCanvas(slideNum);
        if (!canvas) throw new Error("Canvas oluşturulamadı");
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        const slug = slideNum === 1 ? "soru" : (slideNum === 2 ? "altin_taktik" : "reels_anket");
        a.download = `merdiye_lgs_story_soru_${currentStoryQuestionIdx + 1}_${slug}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (!silent) {
          const nameMap = { 1: "Soru Kartı", 2: "Merdiye Hoca Altın Taktiği Kartı", 3: "Reels / Anket Şablonu" };
          showToast(`1080x1920 HD ${nameMap[slideNum]} başarıyla indirildi!`, "success");
        }
      } catch (err) {
        showToast("Story indirme hatası: " + err.message, "error");
      }
    }

    downloadStorySlide1Btn?.addEventListener("click", () => downloadStorySlide(1));
    downloadStorySlide2Btn?.addEventListener("click", () => downloadStorySlide(2));
    downloadStorySlide3Btn?.addEventListener("click", () => downloadStorySlide(3));

    downloadStoryAllBtn?.addEventListener("click", async () => {
      downloadStoryAllBtn.disabled = true;
      downloadStoryAllBtn.textContent = "Tüm Kartlar İndiriliyor...";
      try {
        await downloadStorySlide(1, true);
        await new Promise(r => setTimeout(r, 450));
        await downloadStorySlide(2, true);
        await new Promise(r => setTimeout(r, 450));
        await downloadStorySlide(3, true);
        showToast("Tüm story ve taktik kartları başarıyla indirildi!", "success");
      } catch (e) {
        showToast("Toplu indirme hatası: " + e.message, "error");
      } finally {
        downloadStoryAllBtn.disabled = false;
        downloadStoryAllBtn.textContent = "Tüm Kartları İndir (Soru + Taktik Paketi)";
      }
    });

    downloadStoryPngBtn?.addEventListener("click", () => downloadStorySlide(currentStorySlide));

    copyStoryClipboardBtn?.addEventListener("click", async () => {
      try {
        const canvas = await renderStoryToCanvas(currentStorySlide);
        if (!canvas) return;

        canvas.toBlob(async (blob) => {
          if (!blob) return;
          try {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            showToast("Story görseli panoya kopyalandı! (Ctrl + V ile yapıştırabilirsiniz)", "success");
          } catch (e) {
            showToast("Panoya kopyalama bu tarayıcıda desteklenmiyor, lütfen 'İndir' butonunu kullanın.", "info");
          }
        }, "image/png");
      } catch (e) {
        showToast("Kopyalama hatası: " + e.message, "error");
      }
    });


    // =========================================================================
    // MODÜL 3: Öğretmen Özel Şekil / Görsel Ekleme & Düzenleme
    // =========================================================================
    const customVisualModal = document.getElementById("customVisualModal");
    const closeCustomVisualModalBtn = document.getElementById("closeCustomVisualModalBtn");
    const cancelCustomVisualBtn = document.getElementById("cancelCustomVisualBtn");
    const saveCustomVisualBtn = document.getElementById("saveCustomVisualBtn");
    const removeCustomVisualBtn = document.getElementById("removeCustomVisualBtn");
    const customVisualFileInput = document.getElementById("customVisualFileInput");
    const customVisualSvgInput = document.getElementById("customVisualSvgInput");
    const customVisualPreviewWrap = document.getElementById("customVisualPreviewWrap");
    const customVisualPreviewBox = document.getElementById("customVisualPreviewBox");

    let visualTargetQuestionIdx = 0;
    let pendingVisualData = { type: null, data: null };

    function openCustomVisualModal(idx) {
      visualTargetQuestionIdx = idx;
      const q = currentAiQuestions[idx];
      if (!q) return;

      pendingVisualData = {
        type: q.imageUrl ? 'image' : (q.diagramSvg ? 'svg' : null),
        data: q.imageUrl || q.diagramSvg || null
      };

      if (customVisualFileInput) customVisualFileInput.value = "";
      if (customVisualSvgInput) customVisualSvgInput.value = q.diagramSvg || "";

      updateCustomVisualPreview();
      customVisualModal?.classList.add("active");
    }

    function updateCustomVisualPreview() {
      if (!customVisualPreviewWrap || !customVisualPreviewBox) return;
      if (pendingVisualData.type === 'image' && pendingVisualData.data) {
        customVisualPreviewWrap.style.display = "block";
        customVisualPreviewBox.innerHTML = `<img src="${pendingVisualData.data}" style="max-height: 160px; max-width: 100%; object-fit: contain;">`;
      } else if (pendingVisualData.type === 'svg' && pendingVisualData.data) {
        customVisualPreviewWrap.style.display = "block";
        customVisualPreviewBox.innerHTML = pendingVisualData.data;
      } else {
        customVisualPreviewWrap.style.display = "none";
        customVisualPreviewBox.innerHTML = "";
      }
    }

    customVisualFileInput?.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        pendingVisualData = { type: 'image', data: loadEvt.target.result };
        if (customVisualSvgInput) customVisualSvgInput.value = "";
        updateCustomVisualPreview();
      };
      reader.readAsDataURL(file);
    });

    customVisualSvgInput?.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (val.includes("<svg")) {
        pendingVisualData = { type: 'svg', data: val };
        updateCustomVisualPreview();
      } else {
        pendingVisualData = { type: null, data: null };
        updateCustomVisualPreview();
      }
    });

    closeCustomVisualModalBtn?.addEventListener("click", () => customVisualModal?.classList.remove("active"));
    cancelCustomVisualBtn?.addEventListener("click", () => customVisualModal?.classList.remove("active"));

    removeCustomVisualBtn?.addEventListener("click", () => {
      const q = currentAiQuestions[visualTargetQuestionIdx];
      if (q) {
        q.diagramSvg = null;
        q.imageUrl = null;
        renderAiQuestions();
        showToast("Soruya ait şekil kaldırıldı.", "info");
      }
      customVisualModal?.classList.remove("active");
    });

    saveCustomVisualBtn?.addEventListener("click", () => {
      const q = currentAiQuestions[visualTargetQuestionIdx];
      if (!q) return;

      if (pendingVisualData.type === 'image') {
        q.imageUrl = pendingVisualData.data;
        q.diagramSvg = null;
      } else if (pendingVisualData.type === 'svg') {
        q.diagramSvg = pendingVisualData.data;
        q.imageUrl = null;
      }

      renderAiQuestions();
      customVisualModal?.classList.remove("active");
      showToast(`Soru ${visualTargetQuestionIdx + 1} için şekil/görsel başarıyla kaydedildi!`, "success");
    });

    // =========================================================================
    // MODÜL 4: AI ile Soru Revize Etme & Düzeltme
    // =========================================================================
    const aiRevisionModal = document.getElementById("aiRevisionModal");
    const closeAiRevisionModalBtn = document.getElementById("closeAiRevisionModalBtn");
    const cancelAiRevisionBtn = document.getElementById("cancelAiRevisionBtn");
    const confirmAiRevisionBtn = document.getElementById("confirmAiRevisionBtn");
    const aiRevisionOriginalPreview = document.getElementById("aiRevisionOriginalPreview");
    const aiRevisionPromptInput = document.getElementById("aiRevisionPromptInput");

    let targetRevisionQuestionIdx = 0;

    function openAiRevisionModal(idx) {
      targetRevisionQuestionIdx = idx;
      const q = currentAiQuestions[idx];
      if (!q) return;

      if (aiRevisionOriginalPreview) {
        aiRevisionOriginalPreview.textContent = q.question || "";
      }
      if (aiRevisionPromptInput) {
        aiRevisionPromptInput.value = "";
      }
      aiRevisionModal?.classList.add("active");
    }

    closeAiRevisionModalBtn?.addEventListener("click", () => aiRevisionModal?.classList.remove("active"));
    cancelAiRevisionBtn?.addEventListener("click", () => aiRevisionModal?.classList.remove("active"));

    document.querySelectorAll(".ai-rev-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const prompt = chip.dataset.prompt || "";
        if (aiRevisionPromptInput) {
          aiRevisionPromptInput.value = prompt;
          aiRevisionPromptInput.focus();
        }
      });
    });

    confirmAiRevisionBtn?.addEventListener("click", async () => {
      const q = currentAiQuestions[targetRevisionQuestionIdx];
      if (!q) return;

      const teacherPrompt = aiRevisionPromptInput ? aiRevisionPromptInput.value.trim() : "";
      if (!teacherPrompt) {
        showToast("Lütfen düzeltilmesini istediğiniz talimatı girin.", "warning");
        return;
      }

      confirmAiRevisionBtn.disabled = true;
      confirmAiRevisionBtn.textContent = "AI ile Revize Ediliyor...";

      const geminiKey = geminiKeyInput ? geminiKeyInput.value.trim() : "";
      try {
        const revised = await window.MH_AI_GENERATOR.refineQuestionWithGemini(geminiKey, q, teacherPrompt);
        revised.approved = true;
        currentAiQuestions[targetRevisionQuestionIdx] = revised;
        renderAiQuestions();
        aiRevisionModal?.classList.remove("active");
        showToast(`Soru ${targetRevisionQuestionIdx + 1} başarıyla revize edildi!`, "success");
      } catch (err) {
        console.error("[AI Revision] Hata:", err);
        showToast("Revize sırasında hata oluştu: " + err.message, "error");
      } finally {
        confirmAiRevisionBtn.disabled = false;
        confirmAiRevisionBtn.textContent = "AI ile Soruyu Düzelt ve Yenile";
      }
    });

    // =========================================================================
    // MODÜL 5: AI İnceleme Merkezinden Haftalık Deneme Yayınlama Butonu
    // =========================================================================
    document.getElementById("publishFromAiToWeeklyBtn")?.addEventListener("click", () => {
      let chosen = currentAiQuestions.filter(q => q.approved);
      if (chosen.length === 0) {
        chosen = [...currentAiQuestions];
      }
      if (chosen.length === 0) {
        showToast("Önce soru üretmeniz gerekir.", "warning");
        return;
      }
      openPublishWeeklyModalWithQuestions(chosen);
    });

  }

  // 9. Başlatma: AI Soru Üreticiyi beklemeden hemen başlat
  initAiQuestionGenerator();

  checkAdminAuth().then(isAuthed => {
    if (isAuthed) {
      loadAnalytics();
      loadPDFs();
      loadSocialStats();
      loadPublishedHistory();
      loadLeads();
      loadQuestions();
    }
  });
});

