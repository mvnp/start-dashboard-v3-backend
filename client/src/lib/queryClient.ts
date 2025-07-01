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
  const businessId = localStorage.getItem('x-selected-business-id');
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Add business context for business-scoped endpoints
  const businessScopedEndpoints = [
    '/api/staff',
    '/api/clients', 
    '/api/appointments',
    '/api/services',
    '/api/whatsapp-instances',
    '/api/payment-gateways',
    '/api/support-tickets',
    '/api/accounting-transactions',
    '/api/accounting-transaction-categories',
    '/api/shop-categories',
    '/api/shop-products',
    '/api/settings'
  ];

  const isBusinessScoped = businessScopedEndpoints.some(endpoint => url.includes(endpoint));
  
  if (isBusinessScoped && businessId) {
    headers["x-selected-business-id"] = businessId;
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
    const businessId = localStorage.getItem('x-selected-business-id');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Construct URL from queryKey
    let url = queryKey[0] as string;
    
    // Handle parameterized URLs like ["/api/businesses", id] or ["/api/services/123", businessId]
    if (queryKey.length > 1 && queryKey[1] !== null && queryKey[1] !== undefined) {
      // For business endpoints with ID parameter
      if (url === "/api/businesses") {
        url = `${url}/${queryKey[1]}`;
      }
      // For business-scoped list endpoints, don't append business ID to URL - use headers instead
      else if (url === "/api/staff" || 
               url === "/api/clients" || 
               url === "/api/services" || 
               url === "/api/appointments" ||
               url === "/api/payment-gateways" ||
               url === "/api/whatsapp-instances" ||
               url === "/api/support-tickets" ||
               url === "/api/accounting-transactions" ||
               url === "/api/barber-plans" ||
               url === "/api/shop-categories" ||
               url === "/api/shop-products") {
        // Keep URL as-is, business ID is handled via headers not URL parameters
      }
      // For individual resource endpoints (already have ID in URL), don't append anything
      else if (url.match(/^\/api\/(services|clients|staff|appointments|payment-gateways|whatsapp-instances|support-tickets|accounting-transactions|barber-plans|shop-categories|shop-products)\/\d+$/)) {
        // URL already has resource ID, don't append business ID - use headers instead
      }
      // Add other parameterized endpoints as needed
      else if (url.startsWith('/api/') && !url.includes('?')) {
        url = `${url}/${queryKey[1]}`;
      }
    }
    
    // Add business context for business-scoped endpoints
    const businessScopedEndpoints = [
      '/api/staff',
      '/api/clients', 
      '/api/appointments',
      '/api/services',
      '/api/whatsapp-instances',
      '/api/payment-gateways',
      '/api/support-tickets',
      '/api/accounting-transactions',
      '/api/settings'
    ];

    const isBusinessScoped = businessScopedEndpoints.some(endpoint => url.includes(endpoint));
    
    if (isBusinessScoped && businessId) {
      headers["x-selected-business-id"] = businessId;
    }

    const res = await fetch(url, {
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
