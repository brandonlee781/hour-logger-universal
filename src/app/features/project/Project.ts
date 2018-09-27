import { User } from '@features/user/User';

import Log from '../log/Log';

export default class Project {
  id: string;
  name: string;
  color: string;
  favorite: boolean;
  logs?: Log[];
  user?: User;
  updatedAt: string;
  createdAt: string;
}
