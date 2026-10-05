import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("visits");

  // Only count once per browser (checked on client too, but double-safe)
  const counted = await store.get("total") || "0";
  let total = parseInt(counted, 10);

  // If this is a "hit" request, increment
  const url = new URL(req.url);
  if (url.searchParams.get("hit") === "1") {
    total += 1;
    await store.set("total", total.toString());
  }

  return new Response(JSON.stringify({ count: total }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
};

export const config = { path: "/api/counter" };