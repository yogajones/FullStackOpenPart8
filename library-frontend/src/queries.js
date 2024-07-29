import { gql } from '@apollo/client'


export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
      title
      genres
      id
      published
      author
    }
  }
`

export const EDIT_BIRTH_YEAR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo)  {
      name
      born
    }
  }
`