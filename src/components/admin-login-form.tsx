"use client";

import { useActionState } from "react";
import { sendAdminMagicLink } from "@/app/admin/auth-actions";
import { SubmitButton } from "@/components/submit-button";
import { initialFormState } from "@/lib/form-state";

export function AdminLoginForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, action] = useActionState(sendAdminMagicLink, initialFormState);

  return (
    <form action={action} className="mt-8 grid gap-5" noValidate>
      <label className="font-semibold">
        Admin email
        <input
          className="mt-2 min-h-12 w-full border-2 border-black bg-white px-3 py-2 focus:shadow-[4px_4px_0_#ff5a12] focus:outline-none"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={defaultEmail}
          required
        />
      </label>
      {state.status !== "idle" ? (
        <p
          className={`border-2 p-4 text-sm font-semibold ${
            state.status === "success"
              ? "border-green-800 bg-green-50 text-green-900"
              : "border-red-800 bg-red-50 text-red-900"
          }`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}
      <SubmitButton>Email me a sign-in link</SubmitButton>
    </form>
  );
}
