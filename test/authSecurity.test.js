import test from "node:test";
import assert from "node:assert/strict";
import { buildPasswordResetRedirect, getPasswordValidationError } from "../src/utils/authSecurity.js";

test("password recovery stays on the current secure origin", () => {
  assert.equal(
    buildPasswordResetRedirect("https://acserp.org.ar"),
    "https://acserp.org.ar/admin/reset-password"
  );
  assert.equal(
    buildPasswordResetRedirect("http://localhost:5173"),
    "http://localhost:5173/admin/reset-password"
  );
  assert.throws(() => buildPasswordResetRedirect("http://example.com"), /seguro/);
});

test("admin passwords must satisfy the strong client-side policy", () => {
  assert.match(getPasswordValidationError("short"), /12 caracteres/);
  assert.match(getPasswordValidationError("alllowercase123!"), /mayúscula/);
  assert.match(getPasswordValidationError("NOLOWERCASE123!"), /minúscula/);
  assert.match(getPasswordValidationError("NoNumbersHere!"), /número/);
  assert.match(getPasswordValidationError("NoSymbolsHere123"), /símbolo/);
  assert.equal(getPasswordValidationError("UnaClaveLarga123!"), "");
});
