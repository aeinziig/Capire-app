# Capire App Redesign Plan

## Overview
This plan outlines the redesign of the Capire app to match a new institutional design. The redesign involves updating the design system (colors, typography, spacing, rounded corners, shadows) and modifying all screens to comply with the new design. A missing screen (Submit Topic) will be added, and the navigation structure may be adjusted.

## Goals
- Update the app's visual appearance to match the new institutional design system.
- Ensure consistency across all screens and components.
- Add the missing Submit Topic screen.
- Maintain or improve usability and accessibility.
- Leverage the existing Tailwind/NativeWind setup for efficient theme updates.
- Establish explicit design tokens for consistent implementation.
- Define and implement accessibility standards (WCAG 2.1 AA compliance).
- Establish testing standards for design system changes.
- Document reusable components and validation logic patterns.

## Scope
- **Design System Updates**: Modify `tailwind.config.js` to define new color palette, typography, spacing, border radius, and shadow values as explicit design tokens.
- **Accessibility Standards**: Implement WCAG 2.1 AA compliance including contrast ratios, touch targets, focus states, and screen reader support.
- **Screen Updates**: Update the following screens to use the new design system:
  - SplashScreen
  - Authentication screens (Login, Register, OTP Verification, Forgot Password)
  - DashboardScreen
  - SearchScreen and search results
  - SubmitTopicScreen (new screen to be created)
  - Faculty Review screens (TopicReviewScreen)
  - ChatbotScreen
  - Profile screens (OwnProfileScreen, OtherUserProfileScreen)
  - Shared components used across screens (e.g., buttons, inputs, cards)
  - NotificationsScreen (Phase 4 enhancement)
  - SettingsScreen (Phase 4 enhancement)
  - HelpCenterScreen (Phase 4 enhancement)
- **Navigation Structure**: Review and adjust navigation if required by the new design (e.g., tab bar appearance, header styles).
- **Assets**: Update any static assets (logos, icons) if needed.
- **Testing Standards**: Implement unit tests, integration tests, and visual regression tests for design system changes.
- **Reusable Components Documentation**: Document shared components (buttons, inputs, cards, modals) and validation logic patterns.

## Current Status (Phase 4)
As of 2026-06-20:
- All TypeScript and runtime errors resolved.
- FacultyDashboardScreen and TopicReviewScreen implemented.
- ChatbotScreen, OwnProfileScreen, and BookmarksScreen redesigned with tokens and accessibility.
- Metro server stable; ready for emulator smoke testing.

## Implementation Checklist
Each step is atomic, verifiable, and ordered for execution.

### Phase 1-3: Foundation and Core Screens (Completed)
1. **Baseline and Preparation**
   - 1.1. Create a backup of the current `tailwind.config.js` and src/theme.ts (if used).
   - 1.2. Gather the new institutional design specifications (colors, typography, spacing, border radius, shadows) from stakeholders.
   - 1.3. Define the new Tailwind theme configuration based on the specifications as explicit design tokens.
   - 1.4. Document accessibility standards (WCAG 2.1 AA) to be implemented.
   - 1.5. Define testing standards for unit, integration, and visual regression tests.

2. **Design System Update with Explicit Design Tokens**
   - 2.1. Extract and document explicit design tokens from institutional specifications:
     - **Colors**: Define primary, secondary, neutral, status, and semantic color tokens with exact hex values
     - **Fonts**: Define font family, size, weight, line height, and letter spacing tokens
     - **Spacing**: Define spacing scale tokens (0px to 80px in 4px increments)
     - **Border Radius**: Define radius tokens (none, sm, base, lg, xl, full)
     - **Shadows**: Define shadow tokens (none, sm, base, lg, xl, 2xl, inner)
   - 2.2. Update `tailwind.config.js` with the new color palette as design tokens.
   - 2.3. Update `tailwind.config.js` with new typography settings as design tokens (if using custom fonts, update content and fontFamily).
   - 2.4. Update `tailwind.config.js` with new spacing scale as design tokens.
   - 2.5. Update `tailwind.config.js` with new border radius values as design tokens.
   - 2.6. Update `tailwind.config.js` with new shadow values as design tokens (if applicable).
   - 2.7. Create a design tokens document (`src/styles/design-tokens.ts` or similar) that exports these values for use in TypeScript.
   - 2.8. Verify that the Tailwind configuration compiles without errors by running the Expo web build (or checking for lint errors).

3. **Accessibility Standards Implementation**
   - 3.1. Implement WCAG 2.1 AA contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text).
   - 3.2. Ensure minimum touch target size of 48x48 dp for all interactive elements.
   - 3.3. Implement proper focus states with visible indicators (minimum 2px width, contrast ratio 3:1).
   - 3.4. Ensure proper labeling for form elements and screen reader accessibility.
   - 3.5. Implement semantic structure with appropriate heading levels and landmark roles.
   - 3.6. Verify color combinations meet accessibility requirements using contrast checking tools.
   - 3.7. Test with screen reader accessibility tools (TalkBack, VoiceOver).

4. **SplashScreen Update**
   - 4.1. Read `src/screens/authentication/SplashScreen.tsx`.
   - 4.2. Update styles to use new design system colors, spacing, and typography via design tokens.
   - 4.3. Adjust any images or logos to match new asset requirements.
   - 4.4. Verify the screen renders correctly with the new theme.
   - 4.5. Verify accessibility compliance (contrast, touch targets, focus states).

5. **Authentication Screens Update**
   - 5.1. For each authentication screen (LoginScreen, RegisterScreen, OTPVerificationScreen, ForgotPasswordScreen):
     - 5.1.1. Read the screen file.
     - 5.1.2. Update input styles, button styles, spacing, and typography using design tokens.
     - 5.1.3. Ensure error messages and success states use new color values from design tokens.
     - 5.1.4. Implement proper form validation and error handling patterns.
     - 5.1.5. Verify layout and responsiveness.
     - 5.1.6. Verify accessibility compliance (labels, contrast, touch targets, keyboard navigation).

6. **DashboardScreen Update**
   - 6.1. Read `src/screens/student/DashboardScreen.tsx`.
   - 6.2. Update card components, text styles, and spacing using design tokens.
   - 6.3. Ensure charts or graphs (if any) use new color palette from design tokens.
   - 6.4. Verify the screen renders with new design.
   - 6.5. Verify accessibility compliance.

7. **SearchScreen and Search Results Update**
   - 7.1. Read `src/screens/student/SearchScreen.tsx`.
   - 7.2. Update search bar, filters, and search result list styles using design tokens.
   - 7.3. Update the capstone card component used in search results to use new design system.
   - 7.4. Verify search functionality and styling.
   - 7.5. Verify accessibility compliance.

8. **SubmitTopicScreen Creation**
   - 8.1. Create a new screen `src/screens/student/SubmitTopicScreen.tsx`.
   - 8.2. Implement form for submitting a capstone topic (title, abstract, author, year, department, keywords, etc.).
   - 8.3. Use new design system for form inputs, buttons, and layout via design tokens.
   - 8.4. Add validation and submission logic (placeholder for backend integration) following documented validation patterns.
   - 8.5. Ensure the screen is accessible from the navigation (e.g., from a floating action button or tab).
   - 8.6. Verify accessibility compliance (form labels, error messages, touch targets).

9. **Faculty Review Screen Update**
   - 9.1. Read `src/screens/faculty/TopicReviewScreen.tsx`.
   - 9.2. Update card styles, buttons (approve/reject), and typography using design tokens.
   - 9.3. Ensure the screen uses new color states for pending, approved, rejected topics from design tokens.
   - 9.4. Implement proper validation and feedback patterns.
   - 9.5. Verify the screen renders correctly.
   - 9.6. Verify accessibility compliance.

10. **ChatbotScreen Update**
    - 10.1. Read `src/screens/shared/ChatbotScreen.tsx`.
    - 10.2. Update chat bubble styles, input box, and send button using design tokens.
    - 10.3. Ensure the floating action button (if present) uses new design.
    - 10.4. Verify chat functionality and styling.
    - 10.5. Verify accessibility compliance.

11. **Profile Screens Update**
    - 11.1. Read `src/screens/shared/OwnProfileScreen.tsx` (and OtherUserProfileScreen if exists).
    - 11.2. Update profile information layout, buttons, and typography using design tokens.
    - 11.3. Ensure any charts or stats use new color palette from design tokens.
    - 11.4. Verify the screen renders with new design.
    - 11.5. Verify accessibility compliance.

12. **BookmarksScreen Update**
    - 12.1. Read `src/screens/student/BookmarksScreen.tsx`.
    - 12.2. Update bookmark list item styles, buttons, and typography using design tokens.
    - 12.3. Ensure empty state and loading states use new design.
    - 12.4. Verify the screen renders correctly.
    - 12.5. Verify accessibility compliance.

13. **Shared Components Update and Documentation**
    - 13.1. Identify shared components (e.g., buttons, inputs, cards, modals) used across screens.
    - 13.2. Document each shared component's interface, props, and usage guidelines.
    - 13.3. Document validation logic patterns for forms (required fields, email validation, password strength, etc.).
    - 13.4. Update each shared component to use the new design system via Tailwind classes and design tokens.
    - 13.5. Ensure shared components follow accessibility standards (touch targets, focus states, ARIA attributes).
    - 13.6. Verify that changes propagate correctly to all screens using these components.

14. **Navigation Structure Update**
    - 14.1. Read `src/navigation/types.ts` and any navigation configuration files.
    - 14.2. Update tab bar colors, icon colors, and label styles to match new design using design tokens.
    - 14.3. Update header styles (if using stack navigators) for new design.
    - 14.4. Verify navigation works and appears correctly.
    - 14.5. Verify accessibility compliance for navigation elements.

15. **Assets Update**
    - 15.1. Replace any static assets (logo, icons, images) with new versions if required by the institutional design.
    - 15.2. Ensure assets are correctly referenced and display properly.
    - 15.3. Verify asset accessibility (alt text for images, appropriate contrast).

### Phase 4: Enhancement Screens and Verification (Current Phase - Action Items)
16. **Phase 4 Enhancement Screens - Immediate Tasks**
    - 16.1. **NotificationsScreen Implementation**
        - 16.1.1. Create/update `src/screens/shared/NotificationsScreen.tsx`
        - 16.1.2. Implement design token colors for list items and indicators
        - 16.1.3. Ensure accessible list items with proper touch targets
        - 16.1.4. Add swipe actions (delete, mark as read) with accessible labels
    - 16.2. **SettingsScreen Implementation**
        - 16.2.1. Create/update `src/screens/shared/SettingsScreen.tsx`
        - 16.2.2. Implement toggle components using design tokens
        - 16.2.3. Add theme switch (light/dark) functionality
        - 16.2.4. Include account options (logout, profile, etc.)
    - 16.3. **HelpCenterScreen Implementation**
        - 16.3.1. Create/update `src/screens/shared/HelpCenterScreen.tsx`
        - 16.3.2. Implement FAQ accordion with accessible expand/collapse
        - 16.3.3. Add contact form with validation
        - 16.3.4. Ensure accessible links with proper contrast

17. **Emulator Smoke Testing - Immediate Tasks**
    - 17.1. Run emulator smoke test:
        - 17.1.1. Verify RegisterScreen checkbox renders correctly on Android
        - 17.1.2. Confirm FacultyDashboard → TopicReview navigation works
        - 17.1.3. Test Chatbot floating button and accessibility labels
        - 17.1.4. Validate Profile and Bookmarks screens for layout and color consistency
    - 17.2. Run `npx tsc --noEmit` → confirm 0 errors
    - 17.3. Run `npx expo start --clear` → confirm runtime stability

18. **Verification and Reporting - Immediate Tasks**
    - 18.1. Document files modified during implementation
    - 18.2. Document lines corrected
    - 18.3. Document nature of fix or redesign for each change
    - 18.4. Confirm compilation and runtime both pass cleanly
    - 18.5. Report findings to user

19. **Testing Standards Implementation**
    - 19.1. Unit Tests:
        - Create unit tests for shared components (buttons, inputs, cards) to verify design token usage.
        - Test component props and state changes.
        - Test validation logic functions.
    - 19.2. Integration Tests:
        - Test screen navigation and data flow.
        - Test form submission flows with validation.
        - Test accessibility features with testing tools.
    - 19.3. Visual Regression Tests:
        - Set up visual regression testing baseline for key screens.
        - Compare before/after screenshots to detect unintended changes.
        - Test at multiple screen sizes and orientations.
    - 19.4. Accessibility Tests:
        - Automated accessibility testing using tools like axe-core or similar.
        - Manual testing with assistive technologies.
    - 19.5. Run all tests as part of CI/CD pipeline integration.

20. **Testing and Verification**
    - 20.1. Run the app in Expo development mode and manually verify each screen.
    - 20.2. Check for any broken layouts, overflow, or contrast issues.
    - 20.3. Verify that all interactive elements (buttons, inputs) have correct touch feedback and states.
    - 20.4. Run any existing unit or integration tests (if applicable) to ensure no regressions.
    - 20.5. Execute the test suites defined in section 19.

21. **Final Review**
    - 21.1. Compare the updated app with the design specifications.
    - 21.2. Ensure all screens comply with the new institutional design.
    - 21.3. Verify accessibility standards compliance.
    - 21.4. Document any deviations or open issues.
    - 21.5. Review design tokens documentation for completeness.

### Phase 5: Core Screen Layout Improvements and Dynamic Data Integration
22. **LoginScreen Layout Improvements**
    - 22.1. Read `src/screens/authentication/LoginScreen.tsx`.
    - 22.2. Center the form vertically and horizontally on the screen using flexbox utilities.
    - 22.3. Add institutional branding (SPCBA seal, name) above the form with appropriate spacing using design tokens.
    - 22.4. Ensure visual hierarchy: brand, title, form fields, buttons, links with proper typography scaling.
    - 22.5. Implement inline validation for form fields (email, password) with real-time feedback using design tokens for error states.
    - 22.6. Use design tokens for all spacing, typography, and colors consistently throughout the screen.
    - 22.7. Implement larger rounded primary "Sign In" button with increased touch target size (minimum 48x48dp).
    - 22.8. Add subtle divider (1px line with neutralLightGray color) between "Forgot Password?" and "Register here" links.
    - 22.9. Implement loading state for the Sign In button with visual feedback and disabled state during submission.
    - 22.10. Add accessible ARIA labels for all form elements, buttons, and links.
    - 22.11. Verify the layout is responsive and accessible across different screen sizes.

23. **DashboardScreen Layout Improvements**
    - 23.1. Read `src/screens/student/DashboardScreen.tsx`.
    - 23.2. Implement a responsive grid for metrics (4 metrics: Capstones Reviewed; Originality Checks; Bookmarked Items; Research Hours) using CSS grid:
        - 1 column on extra small screens (<640px)
        - 2 columns on small screens (≥640px)
        - 3 columns on medium screens (≥768px)
        - 4 columns on large screens (≥1024px)
    - 23.3. Add section headers for each metric group using token typography (sectionHeading) with proper spacing.
    - 23.4. Apply card shadows to metric cards using shadowTokens.base with rounded corners (borderRadiusTokens.lg).
    - 23.5. Implement Quick Actions as horizontal accessible button group with minimum touch target of 48x48dp.
    - 23.6. Ensure loading states use skeleton screens with appropriate shimmer effects.
    - 23.7. Implement empty-data placeholders with illustrative graphics and helpful messaging.
    - 23.8. Add accessible charts/tables with proper labeling, color contrast, and screen reader support.
    - 23.9. Use design tokens for all styling (spacing, typography, colors, border radius, shadows).
    - 23.10. Verify the layout and accessibility compliance (WCAG 2.1 AA).

24. **Data Integration Architecture**
    - 24.1. Replace mock fixtures with real Supabase data sources using the existing service layer (`src/services/supabase.ts`).
    - 24.2. Fetch user profile data (name, email, role) after successful login and store in global state.
    - 24.3. Fetch capstone statistics:
        - Total capstone projects available
        - User's bookmarked items count
        - Capstone projects available for review (faculty role)
        - Originality checks completed (student role)
    - 24.4. Fetch real bookmarks for the BookmarksScreen with pagination and filtering.
    - 24.5. Fetch real messages for the MessagesScreen with real-time updates.
    - 24.6. Implement global state management using React Context (existing AppContext) with TypeScript interfaces.
    - 24.7. Implement real-time subscriptions where available:
        - User profile updates
        - New bookmarks additions
        - New messages received
        - Capstone project updates (for faculty dashboard)
    - 24.8. Implement optimistic updates with automatic rollback on failure for:
        - Bookmark addition/removal
        - Profile updates
        - Message sending
    - 24.9. Define typed interfaces for all data structures with runtime validation using zod or similar.
    - 24.10. Ensure data updates dynamically after login and on refresh triggers (pull-to-refresh, screen focus).
    - 24.11. Implement loading and error states for all data fetching operations.

25. **Visual Quality Assurance**
    - 25.1. Require before/after screenshots or Figma references at each milestone (LoginScreen, DashboardScreen, cards).
    - 25.2. Capture mobile and tablet breakpoints (320px, 768px, 1024px) for visual regression testing.
    - 25.3. Store comparison screenshots in `process/features/Redesign/active/screenshots/` directory.
    - 25.4. Implement automated visual regression testing using tools like Percy or Chromatic.
    - 25.5. Define visual QA acceptance criteria:
        - Maximum 5px pixel deviation for layout elements
        - Color values must match design tokens exactly
        - Typography must use correct font sizes and weights from tokens
        - Spacing must adhere to 8px base grid from design tokens

26. **Data Refresh Strategy**
    - 26.1. Define refresh cadence with recommended baseline of 60 seconds for background sync.
    - 26.2. Implement refresh triggers:
        - On screen focus (using focus event listeners)
        - Pull-to-refresh gesture on scrollable content
        - Manual refresh button in app bar
        - Background sync when app is resumed (configurable interval)
    - 26.3. Apply consistent debounce (300ms) and throttle (1000ms) for API calls to prevent over-fetching.
    - 26.4. Implement network-aware behavior:
        - Detect online/offline status using NetInfo API
        - Queue offline actions for synchronization when connectivity restored
        - Show offline indicators with cached data availability
        - Implement exponential backoff for failed requests

27. **Error Handling and Resilience**
    - 27.1. Document fallback UI for failed requests:
        - Error banners with accessible labels and retry buttons
        - Inline validation errors with clear messaging
        - Empty state placeholders with helpful guidance
    - 27.2. Implement graceful degradation to cached or empty states when data is unavailable.
    - 27.3. Add telemetry for errors using logging service (console.error in development, external service in production).
    - 27.4. Implement exponential backoff for retries (starting at 1s, doubling up to 30s maximum).
    - 27.5. Provide user-friendly error messages that distinguish between:
        - Network connectivity issues
        - Authentication/authorization failures
        - Server-side validation errors
        - Unexpected server errors

28. **Performance Optimization**
    - 28.1. Set performance targets:
        - Initial screen load time < 2 seconds (measured from launch to interactive)
        - Smooth scrolling at 60 FPS (measured with Flipper or similar)
        - API response handling time 300–500ms (95th percentile)
        - Time to first byte < 1s for Supabase requests
    - 28.2. Add performance tests to QA pipeline using:
        - React Native Performance library
        - Custom timing hooks for key interactions
        - Frame rate monitoring during scroll operations
    - 28.3. Implement instrumentation for:
        - Load time measurement (using InteractionManager)
        - Frame drop detection (using InteractionManager.runAfterInteractions)
        - API latency tracking (custom wrapper around supabase calls)
    - 28.4. Optimize rendering with:
        - React.memo for expensive components
        - useCallback/useMemo for expensive computations
        - FlatList with removeClippedSubviews for long lists
        - Image caching and optimization

29. **Verification and Acceptance Criteria**
    - 29.1. Update Phase 5 plan file to include all above sections and acceptance criteria.
    - 29.2. Run static and runtime checks: `npx tsc --noEmit` (0 errors); `npx expo start --clear` (stable).
    - 29.3. Emulator tests: login with real credentials; dashboard metrics update from backend; profile and messages show live data.
    - 29.4. Visual QA: attach before/after screenshots and Figma links to verification report.
    - 29.5. Performance checks: report measured initial load time, API latencies, and frame rate.
    - 29.6. Acceptance criteria for LoginScreen:
        - Form is perfectly centered vertically and horizontally on all screen sizes
        - Institutional branding is clearly visible above form with proper spacing
        - "Sign In" button is larger than previous version with increased border radius
        - Subtle divider exists between "Forgot Password?" and "Register here" links
        - Inline validation provides real-time feedback for email and password fields
        - Loading and disabled states are properly implemented on Sign In button
        - All interactive elements have accessible ARIA labels
        - All spacing, typography, and colors use design tokens exclusively
    - 29.7. Acceptance criteria for DashboardScreen:
        - Metrics display in responsive grid (1-4 columns based on screen width)
        - Section headers use token typography with proper visual hierarchy
        - Metric cards have rounded corners and subtle shadows from design tokens
        - Quick Actions are displayed as horizontal accessible button group
        - Loading states show skeleton screens instead of blank containers
        - Empty states show illustrative graphics with helpful messaging
        - Charts and tables are accessible with proper labeling and color contrast
        - All spacing, typography, colors, border radius, and shadows use design tokens
    - 29.8. Acceptance criteria for Data Integration:
        - No hardcoded mock data remains in the codebase
        - User profile data is fetched from Supabase after login
        - Dashboard statistics reflect actual counts from database
        - BookmarksScreen shows real bookmarked items with pagination
        - MessagesScreen shows real conversation data with real-time updates
        - Global state updates propagate correctly to all dependent screens
        - Real-time subscriptions work for available data streams
        - Optimistic updates roll back correctly on failure
        - TypeScript interfaces match actual data structures
        - Data refreshes correctly on screen focus and pull-to-refresh

30. **Reporting Template**
    - 30.1. Files modified (paths) - List all files changed during implementation
    - 30.2. Lines changed (approx.) - Approximate number of lines added/modified/deleted
    - 30.3. Nature of fix or redesign per file - Brief description of changes made to each file
    - 30.4. Verification results for TypeScript, Expo, emulator tests (with screenshots)
    - 30.5. Visual QA artifacts and performance report - Screenshots, Figma links, performance metrics
    - 30.6. Explicit confirmation that Phase 5 plan file and acceptance criteria were updated

## Acceptance Criteria
- The app's color palette, typography, spacing, border radius, and shadows match the new institutional design specifications as defined in the design tokens.
- All existing screens (SplashScreen, Authentication, Dashboard, Search Results, Faculty Review, Chatbot, Profile, Bookmarks) reflect the new design using design tokens.
- The new SubmitTopicScreen is present and functional (form submission placeholder) using documented validation patterns.
- Navigation elements (tab bar, headers) use the new design from design tokens.
- New Phase 4 screens (NotificationsScreen, SettingsScreen, HelpCenterScreen) are implemented with design tokens and accessibility standards.
- **LoginScreen** form is centered, includes institutional branding, has proper visual hierarchy, and implements inline validation.
- **DashboardScreen** uses a responsive grid for metrics, includes section headers, card shadows, horizontal Quick Actions group, and proper loading/empty states.
- All mock data has been replaced with real data from Supabase, and a global state management solution is in place to share user data and statistics.
- Data fetches correctly after login and updates dynamically after relevant actions.
- Accessibility standards (WCAG 2.1 AA) are met including:
  - Minimum contrast ratios of 4.5:1 for normal text and 3:1 for large text
  - Minimum touch target size of 48x48 dp
  - Visible focus states with adequate contrast
  - Proper labeling and screen reader support
- No broken layouts or visual regressions are introduced.
- Manual verification confirms that the app is usable and visually consistent.
- Testing standards are implemented:
  - Unit tests pass for shared components and validation logic
  - Integration tests pass for critical user flows
  - Visual regression tests show no unintended changes
  - Accessibility tests pass
- Reusable components and validation logic are properly documented.
- Emulator smoke testing passes with:
  - Correct RegisterScreen checkbox rendering on Android
  - Working FacultyDashboard → TopicReview navigation
  - Functional Chatbot floating button with accessibility labels
  - Consistent layout and color in Profile and Bookmarks screens
  - Zero TypeScript errors
  - Stable runtime with `npx expo start --clear`

## Dependencies
- The app relies on NativeWind for Tailwind CSS in React Native. No additional dependencies are required for the theme update.
- The design system update assumes that the institutional design specifications are provided.
- Screen updates may require minor adjustments to props or state if component APIs change, but the core functionality remains unchanged.
- Testing dependencies may include Jest, React Native Testing Library, and visual regression testing tools (to be determined).
- State management solution (React Context or Redux) may require additional libraries if not already present.

## Risks and Mitigations
- **Risk**: Updating the Tailwind theme may break screens that rely on specific hardcoded values that are no longer present.
  - **Mitigation**: Define the new theme with fallbacks and check each screen for compatibility. Use the existing theme values as a base and map to new values where possible.
- **Risk**: Missing screens or components may be overlooked.
  - **Mitigation**: Follow the checklist and verify each screen listed in the scope.
- **Risk**: The new design may require assets (fonts, images) that are not available.
  - **Mitigation**: Coordinate with the design team to obtain necessary assets early in the process.
- **Risk**: Navigation changes may affect user flow.
  - **Mitigation**: Review navigation updates with stakeholders and test thoroughly.
- **Risk**: Accessibility requirements may conflict with design specifications.
  - **Mitigation**: Work with design team to find accessible alternatives that meet both requirements.
- **Risk**: Testing implementation may add complexity to the build process.
  - **Mitigation**: Start with critical paths and expand test coverage incrementally.
- **Risk**: Introducing global state management may cause unexpected re-renders or state inconsistencies.
  - **Mitigation**: Use established patterns (e.g., React Context with useReducer or Redux Toolkit) and test thoroughly.

## Touchpoints (Files to Modify)
- `tailwind.config.js` - Primary design system update with explicit design tokens.
- `src/theme.ts` - If used, update to reflect new design (though currently unused, may be referenced in future).
- `src/styles/design-tokens.ts` (new file) - Exported design tokens for TypeScript usage.
- `src/screens/authentication/SplashScreen.tsx`
- `src/screens/authentication/LoginScreen.tsx`
- `src/screens/authentication/RegisterScreen.tsx`
- `src/screens/authentication/OTPVerificationScreen.tsx`
- `src/screens/authentication/ForgotPasswordScreen.tsx`
- `src/screens/student/DashboardScreen.tsx`
- `src/screens/student/SearchScreen.tsx`
- `src/screens/student/SubmitTopicScreen.tsx` (new file)
- `src/screens/faculty/TopicReviewScreen.tsx`
- `src/screens/shared/ChatbotScreen.tsx`
- `src/screens/shared/OwnProfileScreen.tsx`
- `src/screens/shared/OtherUserProfileScreen.tsx` (if exists)
- `src/screens/student/BookmarksScreen.tsx`
- `src/screens/shared/NotificationsScreen.tsx` (Phase 4)
- `src/screens/shared/SettingsScreen.tsx` (Phase 4)
- `src/screens/shared/HelpCenterScreen.tsx` (Phase 4)
- Shared components: buttons, inputs, cards, modals (various files in `src/components/` if they exist; otherwise, inline styles in screens will be updated).
- `src/navigation/types.ts` and navigation configuration files (e.g., `src/screens/MainTabs.tsx` or similar).
- Asset files (logos, icons) in `assets/` directory (if any).
- Test files: `src/__tests__/` directory (new or updated test files for components and screens).
- Documentation files: `src/styles/components.md` (new), `src/styles/validation-patterns.md` (new).
- **State management files**: 
  - If using React Context: `src/context/AppContext.tsx` (new or updated)
  - If using Redux: `src/store/index.ts` (new), `src/store/slices/` (new)
- Service layer updates (if needed for new data fetching): `src/services/supabase.ts` (if adding new helper functions)
- Screens using global data: `src/screens/student/DashboardScreen.tsx`, `src/screens/student/BookmarksScreen.tsx`, `src/screens/shared/MessagesScreen.tsx`, `src/screens/shared/OwnProfileScreen.tsx`

## Blast Radius
- **High**: Changes to `tailwind.config.js` affect all components that use Tailwind classes, which is the majority of the app's styling.
- **Medium**: Screen-specific changes affect individual screens but may propagate if shared components are updated.
- **Low**: Asset updates only affect specific instances where the asset is used.
- The navigation structure update affects the tab bar and headers across the app.
- Design token changes affect all components that consume them.
- Accessibility changes affect all interactive elements and screen layouts.
- Testing additions affect the build and CI/CD processes.
- **State management changes** (if introduced) have a high blast radius as they affect any screen consuming the global state.
- Updates to the service layer for new data fetching may affect screens that use those functions.

## Context API Documentation
The application uses React Context (via `AppContext`) for global state management. The context provides the following functions that can be consumed via the `useApp` hook:

- `refreshUserData`: Async function that re-fetches user data from Supabase and updates the context state (user, stats, recent activities). Used to refresh data after mutations like bookmark addition/removal.
- `updateUserName`: Function to update the user's display name in the context.
- `updateStats`: Function to update specific statistics in the context (accepts a partial stats object).
- `addRecentActivity`: Function to add a new activity to the recent activities list (maintains a maximum of 5 activities).

These functions are defined in `src/context/AppContext.tsx` and are essential for maintaining synchronized state across screens.

## Veribration Evidence
- **Design System**: Screenshots of the app showing colors, typography, spacing, etc., matching the specification.
- **Design Tokens**: Documentation of all explicit design tokens with values and usage examples.
- **Screen Updates**: Before-and-after screenshots for each screen listed in the scope.
- **SubmitTopicScreen**: Existence of the new screen and successful form submission (to a mock endpoint).
- **Navigation**: Verification of tab bar colors, icon colors, and header styles.
- **Accessibility**: Contrast ratio reports, touch target measurements, focus state verification, screen reader test results.
- **Testing**: Unit test reports, integration test logs, visual regression test comparisons, accessibility test results.
- **Component Documentation**: Shared components documentation with usage guidelines.
- **Validation Logic**: Documentation of validation patterns with examples.
- **Tailwind Build**: Successful compilation of the Tailwind configuration without errors.
- **Phase 4 Enhancement Screens**: Existence and verification of NotificationsScreen, SettingsScreen, and HelpCenterScreen with design tokens and accessibility.
- **Emulator Smoke Test Results**: Documentation of test results for:
  - RegisterScreen checkbox rendering on Android
  - FacultyDashboard → TopicReview navigation
  - Chatbot floating button and accessibility labels
  - Profile and Bookmarks screens layout and color consistency
  - TypeScript compilation (`npx tsc --noEmit` → 0 errors)
  - Runtime stability (`npx expo start --clear`)
- **Phase 5 Specific Evidence**:
  - Screenshots of the improved LoginScreen showing centered form, institutional branding, visual hierarchy, and inline validation.
  - Screenshots of the improved DashboardScreen showing responsive grid metrics, section headers, card shadows, horizontal Quick Actions group, and loading/empty states.
  - Evidence of real data being displayed (e.g., network logs showing Supabase requests, console output of fetched data).
  - Verification of global state updates (e.g., data changes reflected across screens after login or after actions like bookmarking).
  - Removal of mock data: verification that no hardcoded mock data remains in the codebase (via grep or manual review).

## Resume and Execution Handoff
If execution is interrupted, the following information should be captured to resume:
- Last completed step number from the Implementation Checklist.
- Any files that were modified but not verified.
- Current branch name and any uncommitted changes.
- List of screens that have been updated and verified.
- Any open issues or blockers encountered.
- Status of design tokens definition and documentation.
- Status of accessibility standards implementation.
- Status of testing standards implementation.
- Status of reusable components and validation logic documentation.
- Status of Phase 4 enhancement screens (NotificationsScreen, SettingsScreen, HelpCenterScreen).
- Status of emulator smoke testing and verification steps.
- Status of Phase 5 core screen layout improvements and dynamic data integration.

To resume, restart the plan from the last completed step, ensuring that any partially completed work is reviewed and verified before proceeding.

## Notes
- The chosen approach is **Centralized Tailwind Theme Update** (Approach 1 from the innovate agent discussion). This leverages the existing Nativewind setup to propagate design system changes efficiently.
- If the institutional design specifications include custom fonts, they will need to be added to the project and referenced in the Tailwind configuration.
- The SubmitTopicScreen will be created as a placeholder; backend integration for topic submission is out of scope for this redesign but should be considered in future work.
- All updates should maintain accessibility standards (contrast ratios, touch target sizes).
- Design tokens provide a single source of truth for design values, making future updates easier.
- Testing standards ensure that design system changes don't introduce regressions and that accessibility is maintained.
- Documentation of reusable components and validation logic promotes consistency and reduces duplication.
- Phase 4 focuses on enhancing the app with additional screens (Notifications, Settings, Help Center) while maintaining design system consistency and accessibility.
- Phase 5 addresses specific layout improvements for core screens (Login, Dashboard) and replaces mock data with real data from Supabase, introducing a global state management solution for a more dynamic and accurate user experience.