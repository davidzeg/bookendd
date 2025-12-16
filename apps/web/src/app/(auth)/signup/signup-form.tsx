"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupWithEmail } from "./actions";

type SignupState = {
  error: string | null;
  success: boolean;
  message?: string;
};

export function SignupForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/library";

  const [state, formAction] = useActionState<SignupState, FormData>(
    async (previousState, formData) => {
      formData.append("redirectTo", redirectTo);
      return signupWithEmail(previousState, formData);
    },
    { error: null, success: false }
  );

  return (
    <div className="space-y-4">
      {/* Email/Password Form */}
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters with uppercase, lowercase, and a
            number
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
          />
        </div>

        {state.error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">
            {state.error}
          </div>
        )}

        {state.success && state.message && (
          <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md">
            {state.message}
          </div>
        )}

        <SubmitButton className="w-full">Create account</SubmitButton>
      </form>
    </div>
  );
}
