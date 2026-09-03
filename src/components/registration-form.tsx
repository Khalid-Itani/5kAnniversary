"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { registerParticipant } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { initialFormState, type FormState } from "@/lib/form-state";

const fieldClass =
  "mt-2 min-h-12 w-full border-2 border-black bg-white px-3 py-2 text-base shadow-none transition-shadow focus:shadow-[4px_4px_0_#ff5a12] focus:outline-none";

export function RegistrationForm() {
  const [state, action] = useActionState(registerParticipant, initialFormState);
  const [webMcpState, setWebMcpState] = useState<FormState>(initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const displayState = webMcpState.status === "idle" ? state : webMcpState;

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const registration = context.registerTool(
      {
        name: "submit_race_registration",
        title: "Submit Coach Arena 5K registration",
        description:
          "Submit an adult runner or walker registration after the person has donated at least $20 through the official GoFundMe.",
        inputSchema: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            ageOnRaceDay: { type: "integer", minimum: 18 },
            city: { type: "string" },
            participationType: { type: "string", enum: ["run", "walk"] },
            referralSource: { type: "string" },
            donorName: { type: "string" },
            amountClaimed: { type: "number", minimum: 20 },
            emailUpdates: { type: "boolean" },
          },
          required: [
            "firstName",
            "lastName",
            "email",
            "ageOnRaceDay",
            "city",
            "participationType",
            "donorName",
            "amountClaimed",
          ],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) {
          if (!input || typeof input !== "object") {
            throw new Error("Registration details are required.");
          }
          const values = input as Record<string, unknown>;
          const formData = new FormData();
          for (const [key, value] of Object.entries(values)) {
            if (key === "emailUpdates") continue;
            formData.set(key, String(value ?? ""));
          }
          if (values.emailUpdates === true) formData.set("emailUpdates", "on");
          formData.set("website", "");

          const result = await registerParticipant(initialFormState, formData);
          setWebMcpState(result);
          if (result.status === "success") formRef.current?.reset();
          return result;
        },
      },
      { signal: lifecycle.signal },
    );

    void Promise.resolve(registration).catch(() => {
      // The visible form remains fully functional if experimental WebMCP fails.
    });
    return () => lifecycle.abort();
  }, []);

  return (
    <form ref={formRef} action={action} className="grid gap-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="font-semibold">
          First name
          <input className={fieldClass} name="firstName" autoComplete="given-name" required />
        </label>
        <label className="font-semibold">
          Last name
          <input className={fieldClass} name="lastName" autoComplete="family-name" required />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1.4fr_0.6fr]">
        <label className="font-semibold">
          Email
          <input className={fieldClass} name="email" type="email" autoComplete="email" required />
        </label>
        <label className="font-semibold">
          Age on race day
          <input className={fieldClass} name="ageOnRaceDay" type="number" min="18" max="120" inputMode="numeric" required />
        </label>
      </div>

      <label className="font-semibold">
        City
        <input className={fieldClass} name="city" autoComplete="address-level2" required />
      </label>

      <fieldset>
        <legend className="font-semibold">How will you participate?</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            ["run", "Run"],
            ["walk", "Walk"],
          ].map(([value, label]) => (
            <label
              className="flex min-h-14 cursor-pointer items-center gap-3 border-2 border-black bg-white px-4 has-[:checked]:bg-[#ff5a12]"
              key={value}
            >
              <input name="participationType" type="radio" value={value} required />
              <span className="display-type text-xl">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="font-semibold">
        How or who did you hear about us?
        <input className={fieldClass} name="referralSource" />
      </label>

      <div className="border-l-4 border-[#ff5a12] bg-[#ede8de] p-5">
        <p className="display-type text-2xl">Donation match</p>
        <p className="mt-2 text-sm leading-6 text-[#5d5952]">
          Enter the name shown on the GoFundMe donation. We use this only to
          confirm the required $20 race entry manually.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_10rem]">
          <label className="font-semibold">
            GoFundMe donor name
            <input className={fieldClass} name="donorName" required />
          </label>
          <label className="font-semibold">
            Amount donated
            <span className="relative mt-2 block">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">$</span>
              <input
                className={`${fieldClass} !mt-0 pl-7`}
                name="amountClaimed"
                type="number"
                inputMode="decimal"
                min="20"
                step="0.01"
                required
              />
            </span>
          </label>
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm leading-6">
        <input className="mt-1.5 h-4 w-4 accent-[#ff5a12]" name="emailUpdates" type="checkbox" />
        <span>
          Email me event reminders and future updates about the Robert Arena
          Scholarship. I can unsubscribe at any time.
        </span>
      </label>

      <label className="absolute -left-[10000px]" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {displayState.status !== "idle" ? (
        <p
          className={`border-2 p-4 text-sm font-semibold ${
            displayState.status === "success"
              ? "border-green-800 bg-green-50 text-green-900"
              : "border-red-800 bg-red-50 text-red-900"
          }`}
          role={displayState.status === "error" ? "alert" : "status"}
        >
          {displayState.message}
        </p>
      ) : null}

      <SubmitButton>Submit registration</SubmitButton>
      <p className="text-center text-xs leading-5 text-[#6b6862]">
        Your entry remains pending until the donation is verified. By submitting,
        you confirm that the information above is accurate.
      </p>
    </form>
  );
}
