const API_URL = "http://localhost:4000";
export async function apiRequest({ resource, method = "GET", body, token }) {
  const res = await fetch(`${API_URL}${resource}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    ...(body && {
      body: JSON.stringify(body),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}
