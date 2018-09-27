import Project from '@features/project/Project';
import Task from '@features/project/Task';
import gql from 'graphql-tag';

export const GET_PROJECT_NAMES = gql`
  query AllProjectNames {
    allProjects {
      projects {
        id
        name
        color
        favorite
      }
    }
  }
`;
export interface GetProjectNameQuery {
  allProjects: {
    projects: Project[];
  };
}

export const GET_PROJECT_TASK = gql`
  query ProjectTasks($project: String!, $limit: Int, $offset: Int) {
    projectTasks(
      input: { project: $project }
      options: { limit: $limit, offset: $offset }
    ) {
      tasks {
        id
        text
        completed
        estimate
        children {
          id
          text
          completed
          estimate
          children {
            id
            text
            completed
            estimate
            children {
              id
              text
              completed
              estimate
              children {
                id
                text
                completed
                estimate
                children {
                  id
                  text
                  completed
                  estimate
                  children {
                    id
                    text
                    completed
                    estimate
                  }
                }
              }
            }
          }
        }
        project {
          id
          name
          color
        }
      }
    }
  }
`;

export interface GetProjectTasksQuery {
  projectTasks: {
    tasks: Task[];
  };
}

export const GET_ALL_PROJECT_TASKS = gql`
  query AllProjectTasks($project: String!, $limit: Int, $offset: Int) {
    allProjectTasks(
      input: { project: $project }
      options: { limit: $limit, offset: $offset }
    ) {
      tasks {
        id
        text
        completed
        estimate
        project {
          id
          name
          color
        }
      }
    }
  }
`;

export interface GetAllProjectTasksQuery {
  allProjectTasks: {
    tasks: Task[];
  };
}
