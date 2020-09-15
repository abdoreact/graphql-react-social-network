import React, { useState } from 'react';  
import { useQuery, gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { currentUserQuery } from '../App';
const commentMutation=gql`
mutation($post:ID, $commenter:ID, $body:String){
    comment(post:$post, commenter:$commenter, body:$body)
}
`
const postQuery=gql`
query ($id:ID){
    post(id:$id){
        id
        likes
        author{
            username
        }
        body
        comments{
            id
            body
            author{
                username
            }
        }
    }
}
`
export default ({match:{params:{id}}}) => {
    const [addComment] = useMutation(commentMutation)
    const handleSubmit = (e) => {
        e.preventDefault()
        addComment({variables:{body:formComment, commenter:isAuth.currentUser.id, post:data.post.id}}).then(() => window.location.reload())
        loading=true
    }
    const [formComment, setComment] = useState("")
    let {data, loading} = useQuery(postQuery, {
        variables:{
            id
        }
    })
    const {data:isAuth} = useQuery(currentUserQuery, {
        variables:{
            jwt:localStorage.getItem("jwt")
        }
    })
    if(loading) return 'Loading...'
    return data ? (
        <div>
            <Link to='/'>Back</Link>
            <div>{data.post.author.username}</div>
            <div>{data.post.body}</div>
            <div>{data.post.likes}</div>
            {!isAuth.currentUser.error ? (
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" onChange={e => setComment(e.target.value)} />
                    <button>Comment</button>
                </form>
            </div>
            ): <Link to='/register'>Register to comment.</Link>}
            <ul style={{listStyle:'none'}}>
            {data.post.comments.map(comment => <li key={comment.id}>
                <hr/>
                <div>{comment.author.username}</div>
                <div>{comment.body}</div>
                <hr/>
            </li>)}
            </ul>
        </div>
    ): <div>Sorry, that post does not exsist.</div>
}