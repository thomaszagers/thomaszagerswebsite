import "dotenv/config";
import { createClient } from "@sanity/client";

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET;
const SANITY_API_VERSION = process.env.SANITY_API_VERSION;
const SANITY_WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN;

if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_VERSION || !SANITY_WRITE_TOKEN) {
  throw new Error("Missing Sanity server environment variables.");
}

export const sanityServerClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false,
  token: SANITY_WRITE_TOKEN,
});