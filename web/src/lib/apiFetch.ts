const apiFetch = async (url: string, options: RequestInit = {}) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL!;

  const apiUrl = apiBaseUrl + url;
  const opts: RequestInit = { ...options, credentials: 'include' }

  const response = await fetch(apiUrl, opts);
  return response;
}

export default apiFetch;
