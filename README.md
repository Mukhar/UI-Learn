# UILearn — React & JavaScript Interview Worksheets

A zero-dependency, single-page learning app to drill React + JavaScript interview
questions at your own pace. Self-graded, progress saved locally, runs from a plain
HTML file — no build, no server, no excuses.

> Built by huppy for mukhar. Sass included free of charge.

---

## Quick start

```bash
# Just open the HTML file in your browser
open index.html            # macOS
xdg-open index.html        # Linux
start index.html           # Windows
```

That's the whole install step. No `npm install`, no bundler. Tailwind is pulled
from a CDN. Progress lives in `localStorage` keyed to that file's origin.

---

## What's in the box

**13 modules, 96 questions**, mixed difficulty (easy / medium / hard):

| # | Module | Qs | What it covers |
|---|---|---|---|
| 1 | JavaScript Fundamentals for React | 6 | Closures, `this`, event loop, prototypes — the JS that bites React devs |
| 2 | JavaScript Interview Essentials | 11 | `==` vs `===`, `null` vs `undefined`, shallow/deep copy, `call`/`apply`/`bind`, debounce, `Promise.all`, currying, event delegation |
| 3 | React Basics | 6 | JSX, props vs state, keys, conditional rendering, fragments, lifting state |
| 4 | Hooks & State | 8 | Rules of Hooks, `useState`, `useEffect`, `useMemo`/`useCallback`, `useRef`, `useReducer`, custom hooks |
| 5 | Hooks Deep Dive | 10 | `useLayoutEffect`, lazy init, `useContext` perf, `useId`, `useTransition` vs `useDeferredValue`, `useSyncExternalStore`, exhaustive-deps gotchas, cleanup order, `useLocalStorage`/`useFetch` recipes |
| 6 | Component Patterns | 5 | Controlled/uncontrolled, HOCs, compound components, `forwardRef` + `useImperativeHandle`, Error Boundaries |
| 7 | Performance | 4 | `React.memo`, code splitting, virtualization, automatic batching |
| 8 | Routing & Forms | 4 | React Router v6 params, CSR vs SSR, controlled forms with a11y, protected routes |
| 9 | Global State Management | 3 | Context limits, Redux Toolkit, server vs client state |
| 10 | Testing & Best Practices | 5 | RTL philosophy, sample test, a11y checklist, blank-screen debugging, hydration |
| 11 | Modern React (18 & 19) | 12 | Concurrent renderer, automatic batching, `startTransition`, `use()` hook, RSC vs SSR, `'use client'`/`'use server'`, Actions + `useActionState` + `useFormStatus`, `useOptimistic`, streaming SSR + selective hydration, React Compiler, hydration mismatch causes |
| 12 | TypeScript + React | 12 | `interface` vs `type`, children typing, event handler types, `useState`/`useRef`/`useReducer` typing, generic components, `as const`, utility types, discriminated unions for state, `forwardRef` + `useImperativeHandle`, polymorphic `as` prop |
| 13 | Next.js / SSR / RSC | 12 | Rendering strategies, App vs Pages Router, extended `fetch` caching, ISR + `revalidateTag`, Server Actions vs Route Handlers, `generateStaticParams`, `next/image`, `<Link>` prefetching, file conventions (`page`/`layout`/`loading`/`error`), dynamic rendering triggers, `dynamic({ ssr: false })`, Edge middleware |

---

## How to use the app

### 1. Pick a module
Use the sidebar on the left. Each tile shows:
- **Title**
- **Progress count** (e.g. `3/8`)
- **Progress bar** — cyan while in-progress, emerald at 100%
- A subtle **ring**: amber if you've started, emerald if done

### 2. Try each question
- Read the prompt. Attempt an answer in your head (or out loud — it's good
  interview rehearsal).
- Stuck? Click **Hint** for a one-line nudge.
- Click **Reveal evaluator** to see the model answer + a checklist of key points
  you should have hit.

### 3. Grade yourself honestly
Three buttons under each evaluator:
- **Got it** — you nailed the core idea and key points
- **Partial** — you got the gist, missed nuances
- **Missed it** — re-read, mark it for later

The header shows your overall progress; the sidebar updates per-module.
Just opening the evaluator marks the question as **Viewed** so you can tell
attempted-but-ungraded from never-touched.

### 4. Iterate
- **First pass**: cover easy + medium without hints. Mark honestly.
- **Second pass** (a week later): re-attempt anything marked Partial / Missed.
  Spaced repetition is your friend.
- **Interview cram**: focus on the `hard` pills — those map to senior-level
  signals (stale closures, hydration, virtualization, `useSyncExternalStore`,
  Promise.all from scratch, etc.).

### 5. Reset when needed
Top-right **Reset progress** button clears all localStorage state. Confirms first.

---

## Quiz Mode

Click the blue **Quiz mode** button in the header for a randomized practice run.

### Setup
Configure three knobs before you start:
- **Count**: 5, 10, 20, or All
- **Difficulty**: toggle easy / medium / hard chips (ringed = included)
- **Modules**: toggle individual module tiles, or use Select all / Clear shortcuts

A live preview at the bottom shows the pool size and how many you'll be asked.

### During the quiz
- One question at a time, with module + difficulty pills.
- A live **timer** ticks up in the top-right of the overlay.
- Click **Reveal answer** to see the model answer + key points.
- Self-grade: **Got it** / **Partial** / **Missed it** — auto-advances to the next question.
- **Previous** button lets you walk back if needed.

### Results
When you finish, you get:
- **Score percentage** (Got it = 1, Partial = 0.5, Missed = 0)
- **Counts tile** for each grade
- **Time taken** + average per question
- **By-difficulty breakdown** with mini progress bars
- **Reviewable list** of every question — expand any to re-read the prompt + answer
- **New quiz** or **Back to study mode**

Quiz answers are *intentionally* separate from study-mode progress — drill
without polluting your study tracking.

---

## Project structure

```
UILearn/
  README.md              (you are here)
  index.html             (shell + script tags + quiz overlay)
  shared.js              (tiny helpers shared by app.js + quiz.js)
  app.js                 (study mode: sidebar, render, progress tracking)
  quiz.js                (quiz mode: setup, question flow, scoring, timer)
  modules/               (one file per module — each pushes to window.MODULES)
    01-js-fundamentals.js
    02-js-interview.js
    03-react-basics.js
    04-hooks-state.js
    05-hooks-deep.js
    06-patterns.js
    07-performance.js
    08-routing-forms.js
    09-state-mgmt.js
    10-testing-bp.js
    11-modern-react.js
    12-typescript-react.js
    13-nextjs-ssr.js
```

Each module file is self-contained. The pattern is:

```js
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "unique-slug",
  title: "Display Title",
  blurb: "Short tagline.",
  questions: [
    {
      id: "unique-question-id",
      difficulty: "easy" | "medium" | "hard",
      q: "Question text. Supports `inline code` and ```fenced``` blocks.",
      hint: "Optional one-liner nudge.",
      answer: "Model answer. Same markdown-lite support.",
      keyPoints: ["bullet 1", "bullet 2", "bullet 3"],
    },
    // ...
  ],
});
```

---

## Adding your own module

1. Create `modules/11-your-topic.js` following the shape above.
2. Add one more `<script src="./modules/11-your-topic.js" defer></script>`
   line in `index.html` (above the `app.js` script tag).
3. Reload the page. The new module appears in the sidebar automatically.

That's it. No build step, no registry to update. Module IDs and question IDs
must be globally unique — they're used as localStorage keys for progress.

## Adding a question to an existing module

Open the relevant `modules/*.js` file and append a new object to the
`questions` array. Pick a fresh `id`. Reload. Done.

---

## Design notes (the why)

- **No build / no framework**: this is a worksheet, not a SaaS. Plain HTML +
  three JS files keeps friction at zero.
- **One file per module**: easier to add/remove/edit topics without grepping
  through a 600-line megafile. Each file owns one concept.
- **Self-grading > auto-grading**: interview answers are nuanced. A checklist
  of key points teaches you what good looks like; you decide if your answer hit
  them. This mirrors how interviewers actually score.
- **localStorage progress**: zero infra, persists per browser. If you want
  cross-device sync, export `localStorage.getItem('uilearn.progress.v1')` and
  paste it on the other machine — or wire a backend later.
- **Tailwind via CDN**: trades a network request for a build step. Worth it
  for a personal study tool.

---

## Roadmap (open to ideas)

- [x] Quiz mode: 5/10/20/All random questions, timer, score at the end
- [ ] Export progress as JSON / import on another device
- [x] Module: Modern React (18/19) — concurrent, Suspense/data, RSC, Actions, `use()`, `useOptimistic`, Compiler
- [x] Module: TypeScript + React — generics, discriminated unions, `as const`, hook typing, polymorphic components
- [x] Module: Next.js / SSR / Server Components — App Router, fetch caching, ISR, Actions, dynamic rendering, middleware
- [ ] Module: System design (design a Tweet feed, infinite scroll, autocomplete)
- [ ] Module: CSS / responsive / a11y deep dive
- [ ] Spaced repetition: re-surface Missed / Partial answers after N days
- [ ] Per-question countdown (interview pressure mode)

If you want any of these, just ask huppy.
