# Project Overview

Biome is a business that sells microbiome test kits directly to consumers, similar to 23andMe. When users receive the test kit, they scan a QR code that directs them to the Biome Progressive Web App (PWA). On the PWA, users can register an account, complete a basic questionnaire to help Biome understand their skin better, and activate their kit by following instructions. After activating the kit, users ship it back for analysis. Once the experiment is complete, Biome provides users with a detailed report accessible through the PWA. This report breaks down their microbiome results, offers insights about their skin, and recommends skincare ingredients and products tailored to their needs.

## Feature Requirements

### Tech Stack

- Frontend Framework: Next.js (App Router)
- Database: Supabase
- UI Library: Shadcn/UI
- State Management: React Context or Zustand (optional for complex state)
- Styling: Tailwind CSS
- Icons: Lucide Icons
- Deployment: Vercel
- Progressive Web App: next-pwa plugin with Service Worker and manifest setup
- Authentication: Firebase

### User Flow and Features

#### 1. Login and Registration

- Users can create an account or log in using Google, Facebook, or email/password authentication.
- After logging in, users are directed to an info setup page where they fill in their name, date of birth, gender, and optionally upload a profile picture. Once completed, they are redirected to the home page.

#### 2. Home Page

Displays user-specific data:

- Key indexes: Biological Skin Age, Microbiome Balance Score.
- List of reports with links to view detailed data.
- Navigation bar at the bottom with tabs for Home, Feed, Scan, Shop, and Profile.
- A profile section at the top with the user's picture and a personalized greeting (e.g., "Hi, FirstName").
- A "Got your test kit?" card linking to a secondary page for activating the kit and starting the swab process.
- Key indexes section displays trends if the user has test data, otherwise shows N/A. Includes a "Show all indexes" tab for viewing more.
- Below this, a list of reports is displayed.

#### 3. Test Kit Activation Flow

Step 1: User taps on the "Got your test kit?" card.
- Secondary page displays two options: "Activate your kit" and "Swab Time!"

Step 2: User selects "Activate your kit," which redirects to the questionnaire page.
- A progress bar at the top shows completion progress for the questions.
- Includes preset questions like "How often do you exfoliate your skin?" and "Do you experience breakouts?"
- Question types include text input, multiple choice, and "choose all that apply."
- Progress is saved after each question. The "Activate your kit" card shows a progress bar, and the button changes to "Continue."
- Users can go back to previous questions to change their answers.

Step 3: After completing the questionnaire, users are shown an "All done!" page with a button to view swabbing instructions. This redirects to the "Swab Time!" page.
- Users can also access this page directly from the "Swab Time!" card if needed.
- Provides step-by-step guidance for swabbing skin, with a progress bar tracking each step. The final step includes a "Ship" button to mark completion.

#### 4. Report Detail Flow

Users receive a detailed microbiome report, accessible through the PWA:
- Breakdown of microbiome composition percentages.
- Skin trait scores such as Antioxidant Capacity and Sensitivity Response.
- Recommendations for skincare ingredients and supplements tailored to their skin's microbiome.

## Tech Requirements

### General Requirements

- Use Next.js App Router for routing and page management.
- Maintain best practices for React component structure and Tailwind CSS styling.

### PWA Setup

next-pwa:
- Enable Service Worker for offline capabilities.
- Configure caching strategies for static assets and API responses.
- Use Supabase to store user data, microbiome details, and questionnaire responses.
- Set up authentication through Firebase.

Configure tables for:
- User Info
- Test Kit Details
- Questionnaire Responses
- Reports
- Microbiome Data

### Deployment

- Deploy on Vercel.
- Ensure PWA features work post-deployment, including offline mode and installability.

## Rules

### Naming Conventions

- Use PascalCase for React components (e.g., UserCard.tsx).
- Use camelCase for variables and functions (e.g., handleClick).
- Use kebab-case for filenames (e.g., user-card.tsx).

### Next.js Best Practices

- Use dynamic imports for large components to improve performance.
- Leverage API routes for server-side logic when necessary.
- Optimize images with the Next.js Image component.

### File Structure Best Practices

- Keep components modular and reusable.
- Organize components by feature or domain.
- Place utility functions in a lib/ directory.
- Maintain a public/ directory for static assets like icons and images.
- All new pages must be placed in /app.
- All new components must go in /components/ui/.
- Maintain consistent coding standards with ESLint and Prettier.

Note: for specific UI design, please refer /requirements/figma-screenshots


## Current File Structure
BIOME_PWA/
├── .next/
├── my-app/
│   ├── .next/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   ├── components/
│   │   └── ui/
│   │       └── button.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── public/
│   │   ├── icons/
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon-32x32.png
│   │   │   ├── icon-192x192.png
│   │   │   ├── icon-512x512.png
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── manifest.json
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   ├── window.svg
│   ├── requirements/
│   │   ├── figma-screenshots/
│   │   │   └── login.png
│   │   └── instruction.md
│   ├── .gitignore
│   ├── components.json
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.js
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   ├── tailwind.config.ts
│   └── tsconfig.json