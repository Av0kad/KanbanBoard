const API_URL = import.meta.env.VITE_API_URL;

export async function getWorkspaces() {
  const response = await fetch(`${API_URL}/workspaces`);

  if (!response.ok) {
    throw new Error("Failed to fetch workspaces");
  }

  return response.json();
}
