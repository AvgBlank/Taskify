import apiFetch from "./apiFetch";

async function checkAuth() {
  try {
    const response = await apiFetch("/api/auth/verify");

    const result = await response.json();
    return {
      valid: result.valid,
      userId: result.userId,
      name: result.name,
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return { valid: false };
  }
}

export default checkAuth;
