import { gql } from "apollo-boost"

export const GET_USER = gql `
query GetUsersList {
    getUsersList {
      data{
        id
        fullname
        phone
        age
      }
      total
    }
  }
`   
