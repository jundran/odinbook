import styled from 'styled-components'
import { useState, useRef } from 'react'
import {createPortal } from 'react-dom'
import axios from 'axios'
import useAuth from '../context/authContext'
import { getTimeFrame } from '../utilities/time'
import UserIcon from './userComponents'
import CommentForm from './commentForm'
import Like from './like'
import { ShowMoreButton } from './postBody'
import ConfirmBox from './confirmBox'
import { GridColumns, SimpleLinkMinor } from '../styles/sharedComponentStyles'

export default function Comments ({ postComments, postId }) {
	const [numberCommentsShown, setNumberCommentsShown] = useState(2)
	const [comments, setComments] = useState(postComments)
	const [showConfirm, setShowConfirm] = useState(false)
	const { user, token } = useAuth()
	const ref = useRef()

	function handleLike (comment) {
		const userLikesComment = comment.likes.some(likingUser => likingUser.id === user.id)
		axios.patch(import.meta.env.VITE_API + `/comment/${userLikesComment ? 'unlike' : 'like'}`,
			{ 'id': comment._id },
			{	headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => {
			const copy = comments.map(c => {
				if (c._id === comment._id) return res.data.document
				return c
			})
			setComments(copy)
		}).catch(err => { console.log(err.message) })
	}

	function handlePost (document) {
		setComments([...comments, document])
	}

	function confirmDelete (comment) {
		setShowConfirm(true)
		ref.current = comment
	}

	function handleDelete (confirmed) {
		setShowConfirm(false)
		if (!confirmed) return
		axios.delete(import.meta.env.VITE_API + `/comment/${ref.current._id}`, {
			headers: { 'Authorization': `Bearer ${token}` }
		}).then(res =>	{
			if (res.status === 204) setComments(comments.filter(c => c._id !== ref.current._id))
		}).catch(err => { console.log(err.message) })
	}

	function showMoreComments () {
		setNumberCommentsShown(numberCommentsShown + 10)
	}

	function showLessComments () {
		setNumberCommentsShown(2)
	}

	return (
		<CommentsContainer>
			<Title>{`Comments (${comments.length})`}</Title>
			<CommentForm postId={postId} onPost={handlePost}/>
			{comments.slice(0, numberCommentsShown).map(comment  =>
				<GridColumns key={comment._id}>
					<UserIcon profilePicture={comment.user.profilePicture} size= '40px' />
					<div>
						<SimpleLinkMinor to={`/user/${comment.user.id}`}>
							{comment.user.fullname}
						</SimpleLinkMinor>
						<Time>{getTimeFrame(comment.createdAt)}</Time>
						<Text>{comment.text}</Text>
						<Like likes={comment.likes} dataType='comment'
							onLikeOrUnlike={() => handleLike(comment)}
						/>
						{user.id === comment.user.id &&
							<Delete onClick={() => confirmDelete(comment)}>Delete</Delete>
						}
					</div>
				</GridColumns>
			)}
			{comments.length > 2 &&
				<>
					{numberCommentsShown < comments.length &&
						<ShowMoreButton onClick={showMoreComments}>Show More</ShowMoreButton>
					}
					{numberCommentsShown >= comments.length &&
						<ShowMoreButton onClick={showLessComments}>Show Less</ShowMoreButton>
					}
				</>
			}
			{showConfirm && createPortal(
				<ConfirmBox
					message='Delete comment? Are you sure?'
					onResponse={handleDelete}
				/>, document.getElementById('modal')
			)}
		</CommentsContainer>
	)
}

const CommentsContainer = styled.div`
	margin: 20px 0;
`

const Title = styled.div`
	font-weight: 600;
	font-size: 90%;
	margin-bottom: 16px;
`

const Time = styled.span`
	font-size: 80%;
	color: #444;
	margin-left: 8px;
`

const Text = styled.p`
	margin: 4px 0 0 0;
`

const Delete = styled.button`
	border: none;
	background: none;
	margin-bottom: 8px;
	color: navy;
	padding-left: 0;
	&:hover {
		text-decoration: underline;
	}
`
