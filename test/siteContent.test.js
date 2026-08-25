import test from "node:test";
import assert from "node:assert/strict";
import { mergeSiteContent, toPublishedSiteContent } from "../src/utils/siteContent.js";

const baseContent = {
  stats: [],
  links: { additionalResources: [] },
  photos: { popup: {}, carouselSections: [], driveFolders: [] },
  modelPage: {},
  donations: { popup: {}, allocationItems: [], faqs: [] },
  organs: [],
  socialPosts: {},
  adminNews: [],
};

test("published content removes hidden collections without mutating the draft", () => {
  const draft = mergeSiteContent(baseContent, {
    organs: [{ id: "visible" }, { id: "hidden", hidden: true }],
    links: { additionalResources: [{ id: "resource", hidden: true }] },
    photos: {
      carouselSections: [{ id: "shown" }, { id: "secret", hidden: true }],
      driveFolders: [{ id: "folder", hidden: true }],
    },
    donations: {
      allocationItems: [{ id: "allocation", hidden: true }],
      faqs: [{ id: "faq", hidden: true }],
    },
    adminNews: [{ id: 1, title: "Visible" }, { id: 2, title: "Private", content: "Private", hidden: true }],
  });

  const published = toPublishedSiteContent(draft);

  assert.deepEqual(published.organs.map(({ id }) => id), ["visible"]);
  assert.deepEqual(published.photos.carouselSections.map(({ id }) => id), ["shown"]);
  assert.deepEqual(published.links.additionalResources, []);
  assert.deepEqual(published.donations.faqs, []);
  assert.deepEqual(published.adminNews[1], { id: 2, hidden: true });
  assert.equal(draft.adminNews[1].content, "Private");
});

test("legacy topic text is normalized in one place", () => {
  const content = mergeSiteContent(baseContent, {
    organs: [{ id: "AG", topicText: "Título\nSubtítulo" }],
  });

  assert.equal(content.organs[0].topicTitle, "Título");
  assert.equal(content.organs[0].topicSubtitle, "Subtítulo");
});
