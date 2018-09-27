import gql from 'graphql-tag';

export const NEW_LOG = gql`
  mutation createNewLog(
    $start: String!
    $end: String!
    $duration: Float!
    $project: String!
    $note: String!
  ) {
    createLog(
      input: {
        log: {
          start: $start
          end: $end
          duration: $duration
          project: $project
          note: $note
        }
      }
    ) {
      log {
        id
        start
        end
        duration
        project {
          id
          name
          color
        }
        note
      }
    }
  }
`;

export const UPDATE_LOG = gql`
  mutation UpdateLog(
    $id: ID!
    $start: String
    $end: String
    $duration: Float
    $project: String
    $note: String
  ) {
    updateLog(
      input: {
        id: $id
        patch: {
          start: $start
          end: $end
          duration: $duration
          project: $project
          note: $note
        }
      }
    ) {
      log {
        id
        start
        end
        duration
        project {
          id
          name
          color
        }
        note
      }
    }
  }
`;

export const DELETE_LOG = gql`
  mutation DeleteLog($logId: ID!) {
    deleteLog(input: { id: $logId }) {
      log {
        note
        project {
          id
          name
        }
      }
    }
  }
`;
