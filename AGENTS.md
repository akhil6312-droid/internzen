# Workspace Rules

## Subfolder Prototyping & Standalone Demos
When creating standalone prototypes, demo interfaces, or experimental static web pages (HTML/CSS/JS) in this workspace:
- Always scaffold them inside a dedicated subfolder (e.g., `login-page/`, `prototypes/<name>/`, `demos/<name>/`).
- Never place standalone prototype files directly into the root directory, which is reserved for the primary React / Vite / TypeScript application.
- Keep subfolder prototypes self-contained with their own scripts, styles, and documentation (`README.md`).

## Windows PowerShell & Tooling Invariants
- **Package Management (`winget`)**: Always append `--accept-source-agreements --accept-package-agreements --silent` to `winget` commands to prevent background task hangs on agreement prompts.
- **NPM Execution**: Always invoke `npm.cmd` or `npx.cmd` (instead of bare `npm` or `npx`) to avoid PowerShell script execution policy blocks (`npm.ps1` restrictions).
- **Session PATH Consistency**: If running package installs or builds that trigger child compiler scripts (e.g., `esbuild` post-install), ensure the current session path is explicitly populated:
  `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH`

## Agent Skills & Customization Structure
- When adding or syncing multi-skill bundles (such as Google Stitch skills):
  - Retain plugin definitions in `.agents/plugins/<plugin_name>/`.
  - Mirror constituent skills directly into `.agents/skills/<skill_name>/` so they appear in Antigravity's progressive disclosure catalog.

## Mobile-First Responsive & UI Invariants
When developing or refactoring UI components in this workspace:
- **No Rigid Pixel Widths**: Replace fixed pixel widths (e.g. `w-[500px]`, `w-[800px]`) with fluid responsive containers (`w-full max-w-4xl mx-auto` or `w-full max-w-2xl mx-auto`).
- **Minimum Tap Target Height (44px)**: All interactive controls (buttons, chips, inputs, selectors, dropzones) must have at least 44px height (`min-h-[44px]`) on mobile devices.
- **Table-to-Card Responsive Transformation**: Never render dense multi-column tables on mobile viewports (`< 768px`). Use responsive pairings: desktop table (`hidden md:block`) alongside touch-friendly vertical cards (`md:hidden space-y-3`).
- **Grid-to-Vertical Stack**: Multi-column opportunity feeds and dashboards must collapse to a single-column vertical stack on mobile: `flex flex-col space-y-4 md:grid md:grid-cols-2 md:gap-5 md:space-y-0`.
- **Navbar Responsive Sub-Strips**: When navbars contain persona/role switchers and multiple action buttons, collapse the mode switcher into a dedicated horizontal sub-bar on mobile (`sm:hidden px-3 py-2 border-t border-slate-800/80 bg-slate-950/95 flex items-center justify-between`) rather than crowding the main 64px header.

## Universal Self-Explanatory Info `(i)` Guidance System
- **Inline Placement**: Place `(i)` info trigger icons inline directly next to the role, skill, or metric title with proper spacing (`inline-flex items-center ml-1.5 sm:ml-2`).
- **Desktop Popover (`>= 768px`)**: Render a Motion spring-physics popover mounted with `z-[9999] pointer-events-auto`, styled with solid high contrast as `max-w-xs w-72 sm:w-80 p-3.5 rounded-xl shadow-2xl bg-slate-900 text-slate-100 text-xs border border-slate-700 text-left` with outside-click dismissal. Trigger container must have `z-30` when active.
- **Mobile Modal Fallback (`< 768px`)**: Never render floating CSS tooltips on mobile that risk boundary cutoffs. Clicking `(i)` on mobile must open a centered dialog or bottom sheet in a full-screen backdrop (`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm`).

## Modal Architecture & Viewport Containment Invariants
When creating or updating modal dialogs in this workspace:
- **Overlay Constraints**: Modals must be mounted in `fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto` with backdrop-click dismissal (`onClick={(e) => e.target === e.currentTarget && onClose()}`).
- **Container Bounds**: Modal shell must use fluid bounded dimensions: `relative w-full max-w-lg (or max-w-2xl) max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-auto`.
- **Pinned Close Button ('X')**: Pinned to the top-right of the non-scrolling header (`absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-200 cursor-pointer p-2 rounded-lg hover:bg-slate-800/50`) so it is never pushed offscreen or scrolled away.
- **Scrollable Modal Body**: Wrap inner contents below the header in `<div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">` with fixed/shrink-0 headers and footers to keep controls accessible on all display heights (1080p, 720p, laptops, mobile).

## Universal Day/Night Theming & Tailwind v4 Opacity Invariants
When implementing or modifying UI elements across light/dark themes:
- **No Hardcoded Dark Cards in Light Mode**: Preview cards, ticker statistics, and interactive widgets must dynamically adapt:
  * Dark: `bg-slate-900/90 border-slate-800 text-slate-100 backdrop-blur-xl`
  * Light: `bg-white border-slate-200 text-slate-900 shadow-xl`
- **Tailwind v4 Opacity Handling**: Tailwind v4 arbitrary opacity background classes (e.g. `bg-slate-900/90`, `bg-slate-950/60`) do not match simple `.bg-slate-900` selectors in raw CSS. Always pair them with dynamic theme condition ternaries (`isDark ? '...' : '...'`) or wildcard attribute selectors (`[class*="bg-slate-900/"]`, `[class*="bg-slate-950/"]`) in `index.css` to prevent dark card bleed in Light Mode.

## Skill Gap Remediation & Career Intelligence Architecture
- **3-Track Platform Model**: Every missing skill card must display at least 3 distinct curated platform tracks:
  1. *Video Track*: FreeCodeCamp / YouTube Playlist badge with estimated watch duration (e.g. "2h 30m").
  2. *Interactive Course Track*: Coursera Free Audit / NPTEL / Kaggle Learn direct module link with module count.
  3. *Documentation / Notes Track*: Official Docs or PDF Cheat Sheet direct link with read duration.
- **Instant Match Recalculation**: Always pair remediation tracks with a live action button (`"Mark Module Completed (+X% Match)"`) that immediately updates the student's profile, recalculates the linear match score, updates progress gauges, and allows "what-if" reversal.

## Native Document Upload & Strict Verification
- **Native OS Dialog**: File uploads must connect to a native file input (`<input type="file" accept=".pdf,.doc,.docx" />`) accessible via click on the dropzone or explicit "Browse File" button.
- **Strict Verification**: Validate document extension (`.pdf`, `.docx`, `.doc`), MIME type, and size ($\le 10\text{ MB}$) with human-readable error alerts before permitting application dispatch.

## TypeScript Cleanliness & Build Hygiene
- In this workspace, `noUnusedLocals: true` and `noUnusedParameters: true` are strictly enforced.
- Never leave unused React imports (e.g. unused `useState`), helper variables, or unreachable code that fails `tsc` during `npm.cmd run build`.

## React Callback Refs & TypeScript Hygiene
- **Void Return on Callback Refs**: In modern React and strict TypeScript, callback refs must return `void` or `undefined`.
  * Always use block bodies: `ref={(el) => { inputRefs.current[i] = el; }}`
  * Never use concise arrow returns: `ref={(el) => (inputRefs.current[i] = el)}` as this returns the assigned element (`HTMLInputElement | null`), causing `error TS2322: Type '...' is not assignable to type 'void | (() => VoidOrUndefinedOnly)'`.

