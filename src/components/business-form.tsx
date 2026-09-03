"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitBusinessInquiry } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { initialFormState } from "@/lib/form-state";

const fieldClass =
  "mt-2 min-h-12 w-full border-2 border-black bg-white px-3 py-2 text-base transition-shadow focus:shadow-[4px_4px_0_#ff5a12] focus:outline-none";

export function BusinessForm() {
  const [state, action] = useActionState(submitBusinessInquiry, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={action} className="grid gap-6" noValidate>
      <label className="font-semibold">
        Business or organization name
        <input className={fieldClass} name="businessName" autoComplete="organization" required />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="font-semibold">
          Contact name
          <input className={fieldClass} name="contactName" autoComplete="name" required />
        </label>
        <label className="font-semibold">
          City
          <input className={fieldClass} name="city" autoComplete="address-level2" />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="font-semibold">
          Email
          <input className={fieldClass} name="email" type="email" autoComplete="email" required />
        </label>
        <label className="font-semibold">
          Phone <span className="font-normal text-[#6b6862]">(optional)</span>
          <input className={fieldClass} name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <label className="font-semibold">
        How would you like to participate?
        <select className={fieldClass} name="interestType" defaultValue="" required>
          <option value="" disabled>Choose one</option>
          <option value="cash_sponsor">Cash sponsorship</option>
          <option value="food_drink">Food or drinks</option>
          <option value="products_merch">Products, shirts, or merchandise</option>
          <option value="prize_gift_card">Prize or gift card</option>
          <option value="event_table">Event-day table</option>
          <option value="other">Something else</option>
        </select>
      </label>
      <label className="font-semibold">
        Tell us what you have in mind
        <textarea className={`${fieldClass} min-h-36 resize-y`} name="message" required />
      </label>
      <label className="absolute -left-[10000px]" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
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
      <SubmitButton>Send business inquiry</SubmitButton>
    </form>
  );
}
