import { gql } from "apollo-boost";

export const CREATE_USER = gql`
  mutation AddUser($data: UserInput!) {
    addUser(data: $data) {
      id
      fullname
      phone
      age
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($data: UserInput!, $where: UserWhereInputOne!) {
    updateUser(data: $data, where: $where) {
      id
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($where: UserWhereInputOne!) {
    deleteUser(where: $where) {
      id
    }
  }
`;
