import Project from '../project/Project';

export default class Log {
  id?: string;
  start: string;
  end: string;
  duration: number;
  note: string;
  project: Project;
  // user: User;
  createdAt?: string;
  updatedAt?: string;
}
