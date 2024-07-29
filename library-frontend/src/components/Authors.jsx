import { useState } from 'react'
import { ALL_AUTHORS, EDIT_BIRTH_YEAR } from "../queries"
import { useQuery, useMutation } from '@apollo/client'

const SetBirthYear = () => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const [ editBirthYear ] = useMutation(EDIT_BIRTH_YEAR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const submit = async (event) => {
    event.preventDefault()

    editBirthYear({  variables: { name, setBornTo: year } })

    setName('')
    setYear('')

  }

  return (
    <div>
      <h3>Set birth year</h3>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={year}
            onChange={({ target }) => setYear(parseInt(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  // eslint-disable-next-line react/prop-types
  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear/>
    </div>
  )
}

export default Authors
