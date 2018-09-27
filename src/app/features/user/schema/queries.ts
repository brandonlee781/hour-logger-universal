import { User } from '@features/user/User';
import gql from 'graphql-tag';

export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      email
      address
      city
      state
      zip
    }
  }
`;
export interface GetUserQuery {
  getUser: User;
}
