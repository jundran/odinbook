import { useState } from 'react'
import axios from 'axios'
import useAuth from '../context/authContext'
import { Form } from './aboutForm'
import { Status } from '../styles/sharedComponentStyles'

export default function PasswordForm () {
	const [passwordFieldChanged, setPasswordFieldChanged] = useState(false)
	const [passwordsMatch, setPasswordsMatch] = useState(false)
	const [error, setError] = useState('')
	const { user, token } = useAuth()

	function handleSubmit (e) {
		e.preventDefault()
		setError('')
		if (!passwordsMatch) return // redundant check

		axios.put(import.meta.env.VITE_API + '/auth/updatepassword',
			{ password: e.target.password.value,	currentPassword: e.target.currentPassword.value },
			{ headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => {	if (res.status === 204) resetForm(e.target) }
		).catch(err => setError(err.response.data.message))
	}

	function resetForm (form) {
		form.reset()
		setPasswordFieldChanged(false)
		setPasswordsMatch(false)
		setError('')
	}

	function checkForChange (e) {
		if (
			e.target.form.password.value === ''	&&
			e.target.form.passwordConfirm.value === ''	&&
			e.target.form.currentPassword.value === ''
		) {
			setPasswordFieldChanged(false)
		} else {
			setPasswordFieldChanged(true)
		}
		checkForMatch(e)
	}

	function checkForMatch (e) {
		e.target.form.password.value === e.target.form.passwordConfirm.value ?
			setPasswordsMatch(true) :	setPasswordsMatch(false)
	}

	return (
		<section>
			<h2>Change Password</h2>
			<Form aria-label='change password' onSubmit={handleSubmit}>
				{/* For accessibility - password manager */}
				<input style={{ display: 'none' }} type='email'
					defaultValue={user.email} autoComplete='username'
				/>
				<ul>
					<li>
						<label htmlFor="password">New Password</label>
						<input type='password' name="password" id="password"
							onChange={checkForChange} autoComplete='new-password' required minLength='8'
						/>
						<Status $modified={passwordFieldChanged}>
							{passwordFieldChanged ? 'Modified' : 'Saved' }
						</Status>
					</li>
					<li>
						<label htmlFor="passwordConfirm">Confirm Password</label>
						<input type='password' name="passwordConfirm" id="passwordConfirm"
							onChange={checkForChange} autoComplete='new-password' required minLength='8'
						/>
						{passwordFieldChanged &&
							<Status $modified={!passwordsMatch}>
								{passwordsMatch ? 'Passwords match' : 'Passwords do not match' }
							</Status>
						}
					</li>
					<li>
						<label htmlFor="currentPassword">Existing Password</label>
						<input type='password' name="currentPassword" id="currentPassword"
							onChange={checkForChange} autoComplete='existing-password' required minLength='8'
						/>
					</li>
					{error && <p style={{ color: 'red' }}>{error}</p>}
					{passwordFieldChanged &&
						<div>
							<button
								style={{ color: 'orange' }}
								type='button'
								onClick={e => resetForm(e.target.form)}
							>
								Clear
							</button>
							<button disabled={!passwordsMatch}>Update Password</button>
						</div>
					}
				</ul>
			</Form>
		</section>
	)
}
