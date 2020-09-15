import { useQuery, gql, useMutation } from "@apollo/client";
import { currentUserQuery } from "../App";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const registerMutation = gql`
mutation($username:String, $password:String, $email:String){
    register(email:$email, password:$password, username:$username){
        error
        id
    }
} 
`

export default ({ history: { push } }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [register] = useMutation(registerMutation)
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
    register({variables:form})
    .then(({data:{register:{error, id}}}) => {
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
        <input type="text" name="username" onChange={handleChange} />
        <input type="email" name="email" onChange={handleChange} />
        <input
          type="password"
          name="password"
          onChange={handleChange}
        />
        <div>{error}</div>
        <button>Register</button>
      </form>
      <Link to='/login'>Already have an account? Login.</Link>
    </div>
  );
};
