// Quiz Mode — randomized practice run with timer + scoring.
// Independent of study-mode progress; quiz answers do NOT touch localStorage.
(function () {
  const { renderMarkdownLite, escapeHtml, difficultyStyles, statusStyles, shuffle, formatDuration } = window.UILearn;

  const ALL_DIFFICULTIES = ["easy", "medium", "hard"];

  // Quiz state — recreated on each startQuiz call.
  let quiz = null;
  let timerHandle = null;

  function allQuestions() {
    return window.MODULES.flatMap((m) =>
      m.questions.map((q) => ({ ...q, moduleId: m.id, moduleTitle: m.title }))
    );
  }

  // ===== Overlay open/close =====

  function openQuiz() {
    document.getElementById("quizOverlay").classList.remove("hidden");
    document.body.style.overflow = "hidden";
    renderSetup();
  }

  function closeQuiz() {
    stopTimer();
    document.getElementById("quizOverlay").classList.add("hidden");
    document.body.style.overflow = "";
    quiz = null;
  }

  // ===== Setup screen =====

  function renderSetup() {
    stopTimer();
    const content = document.getElementById("quizContent");
    const modules = window.MODULES;

    content.innerHTML = `
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h2 class="text-xl font-bold mb-1">Configure your quiz</h2>
        <p class="text-sm text-slate-500 mb-6">Random questions, self-graded, timer ticking. Quiz answers don't affect your study-mode progress.</p>

        <div class="space-y-6">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">How many questions?</label>
            <div class="flex flex-wrap gap-2" id="qsCount">
              ${[5, 10, 20, 0].map((n, i) => `
                <button data-count="${n}" class="px-4 py-2 rounded-md border text-sm font-medium ${n === 10 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}">
                  ${n === 0 ? "All" : n}
                </button>
              `).join("")}
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Difficulty</label>
            <div class="flex flex-wrap gap-2" id="qsDifficulty">
              ${ALL_DIFFICULTIES.map((d) => `
                <button data-diff="${d}" class="px-3 py-1.5 rounded-full text-xs font-medium border ${difficultyStyles[d]} border-transparent ring-2 ring-slate-900">
                  ${d}
                </button>
              `).join("")}
            </div>
            <p class="text-[11px] text-slate-400 mt-1">Click to toggle. Ringed = included.</p>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-500">Modules</label>
              <div class="flex gap-2 text-[11px]">
                <button id="modAll" class="text-sky-700 hover:underline">Select all</button>
                <span class="text-slate-300">|</span>
                <button id="modNone" class="text-sky-700 hover:underline">Clear</button>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="qsModules">
              ${modules.map((m) => `
                <button data-mod="${m.id}" class="text-left px-3 py-2 rounded-md border bg-white text-slate-700 border-slate-300 hover:bg-slate-50 ring-2 ring-slate-900">
                  <div class="text-sm font-medium">${escapeHtml(m.title)}</div>
                  <div class="text-[11px] text-slate-500">${m.questions.length} questions</div>
                </button>
              `).join("")}
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <div class="text-sm text-slate-600" id="poolPreview"></div>
            <button id="startQuizBtn" class="px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm">
              Start quiz
            </button>
          </div>
        </div>
      </div>
    `;

    const state = {
      count: 10,
      difficulties: new Set(ALL_DIFFICULTIES),
      modules: new Set(modules.map((m) => m.id)),
    };

    const updatePool = () => {
      const pool = allQuestions().filter(
        (q) => state.difficulties.has(q.difficulty) && state.modules.has(q.moduleId)
      );
      const want = state.count === 0 ? pool.length : Math.min(state.count, pool.length);
      const startBtn = document.getElementById("startQuizBtn");
      document.getElementById("poolPreview").textContent =
        `${pool.length} questions in pool -> quiz of ${want}`;
      startBtn.disabled = want === 0;
      startBtn.classList.toggle("opacity-50", want === 0);
      startBtn.classList.toggle("cursor-not-allowed", want === 0);
    };

    // count buttons
    content.querySelectorAll("#qsCount button").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.count = Number(btn.dataset.count);
        content.querySelectorAll("#qsCount button").forEach((b) => {
          const sel = Number(b.dataset.count) === state.count;
          b.className = `px-4 py-2 rounded-md border text-sm font-medium ${sel ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`;
        });
        updatePool();
      });
    });

    // difficulty toggles
    content.querySelectorAll("#qsDifficulty button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const d = btn.dataset.diff;
        if (state.difficulties.has(d)) state.difficulties.delete(d);
        else state.difficulties.add(d);
        btn.classList.toggle("ring-2");
        btn.classList.toggle("ring-slate-900");
        btn.classList.toggle("opacity-40");
        updatePool();
      });
    });

    // module toggles
    const wireMod = (btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.mod;
        if (state.modules.has(id)) state.modules.delete(id);
        else state.modules.add(id);
        btn.classList.toggle("ring-2");
        btn.classList.toggle("ring-slate-900");
        btn.classList.toggle("opacity-40");
        updatePool();
      });
    };
    content.querySelectorAll("#qsModules button").forEach(wireMod);

    document.getElementById("modAll").addEventListener("click", () => {
      modules.forEach((m) => state.modules.add(m.id));
      content.querySelectorAll("#qsModules button").forEach((b) => {
        b.classList.add("ring-2", "ring-slate-900");
        b.classList.remove("opacity-40");
      });
      updatePool();
    });
    document.getElementById("modNone").addEventListener("click", () => {
      state.modules.clear();
      content.querySelectorAll("#qsModules button").forEach((b) => {
        b.classList.remove("ring-2", "ring-slate-900");
        b.classList.add("opacity-40");
      });
      updatePool();
    });

    document.getElementById("startQuizBtn").addEventListener("click", () => {
      const pool = allQuestions().filter(
        (q) => state.difficulties.has(q.difficulty) && state.modules.has(q.moduleId)
      );
      const n = state.count === 0 ? pool.length : Math.min(state.count, pool.length);
      if (n === 0) return;
      startQuiz(shuffle(pool).slice(0, n));
    });

    updatePool();
  }

  // ===== Question flow =====

  function startQuiz(questions) {
    quiz = {
      questions,
      current: 0,
      answers: {}, // qid -> 'correct'|'partial'|'wrong'
      revealed: {}, // qid -> bool
      startedAt: Date.now(),
      endedAt: null,
    };
    startTimer();
    renderQuestion();
  }

  function renderQuestion() {
    const content = document.getElementById("quizContent");
    const q = quiz.questions[quiz.current];
    const total = quiz.questions.length;
    const num = quiz.current + 1;
    const revealed = !!quiz.revealed[q.id];
    const answered = quiz.answers[q.id];

    content.innerHTML = `
      <div class="bg-white rounded-lg border border-slate-200 p-6 prose-code">
        <div class="flex items-center justify-between mb-4">
          <div class="text-xs text-slate-500 font-medium">Question ${num} of ${total}</div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-full text-[11px] font-medium ${difficultyStyles[q.difficulty]}">${q.difficulty}</span>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">${escapeHtml(q.moduleTitle)}</span>
          </div>
        </div>

        <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mb-5">
          <div class="bg-emerald-500 h-1.5 transition-all" style="width:${Math.round((num / total) * 100)}%"></div>
        </div>

        <div class="text-slate-900 leading-relaxed text-base">${renderMarkdownLite(q.q)}</div>

        ${q.hint ? `
          <details class="mt-4">
            <summary class="text-xs font-medium text-sky-700 hover:text-sky-900 cursor-pointer">Hint</summary>
            <div class="mt-2 text-sm text-slate-600 bg-sky-50 border border-sky-100 rounded-md p-3">${renderMarkdownLite(q.hint)}</div>
          </details>` : ""}

        ${revealed ? `
          <div class="mt-5 border-l-4 border-emerald-400 pl-4">
            <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Model answer</h4>
            <div class="text-slate-800 leading-relaxed">${renderMarkdownLite(q.answer)}</div>
            <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500 mt-4 mb-2">Key points</h4>
            <ul class="space-y-1 text-sm text-slate-700">
              ${q.keyPoints.map((k) => `<li class="flex items-start gap-2"><span class="text-emerald-600 mt-0.5">&#9656;</span><span>${escapeHtml(k)}</span></li>`).join("")}
            </ul>
          </div>
        ` : ""}

        <div class="mt-6 flex flex-wrap items-center gap-2 justify-between border-t border-slate-100 pt-4">
          <div class="flex flex-wrap gap-2">
            ${!revealed ? `
              <button id="revealBtn" class="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold">
                Reveal answer
              </button>` : `
              <button data-grade="correct" class="px-3 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-sm">Got it</button>
              <button data-grade="partial" class="px-3 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-sm">Partial</button>
              <button data-grade="wrong" class="px-3 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-sm">Missed it</button>
            `}
          </div>
          <div class="flex gap-2">
            ${quiz.current > 0 ? `<button id="prevBtn" class="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 text-sm">Previous</button>` : ""}
            ${answered ? `<button id="nextBtn" class="px-4 py-1.5 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold">${quiz.current === total - 1 ? "Finish quiz" : "Next"}</button>` : ""}
          </div>
        </div>
      </div>
    `;

    const revealBtn = document.getElementById("revealBtn");
    if (revealBtn) revealBtn.addEventListener("click", () => {
      quiz.revealed[q.id] = true;
      renderQuestion();
    });

    content.querySelectorAll("button[data-grade]").forEach((btn) => {
      btn.addEventListener("click", () => {
        quiz.answers[q.id] = btn.dataset.grade;
        // Auto-advance on grade for snappier flow.
        if (quiz.current === quiz.questions.length - 1) finishQuiz();
        else { quiz.current++; renderQuestion(); }
      });
    });

    const prev = document.getElementById("prevBtn");
    if (prev) prev.addEventListener("click", () => { quiz.current--; renderQuestion(); });

    const next = document.getElementById("nextBtn");
    if (next) next.addEventListener("click", () => {
      if (quiz.current === quiz.questions.length - 1) finishQuiz();
      else { quiz.current++; renderQuestion(); }
    });
  }

  // ===== Results screen =====

  function finishQuiz() {
    quiz.endedAt = Date.now();
    stopTimer();
    renderResults();
  }

  function renderResults() {
    const content = document.getElementById("quizContent");
    const total = quiz.questions.length;
    const counts = { correct: 0, partial: 0, wrong: 0, skipped: 0 };
    quiz.questions.forEach((q) => {
      counts[quiz.answers[q.id] || "skipped"]++;
    });
    const score = counts.correct + counts.partial * 0.5;
    const pct = Math.round((score / total) * 100);
    const elapsed = quiz.endedAt - quiz.startedAt;

    // Per-difficulty breakdown
    const byDiff = ALL_DIFFICULTIES.map((d) => {
      const qs = quiz.questions.filter((q) => q.difficulty === d);
      const c = qs.filter((q) => quiz.answers[q.id] === "correct").length;
      return { d, total: qs.length, correct: c };
    }).filter((r) => r.total > 0);

    const verdict =
      pct >= 90 ? { label: "Crushing it", color: "text-emerald-600" } :
      pct >= 70 ? { label: "Solid", color: "text-emerald-600" } :
      pct >= 50 ? { label: "Getting there", color: "text-amber-600" } :
                  { label: "More reps needed", color: "text-rose-600" };

    content.innerHTML = `
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <div class="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h2 class="text-xl font-bold">Quiz complete</h2>
            <p class="text-sm ${verdict.color} font-semibold mt-1">${verdict.label}</p>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold ${pct >= 70 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-rose-600"}">${pct}%</div>
            <div class="text-xs text-slate-500">score (partial = 0.5)</div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          ${tile("Correct", counts.correct, "emerald")}
          ${tile("Partial", counts.partial, "amber")}
          ${tile("Missed", counts.wrong, "rose")}
          ${tile("Skipped", counts.skipped, "slate")}
        </div>

        <div class="bg-slate-50 border border-slate-200 rounded-md p-4 mb-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div><span class="text-slate-500">Time:</span> <strong>${formatDuration(elapsed)}</strong></div>
          <div><span class="text-slate-500">Avg per Q:</span> <strong>${formatDuration(Math.round(elapsed / total))}</strong></div>
          <div><span class="text-slate-500">Questions:</span> <strong>${total}</strong></div>
        </div>

        ${byDiff.length > 1 ? `
          <div class="mb-6">
            <h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">By difficulty</h3>
            <div class="space-y-2">
              ${byDiff.map((r) => {
                const p = Math.round((r.correct / r.total) * 100);
                return `
                  <div class="flex items-center gap-3">
                    <span class="px-2 py-0.5 rounded-full text-[11px] font-medium ${difficultyStyles[r.d]} w-16 text-center">${r.d}</span>
                    <div class="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div class="h-2 bg-emerald-500" style="width:${p}%"></div>
                    </div>
                    <span class="text-xs text-slate-600 w-16 text-right">${r.correct}/${r.total}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        ` : ""}

        <div class="mb-4">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Review answers</h3>
          <div class="space-y-2">
            ${quiz.questions.map((q, i) => {
              const status = quiz.answers[q.id] || "skipped";
              const labels = { correct: "Got it", partial: "Partial", wrong: "Missed", skipped: "Skipped" };
              return `
                <details class="border border-slate-200 rounded-md">
                  <summary class="px-3 py-2 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50">
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="text-xs text-slate-400 w-6">${i + 1}.</span>
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-medium ${difficultyStyles[q.difficulty]}">${q.difficulty}</span>
                      <span class="text-sm text-slate-700 truncate">${escapeHtml(q.q.split("\n")[0].slice(0, 90))}</span>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyles[status]} shrink-0">${labels[status]}</span>
                  </summary>
                  <div class="px-3 pb-3 pt-1 prose-code text-sm">
                    <div class="text-slate-900 mb-2">${renderMarkdownLite(q.q)}</div>
                    <div class="border-l-4 border-emerald-400 pl-3 mt-2">
                      <div class="text-slate-800">${renderMarkdownLite(q.answer)}</div>
                      <ul class="mt-2 space-y-0.5">
                        ${q.keyPoints.map((k) => `<li class="text-xs text-slate-600">&#9656; ${escapeHtml(k)}</li>`).join("")}
                      </ul>
                    </div>
                  </div>
                </details>
              `;
            }).join("")}
          </div>
        </div>

        <div class="flex flex-wrap gap-2 justify-end border-t border-slate-100 pt-4">
          <button id="newQuizBtn" class="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm border border-slate-200">New quiz</button>
          <button id="exitQuizBtn2" class="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold">Back to study mode</button>
        </div>
      </div>
    `;

    document.getElementById("newQuizBtn").addEventListener("click", renderSetup);
    document.getElementById("exitQuizBtn2").addEventListener("click", closeQuiz);
  }

  function tile(label, n, color) {
    const colors = {
      emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
      amber:   "bg-amber-50 border-amber-200 text-amber-800",
      rose:    "bg-rose-50 border-rose-200 text-rose-800",
      slate:   "bg-slate-50 border-slate-200 text-slate-700",
    };
    return `
      <div class="rounded-md border ${colors[color]} p-3 text-center">
        <div class="text-2xl font-bold">${n}</div>
        <div class="text-[11px] uppercase tracking-wide">${label}</div>
      </div>
    `;
  }

  // ===== Timer =====

  function startTimer() {
    stopTimer();
    const el = document.getElementById("quizTimer");
    if (!el) return;
    el.classList.remove("hidden");
    timerHandle = setInterval(() => {
      if (!quiz || quiz.endedAt) return;
      el.textContent = formatDuration(Date.now() - quiz.startedAt);
    }, 500);
  }

  function stopTimer() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    const el = document.getElementById("quizTimer");
    if (el) el.classList.add("hidden");
  }

  // ===== Wire global buttons =====

  document.getElementById("quizModeBtn").addEventListener("click", openQuiz);
  document.getElementById("exitQuizBtn").addEventListener("click", () => {
    if (quiz && !quiz.endedAt && Object.keys(quiz.answers).length > 0) {
      if (!confirm("Exit the quiz? Progress will be lost.")) return;
    }
    closeQuiz();
  });
})();
