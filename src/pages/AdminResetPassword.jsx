import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { isSupabaseConfigured, passwordRecoveryCallbackHasError } from "../lib/supabaseClient";
import { contentService } from "../services/contentService";
import { getPasswordValidationError } from "../utils/authSecurity";

const clearAuthParameters = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

const AdminResetPassword = () => {
  const invalidTimer = useRef(null);
  const [state, setState] = useState("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured || passwordRecoveryCallbackHasError) {
      clearAuthParameters();
      setState("invalid");
      return undefined;
    }

    let active = true;
    const acceptRecovery = (session) => {
      if (!active || !session) return;
      if (invalidTimer.current) window.clearTimeout(invalidTimer.current);
      if (session.user?.app_metadata?.role !== "admin") {
        clearAuthParameters();
        setState("invalid");
        return;
      }
      clearAuthParameters();
      setState("ready");
    };

    const unsubscribe = contentService.onRecoveryStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") acceptRecovery(session);
    });

    contentService.getRecoverySession()
      .then((session) => {
        if (session) acceptRecovery(session);
        else if (active) invalidTimer.current = window.setTimeout(() => setState("invalid"), 1500);
      })
      .catch(() => { if (active) setState("invalid"); });

    return () => {
      active = false;
      if (invalidTimer.current) window.clearTimeout(invalidTimer.current);
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = getPasswordValidationError(password);
    if (validationError) {
      setStatus(validationError);
      return;
    }
    if (password !== confirmation) {
      setStatus("Las contraseñas no coinciden.");
      return;
    }

    setState("saving");
    setStatus("");
    try {
      await contentService.updatePassword(password);
      await contentService.signOut();
      setPassword("");
      setConfirmation("");
      setState("success");
    } catch {
      setState("ready");
      setStatus("No se pudo cambiar la contraseña. Solicitá un enlace nuevo e intentá nuevamente.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-16">
      <section className="mx-auto max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold text-blue-950">Cambiar contraseña</h1>

        {state === "checking" && <p className="text-sm text-gray-600" role="status">Verificando el enlace seguro...</p>}

        {state === "invalid" && (
          <>
            <p className="mb-5 text-sm text-gray-700">El enlace es inválido, venció o ya fue utilizado. Solicitá uno nuevo desde el acceso al panel.</p>
            <Link to="/admin" className="inline-block rounded-md bg-blue-950 px-4 py-2 font-semibold text-white">Volver al login</Link>
          </>
        )}

        {state === "success" && (
          <>
            <p className="mb-5 text-sm text-gray-700">La contraseña fue actualizada. Cerramos las sesiones activas por seguridad.</p>
            <Link to="/admin" className="inline-block rounded-md bg-blue-950 px-4 py-2 font-semibold text-white">Ingresar con la contraseña nueva</Link>
          </>
        )}

        {(state === "ready" || state === "saving") && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">Usá al menos 12 caracteres, con mayúscula, minúscula y número.</p>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Nueva contraseña</span>
              <input
                type="password"
                name="new-password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={12}
                maxLength={128}
                required
                disabled={state === "saving"}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Repetir contraseña</span>
              <input
                type="password"
                name="confirm-password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                minLength={12}
                maxLength={128}
                required
                disabled={state === "saving"}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </label>
            <button disabled={state === "saving"} className="w-full rounded-md bg-blue-950 px-4 py-2 font-semibold text-white disabled:cursor-wait disabled:opacity-60">
              {state === "saving" ? "Actualizando..." : "Guardar contraseña nueva"}
            </button>
            {status && <p className="text-sm text-red-700" role="alert">{status}</p>}
          </form>
        )}
      </section>
    </main>
  );
};

export default AdminResetPassword;
