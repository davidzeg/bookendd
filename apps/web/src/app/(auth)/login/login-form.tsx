"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginState, loginWithEmail } from "./actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/library";
  const errorFromRedirect = searchParams.get("error");

  const [state, formAction] = useActionState<LoginState, FormData>(
    async (previousState, formData) => {
      formData.append("redirectTo", redirectTo);
      return loginWithEmail(previousState, formData);
    },
    { error: null, success: false }
  );

  return (
    <div className="space-y-4">
      {/* Email/Password Form - Using React 19's form action */}
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
            autoComplete="current-password"
          />
        </div>

        {(state.error || errorFromRedirect) && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">
            {state.error || errorFromRedirect}
          </div>
        )}

        {/* SubmitButton uses useFormStatus internally */}
        <SubmitButton className="w-full">Sign in</SubmitButton>
      </form>
    </div>
  );
}
