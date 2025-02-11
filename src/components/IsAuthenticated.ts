async function checkAuth() {
  const controller = new AbortController();

  try {
    const response = await fetch("/api/auth/verify", {
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
