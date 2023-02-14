import {createServer} from 'http';
import app from './api'; // index.ts
import { PORT, BASE_URL } from './config';
import logger from './api/utils/logger';

// Spin server
const server = createServer(app);
server.listen(PORT, () => logger.info(`Server listening on ${PORT}`));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(err);
  logger.info('Shutting down due to uncaught exception');
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err:any) => {
  logger.error(err);
  // Close server & exit process
  logger.info('Shutting down the server due to Unhandled Promise rejection');
  server.close(() => process.exit(1));
});
