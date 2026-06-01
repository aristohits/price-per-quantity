# Price Per Quantity - Project Instructions

## Overview
A PWA tool for comparing product value by calculating price per unit. Designed for quick decision-making while shopping.

## Architecture & Tech Stack
- **Frontend**: Vanilla HTML5, Tailwind CSS (via CDN), and JavaScript.
- **PWA**: Service Worker (`sw.js`) and Web Manifest (`manifest.json`).
- **Styling**: Modern dark theme using Slate and Indigo/Emerald color palettes.
- **Testing**: Vitest with JSDOM for logic and DOM verification.

## Development Conventions

### UI & Styling
- Always use **Tailwind CSS** classes.
- Follow the established **dark theme** (Slate 900/950 backgrounds).
- Interactive elements should have `active:scale-95` or similar feedback.
- Custom modals should use `backdrop-blur-sm` and `animate-scale-up`.
- **Thai Language**: Use Thai for all user-facing labels and messages.

### Comparison Logic
- **Winner**: The product with the lowest `unitPrice`.
- **Difference Calculation**: Show absolute difference and savings percentage relative to the more expensive item: `(Price - WinnerPrice) / Price * 100`.
- **Result Cards**: Results are displayed as cards in `resultListEl`. Winners get a "Winner" badge.

### Safety & UX
- **Vibration**: Use the `vibrate()` helper for haptic feedback on interactions.
- **Confirmation**: Destructive actions (like Reset) MUST show a custom confirmation modal.
- **Calculator**: Inputs support a built-in calculator modal.

## Testing Standards
- All core logic in `app.js` must be exported and tested in `app.test.js`.
- Run tests using `npm test` (Vitest).
- Every new feature or bug fix requires a corresponding test case in `app.test.js`.

## Recent Updates
- Added savings percentage and absolute difference to results.
- Implemented custom confirmation modal for form reset.
- Refactored results UI to a card-based layout.
