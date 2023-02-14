import logger from '../utils/logger';
import { JsonWebTokenError } from 'jsonwebtoken';
import {verifyToken} from '../utils/tokenizer';

async function decodeTokenMiddleware(req: any): Promise<void> {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new JsonWebTokenError('No token provided');
    }
    try {
      req.decodedUser = await verifyToken(token);
      return;
    } catch (err: any) {
      logger.error(err);
      throw new JsonWebTokenError('Invalid token');
    }
  } else {
    throw {message: 'Please log in first', status: 401 }
  }
}

export default decodeTokenMiddleware;