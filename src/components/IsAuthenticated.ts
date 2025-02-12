import { NextRequest } from "next/server";

async function checkAuth(req?: NextRequest) {
  const controller = new AbortController();
  let url;

  try {
    if (req) {
      url = new URL("/api/auth/verify", req.url).toString();
    } else {
      url = "/api/auth/verify";
    }

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      signal: controller.signal,
    });

    const result = await response.json();
    return [result.valid, result.userId, result.name];
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  } finally {
    controller.abort();
  }
}

export default checkAuth;
