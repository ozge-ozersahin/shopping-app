// Try to read a useful error message from the API response
export async function getErrorMessage(response: Response, fallback: string) {
    try {
      const errorData = await response.json();
      return errorData.message || fallback;
    } catch {
      return fallback;
    }
  }