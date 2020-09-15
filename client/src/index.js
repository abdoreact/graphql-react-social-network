import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {apiuri} from '../config.json'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Post from './components/Post';
const client=new ApolloClient({
  uri:apiuri,
  cache:new InMemoryCache()
})
ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <ApolloProvider client={client}>
        <Switch>
          <Route exact path='/' component={App}/>
          <Route path='/register' component={Register}/>
          <Route path='/login' component={Login}/>
          <Route path='/post/:id' component={Post}/>
        </Switch>
      </ApolloProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);

