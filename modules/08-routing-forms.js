// Routing & Forms — navigation + user input.
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "routing-forms",
  title: "Routing & Forms",
  blurb: "Navigation + user input.",
  questions: [
    {
      id: "rf-1",
      difficulty: "easy",
      q: "In React Router v6, how do you define a route with a URL param and read it inside the component?",
      hint: "`:id` + `useParams`.",
      answer: `\`\`\`jsx\n<Route path="/users/:id" element={<User />} />\n// inside User\nimport { useParams } from 'react-router-dom';\nconst { id } = useParams();\n\`\`\`\nUse \`useNavigate()\` for programmatic navigation and \`useSearchParams()\` for the query string.`,
      keyPoints: [
        ":param syntax",
        "useParams hook",
        "Bonus: useNavigate, useSearchParams",
      ],
    },
    {
      id: "rf-2",
      difficulty: "medium",
      q: "Compare client-side routing vs server-side routing. What does React Router do behind the scenes?",
      hint: "History API, no full page reload.",
      answer: `**Server-side routing**: every navigation triggers a full page request — server returns new HTML, browser reloads everything. **Client-side routing**: the initial HTML/JS loads once; subsequent navigations are handled in JS by intercepting link clicks and updating the URL via the History API (\`pushState\`/\`replaceState\`) without a reload. React Router listens to history changes, matches the URL against your route config, and renders the matching component tree. Tradeoffs: faster perceived nav + state preservation vs initial JS cost and SEO/initial-paint concerns (mitigated by SSR/SSG frameworks like Next/Remix).`,
      keyPoints: [
        "Full reload vs in-app navigation",
        "History API: pushState/popstate",
        "Route matching in React",
        "SSR/SSG mention for SEO",
      ],
    },
    {
      id: "rf-3",
      difficulty: "medium",
      q: "Build a controlled form with validation showing an error under the email field on blur.",
      hint: "useState for value + touched + error.",
      answer: `\`\`\`jsx\nfunction EmailForm() {\n  const [email, setEmail] = useState('');\n  const [touched, setTouched] = useState(false);\n  const error = touched && !/^\\S+@\\S+\\.\\S+$/.test(email) ? 'Invalid email' : '';\n  return (\n    <label>\n      Email\n      <input\n        type="email"\n        value={email}\n        onChange={e => setEmail(e.target.value)}\n        onBlur={() => setTouched(true)}\n        aria-invalid={!!error}\n        aria-describedby="email-err"\n      />\n      {error && <span id="email-err" role="alert">{error}</span>}\n    </label>\n  );\n}\n\`\`\`\nIn real apps, prefer \`react-hook-form\` or \`Formik\` + \`zod\`/\`yup\` schema validation.`,
      keyPoints: [
        "Controlled input",
        "Validation only after blur (touched)",
        "Accessibility: aria-invalid, aria-describedby, role=alert",
        "Mentions react-hook-form for real use",
      ],
    },
    {
      id: "rf-4",
      difficulty: "hard",
      q: "How would you implement protected/private routes in React Router v6?",
      hint: "Wrapper component or `<Outlet />`.",
      answer: `Define a guard component that checks auth and either renders \`<Outlet />\` for nested routes or \`<Navigate to="/login" replace state={{ from: location }} />\`:\n\`\`\`jsx\nfunction RequireAuth() {\n  const { user } = useAuth();\n  const location = useLocation();\n  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;\n  return <Outlet />;\n}\n// Route config\n<Route element={<RequireAuth />}>\n  <Route path="/dashboard" element={<Dashboard />} />\n  <Route path="/settings" element={<Settings />} />\n</Route>\n\`\`\`\nAfter login, \`navigate(location.state?.from?.pathname ?? '/')\` returns the user where they came from. Use \`replace\` so the login page doesn't pollute history.`,
      keyPoints: [
        "Guard component + <Outlet />",
        "Navigate with replace",
        "Preserves intended destination via location.state",
        "Post-login redirect back",
      ],
    },
  ],
});
