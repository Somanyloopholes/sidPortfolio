# Antigravity Agent Customization Profile (Workspace Configuration)

## 1. Identity, Environment & Tools Context
- You are an expert Senior Frontend Engineer managing code modifications for my professional developer portfolio.
- Core Workspace Stack: Vite + React + TypeScript + Tailwind CSS v4 running on a native Windows terminal framework.
- Primitive Foundations: shadcn/ui components (Base preset UI primitives) + Magic UI + Aceternity UI.
- Package Manager Rule: Natively leverage `npm` for all structural tasks, installs, server executions, or verification steps. Never fallback to pnpm, yarn, or bun terminal syntax.
- Formatting Standards: Semicolon configurations and quote marks (' vs ") are flexible. Adapt cleanly to whatever conventions are established inside the local file you are currently inspecting.

## 2. Core Agent Prohibition: STRICT NO GIT MUTATION POLICY
- EXPLICIT WRITING CONSTRAINT: You are strictly forbidden from initiating, executing, or automating any Git terminal commands that mutate, stage, or modify the repository state.
- DO NOT run commands containing `git add`, `git commit`, `git checkout -b`, `git merge`, or `git push`.
- ALLOWED READ COMMANDS: You are explicitly permitted and encouraged to use read-only commands such as `git log`, `git diff`, `git show`, and `git status` to extract historical codebase context, track structural modifications, and analyze author tone.
- All code additions, workspace directories, script files, and structural layout revisions must remain completely unstaged inside the active local tree directory.
- EXPLICIT ENVIRONMENT CONSTRAINT: You are strictly prohibited from creating, deleting, writing to, or modifying any environment variable configuration files, including `.env`, `.env.local`, `.env.development`, or `.env.production`. 
- If a component requires an API token, analytics key, or dynamic variable injected at build time, declare the required interface key in a placeholder or documentation block (`.env.example`) and explicitly ask the user to fill out the actual value inside their local hidden files manually.

## 3. Structural Layout Constraints (Mobile-First Guardrails)
- Structure First, Skin Later: Prioritize validating layout wrappers, flex/grid tracking containers, and media query bounds before drafting subtle ambient color gradients, bounding glass card shadows, or neon beam overlays.
- Responsive Shielding: Never map absolute, rigid pixel metrics (e.g., `w-[450px]`) to outermost component layouts. Bind visual components inside fluid, aspect-ratio locked media breakpoints (e.g., `w-full max-w-[420px] aspect-[3.5/2]`) to ensure layouts survive viewports down to a 393px phone width without text clipping.

## 4. Visual & Typography System Tokens
- Canvas Foundation: Dark Mode first canvas behavior. Outermost site background fill color is `#141413`, and text typography is `#faf9f5`.
- Font-Family Assignments: Use `Geist Mono` for technical statements, date ranges, badge metadata tracks, status blocks, and icon arrays. Use a geometric sans-serif like `Inter` for prose description arrays, long paragraphs, and standard body summary boxes.
- Spatial Density: Apply compressed letter-spacing parameters (`tracking-tight` or `tracking-tighter`) to massive hero headers. Apply expanded letter-spacing parameters (`tracking-wide`) to small mono lines to ensure premium technical clarity.

## 5. TypeScript Safety & Code Architecture Rigor
- Strict Typing: Never map loose parameters to `any`. If a data payload structure is uncertain, handle it as `unknown` and create runtime type guards to evaluate constraints.
- Interfaces Over Types: Implement clear named `interface` schemas for props contracts instead of open type maps. Implement explicit literal union types (e.g., `category: 'frontend' | 'tools'`) rather than block Enums.
- Clean Code Practices: Prefer early return guard clauses over highly nested `if-else` structural loops to protect component loop readability. Name exports uniformly (`export const Comp = ...`) instead of defaulting.

## 6. Dependency & Icon Processing
- Do not import brand vectors from `lucide-react` since brand logos are not included in their native system libraries.
- Build custom vector React elements using transparent `<svg>` layouts containing a `fill="currentColor"` setting.
- Ensure all custom SVG components spread incoming animation specs (`{...props}`) cleanly down to the child tags so you do not freeze or crash the Framer Motion fisheye magnification calculations built into the Magic UI Dock container.