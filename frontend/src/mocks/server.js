import { setupServer } from 'msw/node';

// Define default handlers here (empty array = no default mocks)
// Add your request handlers as needed:
// import { handlers } from './handlers';

export const server = setupServer();
