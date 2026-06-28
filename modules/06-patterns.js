// Component Patterns — HOCs, render props, compound components, refs.
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "patterns",
  title: "Component Patterns",
  blurb: "HOCs, render props, compound components, refs.",
  questions: [
    {
      id: "p-1",
      difficulty: "medium",
      q: "What's the difference between a controlled and an uncontrolled component? Show a controlled input.",
      hint: "Source of truth: React state vs DOM.",
      answer: `**Controlled**: React state is the single source of truth. \`<input value={x} onChange={e => setX(e.target.value)} />\`. Easy to validate, transform, reset. **Uncontrolled**: the DOM holds the value; you read it via a ref when needed, often with \`defaultValue\`. Uncontrolled is lighter and useful for file inputs or wrapping non-React widgets. Mixing the two (e.g., providing \`value\` without \`onChange\`) gives a React warning.`,
      keyPoints: [
        "Source-of-truth distinction",
        "Controlled example shown",
        "Uncontrolled = ref + defaultValue",
        "Warning when accidentally mixing",
      ],
    },
    {
      id: "p-2",
      difficulty: "medium",
      q: "What is a Higher-Order Component? Give a tiny example and one drawback.",
      hint: "Function: Component -> Component.",
      answer: `An HOC is a function that takes a component and returns a new enhanced component.\n\`\`\`js\nconst withLogger = (Wrapped) => (props) => {\n  console.log('render', Wrapped.name, props);\n  return <Wrapped {...props} />;\n};\n\`\`\`\nDrawbacks: wrapper hell in devtools, ref forwarding gotchas, prop-name collisions, and harder static typing. Hooks replace most HOC use-cases more cleanly today.`,
      keyPoints: [
        "Definition: fn(Comp) -> Comp",
        "Working example",
        "Drawbacks listed (wrapper hell, refs, naming)",
        "Hooks as modern replacement",
      ],
    },
    {
      id: "p-3",
      difficulty: "medium",
      q: "Explain the compound component pattern with a 4-line sketch.",
      hint: "Think `<Tabs><Tabs.List>...`.",
      answer: `Compound components let a parent expose related sub-components that share implicit state via Context, giving consumers a flexible declarative API:\n\`\`\`jsx\n<Tabs defaultValue="a">\n  <Tabs.List><Tabs.Tab value="a">A</Tabs.Tab><Tabs.Tab value="b">B</Tabs.Tab></Tabs.List>\n  <Tabs.Panel value="a">Content A</Tabs.Panel>\n</Tabs>\n\`\`\`\nUnder the hood, \`Tabs\` provides a Context with the active value + setter; \`Tab\` and \`Panel\` read it. Benefit: consumers control markup/layout without prop explosion.`,
      keyPoints: [
        "Parent + dotted sub-components",
        "Implicit shared state via Context",
        "Flexible JSX API, no prop explosion",
      ],
    },
    {
      id: "p-4",
      difficulty: "hard",
      q: "What problem does `React.forwardRef` solve? When do you also need `useImperativeHandle`?",
      hint: "Forwarding refs through wrappers + custom imperative API.",
      answer: `By default, a ref attached to a function component is meaningless because function components don't have instances. \`forwardRef\` lets a component receive a \`ref\` as a second argument and forward it to a DOM node or child:\n\`\`\`js\nconst Input = forwardRef((props, ref) => <input ref={ref} {...props} />);\n\`\`\`\nUse \`useImperativeHandle(ref, () => ({ focus, clear }))\` when you want to expose a CUSTOM imperative API instead of the raw DOM node — e.g., a \`<Modal>\` ref with \`{ open(), close() }\` methods. Use sparingly; declarative props are usually better.`,
      keyPoints: [
        "Function components can't receive refs directly",
        "forwardRef forwards to DOM/child",
        "useImperativeHandle = custom ref API",
        "Caveat: use sparingly",
      ],
    },
    {
      id: "p-5",
      difficulty: "hard",
      q: "What's an Error Boundary? Why can't a function component be one (yet)?",
      hint: "componentDidCatch / getDerivedStateFromError.",
      answer: `An Error Boundary is a class component that implements \`getDerivedStateFromError\` and/or \`componentDidCatch\` to catch render-phase errors in its children and show a fallback UI instead of unmounting the whole tree. Function components cannot YET be error boundaries — there's no hook equivalent because the lifecycle hook runs at a specific spot in the commit phase. In practice you use a small class boundary (or the \`react-error-boundary\` library) at strategic spots: route shells, widgets, feature islands.\n\nNote: Error boundaries do NOT catch errors in event handlers, async code, or SSR — wrap those in try/catch yourself.`,
      keyPoints: [
        "Class only (today)",
        "getDerivedStateFromError + componentDidCatch",
        "Catches render errors, NOT event handlers / async",
        "react-error-boundary as common helper",
      ],
    },
  ],
});
