# Profile & Tech Stack CRUD Tasks

## 1. Database Schema
- [x] Update `schema.prisma` with `heroDesc`, `aboutTitle`, `aboutFocus`, `aboutLocation`, `techStack`, and `aboutImageUrl` fields
- [x] Push database changes and generate Prisma client types (`npx prisma db push` & `generate`)

## 2. Server Backend
- [x] Update `profile.controller.ts` with new fields and `/upload-image` handler
- [x] Expose `/upload-image` route on server router
- [x] Configure Cloudinary helper in `cloudinary.helper.ts` and set `.env` credentials
- [x] Refactor CV, About Image, and Project Thumbnail uploader endpoints to save to Cloudinary and clean up disk

## 3. Frontend API & Type definitions
- [x] Update `Profile` types in `userApi.ts` and React Query hooks
- [x] Update dynamic rendering in `Hero.tsx` and `About.tsx`
- [x] Modify image src loaders to support absolute Cloudinary URLs
- [x] Set section container backgrounds to transparent to let WebGL particles show through page sections
- [x] Add backdrop-blur filter overlays to section containers to make text highly readable over active particles
- [x] Optimize preloader count speed (reduce duration to 1.4s) and dispatch the animation trigger `onStart` of the slide-out overlay to make Hero page entries snappy and immediate
- [x] Add dynamic group-hover transitions to the profile biography photo container to restore original vibrant colors and scale slightly on hover
- [x] Sequentialize Hero subtitle and description entries to animate in staggered order and apply the moving color sweep gradient animation to both blocks
- [x] Sequentialize Hero action button ("ENTER SYSTEM OVERVIEW") to animate up at the end of the text reveal timeline sequence
- [x] Unify the page styles by adding the colorful gradient wind-sweep animation (`hero-subtitle-wind`) to all primary page headers (`About` heading, `Projects` heading, and `Footer` contact heading)
- [x] Add sequential bottom reveal GSAP scroll triggers to the section headers in `Projects.tsx` and contact elements in `Footer.tsx`
- [x] Bind scroll-scrub triggers (`trigger: container, start: 'top top', end: 'bottom top', scrub: 1`) to all section titles (`About.tsx`, `Projects.tsx`, and `Footer.tsx`) to scale down (`scale: 0.85`) and fade out (`opacity: 0.3`) dynamically as you scroll past them, exactly like `Hero.tsx`
- [x] Resolve GSAP state conflict where scroll scrub animations recorded initial `opacity: 0` states from entry timelines on page load by refactoring exit triggers from `gsap.to` to `gsap.fromTo` and explicitly forcing start properties to `opacity: 1`
- [x] Wrap heading text elements inside entrance container divs so that the entry timeline reveals the container, and the exit scrub timeline scales the inner heading. This completely eliminates any state clash and makes the page scroll entry animations play beautifully
- [x] Clean up the Handshake exit scrub trigger as it sits at the bottom of the page and cannot scroll past the viewport, preventing the footer title from fading out prematurely
- [x] Set `toggleActions: 'play reset play reset'` on all section entry triggers (About, Projects, and Footer elements) to reset and replay the entry animation sequences every single time the user scrolls back into the viewport region

## 4. CMS Dashboard
- [x] Separate status states (`heroStatus` and `profileStatus`) and map them to localized save forms
- [x] Add separate image CRUD section to upload and preview biography cover image
