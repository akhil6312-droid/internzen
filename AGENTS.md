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
- **Parent Card Overflow Invariant (`overflow-visible`)**: Any parent card, metric banner, or container hosting an `(i)` trigger button MUST use `relative overflow-visible` (never `overflow-hidden`), preventing CSS bounding box clipping of the `z-[9999]` popover.
- **Desktop Popover (`>= 768px`)**: Render a Motion spring-physics popover mounted with `z-[9999] pointer-events-auto`, styled with solid high contrast as `max-w-xs w-72 sm:w-80 p-3.5 rounded-xl shadow-2xl bg-slate-900 text-slate-100 text-xs border border-slate-700 text-left` with outside-click dismissal. Trigger container must have `z-30` when active.
- **Mobile Modal Fallback (`< 768px`)**: Never render floating CSS tooltips on mobile that risk boundary cutoffs. Clicking `(i)` on mobile must open a centered dialog or bottom sheet in a full-screen backdrop (`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm`).

## Modal & Drawer Architecture Invariants
When creating or updating modal dialogs or slide-out drawers in this workspace:
- **Overlay Constraints**: Modals must be mounted in `fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto` with backdrop-click dismissal (`onClick={(e) => e.target === e.currentTarget && onClose()}`).
- **Slide-Out Drawers**: Slide-out drawers must mount at `fixed inset-0 z-[100]` with `bg-black/60 backdrop-blur-sm`, explicit backdrop click dismissal, and `custom-scrollbar` on the scrollable container.
- **Container Bounds**: Modal shell must use fluid bounded dimensions: `relative w-full max-w-lg (or max-w-2xl) max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-auto`.
- **Pinned Close Button ('X')**: Pinned to the top-right of the non-scrolling header (`absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-200 cursor-pointer p-2 rounded-lg hover:bg-slate-800/50`) so it is never pushed offscreen or scrolled away.
- **Scrollable Modal Body**: Wrap inner contents below the header in `<div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">` with fixed/shrink-0 headers and footers to keep controls accessible on all display heights (1080p, 720p, laptops, mobile).

## Client-Side Data Integrity & Storage Resilience
- **Defensive Structure Validation**: Never assume `JSON.parse(localStorage.getItem(...))` returns valid data. Always validate:
  * Collections: `Array.isArray(parsed) ? parsed : DEFAULT_COLLECTION`
  * Objects: `parsed && typeof parsed === 'object' && parsed.id ? parsed : null`
- **Auto-Repair & Self-Healing**: If corrupt or malformed entries are detected, immediately repair and re-persist default seed values rather than throwing unhandled runtime exceptions.

## Cloud Database Integration & Real-Time Sync Invariants
When connecting external cloud databases (e.g. Supabase, Firebase) in this workspace:
- **Dual-Tier Resilience (Cloud-First Fallback)**:
  * Always attempt cloud hydration on app boot.
  * If the network request fails, times out, or returns an empty collection, seamlessly fall back to local seed/persistent records (`getAllJobs()`) without throwing unhandled errors or rendering blank feeds.
- **Dedicated Schema Translation Layer**:
  * Isolate raw database row structures from application domain models via explicit mapping functions (e.g. `mapSupabaseRowToJob`).
  * Convert raw database fields (e.g. comma-delimited `skills`) into validated domain structures (`JobRequirement[]`) with deterministic 100% total weight distributions.
- **Real-Time Deduplication & Channel Lifecycle**:
  * In `postgres_changes` subscription callbacks, check for existing records by unique ID before updating React state to prevent duplicate card rendering.
  * Always clean up channel subscriptions on component unmount (`supabase.removeChannel(channel)`).
- **Asynchronous Submit Guards (`isSubmitting`)**:
  * Form controls publishing records to cloud databases must implement `isSubmitting` guards to disable submission triggers during in-flight network requests and display active progress indicators.

## Universal Day/Night Theming & Tailwind v4 Opacity Invariants
When implementing or modifying UI elements across light/dark themes:
- **No Hardcoded Dark Cards in Light Mode**: Preview cards, ticker statistics, and interactive widgets must dynamically adapt:
  * Dark: `bg-slate-900/90 border-slate-800 text-slate-100 backdrop-blur-xl`
  * Light: `bg-white border-slate-200 text-slate-900 shadow-xl`
- **Multi-Role Theme Propagation**: Pass `currentTheme` to all top-level view containers (e.g. `StudentView`, `RecruiterView`). Ensure sub-components (candidate cards, job selectors, filter pills, inputs) dynamically toggle between Light and Dark styles with high contrast.
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

## Cloud Authentication & Session Lifecycle Invariants (Supabase / Firebase Auth)
When implementing or modifying cloud authentication and session handling in this workspace:
- **Immediate Ingress on Registration (`data.user`)**:
  * When a candidate or recruiter registers, pass domain metadata (`name`, `role`, `college`, `specialization`, `company`, `designation`, `batch`) in `options.data`.
  * If `data.user` is returned, immediately synthesize the active domain user model, persist the session, close the auth modal, and navigate directly to the customized dashboard with a welcome toast.
- **Dedicated Auth-to-Domain Translation Layer**:
  * Isolate cloud auth user objects from application domain models via explicit mapping functions (e.g., `mapSupabaseUserToRegisteredUser`).
  * Reconstruct domain profiles (`RegisteredUser`, `StudentProfile`) from `user.user_metadata` while retaining existing local records (applied jobs, verified competencies, progress score).
- **Dual-Tier Authentication Resilience (Local Demo Fallback)**:
  * Attempt cloud authentication first. If cloud sign-in fails or the network is unreachable, gracefully fall back to local registered records and 1-click hackathon demo accounts (`student@internzen.com`, `recruiter@internzen.com`) so judges and evaluators are never locked out.
- **Persistent Session & Cross-Tab Auth Synchronization**:
  * Hydrate active sessions on app mount via `supabase.auth.getSession()`.
  * Subscribes to `supabase.auth.onAuthStateChange` to prevent reloads from logging the user out and keep multi-tab state synchronized.
  * Explicitly handle `SIGNED_OUT` events in `onAuthStateChange` to purge local storage and redirect all tabs back to the public landing page.
- **Toast Feedback for Authentication Failures**:
  * Failed login attempts must display a prominent warning toast (`"Invalid email or password"`) alongside inline modal error alerts for high visibility across all screen sizes.

## Strict Role-Based Persona Separation & Access Invariants
When implementing or modifying multi-persona dashboards (Student vs. Recruiter):
- **No Universal Mode Switcher in Authenticated Views**: Never render universal role-switching toggles or sliders in navbars or footers once a user is authenticated. Dashboards must strictly lock to `currentUser.role`.
- **Candidate Interface Isolation**: When viewing as a student/candidate, completely hide all recruiter capabilities (e.g. "+ Post New Job", opening creators, candidate leaderboards, shortlist controls). Candidates should only see their job feed, skill diagnostics, learning tracks, and "My Applications".
- **Recruiter Interface Isolation**: When viewing as a recruiter, hide candidate job application triggers. Recruiters focus exclusively on "My Posted Jobs", "+ Post New Job", applicant metrics, and candidate evaluation pipelines.
- **Guest Ingress to Role Onboarding**: If an unauthenticated guest attempts recruiter-only actions (such as clicking "Post a Job" or "Post a Job / Hire Talent"), immediately prompt them to register specifically as a recruiter via `onOpenAuth('signup', 'recruiter')`.

## Brand Contrast & Jargon-Free UX Copy Invariants
- **High-Contrast Brand Typography in Light Mode**: Never hardcode static white text (`text-white`) on brand titles or navbar logos. Always use dynamic theme-adaptive classes (`text-slate-900 dark:text-white font-bold`) so brand identities remain prominent across both Light and Dark themes.
- **Plain-English UX Terminology**: Eliminate academic, corporate, or internal jargon in favor of direct, human-readable terms:
  * Replace *"Placement Intelligence"* $\rightarrow$ *"Job Portal"*
  * Replace *"Post Skill-First Internship"* or *"Recruitment Workflow"* $\rightarrow$ *"Post a New Job"*
  * Replace *"Skill Requirements & Weights"* $\rightarrow$ *"Required Skills"*
  * Replace *"satisfied"* $\rightarrow$ *"matched"*
  * Replace *"Deterministic Skill Decomposition"* $\rightarrow$ *"Skill Breakdown & Weights"*
  * Tagline must remain clear and inviting: *"Find your dream internship or hire top student talent."*

## Recruiter Job Ownership & Empty State Invariants
When implementing or modifying recruiter job management and dashboards:
- **Strict Recruiter Job Isolation**:
  * In `RecruiterView`, "My Posted Jobs" must only include openings where `job.recruiterEmail === currentUser.email` (or `job.recruiter_email === currentUser.email`) or `job.recruiterId === currentUser.id` (or `job.user_id === currentUser.id`).
  * Global seed/sample jobs and openings published by other hiring partners must never appear in "My Posted Jobs" or increment the recruiter's "Active Job Openings" KPI count.
- **Empty State UX & First-Action Ingress**:
  * When `myPostedJobs.length === 0`:
    * Suppress/hide job selector pill tags.
    * Render a prominent empty state card with:
      - Heading: `"No Jobs Posted Yet"`
      - Description: `"You have not published any internship listings yet. Start attracting candidates now!"`
      - Primary CTA Button: `"+ Post Your First Recruitment"` (`min-h-[44px]`), launching `JobCreatorModal`.
    * Guard candidate ranking leaderboards against `null` active jobs by rendering an informative placeholder card advising the recruiter to publish their first opening to see candidates scored against required skills.
- **Job Creation Ownership Association & Persistence**:
  * When creating a job in `JobCreatorModal`, automatically attach the authenticated recruiter's credentials: `recruiter_email: currentUser.email` and `recruiterId: currentUser.id`.
  * Persist the record directly to the cloud database (`supabase.from('jobs').insert`) and local state.
  * Automatically set the newly created job as the active selected job so that the recruiter immediately sees candidate rankings, while real-time listeners broadcast the opening to the public Student feed.
