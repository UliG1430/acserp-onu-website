import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

globalThis.window = new JSDOM("<!doctype html><html><body></body></html>").window;
const { isSafeExternalUrl, sanitizeRichHtml, validateSiteContentUrls } = await import("../src/utils/contentSecurity.js");

test("rich HTML keeps formatting and removes executable content", () => {
  const result = sanitizeRichHtml(`
    <h2 class="headline" style="position:fixed">Título <strong>lindo</strong></h2>
    <script>alert(1)</script>
    <p onclick="alert(2)">Texto</p>
    <a href="javascript:alert(3)" target="_blank">Malo</a>
    <a href="https://acserp.org.ar" target="_blank">Bueno</a>
    <table><tbody><tr><td>Dato</td></tr></tbody></table>
  `);

  assert.match(result, /<h2 class="headline">Título <strong>lindo<\/strong><\/h2>/);
  assert.match(result, /<table>/);
  assert.doesNotMatch(result, /script|onclick|position:fixed|javascript:/i);
  assert.match(result, /rel="noopener noreferrer"/);
});

test("external URL validation blocks dangerous protocols and credentials", () => {
  assert.equal(isSafeExternalUrl("https://drive.google.com/drive/folders/example"), true);
  assert.equal(isSafeExternalUrl("javascript:alert(1)"), false);
  assert.equal(isSafeExternalUrl("https://user:password@example.com"), false);
  assert.equal(isSafeExternalUrl("https://example.com", { allowedHosts: ["youtube.com"] }), false);
});

test("admin social content rejects forged YouTube embeds", () => {
  assert.throws(
    () => validateSiteContentUrls({ socialPosts: { youtube: [{ id: "javascript:alert(1)", url: "https://youtube.com/watch?v=test" }] } }),
    /YouTube/
  );
});
