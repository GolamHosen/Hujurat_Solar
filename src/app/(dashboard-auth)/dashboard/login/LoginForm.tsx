"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

/**
 * Demo credentials are surfaced only in local development. They must never be
 * rendered (or prefilled) by a production build, because the sign-in page is
 * publicly reachable.
 */
const SHOW_DEV_HINT = process.env.NODE_ENV !== "production";

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} autoComplete="on" className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="username"
          maxLength={255}
          spellCheck={false}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-brand focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          maxLength={200}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-brand focus:outline-none"
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-brand px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-dark disabled:opacity-70"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
      {SHOW_DEV_HINT && (
        <p className="text-center text-xs text-slate-500">
          Local development only — run <code>npm run seed</code> and use the admin password you set in{" "}
          <code>ADMIN_PASSWORD</code>.
        </p>
      )}
    </form>
  );
}

