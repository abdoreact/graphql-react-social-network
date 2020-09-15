import React from 'react';
import './App.css';
import { useQuery, gql } from '@apollo/client';
import Home from './components/Home';
export const currentUserQuery=gql`
query($jwt:String){
  currentUser(jwt:$jwt){
    id
    username
    error
  }
}
`
function App({history:{push}}) {
  const {loading, data} = useQuery(currentUserQuery, {
    variables:{
      jwt:localStorage.getItem("jwt")
    }
  })
  setTimeout(() => {
    if(data&&data.currentUser.error){
      push('/register')
    }
  }, 0)
  if(loading) return 'Loading...';
  return <Home/>
}

export default App;
