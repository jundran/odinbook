import styled from 'styled-components'
import { useState } from 'react'
import axios from 'axios'
import useAuth from '../context/authContext'
import { checkNameValidity } from '../utilities/utils'
import { ErrorsContainer } from './forms'
import { Status, TABLET_SMALL } from '../styles/sharedComponentStyles'

export default function AboutForm () {
	const [changedFields, setChangedFields] = useState(new Set())
	const [error, setError] = useState('')
	const { user, setUser, token } = useAuth()

	function handleSubmit (e) {
		e.preventDefault()

		const body = {}
		for (const field of changedFields) {
			body[field] = e.target[field].value.trim()
		}

		axios.patch(import.meta.env.VITE_API + '/user/current',
			body,
			{ headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => {
			if (res.status === 200) {
				setChangedFields(new Set())
				setUser(res.data.document)
				setError('')
			}
		}).catch(err => setError(err.response.data.message))
	}

	function checkForChange (e) {
		if (e.target.value.trim() !== user[e.target.name]) {
			// Add returns new set but delete returns boolean
			setChangedFields(prev => new Set(prev).add(e.target.name))
		} else {
			setChangedFields(prev => {
				const next = new Set(prev)
				next.delete(e.target.name)
				return next
			})
		}
	}

	function handleReset (e) {
		e.target.form.reset()
		setError('')
		setChangedFields(new Set())
	}

	return (
		<section>
			<h2>About</h2>
			<Form aria-label='change user information' onSubmit={handleSubmit}>
				<ul>
					<li>
						<label htmlFor="firstname">First Name</label>
						<input name="firstname" id="firstname" required minLength='2'
							defaultValue={user.firstname} onChange={e => {
								checkNameValidity(e)
								checkForChange(e)
							}}
						/>
						<Status $modified={changedFields.has('firstname')}>
							{changedFields.has('firstname') ? 'Modified' : 'Saved' }
						</Status>
					</li>
					<li>
						<label htmlFor="surname">Surname</label>
						<input name="surname" id="surname" required minLength='2'
							defaultValue={user.surname} onChange={e => {
								checkNameValidity(e)
								checkForChange(e)
							}}
						/>
						<Status $modified={changedFields.has('surname')}>
							{changedFields.has('surname') ? 'Modified' : 'Saved' }
						</Status>
					</li>
					<li>
						<label htmlFor="email">Email</label>
						<input name="email" id="email" type='email' required
							defaultValue={user.email} onChange={checkForChange}
						/>
						<Status $modified={changedFields.has('email')}>
							{changedFields.has('email') ? 'Modified' : 'Saved' }
						</Status>
					</li>
					<li>
						<label htmlFor="dob">Date of Birth</label>
						<input name="dob" id="dob" type='date' required
							max={new Date().toISOString().split('T')[0]}
							defaultValue={user.dob.split('T')[0]} onChange={checkForChange}
						/>
						<Status $modified={changedFields.has('dob')}>
							{changedFields.has('dob') ? 'Modified' : 'Saved' }
						</Status>
					</li>
					<li>
						<label htmlFor="location">Location</label>
						<input name="location" id="location"
							defaultValue={user.location} onChange={checkForChange}
						/>
						<Status $modified={changedFields.has('location')}>
							{changedFields.has('location') ? 'Modified' : 'Saved' }
						</Status>
					</li>
					<li>
						<label htmlFor="jobTitle">Job Position</label>
						<input name="jobTitle" id="jobTitle"
							defaultValue={user.jobTitle} onChange={checkForChange}
						/>
						<Status $modified={changedFields.has('jobTitle')}>
							{changedFields.has('jobTitle') ? 'Modified' : 'Saved' }
						</Status>
					</li>
					<li>
						<label htmlFor="company">Company</label>
						<input name="company" id="company"
							defaultValue={user.company} onChange={checkForChange}
						/>
						<Status $modified={changedFields.has('company')}>
							{changedFields.has('company') ? 'Modified' : 'Saved' }
						</Status>
					</li>
					<li>
						<label htmlFor="school">School</label>
						<input name="school" id="school"
							defaultValue={user.school} onChange={checkForChange}
						/>
						<Status $modified={changedFields.has('school')}>
							{changedFields.has('school') ? 'Modified' : 'Saved' }
						</Status>
					</li>
					<li>
						<label htmlFor="hobbies">Hobbies</label>
						<input name="hobbies" id="hobbies"
							defaultValue={user.hobbies} onChange={checkForChange}
						/>
						<Status $modified={changedFields.has('hobbies')}>
							{changedFields.has('hobbies') ? 'Modified' : 'Saved' }
						</Status>
					</li>
					<li>
						<label htmlFor="favouriteAnimal">Favourite Animal</label>
						<input name="favouriteAnimal" id="favouriteAnimal"
							defaultValue={user.favouriteAnimal} onChange={checkForChange}
						/>
						<Status $modified={changedFields.has('favouriteAnimal')}>
							{changedFields.has('favouriteAnimal') ? 'Modified' : 'Saved' }
						</Status>
					</li>
					{changedFields.size > 0 &&
					<div>
						{error && <ErrorsContainer style={{ marginBottom: '10px' }}><p>{error}</p></ErrorsContainer>}
						<button style={{ color: 'orange' }} type='button' onClick={handleReset}>Cancel</button>
						<button style={{ color: 'green' }}>Save Changes</button>
					</div>
					}
				</ul>
			</Form>
		</section>
	)
}

export const Form = styled.form`
	ul {
		padding: 0;
		margin: 0;
		list-style: none;
	}
	li {
		display: grid;
		grid-template-columns: 150px 300px 200px;
		align-items: center;
		gap: 10px;
		margin-bottom: 20px;
		@media (max-width: ${TABLET_SMALL}) {
			grid-template-rows: 1fr 1fr 1fr;
			grid-template-columns: 1fr;
			gap: 4px;
			margin-bottom: 40px;
		}
	}
	button {
		padding: 8px 20px;
		+ button { margin-left: 20px; }
		&:disabled {
			opacity: .5;
			cursor: not-allowed;
		}
	}
`
