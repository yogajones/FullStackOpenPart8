import { useQuery } from "@apollo/client"
import { ALL_BOOKS_AND_ME } from "../queries"

const Books = (props) => {
  const result = useQuery(ALL_BOOKS_AND_ME)

  // eslint-disable-next-line react/prop-types
  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const user = result.data.me

  return (
    <div>
      <h2>books</h2>
      <p>recommended for <b>{user.username}</b> based on favorite genre: <b>{user.favoriteGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.filter(book => book.genres.includes(user.favoriteGenre)).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
