// App logic: render modules + questions, track progress in localStorage.
(function () {
  const STORAGE_KEY = "uilearn.progress.v1";
  const { escapeHtml, renderMarkdownLite, difficultyStyles, statusStyles } = window.UILearn;

  /** progress shape: { [questionId]: 'correct' | 'partial' | 'wrong' | 'skipped' } */
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }
  function saveProgress(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  let activeModuleId = window.MODULES[0].id;
  let progress = loadProgress();

  function moduleStats(mod) {
    const total = mod.questions.length;
    const done = mod.questions.filter((q) => progress[q.id]).length;
    const correct = mod.questions.filter((q) => progress[q.id] === "correct").length;
    return { total, done, correct, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function overallStats() {
    const all = window.MODULES.flatMap((m) => m.questions);
    const total = all.length;
    const done = all.filter((q) => progress[q.id]).length;
    const correct = all.filter((q) => progress[q.id] === "correct").length;
    return { total, done, correct, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function renderSidebar() {
    const nav = document.getElementById("moduleNav");
    nav.innerHTML = window.MODULES.map((m) => {
      const s = moduleStats(m);
      const active = m.id === activeModuleId;
      const ringStyle = s.pct === 100
        ? "ring-2 ring-emerald-500"
        : s.done > 0 ? "ring-1 ring-amber-400" : "";
      return `
        <button data-mod="${m.id}"
          class="w-full text-left px-3 py-2 rounded-md border ${active ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50 border-slate-200"} ${ringStyle}">
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-medium truncate">${m.title}</span>
            <span class="text-[10px] ${active ? "text-slate-300" : "text-slate-500"}">${s.done}/${s.total}</span>
          </div>
          <div class="mt-1 h-1.5 rounded-full ${active ? "bg-slate-700" : "bg-slate-200"} overflow-hidden">
            <div class="h-1.5 ${s.pct === 100 ? "bg-emerald-400" : "bg-sky-400"}" style="width:${s.pct}%"></div>
          </div>
        </button>`;
    }).join("");
    nav.querySelectorAll("button[data-mod]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeModuleId = btn.dataset.mod;
        renderSidebar();
        renderQuestions();
        document.getElementById("questionsArea").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function renderOverall() {
    const s = overallStats();
    document.getElementById("overallProgress").textContent =
      `${s.done}/${s.total} attempted · ${s.correct} correct (${s.pct}%)`;
    document.getElementById("overallBar").style.width = `${s.pct}%`;
  }

  function renderQuestions() {
    const mod = window.MODULES.find((m) => m.id === activeModuleId);
    const area = document.getElementById("questionsArea");
    const stats = moduleStats(mod);

    area.innerHTML = `
      <div class="bg-white rounded-lg border border-slate-200 p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold">${mod.title}</h2>
            <p class="text-sm text-slate-500 mt-0.5">${mod.blurb}</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold ${stats.pct === 100 ? "text-emerald-600" : "text-slate-700"}">${stats.pct}%</div>
            <div class="text-xs text-slate-500">${stats.done}/${stats.total} done · ${stats.correct} </div>
          </div>
        </div>
      </div>
      ${mod.questions.map((q, idx) => renderQuestionCard(q, idx + 1)).join("")}
    `;

    // Wire up evaluator reveal
    area.querySelectorAll("details[data-evaluator]").forEach((det) => {
      det.addEventListener("toggle", () => {
        if (det.open) {
          // mark "skipped" as a baseline if no status yet, so progress reflects "viewed"
          const qid = det.dataset.qid;
          if (!progress[qid]) {
            progress[qid] = "skipped";
            saveProgress(progress);
            renderSidebar();
            renderOverall();
            // update the local card badge
            const card = det.closest("[data-card]");
            updateCardStatusBadge(card, qid);
          }
        }
      });
    });

    // Wire up status buttons
    area.querySelectorAll("button[data-status]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qid = btn.dataset.qid;
        const status = btn.dataset.status;
        progress[qid] = status;
        saveProgress(progress);
        renderSidebar();
        renderOverall();
        // re-render this module summary tile only
        const mod = window.MODULES.find((m) => m.id === activeModuleId);
        const s = moduleStats(mod);
        const headerPct = document.querySelector("#questionsArea .text-2xl");
        if (headerPct) headerPct.textContent = `${s.pct}%`;
        const headerCount = headerPct?.nextElementSibling;
        if (headerCount) headerCount.textContent = `${s.done}/${s.total} done · ${s.correct} `;
        // update card badge
        const card = btn.closest("[data-card]");
        updateCardStatusBadge(card, qid);
      });
    });
  }

  function statusBadgeHtml(status) {
    if (!status) return `<span class="pill bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[11px] font-medium">Not attempted</span>`;
    const labels = { correct: " Correct", partial: "~ Partial", wrong: " Wrong", skipped: " Viewed" };
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-medium ${statusStyles[status]}">${labels[status]}</span>`;
  }

  function updateCardStatusBadge(card, qid) {
    if (!card) return;
    const slot = card.querySelector("[data-status-slot]");
    if (slot) slot.innerHTML = statusBadgeHtml(progress[qid]);
  }

  function renderQuestionCard(q, num) {
    const status = progress[q.id];
    return `
      <article data-card class="bg-white rounded-lg border border-slate-200 p-5 prose-code">
        <header class="flex items-start justify-between gap-4 mb-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-semibold text-slate-400">Q${num}</span>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-medium ${difficultyStyles[q.difficulty]}">${q.difficulty}</span>
            <span data-status-slot>${statusBadgeHtml(status)}</span>
          </div>
        </header>

        <div class="text-slate-900 leading-relaxed">${renderMarkdownLite(q.q)}</div>

        ${q.hint ? `
          <details class="mt-3">
            <summary class="text-xs font-medium text-sky-700 hover:text-sky-900 inline-flex items-center gap-1">
              <span> Hint</span>
            </summary>
            <div class="mt-2 text-sm text-slate-600 bg-sky-50 border border-sky-100 rounded-md p-3">${renderMarkdownLite(q.hint)}</div>
          </details>` : ""}

        <details data-evaluator data-qid="${q.id}" class="mt-3">
          <summary class="text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200">
            <span> Reveal evaluator</span>
          </summary>
          <div class="mt-3 border-l-4 border-emerald-400 pl-4">
            <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Model answer</h4>
            <div class="text-slate-800 leading-relaxed">${renderMarkdownLite(q.answer)}</div>
            <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500 mt-4 mb-2">Self-evaluation checklist</h4>
            <ul class="space-y-1 text-sm text-slate-700">
              ${q.keyPoints.map((k) => `<li class="flex items-start gap-2"><span class="text-emerald-600 mt-0.5">▸</span><span>${escapeHtml(k)}</span></li>`).join("")}
            </ul>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <span class="text-xs text-slate-500 mr-2">How did you do?</span>
              <button data-qid="${q.id}" data-status="correct"
                class="text-xs px-3 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"> Got it</button>
              <button data-qid="${q.id}" data-status="partial"
                class="text-xs px-3 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200">~ Partial</button>
              <button data-qid="${q.id}" data-status="wrong"
                class="text-xs px-3 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200"> Missed it</button>
            </div>
          </div>
        </details>
      </article>
    `;
  }

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset all progress? This cannot be undone.")) return;
    progress = {};
    saveProgress(progress);
    renderSidebar();
    renderOverall();
    renderQuestions();
  });

  // Initial render
  renderSidebar();
  renderOverall();
  renderQuestions();
})();
