export interface Challenge {
  title: string;
  description: string;
}

export interface TechStackItem {
  name: string;
  category: string;   // e.g. "Engine", "Language", "XR / Hand Tracking", "Rendering", "Platform"
  version?: string;
  note?: string;       // sparse — only real caveats, not a note on every item
}

export interface KeyResult {
  label: string;
  value: string;
  note?: string;       // caveats that matter but shouldn't live in the number itself
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;   // card view only
  coverImage?: string;         // card view — bento tile image
  skills: string[];           // card/quick-scan tags
  role?: string;
  problemStatement?: string;
  architecture?: string;
  methodology?: string;
  challenges?: Challenge[];
  techStack?: TechStackItem[];
  keyResults?: KeyResult[];
  impactsAndKeyTakeaways?: string;
  fullDescription?: string;   // legacy
  media: string[];            // full case study — gallery images/screenshots
  githubUrl?: string;
  liveUrl?: string;
}

export const skillsList = [
  "All",
  "C++",
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "SQL",
  "Docker",
  "Docker Compose",
  "GitHub Actions CI/CD",
  "pytest",
  "Apache Kafka",
  "PostgreSQL",
  "SQLite",
  "Git",
  "Linux",
  "Unity",
  "Jira",
  "Meta XR SDK",
  "Unity XR SDK",
  "Open XR"
];

export const projects: Project[] = [
  {
    id: "sidportfolio-engineering",
    title: "Portfolio - Engineering the interface",
    shortDescription:
      "A React 19 / TypeScript SPA with physics-based motion, a scroll-driven timeline, and a markdown-powered case-study system.",
    // coverImage: "" // TODO: bento tile image for card view
    skills: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS v4",
      "Framer Motion",
      "React Router",
      "Component Architecture",
    ],
    role:
      "Solo developer — architecture, component design, animation systems, and build tooling.",

    problemStatement: `Most portfolio SPAs either ship a handful of static pages or bolt animation on top as an afterthought, which tends to show up as jank on scroll, inconsistent transition timing, or a data model that can't hold a real case study without breaking. I wanted a single codebase that could support a growing set of detailed, markdown-rendered case studies, animated page-to-page navigation that reads as intentional rather than decorative, and a component layer strict enough in TypeScript that adding new sections wouldn't quietly introduce bugs.`,

    architecture: `**Shell:** \`main.tsx\` sets up the router (\`createBrowserRouter\`, four nested routes) and wraps the app in \`ReactLenis\` for smooth scrolling. \`App.tsx\` owns the layout shell — background pattern, nav, the animated outlet, and the dock — and is the single place that knows about page order.
 
    **Routing & transitions:** \`App.tsx\` keeps a \`routeOrder\` array and a \`prevLocation\` ref. On every navigation it diffs the new route's index against the previous one to decide slide direction, then hands that direction to \`AnimatePresence\` (\`mode="popLayout"\`) via a custom prop. This is a small, self-contained piece of logic rather than a transition library, which kept it predictable and easy to reason about when adding new pages.
    
    **Content layer:** Project and case-study data lives in a typed \`data/projects.ts\` file, not a CMS or API — the site is fully static by design. The projects page filters that array client-side against active skill tags, and the case-study modal renders each project's markdown fields through \`react-markdown\` with a custom component map for styled paragraphs, links, images, and lists.
    
    **Motion primitives:** The contact card and the timeline both build directly on Framer Motion's lower-level hooks (\`useMotionValue\`, \`useSpring\`, \`useTransform\`) rather than its default animation presets, which is what makes the tilt and scroll-tracking feel physical instead of eased.`,

    methodology: `I built the routing and transition shell first, before any real page content existed, because getting slide direction and mount/unmount timing right is the kind of thing that's painful to retrofit once pages have their own internal state. Everything after that was built and reviewed one section at a time — dock, contact card, timeline, project grid — rather than standing up whole pages at once, which made it easier to catch layout regressions early.
    
    For styling, I chose Tailwind CSS v4 specifically for its native support of CSS custom properties, since the site's color and spacing values needed to live as real design tokens rather than one-off utility values scattered through components. For animation, Framer Motion's hook-based API won out over CSS transitions because several interactions — the card tilt, the timeline's scroll-linked line — need continuous, physically-plausible values rather than discrete state-to-state transitions.
    
    TypeScript is configured in strict mode with \`noUnusedLocals\`, \`noUnusedParameters\`, and \`noFallthroughCasesInSwitch\` all enabled, which I kept on deliberately through the build rather than relaxing it to move faster — the case-study data model in particular has enough optional fields that loose typing would have made rendering bugs easy to miss.`,

    challenges: [
      {
        title: "Directional transitions without a transition library",
        description:
          "Rather than pull in a page-transition package, I wrote the routeOrder-diffing logic by hand in App.tsx so I could control exactly how direction is computed and keep the dependency footprint down. The tradeoff is that adding a new top-level page means remembering to register it in the order array — a deliberate, documented constraint rather than a hidden one.",
      },
      {
        title: "Height tracking for the scroll-driven timeline",
        description:
          "The timeline component started from an open-source layout primitive, but its default height calculation didn't hold up against this site's content, which resizes based on variable-length entries. I rewrote the height logic using ResizeObserver against the first and last icon refs, plus a custom getOffsetTop helper that walks the offsetParent chain so the calculation stays correct even when a parent has a CSS transform applied — the default offsetTop approach breaks under transforms, which the page transitions rely on.",
      },
      {
        title: "3D tilt without a 3D library",
        description:
          "The business card's perspective tilt and glare are done entirely with CSS transforms driven by Framer Motion's motion values — no three.js or WebGL. That kept the bundle lean, but meant hand-tuning the spring config and translateZ layering to get the parallax to read as physical rather than just tilted.",
      },
      {
        title: "A flexible but type-safe case-study data model",
        description:
          "Case studies vary in how much detail they have — some fields are fully populated, others are still placeholders. Modeling that with a mix of required and optional TypeScript fields, while keeping the modal's rendering logic simple, took a few passes before the interface struck the right balance between flexibility and actually catching missing-data bugs at compile time.",
      },
    ],

    techStack: [
      { name: "React", category: "Framework", version: "19.2.0" },
      {
        name: "TypeScript",
        category: "Language",
        version: "~5.9.3",
        note: "strict mode, noUnusedLocals/Params, noFallthroughCasesInSwitch",
      },
      { name: "Vite", category: "Build Tool", version: "7.3.1" },
      { name: "Tailwind CSS", category: "Styling", version: "4.2.1" },
      { name: "Motion (Framer Motion)", category: "Animation", version: "12.42.2" },
      { name: "React Router DOM", category: "Routing", version: "7.14.1" },
      {
        name: "Lenis",
        category: "Scroll",
        version: "1.3.25",
        note: "drives the scroll-linked timeline animation",
      },
      { name: "react-markdown", category: "Content Rendering", version: "10.1.0" },
      { name: "shadcn/ui", category: "Component Primitives", version: "4.13.0" },
    ],

    keyResults: [
      { label: "Commits", value: "13", note: "solo, single contributor" },
      {
        label: "Case studies shipped",
        value: "7",
        note: "5 project case studies + 2 design case studies, each with a full markdown-rendered detail view",
      },
      {
        label: "TypeScript strictness",
        value: "Strict mode",
        note: "noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch all enabled",
      },
      {
        label: "Production build",
        value: "Verified locally",
        note: "npm run build completes; not yet deployed",
      },
    ],

    impactsAndKeyTakeaways: `Building the transition and data layers first, before content, paid off — every new page and case study since has slotted into an existing structure instead of needing its own one-off logic. The biggest engineering lesson was around motion: reaching for Framer Motion's raw hooks instead of its animation presets took more upfront tuning but gave far more control over how the tilt, scroll-tracking, and dock magnification actually feel, which matters more on a portfolio than almost anywhere else. I'd make the same tradeoff again — hand-write the pieces that need to feel exact, and only reach for a library when the problem is genuinely generic.`,

    media: [
      // TODO: screenshots/gifs — dock magnification, contact card tilt, timeline scroll, case-study modal
    ],

    githubUrl: "https://github.com/Somanyloopholes/sidPortfolio",
    // liveUrl: "" // not yet deployed
  },
  {
    id: "sidportfolio-design",
    title: "Portfolio - Designing the system",
    shortDescription:
      "A single-accent, five-token color system and a role-based type scale, built in Figma and disciplined enough to hold up across a website, a LinkedIn banner, a GitHub README, and my own hardware.",
    // coverImage: "" // TODO: bento tile image for card view
    skills: [
      "Figma",
      "Design Systems",
      "Typography",
      "Color Theory",
      "Brand Identity",
      "Figma MCP",
    ],
    role:
      "Solo designer — visual identity, token architecture, and the Figma-to-code handoff structure.",

    problemStatement: `Most portfolio sites default to the same palette — near-black background, a blue accent, done. I wanted something that read as a deliberate identity rather than a default, without tipping into the kind of maximalism that stops being legible. The harder version of that problem: the system couldn't just work on one page. It needed to survive being pulled onto a LinkedIn banner, rendered inside a GitHub README in both light and dark themes, and even reproduced on hardware — my Windows accent color and keyboard RGB are both set to match it now. A system that only works on one background isn't really a system.`,

    architecture: `**Color:** Five Figma variables, flat and kebab-cased — \`primary-bg\` (#131314), \`secondary-text\` (#F4F4F5), \`tertiary-text\` (#A1A1AA), \`hero-accent\` (#A6D800), and \`surface-dock\` (a 15% tint of the background used specifically for the dock's glass-like surface). Four neutrals and exactly one accent — the constraint is the point.
 
**Type:** A role-based scale, not a size-based one — styles are named for what they do (\`display-hero\`, \`section-heading\`, \`sub-heading\`, \`title-small\`, \`body-prose\`, \`body-emphasis\`, \`micro-tag\`, \`statement-mono\`) rather than their pixel value, with a parallel mobile scale that recalculates line-height and size per style rather than just scaling everything down uniformly.
 
**Layout:** Every frame in the Figma file is built with auto-layout — spacing and sizing are encoded as structure inside the file itself, not eyeballed and left implicit. That structure is what actually crosses over into code: it's the difference between a design file that documents intent and one that only shows a result.
 
**Handoff:** Figma → Figma MCP → Antigravity. The MCP server exposes the variables, styles, and auto-layout structure as context Antigravity can read directly, rather than requiring the design system to be redescribed in a prompt. The free tier caps out at 6 tool calls a month, which rules out using it as a continuous sync — so the workflow treats it as a one-time extraction: pull the full variable and style set once, capture it directly into \`index.css\` as Tailwind CSS v4 custom properties, and treat that file as the canonical source from then on, going back to MCP only when the token set itself actually changes.`,

    methodology: `I settled on the color scheme before I built a single token — the five-variable, one-accent structure came after the decision, not before it. That ordering mattered: it meant the system was built to express a choice I'd already made, rather than being assembled first and colored in after.
 
The palette itself is a reaction against the usual portfolio defaults. I wanted a strict monotone base with exactly one accent doing all the work, in the spirit of how accessible color-pairing tools like randoma11y treat contrast — deliberately, not decoratively — combined with a willingness to let that one accent be loud, which is closer to what I took from Bungie's *Marathon* art direction: vibrant, graphic, unapologetic about being the focal point of every frame it appears in. The system is quiet everywhere except the one place it isn't.
 
Typography followed the same logic. Geist Mono carries the bold display moments — the same instinct Palantir uses a heavy, technical-feeling font for its hero type — while Inter handles body copy where actual readability matters more than character, and JetBrains Mono is reserved for anything meant to read as code or a system statement.
 
The first real pass at the visual direction wasn't this one. I built it out in glassmorphism first, got far enough to actually look at it, and realized it read as generic — a style everyone's portfolio was already doing rather than a specific choice. I killed that direction and rebuilt around the current graphic-and-typography-led system instead of trying to salvage it.`,

    challenges: [
      {
        title: "Reconciling loud and quiet influences",
        description:
          "Marathon's art direction and an accessibility-first color tool pull in opposite directions — one wants maximum visual energy, the other wants restraint and legibility above all else. I resolved it by scoping where each one gets to win: the accent color is allowed to be loud because it's the only color in the system, and everything else — the four neutrals, the type scale, the grid — stays disciplined so the one loud decision actually reads as a decision instead of noise.",
      },
      {
        title: "Killing the glassmorphism direction",
        description:
          "I had a working glassmorphism pass before this system existed. It looked fine and it also looked like every other portfolio site right now. Recognizing that and rebuilding from a different starting point was a bigger factor in how the site turned out than any individual visual refinement inside either direction.",
      },
      {
        title: "Working around the Figma MCP free-tier cap",
        description:
          "A 6-tool-call-per-month cap makes it impossible to treat Figma MCP as a live design source you query on demand. I restructured the workflow around that constraint instead of working against it — one deliberate full export, captured into index.css, treated as canonical until the token set itself changes.",
      },
      {
        title: "Making one identity hold across four different surfaces",
        description:
          "The same five-token, one-accent system has to read correctly on the site itself (interactive, full control over background), a LinkedIn banner (fixed aspect ratio, sitting in a feed next to everything else), a GitHub README (rendered in both GitHub's light and dark themes, outside my control), and physical hardware (Windows accent color and keyboard RGB, with far less color accuracy than a browser gives you). Keeping the system simple — one accent, four neutrals — was what made it portable across constraints that different in the first place.",
      },
    ],

    techStack: [
      { name: "Figma", category: "Design Tool" },
      {
        name: "Figma Variables",
        category: "Design Tokens",
        note: "flat, kebab-case naming — primary-bg, secondary-text, tertiary-text, hero-accent, surface-dock",
      },
      {
        name: "Figma MCP",
        category: "Design-to-Code Handoff",
        note: "free tier capped at 6 tool calls/month",
      },
      { name: "Antigravity", category: "Agentic Build Tool" },
      { name: "Auto Layout", category: "Layout System" },
      { name: "Geist Mono / Inter / JetBrains Mono", category: "Typography" },
    ],

    keyResults: [
      {
        label: "Color tokens",
        value: "5",
        note: "primary-bg, secondary-text, tertiary-text, hero-accent, surface-dock — one accent, rest neutral",
      },
      {
        label: "Type styles",
        value: "8 desktop / 6+ mobile",
        note: "named by role (display-hero through micro-tag), not by pixel size",
      },
      {
        label: "Brand surfaces",
        value: "4",
        note: "site, LinkedIn banner, GitHub README, OS accent color + keyboard RGB",
      },
      {
        label: "Figma MCP usage",
        value: "1 full export",
        note: "captured into index.css once due to the 6-call/month free-tier cap; re-run only on deliberate token changes",
      },
    ],

    impactsAndKeyTakeaways: `Designing for four surfaces instead of one forced a kind of discipline that designing for a single page never would have — a system that only survives on one background isn't a system, it's a page. The decision that mattered most wasn't any single color or font choice; it was killing the glassmorphism direction early instead of polishing something that was fundamentally the wrong starting point. And on the handoff side, the clearest lesson was that Antigravity could only rebuild what the Figma file made legible — named variables, auto-layout structure, and a genuinely small token set did more for the Figma-to-code pipeline than any amount of prompting would have.`,

    media: [
      // TODO: Figma variables panel, typography scale panel, project-page mockup, before/after glassmorphism comparison
    ],

    githubUrl: "https://github.com/Somanyloopholes/sidPortfolio",
    // liveUrl: "" // not yet deployed
  },
  {
    id: "signpose-vr",
    title: "SignPoseVR — Learn ASL in VR",
    shortDescription:
      "A controller-free VR app for learning the ASL alphabet and digits on Meta Quest, with real-time hand-tracking feedback.",
    coverImage: "/images/signpose/cover.png",
    skills: ["C#", "Unity", "VR", "Meta XR SDK", "Unity XR SDK", "Open XR"],
    role: "Solo project — designed, built, and published the full application to the Meta Horizon Store.",
    problemStatement:
      "Learning the ASL alphabet and numbers usually means a 2D app or a YouTube tutorial — something that can show you the correct hand shape but has no way of telling you whether the shape you're actually making matches it. That gap is what I wanted to fix. Quest's hand tracking meant I could skip controllers entirely and let someone practice with their actual hands, getting feedback the moment they get a sign right instead of guessing.",
    architecture:
      "Under the hood, the app runs on OpenXR as the active runtime, with Meta XR SDK layered on top providing hand tracking as an OpenXR extension — the Oculus XR Plugin ships in the package via com.meta.xr.sdk.all but isn't the active loader.\n\nOn top of that stack, the app runs on a 3-tier ScriptableObject structure. At the bottom, each of the 36 signs (A–Z, 0–9) is its own Hand Shape asset — per-finger curl and spread conditions with tolerance ranges, so a real hand doesn't have to hit the shape pixel-perfect. Those wrap into PoseWithImage assets, pairing a hand shape with its reference image and description, and all 36 live inside one PoseLibrary asset the rest of the app indexes into.\n\nAt runtime, LearnModeController pulls a random pose from the library and hands it to DynamicGestureController, which is where the actual trick lives: StaticHandGesture, Meta XR SDK's gesture-evaluation component, only checks one hardcoded pose, set in the editor, with no public way to change it at runtime. I used C# reflection to reach into the component's private fields (m_HandShapeOrPose, m_HandPose) and re-invoke its own OnEnable/Initialize methods, effectively hot-swapping which sign a single evaluator is checking for. That let me cycle through all 36 signs off one reusable gesture component instead of instantiating and destroying 36 of them every round.\n\nFrom there it's event-driven: the SDK fires gesturePerformed/gestureEnded against the tracked hand, DynamicGestureController counts how many finger conditions are currently satisfied, and once a match holds steady for 0.8 seconds it fires a PoseMatched event — border materials swap to a glow finish, score bumps in Quiz mode, and LearnModeController pulls the next random pose, with a do-while check so the same sign never repeats twice in a row.",
    methodology:
      "I built this sign by sign rather than trying to solve gesture recognition in the abstract. Each hand shape started as a rough tolerance range and got tightened over repeated rounds of putting the headset on, making the sign myself, and adjusting curl/spread thresholds per finger until it stopped triggering on close-but-wrong shapes and stopped missing correct ones. Signs like P, G, and H needed an extra orientation condition on top of finger shape, since they're distinguished by palm direction more than by which fingers are curled.\n\nI ran a small round of informal testing — 4 to 5 people trying it cold — mostly to catch tolerance settings that felt fine to me, since I'd been making these signs myself for weeks, but were too strict or too loose for someone unfamiliar with the exact hand position.\n\nI also built a custom Unity editor for the PoseSelectorRuntime component early on, because manually wiring up 36 pose references through the default inspector was slow enough that I was making mistakes. A dropdown populated from the pose library made authoring and testing each sign much faster.",
    challenges: [
      {
        title: "Choosing the right layer of the Meta stack for gesture matching",
        description:
          "My first pass used Meta XR SDK's higher-level, out-of-the-box gesture tooling — it gets you gesture detection fast, but it's built around wiring up a handful of predefined gestures by hand in the Inspector, not scaling to three dozen distinct signs. Rather than switch runtimes, I dropped down a layer: StaticHandGesture is a lower-level Meta XR SDK component, still running on the same OpenXR-backed hand tracking, that just evaluates a single hardcoded pose. I gave up the convenience of the higher-level tool in exchange for a component I could manipulate directly — which is what led to the reflection-based pose injection described in the architecture above."
      },
      {
        title: "Real-time hand tracking without controllers",
        description:
          "Meta's hand tracking is good but noisy — a hand passing briefly through the correct shape on its way to a different pose could register as a false match. The fix was the 0.8-second hold timer: a match only counts once the gesture is sustained, and the coroutine cancels immediately if it's lost mid-hold. That one change did more for reliability than any amount of finger-tolerance tuning."
      },
      {
        title: "Gesture recognition across natural variation",
        description:
          "No two people hold their hand exactly the same way for a given sign, and Quest's tracking has its own jitter on top of that. Each hand shape defines per-finger curl and spread with upper and lower tolerance bounds instead of one target value, and a few signs needed an added palm-orientation check since they're differentiated by rotation as much as finger position. Getting these tolerance bands loose enough to accept real variation but tight enough to reject a different letter took more iteration than anything else in the project."
      },
      {
        title: "VR interaction design without a controller pointer",
        description:
          "Most VR UI assumes you have a controller to point and click with. Here the only input is the hand itself, so Learn and Quiz modes had to communicate state through the scene instead of menus: reference images float in view for Learn mode, the border material glows on a correct match, and Quiz mode just hides the reference and tracks score. Keeping both modes legible without a cursor was as much a design problem as a technical one."
      },
      {
        title: "Keeping standalone Quest hardware smooth",
        description:
          "Quest runs on mobile-class chips, so anything I'd take for granted on desktop VR — real-time lighting, uncapped draw calls — was a performance risk. I baked lighting into lightmaps ahead of time instead of computing it live, built on Universal Render Pipeline for its lighter overhead, and kept the classroom scene simple. The app holds a steady 60fps on Quest hardware as a result."
      }
    ],
    techStack: [
      { name: "Unity", category: "Engine", version: "2022.3.60f1 (LTS)" },
      { name: "C#", category: "Language" },
      { name: "OpenXR", category: "XR Runtime", version: "1.14.3", note: "Active loader for the whole XR stack" },
      { name: "Meta XR SDK", category: "XR / Hand Tracking", version: "74.0.3", note: "Feature layer on top of OpenXR — provides hand tracking" },
      { name: "Unity XR Hands", category: "XR / Hand Tracking", version: "1.5.1" },
      { name: "Unity XR Interaction Toolkit", category: "XR / Interaction", version: "2.6.4" },
      { name: "Universal Render Pipeline (URP)", category: "Rendering", version: "14.0.12" },
      { name: "Vulkan", category: "Rendering" },
      { name: "TextMeshPro", category: "UI", version: "3.0.9" },
      { name: "Oculus XR Plugin", category: "Platform", note: "Bundled via com.meta.xr.sdk.all, but not the active loader — vestigial" },
      { name: "Android (Quest OS)", category: "Platform", note: "Min SDK 32" }
    ],
    keyResults: [
      { label: "Downloads", value: "545" },
      { label: "Signs Supported", value: "36" },
      { label: "Frame Rate", value: "60 fps" },
      { label: "Gesture Accuracy", value: "~90%", note: "informal estimate, not formally benchmarked" }
    ],
    impactsAndKeyTakeaways:
      "The reflection-based pose injection was the biggest technical risk in the project: it depends on private SDK internals that aren't part of Meta's public API, so an SDK update could break it without warning. It worked for this build, but it's a trade-off worth naming rather than glossing over. On accessibility, controller-free hand tracking lowers one barrier to entry, but the app has no colorblind-friendly alternative to the glow feedback, no audio cues, and English-only text — the clearest next steps if I picked this back up.",
    media: [
      "/images/signpose/cover.png",
      "/images/signpose/store-listing.png",
      "/images/signpose/gesture-detection-demo.mp4",
      "/images/signpose/classroom-scene.png",
      "/images/signpose/hand-shape-editor.png",
      "/images/signpose/architecture-diagram.png"
    ],
    githubUrl: "https://github.com/Somanyloopholes/SignPoseVR",
    liveUrl: "https://www.meta.com/experiences/24069781642651333/"
  }, {
    id: "spatial-inequality-cook-county",
    title: "Spatial Inequality Analysis: Neighborhood Evolution in Cook County",
    shortDescription:
      "A decade-long spatial network analysis tracking how Cook County neighborhoods shift between seven distinct typologies — built with KNN similarity graphs and Louvain community detection instead of fixed administrative boundaries.",
    coverImage: "/projects/spatial-inequality/cover.png",
    skills: [
      "R",
      "Spatial Analysis",
      "Network Science",
      "Louvain Clustering",
      "Census Data",
      "GIS",
      "Data Visualization",
    ],
    role: "Solo project — designed the full analytical methodology (variable selection, KNN parameter tuning, meta-cluster interpretation) and authored all 10 R pipeline scripts, from data ingestion through final visualization.",

    problemStatement:
      "Neighborhood-level inequality in the Chicago metro area is usually studied through fixed administrative boundaries, which can mask gradual, cross-boundary change. This project instead builds similarity-based network graphs of Census block groups from multivariate sociodemographic features, applies Louvain community detection to surface latent neighborhood typologies, and tracks how individual geographic units move between those typologies across three time periods — exposing gentrification, decline, and stabilization patterns that boundary-based analyses tend to miss.",

    architecture:
      "A 10-script sequential R pipeline where each stage consumes the previous stage's output. It starts by pulling ACS 5-year estimates and tract-level poverty data from the Census API for Cook County block groups across 2013, 2018, and 2023, then joins those to 2020 TIGER/Line geometries and computes derived ratios (poverty rate, education, renter share, etc.). Chicago crime counts and CTA rail accessibility are layered on via spatial joins and a centroid-to-station distance matrix. Block groups are then aggregated to Community Areas / Municipalities, visualized as choropleths and change maps, and finally fed into the network-analysis stage: an 8-variable KNN similarity graph clustered with Louvain community detection, with raw cluster IDs mapped to seven interpretable meta-cluster labels and visualized as year-over-year alluvial flow diagrams.",

    methodology:
      "For each snapshot year, eight socioeconomic and housing variables (Hispanic share, bachelor's-plus attainment, median home value, median age, median household income, crime count, unemployment rate, poverty rate) are z-score normalized, and a full Euclidean distance matrix is used to build a k=8 nearest-neighbors graph, symmetrized to remove duplicate edges. Louvain community detection is run independently on each year's graph. Because Louvain's raw community IDs aren't stable across separate runs, I built year-specific lookup tables mapping each year's cluster IDs to seven consistent, interpretable meta-cluster labels (e.g., Elite & Wealthy, High-Poverty, Aging Suburban), which lets the same neighborhood 'type' be tracked as it evolves from 2013 to 2023. Transition matrices and ggalluvial-based flow diagrams then visualize how block groups moved between typologies across each year pair.",

    challenges: [
      {
        title: "Reconciling Heterogeneous Data Sources",
        description:
          "Aligning Census ACS data, Chicago crime records, and CTA rail GeoJSON into a single consistent spatial base across three time periods required significant data engineering. Some candidate data layers were ultimately dropped due to excessive gaps in coverage.",
      },
      {
        title: "Interpreting Unlabeled Clusters Across Years",
        description:
          "Louvain community detection assigns arbitrary cluster IDs that aren't stable between separate yearly runs. I built year-specific lookup tables to manually map each year's raw cluster IDs onto seven consistent meta-cluster labels, so the same neighborhood type could be tracked as it changed over the decade rather than relabeling itself every year.",
      },
      {
        title: "Choosing a Similarity Metric Over Fixed Boundaries",
        description:
          "Administrative boundaries like Community Areas can obscure gradual, cross-boundary neighborhood change. I chose to build a k-nearest-neighbors graph on z-score normalized socioeconomic features instead, which meant writing custom distance-matrix and edge-symmetrization logic rather than relying on an out-of-the-box clustering routine end-to-end.",
      },
    ],

    techStack: [
      { name: "R", category: "Language", version: "4.2+" },
      { name: "tidycensus", category: "Data Ingestion", note: "Census ACS 5-year API" },
      { name: "sf", category: "Spatial Analysis", note: "Spatial joins, CRS transforms, centroids, distance matrices" },
      { name: "igraph", category: "Network Science", note: "KNN graph construction, Louvain community detection" },
      { name: "tigris", category: "Spatial Data", note: "TIGER/Line block group geometries" },
      { name: "dplyr / tidyr", category: "Data Wrangling" },
      { name: "ggplot2", category: "Visualization" },
      { name: "ggalluvial", category: "Visualization", note: "Sankey-style cluster transition flow diagrams" },
      { name: "patchwork", category: "Visualization", note: "Composite panel layouts" },
      { name: "GeoPackage (.gpkg)", category: "Data Format" },
      { name: "U.S. Census Bureau ACS API", category: "Data Source" },
      { name: "Chicago Open Data", category: "Data Source", note: "Crime incident records" },
    ],

    keyResults: [
      {
        label: "Time span analyzed",
        value: "2013–2023",
        note: "Three snapshot years: 2013, 2018, and 2023",
      },
      {
        label: "Neighborhood typologies identified",
        value: "7 meta-clusters",
        note: "From Elite & Wealthy to High-Poverty, mapped consistently across years",
      },
      {
        label: "ACS variables ingested",
        value: "24 variables",
        note: "Per block group, per year, plus tract-level poverty",
      },
      {
        label: "Clustering feature space",
        value: "8 variables · k=8 KNN graph",
        note: "Z-score normalized before Louvain community detection",
      },
      {
        label: "Visualizations generated",
        value: "160+ PNGs",
        note: "Choropleth maps, histograms, cluster maps, and alluvial flow diagrams",
      },
    ],

    impactsAndKeyTakeaways:
      "This was an independent, self-directed project rather than a deployed tool — no dashboard or external users exist yet, and because Louvain clustering is unsupervised, there's no accuracy metric to report; the value is in the patterns the network-based approach surfaces. Building the pipeline end to end reinforced that similarity graphs over administrative boundaries can reveal gradual neighborhood transitions — gentrification, decline, and stabilization — that choropleth-by-Community-Area analysis tends to smooth over. A natural next step would be turning the static outputs into an interactive dashboard so the year-over-year transitions can be explored rather than just viewed as static flow diagrams.",

    media: [
      "/projects/spatial-inequality/cluster-map-2013.png",
      "/projects/spatial-inequality/cluster-map-2018.png",
      "/projects/spatial-inequality/cluster-map-2023.png",
      "/projects/spatial-inequality/alluvial-flow-2013-2023.png",
      "/projects/spatial-inequality/choropleth-median-income.png",
      "/projects/spatial-inequality/percent-point-change-map.png",
    ],
  },
  {
    id: "iit-campus-assistant",
    title: "IIT Campus Assistant",
    shortDescription:
      "A hybrid RAG-SQL campus chatbot for Illinois Institute of Technology that ingests live dining menus and campus events over Apache Kafka, stores structured data in SQLite, builds FAISS vector indexes for semantic search, and uses Llama-3 (via Groq) to route and answer natural-language questions.",
    coverImage: "/projects/campus-assistant/cover.png",
    skills: [
      "Python",
      "Apache Kafka",
      "FAISS",
      "RAG",
      "SQL",
      "LLM Integration",
      "Streamlit",
    ],
    role: "Built the real-time data layer for the events domain and led the integration work stitching three independently-built subsystems into one working app. That included the Kafka producer that scrapes the dining API and IIT's ICS calendar feed, the Kafka consumer that persists incoming batches to SQLite and auto-triggers a FAISS index rebuild for events, the events FAISS index build pipeline, the SQL-based event date-window and keyword query API, and the constrained semantic retrieval logic that narrows FAISS search to date-relevant events before ranking them. Teammates on the other two subgroups built the curriculum RAG pipeline (web crawling, chunking, hybrid retrieval) and the dining data pipeline plus the chatbot's intent-routing and Streamlit UI layer.",

    problemStatement:
      "University students and prospective applicants need quick, accurate answers spanning three separate domains — dining menus, campus events, and academic/admissions information — but the underlying sources are scattered across a dining API, an ICS calendar feed, and dozens of catalog and admissions web pages. The Campus Assistant consolidates all three into a single natural-language interface, using structured retrieval rather than open-ended generation to reduce hallucinated answers.",

    architecture:
      "Data ingestion runs event-driven through Kafka: a producer scrapes the DineOnCampus REST API and IIT's ICS calendar feed and publishes typed batches (menu_batch / events_batch) to a shared topic. A long-lived consumer dispatches each batch by type — writing menu items to SQLite, or writing events to SQLite and then auto-triggering a rebuild of the events FAISS index so semantic search stays current. Kafka offsets are only committed once both the SQLite write and the FAISS rebuild succeed, so a crash mid-batch replays cleanly on restart. In parallel, a separate batch pipeline crawls university web pages, cleans and chunks the content, and builds a curriculum FAISS index. At query time, a Streamlit chat UI sends the question to an LLM-based intent router (Llama-3.3-70B via Groq), which classifies it as dining, events, or curriculum and extracts structured filters; dining and date-only event queries run as SQL lookups, topic-based event queries use SQL to pre-filter by date before FAISS ranks within that valid set, and curriculum queries go through FAISS semantic search.",

    methodology:
      "The core anti-hallucination pattern is constrained semantic retrieval for events: rather than letting vector search rank across all events regardless of time relevance, a SQL date-range filter first narrows the candidate set to a `valid_urls` list, which is then passed into the FAISS search so it only ranks chunks whose source event falls within that window. Event embeddings are built from a composite string (title, date, location, description), encoded with `all-MiniLM-L6-v2`, L2-normalized, and stored in an `IndexFlatIP` cosine-similarity index alongside a JSON metadata sidecar. On the ingestion side, tying Kafka offset commits to the success of both the SQLite write and the FAISS rebuild step gives the pipeline fault-tolerant replay behavior if either step fails mid-batch.",

    challenges: [
      {
        title: "Keeping Semantic Search Time-Aware",
        description:
          "A pure vector search over events can surface something semantically similar but months out of date. I solved this by having a SQL date-range query narrow the candidate set first, then passing only those valid event URLs into the FAISS search — so the vector index only ever ranks within events that are actually relevant to the requested time window.",
      },
      {
        title: "Committing Kafka Offsets Safely",
        description:
          "If the consumer committed offsets right after reading a message, a crash between the SQLite write and the FAISS rebuild could leave the search index stale with no way to detect it. I tied offset commits to both downstream writes succeeding, so a failure anywhere in that chain causes the consumer to replay the batch from the last successful point on restart, rather than silently losing an update.",
      },
      {
        title: "Integrating Three Independently-Built Subsystems",
        description:
          "The curriculum RAG pipeline, the dining/chatbot stack, and the events/Kafka layer were each built by different people with different assumptions about schemas and interfaces. Getting all three wired into one Streamlit app that routes correctly meant reconciling those interfaces and debugging the seams between subsystems, not just building any one piece in isolation.",
      },
    ],

    techStack: [
      { name: "Python", category: "Language" },
      { name: "Apache Kafka", category: "Streaming / Messaging", note: "KRaft mode, no ZooKeeper; single topic with typed batch messages" },
      { name: "SQLite", category: "Database", note: "menu_items and campus_events tables" },
      { name: "FAISS (faiss-cpu)", category: "Vector Search", note: "IndexFlatIP, cosine similarity via L2-normalized embeddings" },
      { name: "Sentence-Transformers", category: "Embeddings", version: "all-MiniLM-L6-v2", note: "384-dimensional vectors" },
      { name: "Groq API", category: "LLM Inference", note: "Llama-3.3-70B-Versatile for intent routing and answer generation" },
      { name: "Streamlit", category: "Frontend", note: "Chat UI built by a teammate" },
      { name: "icalendar / python-dateutil", category: "Data Ingestion", note: "ICS calendar parsing with timezone normalization" },
      { name: "curl_cffi", category: "Data Ingestion", note: "Chrome impersonation to access the dining API" },
      { name: "NumPy", category: "Numerical Computing" },
    ],

    keyResults: [
      {
        label: "Events processed per Kafka batch",
        value: "1,067",
      },
      {
        label: "Events persisted & indexed",
        value: "1,072",
        note: "In SQLite and as 384-dimensional FAISS vectors",
      },
      {
        label: "FAISS retrieval latency",
        value: "< 50 ms",
        note: "Exhaustive IndexFlatIP search on CPU",
      },
      {
        label: "Events FAISS rebuild time",
        value: "~14 seconds",
        note: "Full re-encode and rebuild of 1,067 events, triggered automatically on new Kafka batches",
      },
      {
        label: "Groq inference speed",
        value: "~280 tokens/sec",
        note: "Reported as 3–4× faster than comparable GPT-4o/Claude inference at the time of testing",
      },
      {
        label: "Total records across all data sources",
        value: "2,200+",
        note: "Combined dining, events, and curriculum records across the full system",
      },
    ],

    impactsAndKeyTakeaways:
      "The most useful pattern to come out of this project was combining structured SQL filtering with vector search rather than treating them as alternatives — using SQL to establish what's temporally valid before FAISS ranks by relevance meaningfully cut down on the chatbot confidently citing an event that had already happened. Tying Kafka offset commits to downstream write success was a small design choice that made the ingestion pipeline resilient to partial failures without needing a separate dead-letter queue. The system runs on localhost with the producer triggered manually rather than on an automated schedule, and there's no usage data or deployment beyond local testing — the value here was in designing and integrating a coherent multi-source retrieval architecture, not in production traffic.",

    media: [
      "/projects/campus-assistant/architecture-diagram.png",
      "/projects/campus-assistant/streamlit-chat-ui.png",
      "/projects/campus-assistant/kafka-pipeline-flow.png",
      "/projects/campus-assistant/events-faiss-index.png",
    ],

    githubUrl: "https://github.com/Somanyloopholes/College-LLM-based-chatbots",
  },
  {
    id: "confidential-ml-federated-learning",
    title: "ConfidentialML: Privacy-Preserving Federated Learning",
    shortDescription:
      "A containerized federated learning system combining Paillier homomorphic encryption with Gaussian differential privacy, so multiple clients can jointly train a logistic regression model without the server — or any other party — ever seeing raw data or plaintext model updates.",
    coverImage: "/projects/confidential-ml/cover.png",
    skills: [
      "Python",
      "Federated Learning",
      "Homomorphic Encryption",
      "Differential Privacy",
      "Flask",
      "Docker",
      "Distributed Systems",
    ],
    role: "Co-built with one other contributor, roughly equal (~50/50) split across the codebase — server orchestration, client-side training/encryption/DP logic, Docker-based multi-container deployment, and the final report and presentation. The team worked feature-branch by feature-branch (FedAvg, homomorphic encryption, ML implementation, differential privacy), so component-level ownership isn't individually tracked.",

    problemStatement:
      "How can multiple parties collaboratively train a machine learning model when they can't share their private data with each other and can't fully trust the central server coordinating the training? This is a real constraint in regulated or adversarial settings — a consortium of banks that can't pool customer data across institutions for fraud detection, or allied organizations that need a shared model without exposing classified inputs to one another. ConfidentialML is a technical demonstration of an architecture for that problem, not a deployed system for either use case.",

    architecture:
      "A Flask server orchestrates training rounds and aggregates encrypted updates without ever decrypting them, while any number of Flask clients each hold their own private data. All traffic is JSON over HTTP on a Docker bridge network. Encrypted model weights flow between server and clients, but Paillier private keys are distributed peer-to-peer between clients and never touch the server. The whole stack — server plus a configurable number of clients — is spun up via Docker Compose, with all training and privacy parameters exposed as environment variables.",

    methodology:
      "Each round follows a fixed lifecycle: clients register with the server, and once a minimum number have joined, the server randomly elects one as Leader. The Leader generates a 2048-bit Paillier keypair, sends the public key to the server, and distributes the private key directly to the other clients (with late joiners picked up via the Leader's key-sharing endpoint). In each training round, selected clients decrypt the current global model, train a from-scratch logistic regression locally, L2-clip their weight update, add Gaussian noise for differential privacy, re-encrypt with the Paillier public key, and send it back. The server performs weighted Federated Averaging directly on the ciphertexts — exploiting Paillier's additive homomorphism — so it aggregates updates without ever decrypting a single one. This repeats for a configurable number of rounds, after which each client decrypts the final model locally to evaluate it.",

    challenges: [
      {
        title: "Aggregating Without Ever Decrypting",
        description:
          "The server needed to perform Federated Averaging across all client updates while never having access to the decryption key. This meant implementing weighted aggregation as pure ciphertext arithmetic — scalar multiplication and addition on Paillier-encrypted numbers — exploiting the cryptosystem's additive homomorphism rather than any conventional aggregation approach.",
      },
      {
        title: "Keeping Keys Away from the Server",
        description:
          "For the server to remain untrusted, private keys could never pass through it. That pushed key distribution into a peer-to-peer pattern where a randomly elected Leader client generates the keypair and shares the private key directly with other clients — including handling clients that join late, after the initial key generation has already happened.",
      },
      {
        title: "Composing Privacy Loss Across Rounds",
        description:
          "A single round's differential privacy noise doesn't capture the total privacy cost of training over many rounds. We implemented Rényi Differential Privacy accounting to track composed epsilon across rounds, with clients halting training if the running privacy budget would exceed the configured target — turning a one-shot privacy guarantee into an enforced multi-round budget.",
      },
    ],

    techStack: [
      { name: "Python", category: "Language", version: "3.9" },
      { name: "Flask", category: "Backend Framework", note: "Powers both server and client HTTP endpoints" },
      { name: "Paillier (phe)", category: "Cryptography", note: "2048-bit keys; additive homomorphic encryption" },
      { name: "NumPy", category: "Numerical Computing" },
      { name: "pandas", category: "Data Handling" },
      { name: "scikit-learn", category: "ML Utilities", note: "Preprocessing and evaluation metrics" },
      { name: "Docker / Docker Compose", category: "Infrastructure", note: "Multi-container deployment, scalable client count" },
      { name: "Requests", category: "Networking" },
      { name: "pytest", category: "Testing", note: "24-test suite covering HE, DP, and FedAvg correctness" },
      { name: "GitHub Actions", category: "CI/CD", note: "flake8 + pytest + gated Docker build" },
    ],

    keyResults: [
      {
        label: "Optimal privacy budget (ε)",
        value: "2",
        note: "Identified as the best tradeoff point between privacy and model accuracy",
      },
      {
        label: "Clipping norm / noise multiplier",
        value: "C = 10, multiplier = 1.5",
      },
      {
        label: "Paillier key size",
        value: "2048-bit",
      },
      {
        label: "Concurrent clients tested",
        value: "5",
        note: "Max tested via Docker Compose scaling; not benchmarked beyond this",
      },
      {
        label: "Automated test suite",
        value: "24 tests",
        note: "Covers HE round-trips, homomorphism properties, DP formulas, and RDP composition; run via GitHub Actions CI",
      },
    ],

    impactsAndKeyTakeaways:
      "As a proof-of-concept rather than a deployed system, the clearest result is a confirmed one: lowering the privacy budget (ε) measurably reduces model accuracy — the privacy-utility trade-off playing out directly in a working system rather than just in theory. Building both the homomorphic aggregation and the differential privacy accounting side by side made that trade-off concrete instead of abstract. The system was only tested up to 5 concurrent clients, so claims about larger-scale behavior would need further benchmarking, and no formal privacy proof accompanies the implementation — it applies well-established DP and HE formulas rather than proving new guarantees.",

    media: [
      "/projects/confidential-ml/architecture-diagram.png",
      "/projects/confidential-ml/round-lifecycle.png",
      "/projects/confidential-ml/docker-compose-setup.png",
      "/projects/confidential-ml/ci-pipeline.png",
    ],
  }
];
