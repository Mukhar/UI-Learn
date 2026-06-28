// JavaScript Fundamentals for React — the stuff that bites React devs at runtime.
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "js-fundamentals",
  title: "JavaScript Fundamentals for React",
  blurb: "The stuff that bites React devs at runtime.",
  questions: [
    {
      id: "js-1",
      difficulty: "easy",
      q: "Explain `var`, `let`, and `const`. Which one would you reach for by default in a React project, and why?",
      hint: "Think scope, hoisting, and re-assignment vs mutation.",
      answer: `\`var\` is function-scoped and hoisted (initialized as undefined), \`let\` and \`const\` are block-scoped and live in the Temporal Dead Zone until declared. \`const\` prevents re-binding (you can still mutate the object it points to). Default to \`const\`, fall back to \`let\` only when you must re-assign, avoid \`var\` in modern code.`,
      keyPoints: [
        "Scope: var=function, let/const=block",
        "Hoisting + Temporal Dead Zone mentioned",
        "const = no rebinding, NOT immutability",
        "Default preference = const",
      ],
    },
    {
      id: "js-2",
      difficulty: "easy",
      q: "What is a closure? Give a tiny React-relevant example.",
      hint: "Stale state in `setInterval` inside `useEffect`...",
      answer: `A closure is a function that retains access to its lexical scope even after the outer function has returned. In React, every render creates new closures around props/state — that's why a \`setInterval\` started inside \`useEffect\` with an empty dep array reads STALE state unless you use a ref or the functional updater form: \`setCount(c => c + 1)\`.`,
      keyPoints: [
        "Definition: function + retained lexical scope",
        "Each render = new closures over state/props",
        "Stale closure bug example (setInterval / event handler)",
        "Mitigations: functional setState, refs, deps array",
      ],
    },
    {
      id: "js-3",
      difficulty: "medium",
      q: "What does `this` refer to in: (a) a regular function, (b) an arrow function, (c) a class method, (d) an event handler passed as a prop?",
      hint: "Arrow functions don't have their own `this`.",
      answer: `(a) Depends on call-site: global/undefined in strict mode, the object in obj.fn(). (b) Arrow functions inherit \`this\` lexically — they have NO own \`this\`. (c) Inside a class method, \`this\` is the instance, but if you pass it as a callback it gets unbound unless you bind it or use a class-field arrow. (d) When passed as a prop like \`onClick={this.handleClick}\`, it loses its \`this\` binding — fix with \`.bind(this)\` in constructor or class-field arrow syntax. Hooks/functional components sidestep this entire mess.`,
      keyPoints: [
        "Regular fn: dynamic, call-site",
        "Arrow: lexical, inherited",
        "Class method needs binding when passed as callback",
        "Functional components avoid the problem",
      ],
    },
    {
      id: "js-4",
      difficulty: "medium",
      q: "Walk me through the event loop. Where do Promises run vs setTimeout?",
      hint: "Microtask queue vs macrotask queue.",
      answer: `The call stack runs synchronous code. When it's empty, the event loop pulls from queues. **Microtasks** (Promise callbacks, queueMicrotask, MutationObserver) drain COMPLETELY before the next macrotask. **Macrotasks** (setTimeout, setInterval, I/O, UI events) run one per tick. So \`Promise.resolve().then(...)\` always runs before a \`setTimeout(..., 0)\` scheduled at the same time. Render happens between macrotasks (browser-dependent).`,
      keyPoints: [
        "Call stack -> event loop -> queues",
        "Microtask queue drains fully before next macrotask",
        "Promises = microtask; setTimeout = macrotask",
        "Example ordering shown",
      ],
    },
    {
      id: "js-5",
      difficulty: "medium",
      q: "Explain prototypal inheritance and how `class` syntax relates to it.",
      hint: "`class` is mostly sugar.",
      answer: `Every object has a hidden [[Prototype]] (accessible via \`Object.getPrototypeOf\`). Property lookups walk up the prototype chain. \`class\` is syntactic sugar over functions + prototype assignment: \`class Foo { bar() {} }\` puts \`bar\` on \`Foo.prototype\`. \`extends\` sets up the chain. Real differences: classes are not hoisted callable, methods are non-enumerable, and you MUST use \`new\`.`,
      keyPoints: [
        "Prototype chain mechanic",
        "Object.getPrototypeOf / __proto__",
        "class = sugar over prototype",
        "Caveats: must use new, non-enumerable methods",
      ],
    },
    {
      id: "js-6",
      difficulty: "hard",
      q: "What's the output and WHY?\n```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n// vs\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n```",
      hint: "var has one binding, let has one per iteration.",
      answer: `**var version**: logs \`3, 3, 3\`. \`var i\` is one function-scoped binding shared by all three callbacks; by the time they run, the loop is done and i=3.\n\n**let version**: logs \`0, 1, 2\`. \`let\` creates a fresh block-scoped binding per iteration, so each closure captures its own i.\n\nFix for the var case pre-ES6: wrap in an IIFE \`(function(j){ setTimeout(() => console.log(j), 0) })(i)\`.`,
      keyPoints: [
        "var -> 3,3,3 with reason (shared binding)",
        "let -> 0,1,2 with reason (per-iteration binding)",
        "IIFE fix for legacy code",
      ],
    },
  ],
});
