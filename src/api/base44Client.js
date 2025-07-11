import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "686f016c628738fdde5d3514", 
  requiresAuth: true // Ensure authentication is required for all operations
});
