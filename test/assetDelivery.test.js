import test from "node:test";
import assert from "node:assert/strict";
import { getAssetDeliveryUrl, mapAssetDelivery } from "../src/utils/assetDelivery.js";

const projectOrigin = "https://example.supabase.co";

test("maps public site assets to the local media delivery route", () => {
  const source = `${projectOrigin}/storage/v1/object/public/site-assets/optimized/news/photo.webp`;
  assert.equal(getAssetDeliveryUrl(source, projectOrigin), "/media/optimized/news/photo.webp");
});

test("does not proxy unrelated or malformed URLs", () => {
  assert.equal(getAssetDeliveryUrl("https://images.example.com/photo.webp", projectOrigin), "https://images.example.com/photo.webp");
  assert.equal(getAssetDeliveryUrl("not a url", projectOrigin), "not a url");
});

test("maps nested public content without mutating the source", () => {
  const sourceUrl = `${projectOrigin}/storage/v1/object/public/site-assets/optimized/photo.webp`;
  const content = { photos: [sourceUrl], external: "https://example.com/photo.webp" };
  const delivered = mapAssetDelivery(content, projectOrigin);

  assert.deepEqual(delivered, { photos: ["/media/optimized/photo.webp"], external: content.external });
  assert.equal(content.photos[0], sourceUrl);
});
