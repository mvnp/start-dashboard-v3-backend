import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = localStorage.getItem('accessToken');
  // Get selected business ID from business context storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const selectedBusinessId = user.email ? localStorage.getItem(`selectedBusinessId_${user.email}`) : null;
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Debug localStorage contents
  console.log(`API Request [${method}] ${url}:`, {
    userEmail: user.email,
    selectedBusinessId,
    localStorageKey: user.email ? `selectedBusinessId_${user.email}` : 'no-email',
    allLocalStorageKeys: Object.keys(localStorage).filter(k => k.includes('selectedBusinessId'))
  });
  
  if (selectedBusinessId) {
    headers["business-id"] = selectedBusinessId;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = localStorage.getItem('accessToken');
    // Get selected business ID from business context storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const selectedBusinessId = user.email ? localStorage.getItem(`selectedBusinessId_${user.email}`) : null;
    const headers: Record<string, string> = {};
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    if (selectedBusinessId) {
      headers["business-id"] = selectedBusinessId;
      console.log(`🔧 Query [GET] ${queryKey[0]} - Sending business-id: ${selectedBusinessId}`);
    } else {
      console.log(`⚠️ Query [GET] ${queryKey[0]} - No business ID found. User email: ${user.email}`);
    }

    const res = await fetch(queryKey[0] as string, {
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true, // Refetch when window gains focus
      refetchOnMount: "always", // Always refetch when component mounts
      staleTime: 30 * 1000, // Data is stale after 30 seconds
      gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      retry: (failureCount, error: any) => {
        // Don't retry 401 errors (authentication)
        if (error?.message?.includes('401')) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
