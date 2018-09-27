import gql from 'graphql-tag';
import { DontBeA } from '@shared/DontBeA';

export const GET_DONT_BE_A = gql`
  query AllDontBeAs {
    allDontBeAs {
      dontBeAs {
        id
        phrase
        episodeNo
        episodeTitle
      }
    }
  }
`;

export interface GetDontBeAQuery {
  allDontBeAs: {
    dontBeAs: DontBeA[];
  };
}
