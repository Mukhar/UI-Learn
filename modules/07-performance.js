// Performance — avoid the death-by-rerender.
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "performance",
  title: "Performance",
  blurb: "Avoid the death-by-rerender.",
  questions: [
    {
      id: "perf-1",
      difficulty: "medium",
      q: "What does `React.memo` do, and when does it NOT help?",
      hint: "Shallow prop comparison.",
      answer: `\`React.memo(Component)\` returns a memoized version that skips re-render when its props are SHALLOW-equal to the previous ones. It doesn't help when (a) parents pass new object/array/function props every render (referential inequality), (b) the component reads from Context — context changes still re-render it, (c) the children include non-memoized JSX. Fix (a) with \`useMemo\`/\`useCallback\` upstream, or restructure to push state down.`,
      keyPoints: [
        "Shallow prop comparison",
        "Broken by new object/array/function props",
        "Context updates bypass it",
        "Mention upstream fix",
      ],
    },
    {
      id: "perf-2",
      difficulty: "medium",
      q: "How would you code-split a route in a React app?",
      hint: "`React.lazy` + `Suspense`.",
      answer: `\`\`\`jsx\nconst Dashboard = React.lazy(() => import('./Dashboard'));\n<Suspense fallback={<Spinner />}>\n  <Routes>\n    <Route path="/dashboard" element={<Dashboard />} />\n  </Routes>\n</Suspense>\n\`\`\`\nThe bundler emits \`Dashboard\` as a separate chunk fetched on demand. Combine with route-level Suspense boundaries to keep the loading UI close to the change. For data, pair with React Router loaders or a data-fetching library to avoid waterfalls.`,
      keyPoints: [
        "React.lazy + dynamic import",
        "Suspense fallback",
        "Mentions separate chunk / on-demand fetch",
        "Bonus: avoiding fetch waterfalls",
      ],
    },
    {
      id: "perf-3",
      difficulty: "hard",
      q: "You have a list of 10,000 rows and scrolling janks. What's your plan?",
      hint: "Windowing / virtualization.",
      answer: `Render only the visible slice using a windowing library like \`react-window\` or \`@tanstack/react-virtual\`. They compute which rows fall in the viewport and absolutely-position them inside a tall scrollable container, so the DOM only holds ~20 rows at a time. Additionally: stable keys, \`React.memo\` on row components, avoid inline objects/functions, and consider \`content-visibility: auto\` in CSS for cheap wins. Profile with the React DevTools Profiler first to confirm render cost is the bottleneck (not layout/paint).`,
      keyPoints: [
        "Virtualization library named",
        "Only visible rows in DOM",
        "Memoized rows + stable keys",
        "Profile first",
      ],
    },
    {
      id: "perf-4",
      difficulty: "hard",
      q: "Explain React 18's automatic batching and what `useTransition` is for.",
      hint: "Concurrent rendering, interruptible work.",
      answer: `**Automatic batching**: in React 18, multiple state updates from ANY source (promises, timeouts, native event handlers — not just React events) are batched into a single re-render. Previously only React-managed events were batched. Opt out with \`flushSync\` when you truly need a synchronous DOM update.\n\n**useTransition**: lets you mark a state update as non-urgent. \`const [isPending, startTransition] = useTransition(); startTransition(() => setBigFilter(x));\` React keeps the UI responsive — the urgent input stays fast while the heavy filtered list renders in the background and can be interrupted. \`isPending\` powers a subtle loading indicator.`,
      keyPoints: [
        "Auto-batching now covers all sources",
        "flushSync escape hatch",
        "useTransition marks low-priority updates",
        "isPending for loading affordance",
      ],
    },
  ],
});
