// React Basics — JSX, components, props, rendering.
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "react-basics",
  title: "React Basics",
  blurb: "JSX, components, props, rendering.",
  questions: [
    {
      id: "rb-1",
      difficulty: "easy",
      q: "What is JSX? Is the browser running it directly?",
      hint: "Babel.",
      answer: `JSX is a syntax extension that looks like HTML but compiles down to JavaScript function calls — typically \`React.createElement(type, props, ...children)\` (or \`jsx(...)\` with the new transform). Browsers can't run JSX; a build tool like Babel/SWC/esbuild transforms it. JSX returns a plain JS object (a React element / "virtual DOM" node), not a real DOM node.`,
      keyPoints: [
        "JSX is syntax sugar, not a template language",
        "Compiles to createElement / jsx() calls",
        "Requires build step",
        "Produces React element objects, not DOM",
      ],
    },
    {
      id: "rb-2",
      difficulty: "easy",
      q: "What's the difference between props and state?",
      hint: "Owner vs receiver.",
      answer: `**Props** are inputs passed from a parent to a child — read-only from the child's perspective. **State** is owned by the component itself and can be updated via \`setState\`/state setter; updates trigger re-renders. Props flow downward; state is local. A child can ask the parent to change state by calling a callback prop.`,
      keyPoints: [
        "Props = inputs, read-only in child",
        "State = local, mutable via setter",
        "Both trigger re-renders when changed",
        "Lifting state up pattern mentioned",
      ],
    },
    {
      id: "rb-3",
      difficulty: "easy",
      q: "Why do lists need a `key`? What's wrong with using array index as the key?",
      hint: "Reconciliation by identity.",
      answer: `\`key\` lets React match elements between renders to decide what to mount, update, or unmount. With stable keys, reorders, insertions, and deletions are O(n) and preserve component state correctly. Using the array index as key works ONLY when the list is static (no insert/remove/reorder); otherwise React reuses the wrong DOM nodes and you get bugs like input values jumping rows or animations breaking. Use a stable unique id from your data.`,
      keyPoints: [
        "Keys identify items across renders",
        "Index keys break on reorder/insert/delete",
        "Concrete bug: state stuck on wrong row",
        "Use stable unique id",
      ],
    },
    {
      id: "rb-4",
      difficulty: "easy",
      q: "Show two ways to render conditionally in JSX.",
      hint: "Ternary, &&, early return, lookup map.",
      answer: `\`\`\`jsx\n// 1) ternary\n{isLoggedIn ? <Dashboard /> : <Login />}\n// 2) &&  (careful: 0 will render as "0"!)\n{items.length && <List items={items} />}  // BAD if length is 0\n{items.length > 0 && <List items={items} />} // GOOD\n// 3) early return\nif (loading) return <Spinner />;\n// 4) lookup map for many cases\nconst views = { idle: <Idle/>, loading: <Spinner/>, error: <Err/> };\nreturn views[status];\n\`\`\``,
      keyPoints: [
        "Ternary / && / early return shown",
        "Gotcha: && with number 0 renders 0",
        "Lookup table for many branches",
      ],
    },
    {
      id: "rb-5",
      difficulty: "medium",
      q: "What is a Fragment? When would you reach for `<></>` vs `<React.Fragment key={x}>`?",
      hint: "Keys + no wrapper div.",
      answer: `Fragments let you return multiple children from a component without adding an extra DOM wrapper (no "div soup"). The short syntax \`<></>\` doesn't accept attributes. Use the long form \`<React.Fragment key={id}>...</React.Fragment>\` when you need to attach a \`key\` (e.g., when mapping a list of fragment groups).`,
      keyPoints: [
        "No extra DOM node",
        "Helps with flex/grid layout & semantic HTML",
        "<></> can't take key; React.Fragment can",
      ],
    },
    {
      id: "rb-6",
      difficulty: "medium",
      q: "What is \"lifting state up\"? Give a 5-line illustration.",
      hint: "Move state to the closest common ancestor.",
      answer: `When two sibling components need to read/write the same state, you move that state up to their closest common ancestor and pass it down as props plus a setter callback.\n\`\`\`jsx\nfunction Parent() {\n  const [text, setText] = useState("");\n  return (<><Input value={text} onChange={setText} /><Preview text={text} /></>);\n}\n\`\`\`\nFor deeply nested trees, prefer Context or a state library instead of prop-drilling.`,
      keyPoints: [
        "Closest common ancestor owns the state",
        "Pass value down + callback to update",
        "Mention escape hatch: Context / store for deep trees",
      ],
    },
  ],
});
