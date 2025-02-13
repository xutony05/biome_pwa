# Survey Frontend Requirement

## Overview

The survey consists of three types of questions and a final completion page:
1. **Input Questions:** 
   - Users type into an input field. The "Next" button becomes active when the user starts typing.
   - Clicking the "Next" button advances the survey to the next question.

2. **MCQ (Single Choice):** 
   - Users select one option, and the survey automatically proceeds to the next question.
   - Choices are grouped and aligned on the right side of the page.

3. **MCQ (Multiple Choice):**
   - Users can select multiple options. Once at least one option is selected, the "Next" button becomes active.
   - Choices are displayed in rows, with a maximum of two buttons per row unless the button text is too long, in which case only one button is shown per row.
   - Clicking the "Next" button advances the survey to the next question.

4. **Final Page (All Done):**
   - Displays a "View Instructions" button and an "Exit" button.

## Design Details

- **Progress Bar:**
  - Fixed at the top of all pages except the final page.
  - Height: 12px.
  - Progress dynamically updates based on the number of questions completed.

- **Header:**
  - Includes:
    - **Back Arrow Button:** 40x40.
    - **Save & Exit Button:** Font size 16px (rem units), padding of 16px (left & right) and 8px (top & bottom).
  - On the final page, the header only has the "Exit" button.

- **Image:**
  - On every question page, there is an image(orb) on the top left side of the question.
  - The orb should be 80x80, the margin between the orb and the question should be 16px.
  - The orb is stored in the public/images/orb.png
  - On the final page, the orb is centered and the margin between the orb and the text should be 16px.


## Technology Stack

- **Framework:** Next.js (App Router)
- **UI Library:** Shadcn/UI for shared components like Button, Input, and Checkbox.
- **Database:** Supabase for storing survey responses.



## Components

### InputQuestion.tsx
Renders an input field and "Next" button.

- **Props:**
  - `question`: Text for the question.
  - `onNext`: Function to proceed to the next question.
  - `palceholder`: placeholder for the input field.

### SingleChoiceQuestion.tsx
Renders options for single-choice questions.

- **Props:**
  - `question`: Text for the question.
  - `choices`: Array of choice strings.
  - `onSelect`: Function triggered on selecting an option.

### MultiChoiceQuestion.tsx
Renders options for multiple-choice questions.

- **Props:**
  - `question`: Text for the question.
  - `choices`: Array of choice strings.
  - `onNext`: Function to proceed to the next question.

---

## State Management

Use **React Context** or **Zustand** to manage survey state, including:
- Current question index.
- Survey progress.
- User responses.

Store responses locally in the browser until the survey is completed. Once all responses are collected, send them to Supabase for storage.

---

## API Integration

Survey responses will be saved to Supabase with the following structure:

- **Table:** `survey_responses`
- **Columns:**
  - `id`: Primary key.
  - `userId`: Foreign key to the user.
  - `surveyId`: Foreign key to the survey.
  - `questionId`: ID of the question.
  - `response`: User’s response (string for single choice, array for multiple choice).

To optimize performance, responses will be sent in bulk to Supabase instead of making individual API calls for each question.



## File Structure:
src/
├── app/                               # Handles routing, pages, layouts, and APIs
│   ├── api/                           # API routes for backend logic
│   │   ├── survey/                    # Survey-specific API routes
│   │   │   ├── answers/               # Handles survey answers
│   │   │   │   ├── route.ts           # API for storing survey answers (POST)
│   │   │   ├── route.ts               # General API for survey metadata (GET)
│   ├── survey/                        # Survey frontend logic
│   │   ├── [id]/                      # Dynamic route for survey ID
│   │   │   ├── page.tsx               # Main survey page
│   │   │   ├── layout.tsx             # Layout for progress bar and header
│   │   │   ├── components/            # Survey-specific components
│   │   │   │   ├── InputQuestion.tsx  # Component for input questions
│   │   │   │   ├── SingleChoiceQuestion.tsx # Component for single-choice questions
│   │   │   │   ├── MultiChoiceQuestion.tsx  # Component for multiple-choice questions
│   │   │   │   ├── ProgressBar.tsx    # Progress bar component
│   │   │   │   ├── Header.tsx         # Header component
│   │   │   │   └── FinalPage.tsx      # Final page component
│   │   │   ├── utils/                 # Survey-specific utilities
│   │   │   │   └── questionParser.ts  # Parses local survey questions
│   │   │   ├── data/                  # Local storage for questions
│   │   │   │   └── questions.json     # JSON file containing survey questions
│   │   │   ├── styles/                # Styles specific to survey
│   │   │   │   └── survey.css
├── components/                        # Shared UI components across the app
│   ├── ui/                            # Modular and reusable UI elements
│   │   ├── Button.tsx                 # Reusable button component
│   │   ├── Input.tsx                  # Reusable input field component
│   │   ├── Checkbox.tsx               # Checkbox for multiple-choice questions
├── lib/                               # Shared utilities, database queries, and configurations
│   ├── supabase.ts                    # Supabase client configuration (for answers)
│   ├── db/                            # Database-related logic (future use)
│   │   ├── user.ts                    # User-related database queries
│   ├── utils/                         # Global reusable utilities
│   │   ├── formatDate.ts              # Utility to format dates
│   │   ├── validateResponse.ts        # Utility to validate survey responses
├── styles/                            # Global styles for the app
│   └── globals.css
├── public/                            # Static assets like images, icons, and PWA-related files
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── favicon.ico
│   ├── manifest.json                  # PWA manifest
│   ├── robots.txt                     # Robots.txt for SEO
│   └── sw.js                          # Service worker for PWA


questions in json format:
[
  {
    "id": "q1",
    "type": "input",
    "text": "First, what’s your test kit serial number?",
    "placeholder": "e.g., RISDT8A03"
  },
  {
    "id": "q2",
    "type": "single",
    "text": "How often do you exfoliate your skin?",
    "options": ["Daily", "Weekly", "Monthly", "Never"]
  },
  {
    "id": "q3",
    "type": "single",
    "text": "Do you experience breakouts?",
    "options": ["Rarely", "Occasionally", "Frequently"]
  },
  {
    "id": "q4",
    "type": "multi",
    "text": "Do you have any specific skin conditions we should know about?",
    "options": [
      "Acne",
      "Seborrheic Dermatitis",
      "Vitiligo",
      "Contact Dermatitis",
      "Rosacea",
      "Psoriasis",
      "None of the above"
    ]
  },
  {
    "id": "q5",
    "type": "single",
    "text": "What’s your primary skin concern?",
    "options": [
      "Acne",
      "Dryness",
      "Sensitivity",
      "Oily Skin",
      "Anti-Aging"
    ]
  },
  {
    "id": "q6",
    "type": "single",
    "text": "How long have you been using skincare products?",
    "options": [
      "Less than 6 months",
      "6 months to 1 year",
      "1 to 3 years",
      "More than 3 years"
    ]
  },
  {
    "id": "q7",
    "type": "final",
    "text": "All done!",
    "description": "We’ll use your answers to make your report even more tailored to you. Now, let’s get you ready for the swab.",
    "buttonText": "View Instructions"
  }
]