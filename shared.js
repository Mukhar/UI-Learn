// Shared helpers used by both study mode (app.js) and quiz mode (quiz.js).
// Kept tiny and dependency-free on purpose.
window.UILearn = window.UILearn || {};

window.UILearn.escapeHtml = function (s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
};

// Minimal markdown: fenced code blocks, inline code, bold, paragraphs.
window.UILearn.renderMarkdownLite = function (text) {
  const esc = window.UILearn.escapeHtml(text);
  let html = esc.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code class="language-${lang || ""}">${code.trimEnd()}</code></pre>`
  );
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  html = html.split(/\n{2,}/).map((p) =>
    p.startsWith("<pre>") ? p : `<p>${p.replace(/\n/g, "<br/>")}</p>`
  ).join("");
  return html;
};

window.UILearn.difficultyStyles = {
  easy:   "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  hard:   "bg-rose-100 text-rose-800",
};

window.UILearn.statusStyles = {
  correct: "bg-emerald-500 text-white",
  partial: "bg-amber-500 text-white",
  wrong:   "bg-rose-500 text-white",
  skipped: "bg-slate-400 text-white",
};

// Fisher-Yates shuffle, returns a new array.
window.UILearn.shuffle = function (arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Format milliseconds as "Mm SSs" or "SSs".
window.UILearn.formatDuration = function (ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
};
