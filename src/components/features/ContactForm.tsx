"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { track } from "@vercel/analytics";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertCircle, Check, CornerDownLeft, RotateCcw } from "lucide-react";

import { CheckCircleIcon, SendIcon, hoverTrigger } from "@/components/icons/AnimatedIcons";
import { submitContact, type ContactState } from "@/lib/actions/contact";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const initialState: ContactState = {};

/* Mirrors ContactSchema so feedback is instant; the server still decides. */
const LIMITS = { name: [2, 100], message: [10, 5000] } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Field = "name" | "email" | "message";
type Values = Record<Field, string>;

function validate(field: Field, v: string): string | null {
  const t = v.trim();
  if (field === "name") {
    if (t.length < LIMITS.name[0]) return "Name must be at least 2 characters.";
    if (t.length > LIMITS.name[1]) return "Name is too long.";
  }
  if (field === "email" && !EMAIL_RE.test(t)) return "Enter a valid email address.";
  if (field === "message") {
    if (t.length < LIMITS.message[0]) return `A few more words, please (at least ${LIMITS.message[0]} characters).`;
    if (t.length > LIMITS.message[1]) return "Message is too long.";
  }
  return null;
}

/** One-click starters for the most common reasons people write. */
const TOPICS = [
  {
    id: "role",
    label: "Full-time role",
    starter: "Hi Sekar, I'm hiring for a [role] at [company]. The team works on [product], and I'd like to talk about whether you'd be a fit.",
  },
  {
    id: "contract",
    label: "Contract / freelance",
    starter: "Hi Sekar, we need help with [project]. Our stack is [stack], and the ideal timeline is [timeline].",
  },
  {
    id: "collab",
    label: "Collaboration",
    starter: "Hi Sekar, I'm working on [idea] and think we could build something together. Here's what I have in mind:",
  },
  { id: "hello", label: "Just saying hi", starter: "Hi Sekar, " },
] as const;

const STARTERS = new Set<string>(TOPICS.map((t) => t.starter));

/* ------------------------------------------------------------------ */

function SubmitButton() {
  const { pending } = useFormStatus();
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      {...hoverTrigger}
      animate={pending ? ["rest", "hover"] : "rest"}
      whileTap={{ scale: 0.97 }}
      className="relative inline-flex h-13 items-center gap-2.5 overflow-hidden rounded-full bg-foreground px-7 text-base font-semibold text-background disabled:cursor-progress"
    >
      {pending && !reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-y-0 w-1/2 bg-linear-to-r from-transparent via-background/25 to-transparent"
          initial={{ left: "-50%" }}
          animate={{ left: "120%" }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <SendIcon size={18} />
      {pending ? "Sending…" : "Send message"}
    </motion.button>
  );
}

export function ContactForm() {
  const [state, action] = useActionState(submitContact, initialState);
  const reduce = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const notifiedRef = useRef<ContactState | null>(null);

  const [values, setValues] = useState<Values>({
    name: state.inputs?.name ?? "",
    email: state.inputs?.email ?? "",
    message: state.inputs?.message ?? "",
  });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  /** Server errors are shown until the field is edited again. */
  const [editedSince, setEditedSince] = useState<{ state: ContactState | null; fields: Partial<Record<Field, boolean>> }>({
    state: null,
    fields: {},
  });
  const [topic, setTopic] = useState<string | null>(null);
  /** Lets "Send another" dismiss a success without a new action state. */
  const [dismissed, setDismissed] = useState<ContactState | null>(null);

  const sent = state.success === true && dismissed !== state;

  useEffect(() => {
    if (!state || state === notifiedRef.current) return;
    if (state.success === true) {
      notifiedRef.current = state;
      track("contact_submitted");
    } else if (state.success === false && state.message) {
      notifiedRef.current = state;
      toast.error(state.message);
    }
    // On phones the errors render above the submit button, off-screen —
    // move the visitor straight to the first invalid field.
    if (state.success === false && state.errors) {
      const el = document.querySelector<HTMLElement>('#contact [aria-invalid="true"]');
      if (el) {
        el.focus({ preventScroll: true });
        // After the error layout settles — a smooth scroll would be cut short.
        requestAnimationFrame(() => el.scrollIntoView({ block: "center", behavior: "instant" }));
      }
    }
  }, [state]);

  const errorFor = (f: Field): string | null => {
    const fresh = editedSince.state === state && editedSince.fields[f];
    const server = !fresh ? state.errors?.[f]?.[0] : undefined;
    if (server) return server;
    return touched[f] ? validate(f, values[f]) : null;
  };

  const set = (f: Field, v: string) => {
    setValues((s) => ({ ...s, [f]: v }));
    setEditedSince((e) => ({ state, fields: { ...(e.state === state ? e.fields : {}), [f]: true } }));
  };

  const pickTopic = (id: string) => {
    const t = TOPICS.find((x) => x.id === id)!;
    setTopic(id);
    // Only fill in a starter when the message is empty or still another starter.
    if (!values.message.trim() || STARTERS.has(values.message)) set("message", t.starter);
    requestAnimationFrame(() => {
      const el = messageRef.current;
      if (!el) return;
      el.focus();
      const at = el.value.indexOf("[");
      if (at >= 0) el.setSelectionRange(at, el.value.indexOf("]", at) + 1);
      else el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  const reset = () => {
    setValues({ name: "", email: "", message: "" });
    setTouched({});
    setTopic(null);
    setDismissed(state);
  };

  const len = values.message.trim().length;
  const ready = (["name", "email", "message"] as const).every((f) => !validate(f, values[f]));

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <Success key="sent" name={values.name.trim().split(" ")[0]} email={values.email} onReset={reset} />
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            action={action}
            noValidate
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            aria-describedby="contact-form-status"
            className="space-y-6"
          >
            {/* Honeypot — hidden from humans + a11y tree, bots happily fill it. */}
            <div aria-hidden className="pointer-events-none absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
              <label htmlFor="honeypot">Leave this field empty</label>
              <input id="honeypot" type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
            </div>

            {/* Topic starters */}
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-foreground/85">What&apos;s this about?</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => {
                  const on = topic === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => pickTopic(t.id)}
                      className={cn(
                        "relative isolate inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors",
                        on ? "border-accent text-accent-foreground" : "border-border/70 text-muted-foreground hover:border-accent/50 hover:text-foreground",
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId="contact-topic"
                          transition={reduce ? { duration: 0 } : spring.snappy}
                          className="absolute inset-0 -z-10 rounded-full bg-accent"
                        />
                      )}
                      {on && <Check size={14} strokeWidth={3} />}
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Picking one drafts a starter you can edit. The highlighted part is yours to fill in.</p>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <FloatField
                id="name"
                label="Your name"
                error={errorFor("name")}
                valid={!validate("name", values.name)}
                filled={!!values.name}
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  minLength={LIMITS.name[0]}
                  maxLength={LIMITS.name[1]}
                  autoComplete="name"
                  autoCapitalize="words"
                  autoCorrect="off"
                  enterKeyHint="next"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  aria-invalid={errorFor("name") ? true : undefined}
                  aria-describedby={errorFor("name") ? "name-error" : undefined}
                  placeholder=" "
                  className={fieldClass}
                />
              </FloatField>

              <FloatField
                id="email"
                label="Work email"
                error={errorFor("email")}
                valid={!validate("email", values.email)}
                filled={!!values.email}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={errorFor("email") ? true : undefined}
                  aria-describedby={errorFor("email") ? "email-error" : undefined}
                  placeholder=" "
                  className={fieldClass}
                />
              </FloatField>
            </div>

            <FloatField
              id="message"
              label="Your message"
              error={errorFor("message")}
              valid={!validate("message", values.message)}
              filled={!!values.message}
              multiline
              meter={<Meter len={len} />}
            >
              <textarea
                ref={messageRef}
                id="message"
                name="message"
                required
                minLength={LIMITS.message[0]}
                maxLength={LIMITS.message[1]}
                rows={7}
                value={values.message}
                onChange={(e) => set("message", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                aria-invalid={errorFor("message") ? true : undefined}
                aria-describedby={errorFor("message") ? "message-error" : "message-meter"}
                placeholder=" "
                className={cn(fieldClass, "min-h-44 resize-y pb-8 pr-10 pt-7")}
              />
            </FloatField>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <SubmitButton />
              <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
                <kbd className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px]">Ctrl</kbd>
                <span>+</span>
                <kbd className="inline-flex items-center rounded-md border border-border px-1.5 py-0.5">
                  <CornerDownLeft size={10} />
                </kbd>
                to send
              </span>
              <span className={cn("text-xs transition-colors", ready ? "text-accent" : "text-muted-foreground")}>
                {ready ? "Looks good. Ready to send." : "All three fields are required."}
              </span>

              {/* Inline, non-toast status — also visible when JS is off. */}
              <p id="contact-form-status" role="status" aria-live="polite" className="basis-full text-sm">
                {state.success === false && !state.errors && state.message && (
                  <span className="inline-flex items-center gap-2 text-destructive">
                    <AlertCircle size={16} /> {state.message}
                  </span>
                )}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const fieldClass =
  "peer block w-full rounded-2xl border border-border/80 bg-background/50 px-4 pb-2.5 pt-6 text-base text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-transparent hover:border-foreground/25 focus:border-accent focus:bg-background/80 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_18%,transparent)] aria-invalid:border-destructive/70";

function FloatField({
  id,
  label,
  error,
  valid,
  filled,
  multiline = false,
  meter,
  children,
}: {
  id: string;
  label: string;
  error: string | null;
  valid: boolean;
  filled: boolean;
  multiline?: boolean;
  meter?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="relative">
        {children}
        {/* Floats up on focus or once filled (placeholder=" " trick). */}
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 origin-left text-muted-foreground transition-all duration-200",
            multiline ? "top-5" : "top-1/2 -translate-y-1/2",
            "peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-accent",
            "peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs",
          )}
        >
          {label}
        </label>
        <AnimatePresence>
          {filled && valid && !error && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={spring.bouncy}
              aria-hidden
              className={cn("absolute right-3.5 grid size-5 place-items-center rounded-full bg-accent text-accent-foreground", multiline ? "top-3.5" : "top-1/2 -translate-y-1/2")}
            >
              <Check size={12} strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
        {meter}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 flex items-center gap-1.5 overflow-hidden text-xs text-destructive"
          >
            <AlertCircle size={13} className="shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Character progress toward the minimum, then a count toward the maximum. */
function Meter({ len }: { len: number }) {
  const min = LIMITS.message[0];
  const max = LIMITS.message[1];
  const toMin = Math.min(len / min, 1);
  return (
    <span id="message-meter" className="pointer-events-none absolute bottom-2.5 right-3.5 flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground">
      <svg viewBox="0 0 20 20" className="size-4 -rotate-90" aria-hidden>
        <circle cx="10" cy="10" r="8" fill="none" strokeWidth="2.5" className="stroke-foreground/10" />
        <motion.circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={toMin >= 1 ? "stroke-accent" : "stroke-muted-foreground"}
          animate={{ pathLength: toMin }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </svg>
      {len < min ? `${min - len} more to go` : `${len.toLocaleString()} / ${max.toLocaleString()}`}
    </span>
  );
}

/* ------------------------------------------------------------------ */

function Success({
  name,
  email,
  onReset,
}: {
  name: string;
  email: string;
  onReset: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={spring.soft}
      role="status"
      aria-live="polite"
      className="relative flex min-h-[28rem] flex-col items-center justify-center overflow-hidden text-center"
    >
      {/* Paper plane takes off */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute text-accent"
          initial={{ x: -140, y: 60, rotate: -10, opacity: 0 }}
          animate={{ x: [-140, 0, 260], y: [60, -10, -160], rotate: [-10, 0, 12], opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, ease: "easeInOut", times: [0, 0.45, 1] }}
        >
          <SendIcon size={34} />
        </motion.span>
      )}

      <motion.span
        initial={reduce ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...spring.bouncy, delay: reduce ? 0 : 0.9 }}
        className="relative grid size-20 place-items-center rounded-full bg-accent/15 text-accent"
      >
        {!reduce && (
          <motion.span
            className="absolute inset-0 rounded-full ring-2 ring-accent"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.4, delay: 1, repeat: 2 }}
          />
        )}
        <CheckCircleIcon size={38} trigger="mount" />
      </motion.span>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.soft, delay: reduce ? 0 : 1.05 }}
        className="mt-6 max-w-md"
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Thanks{name ? `, ${name}` : ""}. Message sent.
        </h2>
        <p className="mt-2 text-pretty text-muted-foreground">
          It&apos;s in my inbox now, and I usually reply within one working day. A confirmation email is on its way to{" "}
          <span className="font-medium text-foreground">{email || "you"}</span>.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:border-accent/50"
        >
          <RotateCcw size={15} /> Send another
        </button>
      </motion.div>
    </motion.div>
  );
}
