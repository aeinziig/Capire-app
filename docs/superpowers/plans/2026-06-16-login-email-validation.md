# Login Email Format Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add client-side email format validation to the Login screen to provide immediate feedback on invalid email formats before attempting to authenticate with Supabase.

**Architecture:** We will add a regex-based email validation in the handleLogin function of the LoginScreen component. The validation will occur after checking for empty fields and before calling Supabase. If the email is invalid, we set an error message and return early.

**Tech Stack:** React Native, TypeScript, existing Supabase client.

---

### Task 1: Add email validation regex and validation logic

**Files:**
- Modify: `src/screens/authentication/LoginScreen.tsx:11-42`

- [ ] **Step 1: Write the failing test (manual verification)**
  Since this is a UI change and we don't have unit tests set up for components, we will manually verify the validation works.
  We'll create a test by attempting to log in with an invalid email and verifying the error message appears.

- [ ] **Step 2: Implement the validation logic**
  ```tsx
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) throw supabaseError;

      // Navigate based on user role (in real app, check user metadata)
      navigation.replace('MainTabs');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  ```

- [ ] **Step 3: Verify the changes work**
  - Run the app and navigate to the Login screen.
  - Attempt to log in with an invalid email (e.g., "test") and verify the error message "Please enter a valid email address" appears.
  - Attempt to log in with a valid email format (e.g., "test@example.com") and incorrect password to ensure we still get the Supabase error.
  - Attempt to log in with valid email and correct password (if available) to ensure successful login still works.

- [ ] **Step 4: Commit**
  ```bash
  git add src/screens/authentication/LoginScreen.tsx
  git commit -m "feat(login): add email format validation"
  ```
