import styled from 'styled-components'
import { useState, Fragment } from 'react'
import axios from 'axios'
import useAuth from '../context/authContext'
import Like from './like'
import Others from './others'
import { SimpleLink } from '../styles/sharedComponentStyles'

export default function PostLikes ({ postLikes, postId }) {
	const [likes, setLikes] = useState(postLikes)
	const { user, token } = useAuth()

	const userLikesPost = likes.find(like => like._id === user.id)
	// Ensure current user is first in the array
	if (userLikesPost && likes[0].id !== user.id) {
		const copy = likes.filter(like => like.id !== user.id)
		copy.unshift(userLikesPost)
		setLikes(copy)
	}

	function handleLike () {
		axios.patch(import.meta.env.VITE_API + `/post/${userLikesPost ? 'unlike' : 'like'}`,
			{ 'id': postId },
			{	headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => setLikes(res.data.document)
		).catch(err => { console.log(err.message) })
	}

	return (
		<Container>
			<Like likes={likes} dataType='post' onLikeOrUnlike={handleLike}/>
			<p>
				{likes.slice(0, 3).map((likingUser, index) => {
					return (
						<Fragment key={likingUser.id}>
							<SimpleLink key={likingUser.id} to={`/user/${likingUser.id}`}>
								{likingUser.id === user.id ? 'You' : likingUser.fullname}
							</SimpleLink>
							{index < 2 && index < likes.length - 2 &&
								<span>, </span>
							}
						</Fragment>
					)
				})}
				{likes.length > 0 &&
					<>
						<span>{` and ${Math.max(0, likes.length - 3)} `}</span>
						<Others likes={likes}/>
						<span> like this post</span>
					</>
				}
			</p>
		</Container>
	)
}

const Container = styled.div`
	font-size: .8rem;
`
