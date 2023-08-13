import styled from 'styled-components'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import ImageCropper from '../components/imageCropper'
import useAuth from '../context/authContext'
import axios from 'axios'
import AboutForm from '../components/aboutForm'
import PasswordForm from '../components/passwordForm'
import { ConfirmBoxWithPassword } from '../components/confirmBox'

export default function EditProfilePage () {
	document.title = 'Edit Profile'
	const [cropToolOpen, setCropToolOpen] = useState(false)
	const { user, setUser, token, logout } = useAuth()
	const [showConfirm, setShowConfirm] = useState()
	const [error, setError] = useState('')

	function handlePhotoDelete () {
		axios.delete(import.meta.env.VITE_API + '/user/portrait',
			{ headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => {
			if (res.status === 200) setUser(res.data.document)
		}).catch(err => { console.log(err.message) })
	}

	function handleDelete (confirmed, password) {
		if (!confirmed) return setShowConfirm(false)
		if (!password) return setError('Please enter your password')

		axios.post(import.meta.env.VITE_API + '/auth/deleteAccount',
			{ password },
			{ headers: { 'Authorization': `Bearer ${token}` }}
		).then(res => {
			if (res.status === 204) logout()
		}).catch(err => {
			if (err?.response?.data?.message) {
				setError(err.response.data.message)
			} else {
				console.log(err)
			}
		})
	}

	const userHasProfilePicture = user.profilePicture !== '/images/saved/default-profile-picture.png'
	return (
		<main>
			{cropToolOpen ?
				<ImageCropper close={() => setCropToolOpen(false)} />
				:
				<EditProfile>
					<h2>Profile Picture</h2>
					<img src={import.meta.env.VITE_SERVER + user.profilePicture} alt='profile' />
					<div>
						<button onClick={() => setCropToolOpen(true)}>
							{userHasProfilePicture ? 'Change' : 'Upload'}
						</button>
						{userHasProfilePicture && <button className='warn' onClick={handlePhotoDelete}>Delete</button>}
					</div>
					<ButtonLink to='/profile'>Close Edit</ButtonLink>
					<AboutForm />
					<PasswordForm />
					<Delete onClick={() => setShowConfirm(true)}>Delete Account</Delete>
					{showConfirm && createPortal(
						<ConfirmBoxWithPassword
							message='Delete your account and all its data? Are you sure?'
							onResponse={handleDelete}
							error={error}
						/>, document.getElementById('modal')
					)}
				</EditProfile>
			}
		</main>
	)
}

const EditProfile = styled.div`
	h2 { margin-top: 48px; }
	img {
		max-width: min(400px, 100%);
	}
	button {
		padding: 8px 20px;
		+ button { margin-left: 20px; }
		&.warn { color: red; }
	}
`

const ButtonLink = styled(Link)`
	display: inline-block;
	margin: 20px 0 ;
	text-decoration: none;
	border: 1px solid teal;
	padding: 8px 24px;
	color: navy;
	&:hover {
		background: #c5d2d2;
	}
`

const Delete = styled.button`
	margin-top: 20px;
	border: 1px solid red;
	border-radius: 2px;
`
