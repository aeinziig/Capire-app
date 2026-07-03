# Email Format Validation for Login Screen

## Topic
Adding client-side email format validation to the Login screen in the Capire-app.

## Context
The Login screen currently allows users to submit an email and password to Supabase for authentication. While Supabase validates the email format on its end and returns an error for invalid formats, adding client-side validation can provide immediate feedback to the user without waiting for a network round trip.

## Chosen Approach
**Simple regex validation** - Add a lightweight regular expression check for basic email format (e.g., containing an `@` symbol and a domain with a dot) in the `handleLogin` function before making the Supabase call.

## Implementation Details
1. Define a regex pattern for basic email validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
2. In the `handleLogin` function, after checking that fields are not empty, validate the email against this regex.
3. If the email fails validation, set an appropriate error message (e.g., "Please enter a valid email address") and return early, preventing the Supabase call.
4. Use the existing `error` state and UI to display the validation error.
5. The validation will occur on form submit; real-time validation on input change is not included to keep the implementation simple.

## Trade-offs Considered
- **Simple regex vs. validation library**: The regex approach avoids adding dependencies and is sufficient for catching common mistakes. A library like `validator` would provide more robust RFC-compliant validation but increases bundle size.
- **Validation on submit vs. real-time**: Validating on submit keeps the implementation straightforward and avoids potential frustration from validating while the user is still typing. Real-time validation on blur was considered but rejected for simplicity.
- **Client-only vs. relying on Supabase**: While Supabase validates email format, client-side validation improves user experience by providing instant feedback.

## Open Questions
- Should we also clear the validation error when the user corrects the email input? (This could be added in a future improvement.)
- Should the regex be adjusted to allow more valid email formats? (The current regex rejects emails with multiple dots or plus signs, which are valid. However, Supabase will accept them, so the validation is conservative.)

## Related Files
- `src/screens/authentication/LoginScreen.tsx`: Where the validation logic will be added.

## Notes
This design focuses solely on adding email format validation. Other improvements (such as password strength validation or clearing errors on input change) are out of scope for this change.