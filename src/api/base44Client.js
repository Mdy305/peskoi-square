import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "693fa4d9b7765f4b9419f3d3", 
  requiresAuth: true // Ensure authentication is required for all operations
});
