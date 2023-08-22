import styled from 'styled-components'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import useAuth from '../context/authContext'
import { MOBILE, headerBlue } from '../styles/sharedComponentStyles'

// Only taking in id in props and setting friends in useEffect so that when friends
// online status changes in user object from useAuth then state is reflected here
export default function Chat ({ activeFriendId }) {
	// TODO - show input that matches the friend's window
	const [input, setInput] = useState('')
	const [sending, setSending] = useState(false)
	const [filteredMessages, setFitleredMessages] = useState([])
	const [friend, setFriend] = useState(null)
	const { user, token, messages, setMessages } = useAuth()
	const chatWindowRef = useRef()

	// Mark messages as unread after 5 seconds from chat opening or new message appearing
	useEffect(() => {
		const unreadMessagesIds = filteredMessages.filter(m =>
			m.sender !== user.id && !m.isRead).map(m => m._id
		)
		if (!unreadMessagesIds.length) return

		setTimeout(() => {
			axios.patch(import.meta.env.VITE_API + '/message/read',
				{ ids: unreadMessagesIds },
				{ headers: { 'Authorization': `Bearer ${token}` }}
			).then(res => {
				if (res.status === 204) {
					setMessages(messages => messages.map(m => {
						if (m.sender === friend.id) return { ...m, isRead: true }
						else return m
					}))
				}
			}).catch(err => { console.log(err.message) })
		}, [5000])
	}, [filteredMessages, friend?.id, setMessages, token, user.id])

	useEffect(() => {
		if (!activeFriendId) return
		setFriend(user.friends.find(f => f.id === activeFriendId))
	}, [activeFriendId, user.friends])

	useEffect(() => {
		if (!friend?.id) return
		setFitleredMessages(messages.filter(message =>
			(message.sender === user.id || message.recipient === user.id) &&
			(message.sender === friend.id || message.recipient === friend.id)))
	}, [messages, friend?.id, user.id])

	useEffect(() => {
		// TODO - prompt user to scroll down rather than doing it for them
		chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
	}, [filteredMessages])

	function handleSubmit (e) {
		e.preventDefault()
		setSending(true)
		axios.post(import.meta.env.VITE_API + '/message', {
			sender: user.id,
			recipient: friend.id,
			text: input.trim()
		}, {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json'
			}
		}).then(res => {
			setInput('')
			setSending(false)
			setMessages(messages =>[...messages, res.data.document])
		}).catch(err => console.log(err.message))
	}

	function getPlaceHolder () {
		if (friend && friend.isOnline) return `Send a message to ${friend.fullname}`
		else if (friend) return `Send <offline> message to ${friend.fullname}`
		else return 'Select friend to type a message'
	}

	return (
		<Container className='Chat'>
			<Title $isOnline={friend?.isOnline}>
				{friend ?
					<>
						<span>Chatting with </span>
						<span className='name'>{friend.fullname} </span>
						(<span className='status'>{friend.isOnline ? 'Online' : 'Offline'}</span>)
					</> :
					'Select friend to chat with'
				}
			</Title>
			<ChatWindow ref={chatWindowRef}>
				{filteredMessages.map(message =>
					<Message
						key={message._id}
						$isSender={message.sender === user.id}
						$isRead={message.sender === user.id || message.isRead}
					>
						<span>{message.sender === user.id ? user.firstname : friend.firstname}</span>
						<span>{message.text}</span>
					</Message>
				)}
			</ChatWindow>
			<ChatInput onSubmit={handleSubmit}>
				<input
					disabled={!friend} value={input}
					onChange={e => setInput(e.target.value)}
					placeholder={getPlaceHolder()}
				/>
				<button disabled={sending || !input.trim().length}>Send</button>
			</ChatInput>
		</Container>
	)
}

const Container = styled.section`
	flex-grow: 1;
	border: 5px solid;
	display: flex;
	flex-direction: column;
	overflow: auto;
`

const Title = styled.p`
	margin: 0;
	padding: 15px;
	font-size: .9rem;
	font-weight: 600;
	border-bottom: 1px solid;
	span.name { color: teal; }
	span.status { color: ${props => props.$isOnline ? 'green' : 'grey'} }
`

const ChatWindow = styled.div`
	flex-grow: 1;
	overflow: auto;
	display: flex;
	flex-direction: column;
	padding: 10px;
`

const Message = styled.div`
	margin-bottom: 10px;
	span {
		color: ${props => props.$isSender ? 'black' : 'teal'};
	}
	span:first-of-type {
		font-weight: 600;
		&:before { content: '[' }
		&:after { content: ']' }
	}
	span + span {
		margin-left: 10px;
		${props => !props.$isRead && `
			&:before { content: '[new] ' }
		`}
	}
`

const ChatInput = styled.form`
	display: flex;
	border-top: 1px solid;
	input {
		flex-grow: 1;
		font-size: 1rem;
		padding: 10px;
		border: none;
		outline: none;
		&:disabled { opacity: 1; }
	}
	@media (max-width: ${MOBILE}) {
		input::placeholder { font-size: .8rem; }
	}
	button {
		border: none;
		background: ${headerBlue};
		padding: 0 10px;
		outline-offset: -3px;
		&:hover, &:focus { background: #3e91ad; }
	}
`
