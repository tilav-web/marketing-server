// somewhere in your project (e.g., src/types/express.d.ts)
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    email: string;
    name: string;
    googleId: string;
    avatar: string;
    provider: string;
  };
}
