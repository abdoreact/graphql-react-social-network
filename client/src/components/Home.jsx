import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { currentUserQuery } from "../App";
import {Link} from 'react-router-dom';
const postsQuery = gql`
  {
    posts {
      id
      likes
      body
      author {
        username
      }
    }
  }
`;
const likeMutation = gql`
  mutation($post: ID, $liker: ID) {
    like(post: $post, liker: $liker)
  }
`;
const postMutation = gql`
  mutation($author: ID, $body: String) {
    post(author: $author, body: $body) {
      author {
        username
        id
      }
      likes
      body
      id
    }
  }
`;
export default () => {
  const [posts, setPosts] = useState([])
  useQuery(postsQuery, {
    onCompleted:e => {
      setPosts(e.posts)
    }
  });
  const [user, setUser] = useState(null);
  useQuery(currentUserQuery, {
    variables: {
      jwt: localStorage.getItem("jwt"),
    },
    onCompleted: setUser,
  });
  const [post] = useMutation(postMutation);
  const [like] = useMutation(likeMutation);
  const [form, setForm] = useState("");
  const handleSubmit = () => {
    post({ variables: { body: form, author: user.currentUser.id } });
  };
  return (
    <div>
      <button onClick={() => {
        localStorage.removeItem("jwt")
        window.location.reload()
      }}>Log Out</button>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="What's up?"
          onChange={(e) => setForm(e.target.value)}
          value={form}
          required
        />
        <button>Post</button>
      </form>
      <div>
        <ul style={{ listStyle: "none" }}>
          {posts.map(
            ({ id, body, author: { username }, likes }) => (
              <li key={id}>
                <div>
                  <div>{username}</div>
                  <Link to={`/post/${id}`}>
                    <div>{body}</div>
                    <div id={id}>{likes}</div>
                  </Link>
                  <div>
                    <button
                      onClick={() => {
                        like({
                          variables: { post: id, liker: user.currentUser.id },
                        }).then(({data:{like}}) => document.getElementById(id).innerText=Number(document.getElementById(id).innerText)+like);
                      }}
                    >
                      Like
                    </button>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};
