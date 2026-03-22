'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction } from '@/app/(auth)/login/actions';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <motion.button
      type="submit"
      disabled={pending}
      className="w-full bg-neon-cyan text-text-inverse font-pixel text-h4 border border-cyan-muted rounded-md px-6 py-4 hover:bg-cyan-light hover:shadow-glow-md-cyan active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-base flex items-center justify-center gap-3"
      whileTap={{ scale: 0.97 }}
    >
      {pending ? (
        <span className="animate-pulse">AUTHENTICATING...</span>
      ) : (
        <>
          <LogIn size={16} />
          INSERT COIN
        </>
      )}
    </motion.button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { error: null });

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="username" className="block font-pixel text-h4 text-text-secondary mb-2">
          USERNAME
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          placeholder="Enter username"
          required
          className="w-full bg-surface-2 text-text-primary font-body border border-surface-3 rounded-md px-4 py-3 placeholder:text-text-tertiary focus:border-neon-cyan focus:shadow-glow-sm-cyan focus:outline-none transition-all duration-150"
        />
      </div>

      <div>
        <label htmlFor="password" className="block font-pixel text-h4 text-text-secondary mb-2">
          PASSWORD
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter password"
          required
          className="w-full bg-surface-2 text-text-primary font-body border border-surface-3 rounded-md px-4 py-3 placeholder:text-text-tertiary focus:border-neon-cyan focus:shadow-glow-sm-cyan focus:outline-none transition-all duration-150"
        />
      </div>

      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error/10 border border-error/30 rounded-md px-4 py-3 text-error-light text-body-sm"
        >
          {state.error}
        </motion.div>
      )}

      <SubmitButton />
    </form>
  );
}
