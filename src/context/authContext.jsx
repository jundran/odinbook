import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'

const AuthContext = createContext()

export function AuthProvider ({ children }) {
	const [user, setUser] = useState(null)
	const [token, setToken] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const token = localStorage.getItem('odinbook-token')
		if (!token) return setLoading(false)

		setToken(token)
		axios.get(import.meta.env.VITE_API + '/user/current', {
			headers: {
				'Access-Control-Allow-Origin': true,
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json'
			}
		}).then(res => setUser(res.data.document))
			.catch(err => console.log(err.message))
			.finally(() => setLoading(false))
	}, [])

	// SOCKET IO
	useEffect( () => {
		if (!token) return
		const socket = io(import.meta.env.VITE_SERVER, { auth: { token } })

		// Incoming messages
		socket.on('userUpdate', userDocument => setUser(userDocument))
		socket.on('message', message => console.log('SOCKET SERVER:', message))
		socket.on('friendStatusUpdate', status =>
			setUser(currentUser => {
				console.log('friendStatusUpdate', status)
				let updatedFriend = null

				const updatedFriends = currentUser.friends.map(friend => {
					if (friend.id === status.id) {
						updatedFriend = friend
						return {
							...friend,
							isOnline: status.isOnline
						}
					} else {
						return friend
					}
				})

				const notification = {
					type: 'friend-update',
					user: updatedFriend,
					message: status.isOnline ? ' came online' : ' went offline',
					createdAt: new Date()
				}

				return {
					...currentUser,
					friends: updatedFriends,
					notifications: [...currentUser.notifications, notification]
				}
			})
		)

		// TESTING
		// document.addEventListener('keydown', e => {
		// 	if (e.target.matches('input')) return
		// 	else if (e.key === 'c') socket.connect()
		// 	else if (e.key === 'd') disconnectSocket()
		// })

		function disconnectSocket () {
			console.log('Disconnected from socketIO')
			socket.disconnect()
		}

		return () => disconnectSocket()
	}, [token])

	function sendFriendRequest (id) {
		axios.put(import.meta.env.VITE_API + '/friend/add',
			{ id },
			{ headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => { if (res.status === 200) setUser(res.data.document) }
		).catch(err => { console.log(err.message) })
	}

	function removeFriend (id) {
		axios.put(import.meta.env.VITE_API + '/friend/remove',
			{ id },
			{ headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => { if (res.status === 200) setUser(res.data.document) }
		).catch(err => { console.log(err.message) })
	}

	function acceptFriendRequest (id) {
		axios.put(import.meta.env.VITE_API + '/friend/accept',
			{ id },
			{ headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => { if (res.status === 200) setUser(res.data.document) }
		).catch(err => { console.log(err.message) })
	}

	function rejectFriendRequest (id) {
		axios.put(import.meta.env.VITE_API + '/friend/reject',
			{ id },
			{ headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => { if (res.status === 200) setUser(res.data.document) }
		).catch(err => { console.log(err.message) })
	}

	function cancelFriendRequest (id) {
		axios.put(import.meta.env.VITE_API + '/friend/cancel',
			{ id },
			{ headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => { if (res.status === 200) setUser(res.data.document) }
		).catch(err => { console.log(err.message) })
	}

	async function login (user, token) {
		setUser(user)
		setToken(token)
		localStorage.setItem('odinbook-token', token)
	}

	async function logout () {
		setUser(null)
		setToken(null)
		localStorage.removeItem('odinbook-token')
	}

	function clearNotification (id) {
		axios.patch(import.meta.env.VITE_API + '/user/clearNotification',
			{ id },
			{ headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => { if (res.status === 200) setUser(res.data.document) }
		).catch(err => { console.log(err.message) })
	}

	return (
		<AuthContext.Provider value={{
			user,
			token,
			login,
			logout,
			setUser,
			sendFriendRequest,
			removeFriend,
			acceptFriendRequest,
			rejectFriendRequest,
			cancelFriendRequest,
			clearNotification
		}}>
			{!loading && children}
		</AuthContext.Provider>
	)
}

export default function useAuth () {
	return useContext(AuthContext)
}
