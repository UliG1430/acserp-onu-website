export const PASSWORD_RESET_PATH = "/admin/reset-password";

export const buildPasswordResetRedirect = (origin) => {
  const url = new URL(PASSWORD_RESET_PATH, origin);
  const isLocalDevelopment = url.hostname === "localhost" || url.hostname === "127.0.0.1";

  if (url.protocol !== "https:" && !(isLocalDevelopment && url.protocol === "http:")) {
    throw new Error("El origen de recuperación no es seguro.");
  }

  url.search = "";
  url.hash = "";
  return url.toString();
};

export const getPasswordValidationError = (password = "") => {
  if (password.length < 12) return "La contraseña debe tener al menos 12 caracteres.";
  if (password.length > 128) return "La contraseña no puede superar los 128 caracteres.";
  if (!/[a-z]/.test(password)) return "La contraseña debe incluir una letra minúscula.";
  if (!/[A-Z]/.test(password)) return "La contraseña debe incluir una letra mayúscula.";
  if (!/[0-9]/.test(password)) return "La contraseña debe incluir un número.";
  return "";
};
