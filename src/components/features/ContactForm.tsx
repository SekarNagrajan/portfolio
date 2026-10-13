"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  submitContact,
  type ContactState,
} from "@/lib/actions/contact";

const initialState: ContactState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      aria-disabled={pending}
      className="gap-2"
    >
      <Send className="size-4" />
      {pending ? "Sending…" : "Send message"}
    </Button>
  );
}

export function ContactForm() {
  const [state, action] = useActionState(submitContact, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const notifiedRef = useRef<ContactState | null>(null);

  // Toast + reset on success/failure. Guard with notifiedRef so the
  // same state object doesn't trigger duplicate toasts on re-render.
  useEffect(() => {
    if (!state || state === notifiedRef.current) return;
    if (state.success === true) {
      notifiedRef.current = state;
      toast.success(state.message ?? "Message sent.");
      formRef.current?.reset();
    } else if (state.success === false && state.message) {
      notifiedRef.current = state;
      toast.error(state.message);
    }
  }, [state]);

  const err = state?.errors;
  const inputs = state?.inputs;

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      className="space-y-5"
      aria-describedby="contact-form-status"
    >
      {/* Honeypot — hidden from humans + a11y tree, bots happily fill it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
      >
        <label htmlFor="honeypot">Leave this field empty</label>
        <input
          id="honeypot"
          type="text"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            defaultValue={inputs?.name ?? ""}
            aria-invalid={err?.name ? true : undefined}
            aria-describedby={err?.name ? "name-error" : undefined}
            placeholder="Jane Doe"
          />
          {err?.name && (
            <p id="name-error" className="text-xs text-destructive">
              {err.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={inputs?.email ?? ""}
            aria-invalid={err?.email ? true : undefined}
            aria-describedby={err?.email ? "email-error" : undefined}
            placeholder="jane@company.com"
          />
          {err?.email && (
            <p id="email-error" className="text-xs text-destructive">
              {err.email[0]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          defaultValue={inputs?.message ?? ""}
          aria-invalid={err?.message ? true : undefined}
          aria-describedby={err?.message ? "message-error" : undefined}
          placeholder="Tell me about your project, the problem you're solving, and how I can help."
        />
        {err?.message && (
          <p id="message-error" className="text-xs text-destructive">
            {err.message[0]}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton />

        {/* Inline, non-toast status message — also visible when JS is off. */}
        <p
          id="contact-form-status"
          role="status"
          aria-live="polite"
          className="text-sm"
        >
          {state?.success === true && (
            <span className="text-accent">{state.message}</span>
          )}
          {state?.success === false && !state?.errors && state?.message && (
            <span className="text-destructive">{state.message}</span>
          )}
        </p>
      </div>
    </form>
  );
}
