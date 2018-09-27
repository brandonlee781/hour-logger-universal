import Project from '@features/project/Project';
import Task from '@features/project/Task';
import gql from 'graphql-tag';

export const NEW_PROJECT = gql`
  mutation CreateProject($name: String!, $color: String!) {
    createProject(input: { name: $name, color: $color }) {
      project {
        id
        name
        color
      }
    }
  }
`;

export const NEW_TASK = gql`
  mutation CreateTask(
    $text: String!
    $project: String!
    $estimate: Float
    $priority: Int
    $parent: String
  ) {
    createTask(
      input: {
        task: {
          text: $text
          project: $project
          estimate: $estimate
          parent: $parent
          priority: $priority
        }
      }
    ) {
      task {
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

export const TOGGLE_TASK = gql`
  mutation ToggleTask($id: String) {
    toggleTask(input: { id: $id }) {
      task {
        id
        text
        completed
      }
    }
  }
`;

export interface ToggleTaskQuery {
  toggleTask: {
    task: Task;
  };
}

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(input: { id: $id }) {
      task {
        text
        completed
      }
    }
  }
`;

export interface DeleteTaskQuery {
  deleteTask: {
    task: Task;
  };
}

export const EDIT_TASK = gql`
  mutation EditTask($id: ID!, $text: String, $estimate: Float) {
    updateTask(input: {
      id: $id,
      patch: { text: $text, estimate: $estimate }
    }){
      task {
        id
        text
        estimate
        completed
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

export interface EditTaskQuery {
  updateTask: {
    task: Task;
  };
}

export const UPDATE_PROJECT_COLOR = gql`
  mutation UpdateProject($id: ID!, $color: String) {
    updateProject(input: { id: $id, patch: { color: $color } }) {
      project {
        id
        name
        color
      }
    }
  }
`;

export interface UpdateProjectQuery {
  updateProject: {
    project: Project;
  };
}

export const TOGGLE_PROJECT_FAVORITE = gql`
  mutation ToggleProjectFavorite($id: ID!) {
    toggleProjectFavorite(input: { id: $id }) {
      project {
        id
        name
        color
        favorite
      }
    }
  }
`;

export interface ToggleProjectFavoriteQuery {
  toggleProjectFavorite: {
    project: Project;
  };
}

export const UPDATE_TASK_PARENT = gql`
  mutation UpdateTaskParent($id: ID!, $parent: ID!) {
    updateTaskParent(input: { id: $id, parent: $parent }) {
      task {
        id
        text
        estimate
        completed
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
