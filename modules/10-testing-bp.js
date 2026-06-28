// Testing & Best Practices — RTL, Jest, a11y, error handling.
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "testing-bp",
  title: "Testing & Best Practices",
  blurb: "RTL, Jest, a11y, error handling.",
  questions: [
    {
      id: "tb-1",
      difficulty: "easy",
      q: "Why does React Testing Library push you to query by role/label instead of by class/test-id?",
      hint: "Tests should resemble user interaction.",
      answer: `RTL's guiding principle: the more your tests resemble how the software is used, the more confidence they give you. Querying by accessible role/label/text matches what users (and assistive tech) actually perceive, so tests stay valid through refactors and also surface accessibility gaps. Class names and test-ids are implementation details — easy to break and meaningless to users. Use \`data-testid\` only as a last resort for things with no accessible representation.`,
      keyPoints: [
        "Tests should mimic user interaction",
        "Role/label queries also test a11y",
        "Implementation details break refactor-resistance",
        "data-testid as last resort",
      ],
    },
    {
      id: "tb-2",
      difficulty: "medium",
      q: "Write a quick RTL test for a Counter component with an Increment button.",
      hint: "render, getByRole, userEvent.click, expect.",
      answer: `\`\`\`jsx\nimport { render, screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport Counter from './Counter';\n\ntest('increments when the button is clicked', async () => {\n  const user = userEvent.setup();\n  render(<Counter />);\n  const button = screen.getByRole('button', { name: /increment/i });\n  await user.click(button);\n  expect(screen.getByText('Count: 1')).toBeInTheDocument();\n});\n\`\`\`\nPrefer \`userEvent\` over \`fireEvent\` (it simulates real user interaction including focus, key sequences). Use \`findBy*\` for async appearance.`,
      keyPoints: [
        "render + screen.getByRole",
        "userEvent over fireEvent",
        "Assertion uses visible text/role",
        "Mentions findBy for async",
      ],
    },
    {
      id: "tb-3",
      difficulty: "medium",
      q: "List five concrete accessibility practices you bake into your React components.",
      hint: "Semantic HTML, labels, focus, contrast, keyboard.",
      answer: `(1) Use semantic HTML first — \`<button>\` not \`<div onClick>\`, \`<nav>/<main>/<header>\`, real headings in order. (2) Every form control has an associated \`<label>\` (or aria-label). (3) Visible focus styles preserved — never \`outline: none\` without an alternative. (4) Keyboard interaction: all interactive elements reachable via Tab, support Enter/Space, trap focus in modals + restore on close. (5) Color contrast meets WCAG 2.2 AA (4.5:1 text, 3:1 UI). Bonus: announce dynamic changes via \`aria-live\` regions; respect \`prefers-reduced-motion\`.`,
      keyPoints: [
        "Semantic HTML first",
        "Labels on form controls",
        "Visible focus",
        "Full keyboard support / focus trap in modals",
        "Color contrast WCAG AA",
      ],
    },
    {
      id: "tb-4",
      difficulty: "hard",
      q: "Your React app shows a blank white screen after deploy. Walk me through how you'd debug it.",
      hint: "Console, sourcemaps, error boundaries, network.",
      answer: `Systematic walkthrough:\n1. **Open DevTools console** — uncaught error in render is the #1 cause. Read the stack; if minified, load sourcemaps.\n2. **Network tab** — confirm \`index.html\`, JS, and CSS bundles 200'd; look for failed chunk loads (often a stale chunk after deploy if the user had the old index.html open).\n3. **Strict CSP / hash mismatch** — check for blocked scripts.\n4. **Env vars / API base URL** — confirm prod build embedded the correct \`VITE_*\`/\`REACT_APP_*\` variables.\n5. **Error boundary** — wrap the root in one so the next blank-screen incident shows a fallback + reports to Sentry.\n6. **Source maps + Sentry/LogRocket** for prod-only repros.\n7. **Local repro**: \`npm run build && npm run preview\` to catch dev-vs-prod differences (e.g., dev-only code, env vars, base path).\n8. **Hydration mismatch** if SSR — check for server/client divergence (\`Date.now()\`, \`Math.random\`, locale).`,
      keyPoints: [
        "Console + sourcemaps first",
        "Network: chunk load failures + stale deploys",
        "Env vars / API base URL check",
        "Error boundary + monitoring (Sentry)",
        "Build-locally repro / SSR hydration mention",
      ],
    },
    {
      id: "tb-5",
      difficulty: "hard",
      q: "What is hydration in the context of SSR React, and what common bugs come from it?",
      hint: "Server HTML + client attach.",
      answer: `Hydration is when React takes server-rendered HTML and attaches event listeners + state to it on the client, turning a static page into an interactive app without re-rendering the DOM from scratch. The server output and the first client render MUST produce identical trees, otherwise React warns and (in React 18) may discard the SSR HTML and re-render client-side, hurting performance and causing flickers.\n\nCommon causes of mismatches:\n- Non-deterministic values: \`Date.now()\`, \`Math.random()\`, locale-dependent formatting.\n- Browser-only APIs (\`window\`, \`localStorage\`) used during render — gate behind \`useEffect\` or \`typeof window !== 'undefined'\`.\n- Conditional rendering based on screen size / user-agent.\n- Third-party scripts mutating the DOM before hydration.\n\nFixes: render the same thing on both sides, defer client-only UI to \`useEffect\`, or use Next.js's \`dynamic(..., { ssr: false })\` / \`suppressHydrationWarning\` sparingly.`,
      keyPoints: [
        "Definition: attach listeners/state to SSR HTML",
        "Same tree required server vs client",
        "Names 2+ common causes (random, window, locale)",
        "Mitigation: useEffect / ssr:false",
      ],
    },
  ],
});
