# Technical Issues Summary and Solutions

## Context
Developing a web application featuring a choice-based questionnaire. The frontend interacts with Strapi CMS. This document logs encountered issues and their resolutions.

## Primary Issues and Resolutions

### 1. Frontend Data Fetching Error (404 Not Found)
- **Problem:** Errors when fetching data for "Communication" choice from Strapi (`/api/choice-to-question-maps/comm?populate=*`), resulting in a 404 Not Found error.
- **Resolution:** Discovered that the endpoint was incorrect. Correct endpoint should reference the ID number rather than a string (`comm`). The correct API call is `/api/choice-to-question-maps?populate=*`. Issue resolved by updating the `id` reference in the frontend `QuestionairePage.tsx` file from "comm" to the numerical ID "2".

### 2. Strapi Data Import Script Failure (405 Method Not Allowed and 404 Not Found)
- **Problem:** Node.js script (`import-script.js`) failed to authenticate with Strapi. Attempts to access `/auth/local` endpoint for a token resulted in 405 Method Not Allowed and 404 Not Found errors.
- **Resolution:** Resolved by adjusting user and permissions settings in the Strapi admin panel. Specifically, modified public role permissions for content types like `choice-to-question-map`, `question-to-choice-map`, `first-entry` etc., to address the 403 Forbidden and 405 Method Not Allowed errors.

### 3. Strapi Console Errors (403 Forbidden, 404 Not Found)
- **Reported Errors:**
  - 405 error on POST to `/auth/local`.
  - 404 error on GET to `/auth/local`.
  - 403 and 404 errors on GET requests to various API endpoints (`/api/first-entries/1?populate=*`, `/api/choice-to-question-maps/comm?populate=*`).
- **Resolution:** The 403 Forbidden error was due to inadequate permissions set in Strapi for certain roles. Adjusting these permissions in the Strapi admin panel resolved the issue. The 404 errors were fixed by correcting the API endpoints as detailed above.

### 4. Adding TitleDescription Box to Questions
- **Requirement:** Implementing a feature to add a short paragraph of description to questions displayed on the website.
- **Resolution:**
  - Added an additional text field `QuestionDescription` in Strapi content manager under the `question-to-choice-map` collection type.
  - Modified `QuestionairePage.tsx` to include this new field in the displayed content.
  - Updated `tempNextChoiceSelectionFromJson.tsx` to fetch `QuestionDescription` as part of the question data.
  - Adjusted styling in `BodyContentUseStyles` to properly display the description text alongside the question title.

## Future Considerations
This document serves as a log of issues and resolutions during the development phase. It is intended to assist future developers encountering similar challenges, providing guidance and solutions without the need for direct consultation.

---
