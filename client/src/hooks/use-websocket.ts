import { useEffect, useRef, useState } from 'react';
import { queryClient } from '@/lib/queryClient';

interface WebSocketMessage {
  type: string;
  eventType: 'create' | 'update' | 'delete';
  data: any;
  businessId?: number;
}

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect WebSocket on accounting pages - return early for all other pages
    if (!window.location.pathname.includes('/accounting')) {
      setIsConnected(false);
      return () => {}; // Return empty cleanup function
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    // Ensure we're not conflicting with Vite's HMR WebSocket
    if (wsUrl.includes('undefined') || wsUrl.includes('token=')) {
      console.warn('Skipping WebSocket connection due to invalid URL');
      setIsConnected(false);
      return;
    }
    
    try {
      ws.current = new WebSocket(wsUrl);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnected(false);
      return;
    }

    ws.current.onopen = () => {
      console.log('WebSocket connected for real-time updates');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        if (message.type === 'accounting_transaction_update') {
          // Invalidate accounting transactions queries to trigger refetch
          queryClient.invalidateQueries({ 
            queryKey: ["/api/accounting-transactions"] 
          });
          
          console.log(`Real-time update: ${message.eventType} accounting transaction`, message.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return { isConnected };
}