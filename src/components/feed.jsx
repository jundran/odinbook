import styled from 'styled-components'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../context/authContext'
import Post from './post'
import PostCreate from '../components/postCreate'

export default function Feed () {
	const { token } = useAuth()
	const [posts, setPosts] = useState(null)

	const fetchPosts = useCallback(() =>  {
		axios.get(import.meta.env.VITE_API + '/post/feed', {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json'
			}
		}).then(res => setPosts(res.data.documents)
		).catch(err => console.log(err.response.data))
	}, [token])

	useEffect(() => fetchPosts(), [fetchPosts])

	return (
		<section>
			<PostCreate refreshPosts={fetchPosts} />
			<h2>Odin Feed</h2>
			<Posts>
				{posts ? posts.map(post => (
					<Post
						key={post._id}
						postData={post}
						refreshPosts={fetchPosts}
					/>
				)) :
					<p>This is your feed. When you or your friends make posts they will show up here.</p>
				}
			</Posts>
		</section>
	)
}

export function UserPosts ({ user }) {
	const [posts, setPosts] = useState(null)
	const { user: currentUser, token } = useAuth()

	const fetchPosts = useCallback(() =>  {
		axios.get(import.meta.env.VITE_API + '/post/user/' + user.id, {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json'
			}
		}).then(res => setPosts(res.data.documents)
		).catch(err => console.log(err.response.data))
	}, [token, user.id])

	useEffect(() => fetchPosts(), [fetchPosts])


	const userIsCurrentUser = currentUser.id === user.id
	const userIsFriend = currentUser.friends.some(friend => friend.id === user.id)
	return (
		<section>
			{userIsCurrentUser && <PostCreate refreshPosts={fetchPosts} headerType='banner' />}
			<h2 className='white-bg' style={userIsCurrentUser ? {} : { marginTop: 0 }}>
				{userIsCurrentUser ? 'My Posts' : `Posts by ${user.firstname}`}
			</h2>
			{userIsCurrentUser || userIsFriend ?
				<Posts >
					{posts ? posts.map(post => (
						<Post
							key={post._id}
							postData={post}
							refreshPosts={fetchPosts}
						/>
					)) : (
						<>
							{currentUser.id === user.id ?
								<p>This is your feed. When you or your friends make posts they will show up here.</p>
								:
								<p><span>{user.fullname}</span> has not made any posts</p>
							}
						</>
					)}
				</Posts>
				:
				<p>You must add <span>{user.firstname}</span> as a friend to see their posts</p>
			}
		</section>
	)
}

const Posts = styled.div`
	> div {
		margin-bottom: 40px;
	}
`

