import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useState } from 'react'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [selectedGenre, setSelectedGenre] = useState('')

  // eslint-disable-next-line react/prop-types
  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  const uniqueGenres = Array.from(new Set(books.flatMap(book => book.genres)))

  const filteredBooks = selectedGenre
    ? books.filter(book => book.genres.includes(selectedGenre))
    : books

  return (
    <div>
      <h2>books</h2>
      <div>
        <label>Filter by genre:</label>
        <select
          onChange={({ target }) => setSelectedGenre(target.value)}
          value={selectedGenre}
        >
          <option value="">All genres</option>
          {uniqueGenres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
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
