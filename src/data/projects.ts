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
  figmaUrl?: string;
}

export const skillsList = [
  "All",
  "Python",
  "Java",
  "JavaScript",
  "C#",
  "C++",
  "SQL",
  "R",
  "Docker",
  "Flask",
  "Apache Kafka",
  "REST apis",
  "Git",
  "FAISS",
  "Scikit-learn",
  "Pandas",
  "Numpy",
  "RAG",
  "LLM Integration",
  "Spatial Analysis",
  "Network Science",
  "Louvain Clustering",
  "Data Visualization",
  "Federated Learning",
  "Homomorphic Encryption",
  "Differential Privacy",
  "React",
  "TypeScript",
  "Tailwind",
  "Vite",
  "Streamlit",
  "Figma",
  "Figma MCP",
  "UI/UX",
  "Linux",
  "Jira",
  "Unity",
  "Meta XR SDK",
  "Unity XR SDK",
  "Open XR",
  "VR"
];

export const projects: Project[] = [
  {
    id: "sidportfolio-engineering",
    title: "Portfolio - Engineering the interface",
    shortDescription:
      "A React, TypeScript SPA with physics-based motion, a scroll-driven timeline, and a markdown-powered case-study system.",
    coverImage: "/portfolioEngineeringCover.png",
    skills: [
      "React",
      "TypeScript",
      "Tailwind",
      "Vite"
    ],
    role: "Solo developer: architecture, component design, animation systems, and build tooling.",

    problemStatement: `
![Screenshot of the portfolio home page](/screenshots/portfolioEngineer1.png)

Most portfolio sites either ship a handful of static pages or bolt animation on top as an afterthought, and that usually shows up as jank on scroll, inconsistent transition timing, or a data model that can't hold a real case study without breaking. I wanted one codebase that could support a growing set of detailed, markdown-rendered case studies, page-to-page navigation that reads as intentional rather than decorative, and a component layer strict enough in TypeScript that adding new sections wouldn't quietly introduce bugs.`,

    architecture: `**Shell:** \`main.tsx\` is the entry point. It sets up the router (four nested routes, so \`/projects\`, \`/experience\`, and \`/contact\` are all real URLs rather than one page faking navigation) and wraps the whole app in \`ReactLenis\`, a library that smooths out scroll so it eases instead of jumping in raw pixel steps. \`App.tsx\` owns everything visible around the actual page content: the background pattern, the nav bar, the dock at the bottom, and the animated area where pages swap in and out. It's the one place in the codebase that knows what order the pages come in, which matters for the next part.

**Routing and transitions:** Every time you navigate, the app needs to decide whether the new page should slide in from the left or the right, and that decision has to feel consistent no matter which two pages you're moving between. \`App.tsx\` keeps a \`routeOrder\` array (just the pages in their intended left-to-right order) and a ref that remembers the last page you were on. On every navigation it compares the new page's position in that array against the old one, and that comparison becomes a direction: left or right. That direction gets handed off to \`AnimatePresence\`, a Framer Motion component whose job is to let a page finish animating out before the next one mounts, so you never get a jarring cut. I'm using it in \`popLayout\` mode specifically, which means the outgoing and incoming pages don't fight each other for layout space while both are briefly on screen. I wrote this direction logic by hand instead of reaching for a page-transition library, since the actual computation is small and having full control over it made the timing easier to get right.

**Content layer:** All the project and case-study data lives in one typed file, \`data/projects.ts\`, not a CMS or an API. The site is fully static by design, so the projects page just filters that array in the browser against whichever skill tags are active, and the case-study modal renders each project's text fields through \`react-markdown\`, a library that turns markdown syntax into actual styled HTML, with a custom set of components so paragraphs, links, images, and lists all match the site's type system instead of looking like default browser markdown.

**Motion primitives:** The contact card and the timeline both skip Framer Motion's built-in animation presets and build directly on its lower-level hooks instead: \`useMotionValue\` (a value that can update every frame without triggering a React re-render), \`useSpring\` (which smooths a value's changes so it eases like a physical spring instead of snapping), and \`useTransform\` (which maps one animated value onto another, like turning mouse position into a rotation angle). That's the difference between the card tilt and the timeline's scroll tracking feeling like they're actually responding to you in real time, versus just playing a canned animation.`,

    methodology: `I built the routing and transition shell before any real page content existed, since getting slide direction and mount and unmount timing right is the kind of thing that's painful to fix later once pages have their own internal state to worry about. Everything after that got built and reviewed one section at a time: dock, contact card, timeline, project grid, rather than standing up whole pages at once. That made it a lot easier to catch layout regressions while they were still small.

For styling, I picked Tailwind CSS v4 specifically because it has native support for CSS custom properties, since the site's colors and spacing needed to live as real design tokens rather than one-off values scattered across components. For animation, Framer Motion's hook-based API won out over plain CSS transitions because a few interactions, the card tilt and the timeline's scroll-linked line especially, need continuous values that update every frame rather than jumping between a few fixed states.

TypeScript is configured in strict mode, with \`noUnusedLocals\`, \`noUnusedParameters\`, and \`noFallthroughCasesInSwitch\` all turned on. I kept that on through the whole build instead of loosening it to move faster. The case-study data model in particular has enough optional fields that loose typing would have let rendering bugs slip through unnoticed.`,

    challenges: [
      {
        title: "Directional transitions without a transition library",
        description:
          "Rather than pull in a page-transition package, I wrote the `routeOrder` comparison by hand in `App.tsx` so I could control exactly how direction gets computed and keep the dependency count down. The tradeoff is that adding a new top-level page means remembering to register it in that order array too. It's a real constraint, but a documented one rather than a hidden trap.",
      },
      {
        title: "Height tracking for the scroll-driven timeline",
        description:
          "The timeline component started from an open-source layout primitive, but its default height calculation didn't hold up against this site's content, since entries here can vary a lot in length. I rewrote the height logic using `ResizeObserver` (a browser API that watches an element and fires whenever its size changes) against the first and last icon on the timeline, plus a custom helper that walks up the chain of offset parents by hand. The default approach for measuring an element's position breaks once a parent has a CSS transform applied to it, which is exactly the situation the page transitions create, so I had to work around that directly.",
      },
      {
        title: "3D tilt without a 3D library",
        description:
          "The business card's tilt and glare are done entirely with CSS transforms driven by Framer Motion's motion values, no three.js or WebGL involved. That kept the bundle small, but it meant hand-tuning the spring settings and the depth layering myself to get the parallax to actually read as physical instead of just tilted.",
      },
      {
        title: "A flexible but type-safe case-study data model",
        description:
          "Case studies vary a lot in how much detail they have. Some fields are fully written out, others are still placeholders. Modeling that with a mix of required and optional TypeScript fields, while keeping the modal's rendering logic simple, took a few passes before the interface struck the right balance between staying flexible and actually catching missing-data bugs at compile time instead of at runtime.",
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
        note: "Lenis smooth scroll",
      },
      { name: "react-markdown", category: "Content Rendering", version: "10.1.0" },
      { name: "shadcn/ui", category: "Component Primitives", version: "4.13.0" },
    ],



    impactsAndKeyTakeaways: `Building the transition and data layers first, before any content existed, paid off. Every new page and case study since has slotted into a structure that was already there instead of needing its own one-off logic. The biggest lesson was around motion specifically: reaching for Framer Motion's raw hooks instead of its animation presets took more upfront tuning, but it gave a lot more control over how the tilt, the scroll tracking, and the dock magnification actually feel, and that matters more on a portfolio than almost anywhere else. I'd make the same tradeoff again: hand-write the pieces that need to feel exact, and only reach for a library when the problem is genuinely generic.`,

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
    coverImage: "/portfolioDesignCover.png",
    skills: [
      "Figma",
      "UI/UX",
      "Figma MCP"
    ],
    role: "Solo designer: visual identity, token architecture, and the Figma-to-code handoff structure.",

    problemStatement: `Most portfolio sites default to the same palette: near-black background, a blue accent, done. I wanted something that read as a deliberate identity instead of a default, without tipping into the kind of maximalism that stops being legible. The harder version of the problem was that the system couldn't just work on one page. It needed to survive being pulled onto a LinkedIn banner, rendered inside a GitHub README in both light and dark themes, and even reproduced on actual hardware (my Windows accent color and my keyboard RGB are both set to match it now). A system that only works on one background isn't really a system.`,

    architecture: `**Color:** Five Figma variables, which are named color values you define once and reuse everywhere instead of retyping a hex code on every element. They're kebab-cased (hyphenated, like \`primary-bg\`) so multi-word names stay readable: \`primary-bg\` (#131314), \`secondary-text\` (#F4F4F5), \`tertiary-text\` (#A1A1AA), \`hero-accent\` (#A6D800), and \`surface-dock\`, a 15% tint of the background used specifically for the dock's glass-like surface. Four neutrals and exactly one accent color. That restraint is the actual design decision, not a limitation.

**Type:** A role-based scale instead of a size-based one, meaning each style is named for what it does (\`display-hero\`, \`section-heading\`, \`sub-heading\`, \`title-small\`, \`body-prose\`, \`body-emphasis\`, \`micro-tag\`, \`statement-mono\`) rather than its pixel value. There's a parallel mobile scale too, and it recalculates line height and size per style rather than just shrinking everything down by the same percentage.

**Layout:** Every frame in the Figma file uses auto layout, Figma's system for defining spacing and sizing as real structure rather than elements placed by eye. That structure is what actually survives the handoff into code. A design file that only shows a finished result forces a developer to guess at the spacing, one built with auto layout documents the intent directly.

**Handoff:** The path from design to code runs Figma to Figma MCP to Antigravity. Figma MCP is a bridge that lets an outside tool read a Figma file's variables, styles, and layout structure directly, instead of a developer manually describing the design in a prompt. Antigravity is the tool on the other end that turns that structure into actual code. The free tier of Figma MCP only allows 6 tool calls a month, which rules it out as something you'd query continuously while designing. So I built the workflow around that limit instead of fighting it: pull the full variable and style set once, save it directly into the site's CSS as reusable style variables, and treat that file as the source of truth from then on. I only go back to Figma MCP when the token set itself actually changes.`,

    methodology: `I settled on the color scheme before I built a single token. The five-variable, one-accent structure came after that decision, not before it. That ordering mattered, since it meant the system was built to express a choice I'd already made, instead of being assembled first and colored in afterward.

The palette itself pushes back against the usual portfolio defaults. I wanted a strict monotone base with exactly one accent doing all the work, in the spirit of how accessible color-pairing tools like randoma11y treat contrast: deliberately, not decoratively. I paired that with a willingness to let the one accent actually be loud, which is closer to what I took from Bungie's *Marathon* art direction, vibrant, graphic, and unapologetic about being the focal point of every frame it shows up in. The result is a system that's quiet everywhere except the one place it isn't.

Typography followed the same logic. Geist Mono carries the bold display moments, the same instinct behind Palantir using a heavy, technical-feeling font for its hero type. Inter handles body copy, where actual readability matters more than character. JetBrains Mono is reserved for anything meant to read as code or a system statement.

This wasn't my first real pass at the visual direction, either. I built the site out in glassmorphism first and got far enough to actually sit with it before realizing it read as generic, a style every other portfolio was already doing rather than a specific choice of my own. I killed that direction and rebuilt around the current graphic, typography-led system instead of trying to salvage what I had.`,

    challenges: [
      {
        title: "Reconciling loud and quiet influences",
        description:
          "Marathon's art direction and an accessibility-first color tool pull in opposite directions. One wants maximum visual energy, the other wants restraint and legibility above everything else. I resolved it by scoping where each one gets to win. The accent color is allowed to be loud because it's the only color in the system, while everything else, the four neutrals, the type scale, the grid, stays disciplined enough that the one loud decision actually reads as a decision instead of noise.",
      },
      {
        title: "Killing the glassmorphism direction",
        description:
          "I had a working glassmorphism pass before this system existed. It looked fine, and it also looked like every other portfolio site right now. Recognizing that and starting over from a different point mattered more to how the site turned out than any individual visual refinement inside either direction would have.",
      },
      {
        title: "Working around the Figma MCP free-tier cap",
        description:
          "A 6-tool-call-per-month cap makes it impossible to treat Figma MCP as something you query on demand while designing. I restructured the workflow around that limit instead of working against it: one deliberate full export, saved into the site's CSS, treated as canonical until the token set itself actually changes.",
      },
      {
        title: "Making one identity hold across four different surfaces",
        description:
          "The same five-token, one-accent system has to read correctly across four very different places: the site itself, where I have full control over the background; a LinkedIn banner, locked to a fixed aspect ratio and sitting in a feed next to everything else; a GitHub README, rendered in both GitHub's light and dark themes, outside my control; and physical hardware, my Windows accent color and keyboard RGB, with far less color accuracy than a browser gives you. Keeping the system simple, one accent, four neutrals, was what made it portable across constraints that were this different from each other in the first place.",
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

    impactsAndKeyTakeaways: `Designing for four surfaces instead of one forced a kind of discipline that designing for a single page never would have. A system that only survives on one background isn't really a system, it's just a page. The decision that mattered most wasn't any single color or font choice. It was killing the glassmorphism direction early instead of polishing something that was fundamentally the wrong starting point. On the handoff side, the clearest lesson was that Antigravity could only rebuild what the Figma file actually made legible. Named variables, auto layout structure, and a genuinely small token set did more for the Figma-to-code pipeline than any amount of prompting would have.`,

    media: [
      // TODO: Figma variables panel, typography scale panel, project-page mockup, before/after glassmorphism comparison
    ],

    figmaUrl: "https://www.figma.com/design/6SdfRR2rv8q3cSsxJH8GHT/PortfolioWebsiteDesignDoc?node-id=1-3&t=dCFCO7OKrv6OcYA8-1",
  },
  {
    id: "signpose-vr",
    title: "SignPoseVR - Learn ASL in VR",
    shortDescription:
      "A controller-free VR app for learning ASL alphabets and digits on Meta Quest, with real-time hand-tracking feedback.",
    coverImage: "/SignPoseCover.png",
    skills: ["C#", "Unity", "VR", "Meta XR SDK", "Unity XR SDK", "Open XR"],
    role: "Solo project: designed, built, and published the full application to the Meta Horizon Store.",
    problemStatement:
      `
![In-game view showing hand pose detection](/screenshots/signPoseVR1.png)

Learning the ASL alphabet and numbers usually means a 2D app or a YouTube tutorial. Both can show you the correct hand shape, but neither can tell you whether the shape you're actually making matches it. That's the gap I wanted to close. Quest's hand tracking let me skip controllers entirely and have someone practice with their actual hands, getting feedback the moment they get a sign right instead of just guessing and moving on.`,
    architecture:
      `**Runtime:** The app sits on top of OpenXR, which is the runtime actually doing the hand tracking underneath everything. Meta XR SDK sits one layer above that, exposing hand tracking as an OpenXR extension rather than replacing it (the Oculus XR Plugin is bundled in the package too, but it's not the active loader, just leftover baggage from the SDK install).

**Data layer:** Above that runtime, the app's content is organized as three layers of data, each one built on the layer below it. A \`Hand Shape\` asset is the bottom layer: one per sign, 36 total, storing per-finger curl and spread conditions with tolerance ranges, so a real hand doesn't have to match the shape pixel-perfectly. A \`PoseWithImage\` asset wraps one hand shape together with its reference image and text description, basically one flashcard. A single \`PoseLibrary\` asset holds all 36 of those flashcards in one array the rest of the app reads from. Because everything here is data rather than code, adding a 37th sign later would just mean creating new assets, no scripts to touch.

**Gameplay loop:** Two controllers run the actual gameplay. \`LearnModeController\` is the higher-level one: it picks a random flashcard from the library, keeps score in Quiz mode, and makes sure the same sign never repeats twice in a row. \`DynamicGestureController\` does the harder job of actually checking whether your hand matches the sign on screen, and it's where the interesting engineering problem lives.

**The reflection trick:** Meta XR SDK ships a component called \`StaticHandGesture\` that checks a hand against one specific pose, set once in the Unity editor with no way to change it while the app is running. That's fine for two or three fixed gestures wired up by hand, but it doesn't scale to 36 signs that all need to swap in and out as the user cycles through them. Rather than build 36 separate copies of that component, I used C# reflection to reach into its private fields (\`m_HandShapeOrPose\`, \`m_HandPose\`) and re-run its own internal setup methods (\`OnEnable\`, \`Initialize\`), which lets me swap which pose a single evaluator is checking for at runtime. One reusable component ends up doing the job of 36.

**Putting it together:** From there the loop is event-driven. The SDK fires events when a gesture starts and stops matching, \`DynamicGestureController\` counts how many of the five finger conditions are currently satisfied, and once a match holds steady for 0.8 seconds straight, it fires its own \`PoseMatched\` event. That triggers the visual payoff (the border cubes around the hand swap to a glowing material), bumps the score if you're in Quiz mode, and hands control back to \`LearnModeController\` to pick the next sign.`,
    methodology:
      `I built this sign by sign instead of trying to solve gesture recognition as one big abstract problem. Each hand shape started as a rough tolerance range, and I tightened it over repeated rounds of putting the headset on, making the sign myself, and adjusting the curl and spread thresholds per finger until it stopped triggering on close-but-wrong shapes and stopped missing correct ones. Signs like P, G, and H needed an extra condition on top of finger shape, since what actually distinguishes them is which way the palm is facing, not just which fingers are curled.

I also ran a small, informal round of testing: 4 to 5 people trying the app cold. The main thing I was checking for was tolerance settings that felt fine to me (since I'd been making these signs myself for weeks) but were actually too strict or too loose for someone seeing the correct hand position for the first time.

Early on I also built a custom Unity editor for \`PoseSelectorRuntime\`, the component responsible for picking which pose asset a given scene object represents. Wiring up all 36 pose references by hand through Unity's default inspector was slow enough that I kept making mistakes, so I replaced it with a dropdown populated straight from the pose library, which made authoring and testing each sign a lot faster.`,
    challenges: [
      {
        title: "Choosing the right layer of the Meta stack for gesture matching",
        description:
          "My first pass used Meta XR SDK's higher-level, out-of-the-box gesture tooling. It gets you gesture detection running fast, but it's built around wiring up a handful of predefined gestures by hand in the Inspector, not scaling to three dozen distinct signs. Rather than switch runtimes entirely, I dropped down a layer: `StaticHandGesture` is a lower-level Meta XR SDK component, still running on the same OpenXR-backed hand tracking, that evaluates a single hardcoded pose. I gave up the convenience of the higher-level tool in exchange for a component I could manipulate directly, which is what led to the reflection-based pose injection described above."
      },
      {
        title: "Real-time hand tracking without controllers",
        description:
          "Meta's hand tracking is good but noisy. A hand passing briefly through the correct shape on its way to a different pose could register as a false match. The fix was the 0.8 second hold timer: a match only counts once the gesture is sustained, and the coroutine cancels immediately if it's lost mid-hold. That one change did more for reliability than any amount of finger-tolerance tuning."
      },
      {
        title: "Gesture recognition across natural variation",
        description:
          "No two people hold their hand exactly the same way for a given sign, and Quest's tracking has its own jitter on top of that. Each hand shape defines per-finger curl and spread with upper and lower tolerance bounds instead of a single target value, and a few signs needed an added palm-orientation check since they're differentiated by rotation as much as finger position. Getting these tolerance bands loose enough to accept real variation, but tight enough to reject a different letter, took more iteration than anything else in the project."
      },
      {
        title: "VR interaction design without a controller pointer",
        description:
          "Most VR UI assumes you have a controller to point and click with. Here the only input is the hand itself, so Learn and Quiz modes had to communicate state through the scene instead of menus: reference images float in view for Learn mode, the border material glows on a correct match, and Quiz mode just hides the reference and tracks score. Keeping both modes legible without a cursor was as much a design problem as a technical one."
      },
      {
        title: "Keeping standalone Quest hardware smooth",
        description:
          "Quest runs on mobile-class chips, so anything I'd take for granted on desktop VR (real-time lighting, uncapped draw calls) was a performance risk. I baked lighting into lightmaps ahead of time instead of computing it live, built on Universal Render Pipeline for its lighter overhead, and kept the classroom scene simple. The app holds a steady 60fps on Quest hardware as a result."
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
      "The reflection-based pose injection was the biggest technical risk in the project. It depends on private SDK internals that aren't part of Meta's public API, so an SDK update could break it without warning. It worked for this build, but it's a trade-off worth naming rather than glossing over. On accessibility, controller-free hand tracking lowers one barrier to entry, but the app still has no colorblind-friendly alternative to the glow feedback, no audio cues, and only English text. Those would be the clearest next steps if I picked this back up.",
    media: [

    ],
    githubUrl: "https://github.com/Somanyloopholes/SignPoseVR",
    liveUrl: "https://www.meta.com/experiences/24069781642651333/"
  },
  {
    id: "spatial-inequality-cook-county",
    title: "Neighborhood Evolution in Cook County",
    shortDescription:
      "A decade-long spatial network analysis tracking how Cook County neighborhoods shift between seven distinct typologies — built with KNN similarity graphs and Louvain community detection instead of fixed administrative boundaries.",
    coverImage: "/CookCountyCover.png",
    skills: [
      "R",
      "Spatial Analysis",
      "Network Science",
      "Louvain Clustering",
      "Data Visualization",
    ],
    role: "2 man team - Built end-to-end with co-contributor, working together across the full pipeline from data ingestion through the network analysis and final visualization, rather than split by fixed component ownership.",

    problemStatement: `![Cluster map results comparing 2013, 2018, and 2023 typologies](/screenshots/cookCounty1.1.png,/screenshots/cookCounty1.2.png,/screenshots/cookCounty1.3.png)\n\nNeighborhood-level inequality in the Chicago metro area is usually studied through fixed administrative boundaries like Community Areas, and those boundaries can mask change that happens gradually and doesn't respect a line on a map. We built similarity-based network graphs of Census block groups instead, using multivariate sociodemographic features to connect each block group to the ones most like it, then applied Louvain community detection to surface neighborhood typologies that emerge from the data itself rather than from administrative lines. Tracking how individual block groups move between those typologies across three time periods exposes gentrification, decline, and stabilization patterns that boundary-based analysis tends to miss.`,

    architecture: `**Data collection:** The pipeline starts by pulling 24 variables from the Census Bureau's American Community Survey (ACS), plus tract-level poverty data pulled separately since it isn't available at the block group level. A block group is the smallest geography the Census publishes detailed data for, typically a few hundred to a few thousand people, small enough to capture real neighborhood-level variation instead of averaging it away. Data comes in for three years: 2013, 2018, and 2023.

**Building the spatial base:** Those ACS numbers get joined to 2020 TIGER/Line block group boundaries, the Census Bureau's official geographic shape files, so every year of data sits on the same consistent map instead of drifting as boundaries get redrawn between census cycles. From the raw ACS counts we compute 11 derived ratios (poverty rate, percent renter, bachelor's-plus attainment, and others), each with a safe-division check so a block group with zero population doesn't cause a divide-by-zero error downstream. Chicago crime counts and CTA rail accessibility get layered in next, crime through a spatial join that counts incidents falling inside each block group's boundary, rail access through a distance matrix measuring how far each block group's center sits from the nearest station.

**Aggregation and visualization:** Block groups get aggregated up to Community Areas (Chicago's official neighborhoods) and Municipalities (for suburban Cook County), weighted by population so a dense block group counts more than a sparse one. Every variable gets mapped as a choropleth, a map where each region is shaded by its value for that variable, alongside a histogram showing the same data as a distribution. That runs for all three years individually, then again as percent-point change maps between year pairs, so you can see not just where values are high, but where they moved the most.

**Network construction and clustering:** This is the core of the analysis. For each year, we take 8 socioeconomic and housing variables per block group and build a k-nearest-neighbors graph, a network where each block group connects to the 8 other block groups most similar to it across those variables, regardless of whether they're geographically adjacent. Louvain community detection, a network science algorithm that finds tightly connected clusters within a graph, runs on top of that network to surface groups of block groups that behave like a shared neighborhood type. We ran this independently for each of the three years, then mapped the raw cluster outputs onto 7 consistent, human-readable labels, things like Elite & Wealthy, Working-Class Transitional, and High-Poverty, so the same neighborhood type can be tracked as it changes over the decade instead of getting relabeled from scratch every year.

**Longitudinal tracking:** The final stage builds transition matrices, tables showing how many block groups moved from each meta-cluster to each other one between year pairs, and turns those into alluvial flow diagrams, the kind of chart where colored bands flow from one category into another across time, so the whole decade of change reads as one continuous picture instead of three disconnected snapshots.`,

    methodology: `![Alluvial diagram showing neighborhood typology transitions](/screenshots/cookCounty2.png)\n\nThe 8 variables that go into clustering (Hispanic population share, bachelor's-plus attainment, median home value, median age, median household income, crime count, unemployment rate, and poverty rate) get z-score normalized first, meaning every variable is rescaled based on how far each value sits from the average. Without that step, a variable like median home value, which can range into the hundreds of thousands, would dominate the distance calculation over something like unemployment rate, which lives in the single digits as a percentage.

From there we compute the distance between every pair of block groups and keep each one's 8 closest matches, which becomes the k-nearest-neighbors graph. We symmetrize the edges afterward, since a block group being one of your 8 closest matches doesn't automatically mean you're one of theirs, and an undirected graph needs that relationship to run both ways.

Louvain runs independently on each year's graph, and that independence creates a real problem: it assigns cluster IDs arbitrarily, so cluster 3 in the 2013 run has no relationship to cluster 3 in 2018 even if they represent the same kind of neighborhood. We handled that by building year-specific lookup tables that map each year's raw cluster IDs onto the same 7 meta-cluster labels, based on comparing each cluster's actual profile (its average income, poverty rate, and so on) across years. That's what makes it possible to say a block group moved from High-Poverty to Working-Class Transitional between 2013 and 2018, instead of just reporting that it moved from cluster 4 to cluster 2.`,

    challenges: [
      {
        title: "Reconciling Heterogeneous Data Sources",
        description:
          "The Census API, Chicago's crime data portal, and CTA's rail station data all come in different formats with different geographic precision and their own quirks. Getting all three onto the same 2020 block group base, consistently across three separate years, took up most of the actual engineering time on this project. A few candidate data layers didn't make it in at all, since the gaps in their coverage were bad enough that including them would have hurt the analysis more than it helped.",
      },
      {
        title: "Interpreting Unlabeled Clusters Across Years",
        description:
          "Louvain hands you numbered clusters with no inherent meaning, and those numbers reset with every run. Turning cluster 4 in one year and cluster 1 in another into the same trackable label meant actually reading each cluster's profile and deciding what it represented, then documenting that mapping so the seven meta-clusters stayed consistent across the whole decade instead of drifting.",
      },
      {
        title: "Choosing a Similarity Metric Over Fixed Boundaries",
        description:
          "Community Areas and other administrative boundaries are convenient but arbitrary from a data standpoint. They can lump very different block groups together or split apart ones that are practically identical. Building a similarity graph instead meant writing the distance matrix and edge symmetrization logic ourselves rather than calling a single out-of-the-box clustering function, but it meant the clusters reflected actual similarity in the data instead of a line drawn for administrative reasons.",
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
      "![poster made for the project](/screenshots/cookCounty3.png)\n\nThe poster shown here summarizes the full analysis as presented, including the cluster maps across all three years side by side and the income, unemployment, and poverty distributions that fed into the clustering variables.\n\nThis was a two-person, self-directed project, not a deployed tool. There's no dashboard and no external users yet, and because Louvain clustering is unsupervised, there's no accuracy score to report the way there would be with a classification model. The value sits in the patterns the network-based approach surfaces, not in a single performance number. Building the pipeline end to end reinforced why similarity graphs are worth the extra effort over administrative boundaries: gentrification, decline, and stabilization all tend to happen gradually and across boundary lines, and a choropleth broken out by Community Area smooths right over that kind of change. The natural next step would be turning these static outputs into an interactive dashboard, so someone could actually explore the year-over-year transitions themselves instead of only seeing them as fixed flow diagrams.",

    media: [
      "/projects/spatial-inequality/cluster-map-2013.png",
      "/projects/spatial-inequality/cluster-map-2018.png",
      "/projects/spatial-inequality/cluster-map-2023.png",
      "/projects/spatial-inequality/alluvial-flow-2013-2023.png",
      "/projects/spatial-inequality/choropleth-median-income.png",
      "/projects/spatial-inequality/percent-point-change-map.png",
    ],
    githubUrl: "https://github.com/Somanyloopholes/Spatial-inequality-analysis",
  },
  {
    id: "iit-campus-assistant",
    title: "IIT Campus Assistant",
    shortDescription:
      "A hybrid RAG-SQL campus chatbot for Illinois Institute of Technology that ingests live dining menus and campus events over Apache Kafka, stores structured data in SQLite, builds FAISS vector indexes for semantic search, and uses Llama-3 (via Groq) to route and answer natural-language questions.",
    coverImage: "/campusAssistantCover.png",
    skills: [
      "Python",
      "Apache Kafka",
      "FAISS",
      "RAG",
      "SQL",
      "LLM Integration",
      "Streamlit",
    ],
    role: "Team effort - Built the real-time events pipeline (Kafka ingestion, SQLite persistence, FAISS indexing, and time-aware retrieval) and led integration across the team's three independently-built subsystems into one working app.",

    problemStatement: "![Streamlit app in action](/screenshots/campusAssitant1.png)\n\nUniversity students and prospective applicants need quick answers spanning three separate domains: dining menus, campus events, and academic or admissions information. The underlying sources are scattered across a dining API, an ICS calendar feed, and dozens of catalog and admissions web pages. The Campus Assistant consolidates all three into one natural-language interface, and it leans on structured retrieval rather than open-ended generation specifically to cut down on hallucinated answers.",

    architecture: "Ingestion (my work): Data comes in event-driven through Apache Kafka, a system for streaming data between services in real time rather than on a fixed schedule. A producer I built scrapes the DineOnCampus REST API and IIT's ICS calendar feed, then publishes typed batches, tagged either menu_batch or events_batch, to a shared Kafka topic (a named channel that other services can listen to). A consumer I also built listens on that topic and handles each batch by type: menu items get written straight to SQLite, while events get written to SQLite and then trigger an automatic rebuild of the events search index, so semantic search never falls out of date. Kafka offsets are essentially a bookmark of what's already been processed, and I only commit that bookmark once both the SQLite write and the index rebuild succeed. That means a crash partway through a batch doesn't silently lose or duplicate data, the consumer just replays cleanly from the last successful point on restart.\n\nEvents search index (my work): FAISS is a library for fast similarity search over vector embeddings, numeric representations of text that let a computer compare meaning rather than just matching exact words. I built the pipeline that reads events out of SQLite, builds a composite string for each one (title, date, location, and description combined), encodes it with a sentence-embedding model, and stores the result in an IndexFlatIP index, a FAISS index type built for cosine similarity search, alongside a metadata file that maps each vector back to its original event.\n\nCurriculum pipeline (teammate's work): In parallel, a separate batch pipeline built by a teammate crawls university web pages, cleans and chunks the content, and builds its own FAISS index for academic and admissions material. That side of the system isn't something I built, but it's worth naming since it's the third domain the chatbot has to route between.\n\nQuery-time routing: A Streamlit chat interface, built by a teammate, sends each question to an LLM-based intent router (also a teammate's work) that classifies the question as dining, events, or curriculum and pulls out structured filters like date or dietary preference. Dining questions and date-only event questions run as direct SQL lookups. Curriculum questions go through the teammate-built FAISS search. Topic-based event questions are where my constrained retrieval logic comes in: SQL narrows the candidate set by date first, and only then does FAISS rank within that narrowed set for relevance.",

    methodology: "The core pattern I built for events is constrained retrieval rather than pure semantic search. A plain vector search over events can easily surface something that's a close topical match but happened months ago or hasn't happened yet, since embedding similarity has no built-in sense of time. My fix runs the SQL date filter first, narrowing the candidate set down to a list of valid event URLs within the relevant window, and only passes that narrowed list into FAISS. The vector search never even sees an event outside the requested timeframe, so it can't rank one highly by accident.\n\nOn the ingestion side, tying Kafka's offset commits to both the SQLite write and the FAISS rebuild succeeding was a deliberate fault-tolerance choice. If either step fails mid-batch, the consumer doesn't move its bookmark forward, so it picks the batch back up cleanly on restart instead of leaving the search index quietly out of sync with what's actually in the database.",

    challenges: [
      {
        title: "Keeping Semantic Search Time-Aware",
        description:
          "A pure vector search over events can surface something semantically similar but months out of date, since embedding similarity has no concept of time on its own. I solved this by having a SQL date-range query narrow the candidate set first, then passing only those valid event URLs into the FAISS search, so the vector index only ever ranks within events that are actually relevant to the requested time window.",
      },
      {
        title: "Committing Kafka Offsets Safely",
        description:
          "If the consumer committed its offset right after reading a message, a crash between the SQLite write and the FAISS rebuild could leave the search index stale with no way to detect it. I tied offset commits to both downstream writes succeeding, so a failure anywhere in that chain makes the consumer replay the batch from the last successful point on restart instead of silently losing an update.",
      },
      {
        title: "Integrating Three Independently-Built Subsystems",
        description:
          "The curriculum RAG pipeline, the dining and chatbot stack, and the events and Kafka layer were each built by different people with different assumptions about schemas and interfaces. Getting all three wired into one Streamlit app that routes correctly meant reconciling those interfaces and debugging the seams between subsystems, which turned out to be a different kind of problem than building any one piece in isolation.",
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

    impactsAndKeyTakeaways: "![the assistant being asked a question about courses](/screenshots/campusAssistant2.png)\n\n![the assistant being asked a question about the dining options](/screenshots/campusAssistan3.png)\n\nThe most useful pattern to come out of this project was combining structured SQL filtering with vector search instead of treating them as alternatives to each other. Using SQL to establish what's temporally valid before FAISS ranks by relevance meaningfully cut down on the chatbot confidently citing an event that had already happened. Tying Kafka offset commits to downstream write success was a small design choice that made the ingestion pipeline resilient to partial failures without needing a separate error-handling system on top. The system runs on localhost, with the producer triggered manually rather than on a schedule, and there's no usage data or deployment beyond local testing. The value here was in designing and integrating a coherent multi-source retrieval architecture, not in production traffic.",

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
    title: "ConfidentialML",
    shortDescription:
      "A containerized federated learning system combining Paillier homomorphic encryption with Gaussian differential privacy, so multiple clients can jointly train a logistic regression model without the server — or any other party — ever seeing raw data or plaintext model updates.",
    coverImage: "/confidentialMLCover.png",
    skills: [
      "Python",
      "Federated Learning",
      "Homomorphic Encryption",
      "Differential Privacy",
      "Flask",
      "Docker",
    ],
    role: "2 man team - Co-built end-to-end with one other contributor, roughly equal split across server orchestration, client-side encryption and differential privacy logic, Docker deployment, and the final report.",

    problemStatement: "How can multiple parties train a machine learning model together when they can't share their private data with each other and can't fully trust the server coordinating the training? That's a real constraint in regulated or adversarial settings: a group of banks that can't pool customer data across institutions for fraud detection, or allied organizations that need a shared model without exposing classified inputs to one another. ConfidentialML is a technical demonstration of an architecture for that problem, not a deployed system for either use case.",

    architecture: "![Architecture](/screenshots/confidentialML1.png)\n\nThe players: A Flask server coordinates training rounds, and any number of Flask clients each hold their own private data. Everything communicates as JSON over HTTP on a Docker bridge network, meaning the whole system runs as separate containers that can talk to each other without being exposed to the outside world. Encrypted model weights move back and forth between the server and clients, but the encryption keys travel directly between clients and never touch the server at all.\n\nHomomorphic encryption: This is the property the whole design leans on. Paillier is an encryption scheme with a specific and unusual trait: you can add two encrypted numbers together and get a correctly encrypted sum, without ever decrypting either one. That means the server can combine every client's encrypted update into one combined model update while never seeing a single plaintext value.\n\nKey generation and distribution: Once enough clients register, the server randomly elects one of them as Leader. The Leader generates a 2048-bit Paillier keypair, a public key and a private key, sends the public key to the server, and shares the private key directly with the other clients. Clients that join after key generation already happened still get picked up through the Leader's key-sharing endpoint, so late joiners aren't left out.\n\nOne training round: Selected clients decrypt the current global model, train a logistic regression model from scratch on their own local data, and compute how much their local weights changed. Before sending that update anywhere, each client clips it (capping how large any single value in the update is allowed to be) and adds Gaussian noise on top, which is the actual differential privacy step, then re-encrypts the noised update with the Paillier public key and sends it to the server.\n\nAggregation without decryption: The server performs Federated Averaging, a weighted average of every client's update, directly on the encrypted values. Because of Paillier's additive property, that average comes out correctly encrypted without the server ever decrypting a single client's contribution. This repeats for a configurable number of rounds, and only at the very end does each client decrypt the final model locally to check how well it actually performs.",

    methodology: "Each round follows a fixed lifecycle. Clients register with the server, and once a minimum number have joined, the server randomly elects a Leader. The Leader generates the Paillier keypair, keeps the private key out of the server's hands entirely, and distributes it directly to the other clients instead, with a separate path for anyone who joins late.\n\nIn each round, selected clients decrypt the current global model, train locally, clip their update, add Gaussian noise for differential privacy, re-encrypt, and send the result back. The server then aggregates everything as ciphertext arithmetic, exploiting Paillier's additive property rather than decrypting anything to average it conventionally. That's the core mechanism that makes the whole system work: privacy isn't bolted on as a separate step, it's built into how the math itself gets done.\n\nA single round's noise doesn't capture the full privacy cost of training over many rounds, since each additional round leaks a little more information even with noise added every time. We implemented Rényi Differential Privacy accounting, a method for tracking that cumulative privacy cost across rounds, so a client halts training entirely if the running total would exceed the configured privacy budget. That turns a one-shot privacy guarantee into something enforced across the whole training run.",

    challenges: [
      {
        title: "Aggregating Without Ever Decrypting",
        description:
          "The server needed to perform Federated Averaging across every client's update while never having access to the decryption key at all. That meant implementing weighted aggregation as pure ciphertext arithmetic, scalar multiplication and addition performed directly on Paillier-encrypted numbers, rather than any conventional aggregation approach that assumes you can see the actual values.",
      },
      {
        title: "Keeping Keys Away from the Server",
        description:
          "For the server to stay untrusted, private keys could never pass through it, not even briefly. That pushed key distribution into a peer-to-peer pattern, where a randomly elected Leader client generates the keypair and shares the private key directly with the others, including handling clients that join late, after key generation has already happened.",
      },
      {
        title: "Composing Privacy Loss Across Rounds",
        description:
          "A single round's differential privacy noise doesn't capture the total privacy cost of training over many rounds. We implemented Rényi Differential Privacy accounting to track composed epsilon (the cumulative privacy loss) across rounds, with clients halting training if the running privacy budget would exceed the configured target. That turned a one-shot privacy guarantee into an enforced, multi-round budget instead.",
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

    impactsAndKeyTakeaways: "As a proof of concept rather than a deployed system, the clearest result is a confirmed one: lowering the privacy budget measurably reduces model accuracy, the privacy-utility tradeoff playing out directly in a working system instead of staying purely theoretical. Building the homomorphic aggregation and the differential privacy accounting side by side made that tradeoff concrete instead of abstract. The system was only tested up to 5 concurrent clients, so any claim about larger-scale behavior would need further benchmarking, and no formal privacy proof accompanies the implementation. It applies well-established DP and HE formulas rather than proving new guarantees of its own.",

    media: [
      "/projects/confidential-ml/architecture-diagram.png",
      "/projects/confidential-ml/round-lifecycle.png",
      "/projects/confidential-ml/docker-compose-setup.png",
      "/projects/confidential-ml/ci-pipeline.png",
    ],
    githubUrl: "https://https://github.com/CLEMS3/ConfidentialML.com/Somanyloopholes",
  },
  {
    id: "ieee-iit-style-guide",
    title: "IEEE@IIT Style Guide",
    shortDescription:
      "A unified design system reconciling IEEE's and Illinois Tech's brand identities into one practical style guide, then used to produce the chapter's on-brand event materials.",
    coverImage: "/IEEExIITcover.png",
    skills: [
      "Figma",
      "UI/UX"
    ],
    role: "Board Member, IEEE Student Chapter, Illinois Institute of Technology (Social Media & Community Engagement)",

    problemStatement: "![Style guide - color and typography](/screenshots/IEEExIIT1.png)\n\nMy actual board role covered social media and community engagement, not design, but running the chapter's Instagram and building materials for events meant constantly deciding how to represent two separate brands at once: IEEE's global identity and Illinois Tech's institutional identity, with no shared reference for how the two should actually be combined. Every new post or poster meant re-deciding the same things from scratch: which blue, which logo lockup, which pairing was actually correct. I built the style guide to settle that once, on my own initiative, since nothing about my actual role required it.",

    architecture: "The guide is built in four layers, each one building on the layer before it.\n\nColor: A primary palette plus a tint scale, meaning each core color also comes with a range of lighter and darker steps derived from it, so there's an approved way to use a lighter version of a brand color for something like a background or a hover state instead of someone picking an arbitrary shade by eye.\n\nType: A modular typographic scale, a type system where each size is calculated as a fixed ratio of the one before it rather than picked by feel, covering H1 through H5 plus body and small text. I documented the actual ratio and font sources directly in the guide, including links to the type specimen and the modular scale calculator I used, so anyone extending the system later isn't guessing at how the numbers were derived.\n\nLogo lockups: The core of the project. A lockup is a specific, pre-approved way of combining or positioning two logos together, and I built out a full matrix of them across light and dark backgrounds, individual marks, side-by-side combinations, and vertical stacks. Rather than leaving it to whoever's building a poster or Instagram post that week to decide how the two logos should sit next to each other, every valid combination already exists as a documented, ready-to-use asset. I applied that matrix directly to the chapter's actual Instagram presence, including profile picture variants and a recurring team-spotlight post template.\n\n![Style guide - some logo lockups](/screenshots/IEEExIIT2.png)",

    methodology: "I started by auditing both IEEE's and Illinois Tech's existing brand guidelines directly, checking clear space rules, approved color values, and lockup restrictions rather than working from memory or a rough sense of each brand, since getting a detail wrong risked misrepresenting either organization. From there I extracted the primary colors and typography into one shared token set both brands could sit inside of.\n\nOnce the core tokens existed, I defined interactive states, meaning how a component actually looks in its default resting state, on hover, and when disabled, for every reusable component in the system, and built out every approved logo pairing as its own separately documented lockup rather than leaving the combination rules open to individual judgment. I also wrote the guide with the next person in mind, not just myself: font sourcing notes, links to the tools I used, and the reasoning behind decisions, not just the decisions themselves, so whoever inherits this role after me isn't rebuilding it from scratch. The guide then went straight into use on real deliverables, chapter event posters and the chapter's Instagram account, instead of sitting as a reference document nobody actually opened.",

    challenges: [
      {
        title: "Reconciling two brand identities",
        description:
          "IEEE and Illinois Tech each have their own strict, independent brand guidelines, and neither one could be overridden by the other. The entire project came down to finding a structure, tint scales, lockup variants, explicit pairing rules, that respected both identities at once without either brand ending up looking secondary to the other.",
      },
      {
        title: "Getting brand usage actually right, not just close",
        description:
          "Both organizations have specific rules about clear space, minimum sizing, and which color combinations are actually approved. Getting this wrong wouldn't just look inconsistent, it could misrepresent either brand. I went through both sets of official guidelines directly rather than approximating from existing chapter materials, and built the token set and lockup matrix to match what was actually documented, not just what looked right at a glance.",
      },
      {
        title: "Making it usable by the whole board, and whoever comes after",
        description:
          "A style guide only actually helps if other people can pick it up and use it without having to ask me first, including future board members who take over this role after I graduate. That meant being explicit enough (pre-approved lockups, clearly defined component states, a full type scale, sourcing notes) that any board member, current or future, could pull directly from the guide and produce something on-brand without needing to check in.",
      },
    ],

    techStack: [
      { name: "Figma", category: "Design Tool" },
      {
        name: "Feather Icons",
        category: "Icon System",
        note: "Standardized at 24px with a 2px stroke weight",
      },
      {
        name: "Modular Scale",
        category: "Typography",
        note: "Ratio-based scale driving the H1–H5 and body sizing",
      },
    ],


    impactsAndKeyTakeaways:
      "![one of the team announcement posters](/screenshots/IEEExIIT3.png)\n\nThe guide gave the chapter a single source of truth for brand-compliant materials, which removed the recurring back-and-forth over which blue or which logo pairing was actually safe to use. It went beyond posters into the chapter's actual Instagram presence, including profile picture variants and a repeatable team-spotlight template. Posters and posts produced from the spec stayed visually consistent even when made weeks apart by completely different people.\n\nThe team-spotlight poster shown here is a direct example of the guide in practice: the primary color pulled straight from the token set, the IEEE Illinois Tech lockup used exactly as documented, and the typographic hierarchy following the same H1-to-body scale defined in the guide, not a one-off design made from scratch.\n\nThe bigger lesson was that a style guide is only as good as its second use. The hard part was never making the document itself look good, it was making the decisions inside it concrete and documented enough that someone else, including whoever holds this role after me, could actually apply them under a deadline without re-litigating brand choices or official guideline details from scratch.",

    media: [
      // Add screenshots of the style guide sections and the finished posters, e.g.:
      // "/projects/ieee-iit/style-guide-colors.png",
      // "/projects/ieee-iit/poster-1.png",
      // "/projects/ieee-iit/poster-2.png",
    ],
    figmaUrl: "https://www.figma.com/design/wGXjNCxbwX4mIP3iLWY920/IEEE-Design-doc?node-id=498-0&t=c7P2BjNe2LmJFvDY-1",
  }
];
