import { useState } from "react";
import { useApolloClient } from '@apollo/client';
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm"


const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState("authors")
  const client = useApolloClient()

  const logout = () => {    
    setToken(null)    
    localStorage.clear()    
    client.resetStore()
    setPage("authors")
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button onClick={() => setPage("login")}>login</button>
        </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <LoginForm show={page === "login"} setToken={setToken} setPage={setPage}/>
    </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
