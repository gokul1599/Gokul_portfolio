# Cinematic redesign — implementation notes

Implemented in the existing static HTML/CSS/JavaScript repository. No framework migration or new runtime dependencies.

## Source organization

- `cinematic-scene.js`: reusable Three.js installation factory. Transparent box geometry, inset glass edges, faceted emissive core, wire lattice, procedural glow texture, three orbital satellites, deterministic particles, and a lit pedestal. Pointer parallax and scroll-linked camera/geometry movement.
- `cinematic-motion.js`: finite Web Animations entrances and IntersectionObserver section reveals. Content is visible when scripting is unavailable.
- `cinematic.css`: shared cinematic design, distinct project layouts, responsive adjustments and accessible overlay visibility.
- `assets/crystal-fallback.svg`: lightweight static installation for reduced motion, Read Mode, and WebGL failures.
- `script.js`: retained site interactions and lab integration; replaced legacy global WebGL scene, removed custom cursor loop, made spring physics settle instead of animating at rest, and added keyboard spring controls.
- Existing `style.css` and `premium.css` remain the base styles. Case studies load the shared cinematic stylesheet.

## Runtime strategy

Three.js loads only when the installation approaches the viewport and motion is enabled. Reduced motion and Read Mode do not load it initially. Rendering stops outside the scene, in a hidden document, and in calm modes. The scene caps rendering resolution, lowers particles and geometry segments on compact layouts, and uses procedural light sprites rather than a bloom pipeline or video. Resize observers and scene resources are disposed on navigation. The native cursor and normal document scrolling remain intact.

Product descriptions, project destinations, four case-study routes, resume, contact links, command palette, recruiter summary, and lab demonstrations are preserved. The material calibrator updates the hero installation; its explanatory text now tells visitors where to inspect changes.

## Verification completed

- Node syntax checks: main script, new scene/motion modules, and data registries.
- Seven-page local link/fragment, duplicate-ID, image-alt and JSON-LD checks: passed.
- Storage-blocked mode regression test: passed.
- Desktop browser: hero, work, about, lab, stack, journey and contact inspected; navigation and active markers checked.
- Command palette toggles Read Mode; scene diagnostics confirmed calm, running and paused states.
- OCR preset, pipeline stage selection and keyboard spring interaction exercised without console errors.
- Four case studies and resume rendered at 903px without broken images or horizontal overflow.
- Phone fixtures at 390px and 320px (375px and 305px content area with scrollbars): no document overflow after fixing intrinsic grid sizing in the atlas and laboratory.
- Simulated WebGL creation failure: static crystal remained loaded and visible; render state reported fallback.
- Responsive navigation opens, moves focus to its first link, and closes.
- Reduced-motion fixture: static fallback visible, canvas hidden, Three.js not requested.
- Existing local audit scripts and browser fixtures live in ignored `scratch/`; `.vercelignore` excludes them from deployment.

## Limits

This repository has no package manifest, TypeScript configuration, build step, or lint command; those checks are not applicable. No Lighthouse score, real-device battery benchmark, screen-reader certification, or complete cross-browser matrix is claimed. Product previews remain the existing clearly labeled illustrative HTML demonstrations, not newly captured screenshots of external apps. The procedural installation follows the supplied art direction; it is not a pixel-identical reproduction of the reference render.

Publication target: github.com/gokul1599/Gokul_portfolio and the existing linked Vercel project.


