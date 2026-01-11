a# Plan: Add Hide/Show Password Toggle to Login Page

## Goal

Improve user experience on the login page by allowing users to toggle password visibility.

## Changes to be made in `app/auth/login/page.tsx`

1. **Imports**:

   - Import `Eye` and `EyeOff` icons from `lucide-react`.

2. **State Management**:

   - Add `showPassword` state variable (boolean) to track password visibility.

3. **UI Updates (Password Field)**:

   - Wrap the password input in a `relative` div (already has `relative` on inputs, so we can keep it or adjust).
   - Replace the standard `password` type `input` with a container that includes:
     - The input field (type changes between `password` and `text`).
     - A button/icon on the right side to toggle visibility.

4. **Functionality**:
   - Add a toggle function or inline logic to switch `showPassword` state.

## Implementation Steps

1. Add imports for `Eye` and `EyeOff` from `lucide-react`.
2. Initialize `const [showPassword, setShowPassword] = useState(false);`.
3. Update the password field:
   - Change `type` to `{showPassword ? "text" : "password"}`.
   - Add a button on the right side of the input using absolute positioning.
   - Button will toggle the state and show the appropriate icon.
