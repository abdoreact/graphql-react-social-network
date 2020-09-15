import { useQuery, gql, useMutation } from "@apollo/client";
import { currentUserQuery } from "../App";
import React, { useState } from "react";
import {Link} from 'react-router-dom';
const loginMutation = gql`
mutation($password:String, $email:String){
    login(password:$password, email:$email){
        error
        id
    }
} 
`

export default ({ history: { push } }) => {
  const [form, setForm] = useState({
    password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [login] = useMutation(loginMutation)
  const { loading, data } = useQuery(currentUserQuery, {
    variables: {
      jwt: localStorage.getItem("jwt"),
    },
  });
  // eslint-disable-next-line
  setTimeout(() => {
    if (data && !data.currentUser.error) {
      push("/");
    }
  }, 0);
  if (loading) return "Loading...";
  const handleChange = (e) => {
    e.persist();
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login({variables:form})
    .then(({data:{login:{error, id}}}) => {
        if(error) {
            setError(error)
            return
        }
        localStorage.setItem("jwt", id)
        push('/')

    })
  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" onChange={handleChange} />
        <input
          type="password"
          name="password"
          onChange={handleChange}
        />
        <div>{error}</div>
        <button>Login</button>
      </form>
      <Link to='/register'>Don't have an account? Register.</Link>
    </div>
  );
};
