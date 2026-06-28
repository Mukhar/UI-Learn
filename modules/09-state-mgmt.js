// Global State Management — Context, Redux, Zustand, et al.
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "state-mgmt",
  title: "Global State Management",
  blurb: "Context, Redux, Zustand, et al.",
  questions: [
    {
      id: "sm-1",
      difficulty: "medium",
      q: "When does Context become a poor fit, and what alternatives do you reach for?",
      hint: "All consumers re-render on any context change.",
      answer: `Context is great for low-frequency, broadly-needed values (theme, locale, current user). It struggles when state updates are frequent or fine-grained, because EVERY consumer re-renders on any context value change — selector-based subscriptions aren't built in. Workarounds: split into multiple narrow contexts, memoize the value, or move to a store with selector-level subscriptions like Zustand, Jotai, Redux Toolkit (with \`useSelector\` + equality), or Recoil. For server state, prefer TanStack Query / RTK Query / SWR over both.`,
      keyPoints: [
        "All consumers re-render — no selectors",
        "Split contexts / memoize value",
        "Mentions Zustand/Jotai/RTK as alternatives",
        "Server state belongs in Query libraries",
      ],
    },
    {
      id: "sm-2",
      difficulty: "medium",
      q: "What does Redux Toolkit's `createSlice` give you that classic Redux didn't?",
      hint: "Immer + auto-generated action creators.",
      answer: `\`createSlice\` removes the boilerplate of writing action types, action creators, and switch-based reducers. You write a name + initial state + reducers as plain mutation-style functions (powered by Immer under the hood, so direct mutation is safe and produces immutable next-state). It auto-generates action creators and action types matched by name. Combined with \`configureStore\` (thunk + devtools by default) and RTK Query for data fetching, you get ~70% less code than legacy Redux.`,
      keyPoints: [
        "Auto-generated actions/types",
        "Immer for mutate-style reducers",
        "configureStore defaults: thunk + devtools",
        "RTK Query for server state",
      ],
    },
    {
      id: "sm-3",
      difficulty: "hard",
      q: "Why should server state be separate from client state? Name one library and what it gives you.",
      hint: "Caching, dedup, stale-while-revalidate.",
      answer: `Server state has properties client state doesn't: it lives remotely, can become stale, needs caching, request dedup, retries, background refetch, pagination, optimistic updates, and invalidation. Treating it like local state (raw \`useEffect\` + \`useState\`) reinvents all of this badly. **TanStack Query** (or SWR, RTK Query) provides \`useQuery\`/\`useMutation\` with: declarative cache keys, deduped requests, stale-time control, focus refetch, retries with backoff, pagination/infinite query helpers, optimistic updates, and devtools. Result: less code, fewer race conditions, and snappy UX.`,
      keyPoints: [
        "Distinguishes server vs client state characteristics",
        "Names a library (TanStack Query / SWR / RTK Query)",
        "Lists 2-3 concrete features (cache, dedup, refetch)",
        "Outcome: less code + fewer bugs",
      ],
    },
  ],
});
