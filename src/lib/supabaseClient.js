import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const callbackHash = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.hash.replace(/^#/, ""));
const callbackQuery = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);

export const passwordRecoveryCallbackHasError = Boolean(
  callbackHash.get("error")
  || callbackHash.get("error_code")
  || callbackQuery.get("error")
  || callbackQuery.get("error_code")
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

let capturedPasswordRecoverySession = null;

if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") capturedPasswordRecoverySession = session;
    if (event === "SIGNED_OUT") capturedPasswordRecoverySession = null;
  });
}

export const getCapturedPasswordRecoverySession = () => capturedPasswordRecoverySession;
