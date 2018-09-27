import gql from 'graphql-tag';

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $email: String!,
    $password: String,
    $address: String,
    $city: String,
    $state: String,
    $zip: String
  ) {
    updateUser (
      input: {
        patch: {
          email: $email,
          password: $password,
          address: $address,
          city: $city,
          state: $state,
          zip: $zip
        }
      }
    ) {
      user {
        email
        address
        city
        state
        zip
      }
    }
  }
`;
