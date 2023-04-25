import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query UsersQuery {
    list {
      id
      name
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      deleted
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($user: UserInput!) {
    createUser(user: $user) {
      email
      id
      name
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUser($id: String!) {
    getById(id: $id) {
      id
      name
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($user: UserInput!) {
    updateUser(user: $user) {
      id
      name
      email
    }
  }
`;
