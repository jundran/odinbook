import styled from 'styled-components'
import { useEffect, useRef, useState, useCallback } from 'react'
import axios from 'axios'
import useAuth from '../context/authContext'
import Message from './message'
import { MOBILE, headerBlue } from '../styles/sharedComponentStyles'

// Only taking in id in props and setting friends in useEffect so that when friends
// online status changes in user object from useAuth then state is reflected here
export default function Chat ({ activeFriendId }) {
	const [sending, setSending] = useState(false)
	const [filteredMessages, setFitleredMessages] = useState([])
	const [friend, setFriend] = useState(null)
	const [messagesWaiting, setMessagesWaiting] = useState(false)
	const { user, token, messages, setMessages } = useAuth()
	const chatWindowRef = useRef()
	const chatWindowIsAtBottom = useRef(true)

	const messageIsUnread = useCallback(message => {
		// Message may be unread but if it was sent by user, mark as such
		return message.sender !== user.id && !message.isRead
	}, [user.id])

	// Set friend on selection
	useEffect(() => {
		if (!activeFriendId) return
		chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
		chatWindowIsAtBottom.current = true // reset after friend selection change
		setFriend(user.friends.find(f => f.id === activeFriendId))
	}, [activeFriendId, user.friends])

	// Filter messages when they arrive
	useEffect(() => {
		if (!friend) return
		// Check if chat window is at the bottom
		const {scrollHeight, scrollTop, clientHeight} = chatWindowRef.current
		const difference = scrollHeight - (scrollTop + clientHeight)
		chatWindowIsAtBottom.current = difference < 1  // Calculation on chrome can be off by .5
		// console.log(scrollHeight, scrollTop, clientHeight, difference, chatWindowIsAtBottom.current)

		setFitleredMessages(messages.filter(message =>
			(message.sender === user.id || message.recipient === user.id) &&
			(message.sender === friend.id || message.recipient === friend.id))
		)
	}, [messages, friend, user.id])

	// Mark messages as read when they are filtered and rendered
	useEffect(() => {
		const unreadMessagesIds = filteredMessages.filter(m => messageIsUnread(m)).map(m => m._id)
		if (!unreadMessagesIds.length) return

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
	}, [filteredMessages, friend, messageIsUnread, setMessages, token])

	// Scroll chat if it's at the bottom else notify of waiting messages
	useEffect(() => {
		if (chatWindowIsAtBottom.current) {
			chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
		}
		else setMessagesWaiting(true)
	}, [filteredMessages])

	function handleSubmit (e) {
		e.preventDefault()
		const text = e.target.text.value.trim()
		if (!text) return
		setSending(true)
		chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
		e.target.text.value = ''
		axios.post(import.meta.env.VITE_API + '/message', {
			sender: user.id,
			recipient: friend.id,
			text
		}, {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json'
			}
		}).then(() => {
			setSending(false)
			// Do not set message here because it will be returned by socketIO to keep all clients in sync
		}).catch(err => console.log(err.message))
	}

	function getPlaceHolder () {
		if (friend && friend.isOnline) return `Send a message to ${friend.fullname}`
		else if (friend) return `Send <offline> message to ${friend.fullname}`
		else return 'Select friend to type a message'
	}

	function handleClick () {
		chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
		setMessagesWaiting(false)
	}

	function handleScroll () {
		// setMessagesWaiting(false) if chat window is scrolled to the bottom
		const {scrollHeight, scrollTop, clientHeight} = chatWindowRef.current
		const difference = scrollHeight - (scrollTop + clientHeight)
		if (difference < 1) setMessagesWaiting(false)
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
			<ChatWindow ref={chatWindowRef} onScroll={handleScroll}>
				{filteredMessages.map(message =>
					<Message key={message._id} data={message} friend={friend} />)
				}
			</ChatWindow>
			{messagesWaiting &&
				<Status onClick={handleClick}>Messages Waiting</Status>
			}
			<ChatInput onSubmit={handleSubmit}>
				<input name='text' disabled={!friend} placeholder={getPlaceHolder()} />
				<button disabled={sending}>Send</button>
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
	gap: 10px;
`

const Status = styled.button`
	background: none;
	border: none;
	border-top: 1px solid #222;
	padding: 10px;
	text-align: center;
	font-weight: 600;
	font-size: .8rem;
	&:hover { color: navy; }
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
