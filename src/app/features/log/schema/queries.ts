import Log from '@features/log/Log';
import gql from 'graphql-tag';

export const getAllLogs = gql`
  query AllLogs {
    allLogs {
      logs {
        id
      }
    }
  }
`;

export const LOG_LIST_QUERY = gql`
  query LogListQuery($project: String, $offset: Int, $limit: Int) {
    allLogsByProjectId(
      input: { id: $project }
      options: { limit: $limit, offset: $offset }
    ) {
      logs {
        id
        start
        end
        duration
        note
        project {
          id
          name
          color
        }
      }
    }
  }
`;
export interface LogListQuery {
  allLogsByProjectId: {
    logs: Log[];
  };
}

export const GET_LOGS_BY_DATES = gql`
  query GetLogsByDates(
    $project: [String]
    $start: String
    $end: String
    $limit: Int
    $offset: Int
  ) {
    allLogsByDates(
      input: { project: $project, start: $start, end: $end }
      options: { limit: $limit, offset: $offset }
    ) {
      logs {
        id
        start
        end
        duration
        project {
          id
          color
          name
        }
        note
      }
    }
  }
`;

export interface GetLogsByDatesQuery {
  allLogsByDates: {
    logs: Log[];
  };
}
