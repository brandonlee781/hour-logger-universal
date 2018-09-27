import { User } from '@features/user/User';
import Project from './Project';

export default class Task {
  id: string;
  text: string;
  completed: boolean;
  estimate: number;
  // priority: number;
  project: Project;
  parent?: Task;
  children?: Task[];
  createdAt: string;
  updatedAt: string;
}
