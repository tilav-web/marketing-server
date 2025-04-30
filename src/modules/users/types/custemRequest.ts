// somewhere in your project (e.g., src/types/express.d.ts)
import { Request } from 'express';
import { UserProvider } from 'src/common/enums/user-provider-enum';
import { UserRole } from 'src/common/enums/user-role-enum';

export interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    email: string;
    name: string;
    googleId: string;
    avatar: string;
    provider: UserProvider;
    role: UserRole;
  };
}
