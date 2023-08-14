import styled from 'styled-components'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import axios from 'axios'
import useAuth from '../context/authContext'
import UserIcon from './userComponents'
import PostHeader from './postHeader'
import PostBody from './postBody'
import PostLikes from './postLikes'
import PostComments from './postComments'
import ConfirmBox from './confirmBox'

export default function Post ({ postData, refreshPosts }) {
	const [showConfirm, setShowConfirm] = useState(false)
	const { user, token } = useAuth()

	function deletePost (confirmation) {
		setShowConfirm(false)
		if (!confirmation) return

		axios.delete(import.meta.env.VITE_API + '/post/' + postData._id, {
			headers: { 'Authorization': `Bearer ${token}` }
		}).then(res => { if (res.status === 204) refreshPosts()
		}).catch(err => console.log(err?.response.data || err))
	}

	return (
		<PostContainer className='post white-bg'>
			<UserIcon profilePicture={postData.user.profilePicture} size='40px'/>
			<Container>
				<PostHeader data={postData} />
				<PostBody text={postData.text} image={postData.image} />
				<PostLikes postLikes={postData.likes} postId={postData._id} />
				<PostComments postComments={postData.comments} postId={postData._id} />
				{user.id === postData.user.id &&
					<DeleteButton onClick={() => setShowConfirm(true)}>Delete Post</DeleteButton>
				}
			</Container>
			{showConfirm && createPortal(
				<ConfirmBox message='Delete Post? Are you sure?' onResponse={deletePost} />,
				document.getElementById('modal')
			)}
		</PostContainer>
	)
}

const PostContainer = styled.div`
	display: grid;
	grid-template-columns: auto 1fr;
`

const Container = styled.div`
	margin-left: 12px;
	font-size: 90%;
	color: #222;
`

const DeleteButton = styled.button`
	border: 1px solid lightgrey;
	background: none;
	padding: 4px;
	font-weight: 600;
	font-size: 90%;
	color: orange;
	&:hover { color: red }
`
