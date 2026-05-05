# WasteStream AI UI Build Prompt

Create a polished, production-quality frontend for **WasteStream AI**, an AI marketplace for waste trading and recycling.

## Objective

Build a complete UI flow in `@web` with the following pages:

- Home page
- Login page
- Signup page
- Onboarding flow
- Dashboard

The UX must guide users from landing to authenticated onboarding, and only allow dashboard access after onboarding is complete.

## Product Context

WasteStream AI helps waste providers and recyclers connect through AI-assisted waste classification, pricing, and matching.

The product should feel practical, trustworthy, and startup-ready, not experimental.

## Required Routes and Flow

Implement and connect these routes (or equivalent route structure in the project):

- `/` -> Home
- `/login` -> Login
- `/signup` -> Signup
- `/onboarding` -> Role-specific onboarding
- `/dashboard` -> Protected dashboard

User flow rules:

1. Unauthenticated user can access Home, Login, and Signup.
2. Authentication is Google-only (no email/password form fields).
3. After sign-in, user must complete onboarding before entering dashboard.
4. If onboarding is incomplete and user tries to access dashboard, redirect to onboarding.
5. If onboarding is complete, allow dashboard access.

## Page Requirements

### 1) Home Page

Must include:

- A simple hero section with a clear primary CTA.
- Bento-box style feature sections explaining what WasteStream AI does.
- A simple footer.

Suggested hero message direction:

- "AI marketplace for waste providers and recyclers."
- CTA examples: "Get Started", "Join as Recycler", "Join as Provider".

### 2) Login and Signup Pages

Requirements:

- Clean, modern auth card layout.
- Google Auth as the only authentication option.
- No email input, no password input, no forgot-password flow.
- Clear links between login and signup screens.

### 3) Onboarding (Mandatory Before Dashboard)

Role selection is required:

- Recycler
- Waste Provider

Render role-specific forms after selection.

#### Recycler Onboarding Fields

- Full name
- Age
- Location (use location REST API/source available in the project)
- Recycling company/agency name
- Recycling company website (optional)
- Bio/description
- Types of waste collected (multi-select): plastic, scrap, nylons
- Profile picture upload

#### Waste Provider Onboarding Fields

- Full name
- Age
- Location
- Types of waste likely to trade
- Profile picture upload
- Bio/description

Validation expectations:

- Required fields must show clear error states.
- Optional fields should be labeled optional.
- Form submission should provide loading/success feedback.

### 4) Dashboard

Requirements:

- Simple sidebar navigation layout.
- Clean, modern content area with cards/sections.
- Mobile-responsive behavior with usable navigation on small screens.
- Empty states and placeholder sections are acceptable if backend data is not ready.

## Design System and Styling Constraints

- Use **Bricolage Grotesque** as the primary font.
- Use **shadcn/ui** components.
- Use **lucide-react** for icons.
- Apply a **bento-box visual pattern** across sections where appropriate.
- Follow design direction from `@/public/design_references_samples`.

Design quality expectations:

- Consistent spacing scale and typography hierarchy.
- Good contrast and accessible button/input states.
- Reusable UI patterns across pages (cards, buttons, form fields, section headers).

## Responsiveness Requirements

Support at minimum:

- Mobile (~320px and up)
- Tablet
- Desktop

Ensure:

- Navigation remains usable on mobile.
- Forms remain readable and easy to complete on small screens.
- Bento sections stack gracefully on smaller breakpoints.

## Implementation Guidance

- Keep components modular and reusable.
- Separate page-level layout components from shared UI components.
- Keep auth state and onboarding completion checks centralized.
- Use route guards/middleware/layout checks so dashboard protection is enforced consistently.

## Acceptance Criteria

The task is complete only if all conditions below are satisfied:

1. Home page includes hero, bento feature sections, and footer.
2. Login and signup pages are Google-auth only (no email/password fields).
3. Onboarding supports role selection and role-specific fields exactly as defined.
4. Dashboard cannot be accessed without completed onboarding.
5. Dashboard uses a sidebar layout and is mobile responsive.
6. Bricolage Grotesque, shadcn/ui, and lucide-react are used in the implementation.
7. Styling reflects bento-inspired design and references from `@/public/design_references_samples`.
8. UI is coherent, modern, and consistent across all pages.

## Deliverable

Return:

- Implemented pages and components.
- Any required route protection/onboarding guard logic.
- Brief notes on where each requirement is implemented.
