import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: "du8uvp02",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: unknown) {
  return builder.image(source);
}
