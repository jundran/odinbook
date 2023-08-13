import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import useAuth from '../context/authContext'
import { Badge } from '../components/userComponents'

export default function PeoplePage () {
	document.title = 'People Page'
	const data = useRef()
	const [users, setUsers] = useState([])
	const { user: currentUser, token } = useAuth()

	useEffect(() => {
		axios.get(import.meta.env.VITE_API + '/user', {
			headers: { 'Authorization': `Bearer ${token}` }
		}).then(res => {
			data.current = res.data.documents
			setUsers(res.data.documents)
		}
		).catch(err => console.log(err.response.data))
	}, [token])

	function filterFunction (value, fullname) {
		return fullname.toLowerCase().match(value.trim())
	}

	function handleChange (e) {
		const matchedUsers = data.current.filter(user =>
			filterFunction(e.target.value, user.fullname)
		)
		setUsers(matchedUsers)
	}

	return (
		<main>
			<People>
				<h1>Find People</h1>
				<form onChange={handleChange}>
					<input type="search" />
					<button>Search</button>
				</form>
				{users.filter(user => user.id !== currentUser.id).map(user =>
					<Badge style={{ marginBottom: '32px' }}key={user.id} userData={user} />
				)}
			</People>
		</main>
	)
}

const People = styled.section`
	form {
		display: flex;
		height: 32px;
		margin-bottom: 20px;
	}
	input {
		height: 100%;
		width: 500px;
		max-width: 100%;
		margin-right: 10px;
	}
`
