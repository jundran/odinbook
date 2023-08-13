import styled from 'styled-components'
import { useState, useRef } from 'react'
import axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import useAuth from '../context/authContext'
import { dataUrlToBlob } from '../utilities/file-utils'
import UserIcon from './userComponents'
import ImageUploader from './postImageUpload'
import { GridColumns, Line } from '../styles/sharedComponentStyles'

export default function PostCreate ({ refreshPosts, headerType }) {
	const [value, setValue] = useState('')
	const { user, token } = useAuth()
	const [image, setImage] = useState(null)
	const filename = useRef()

	async function handleSubmit (e) {
		e.preventDefault()

		const formData = new FormData()
		formData.append('user', user.id)
		formData.append('text', value)
		if (image) formData.append('file', await dataUrlToBlob(image), filename.current)

		axios.post(import.meta.env.VITE_API + '/post', formData, {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json'
			}
		}).then(res => {
			if (res.status === 201) {
				setValue('')
				setImage(null)
				refreshPosts()
			}
		}).catch(error => {
			console.log(error.response.data)
		})
	}

	function handleEdit (value) {
		// Quill editor returns this junk HTML when user types something but then deletes it
		if (value !== '<p><br></p>') setValue(value)
		else setValue('')
	}

	return (
		<PostCreateContainer $headerType={headerType}>
			<h2>Create a new post</h2>
			<GridColumns>
				<UserIcon profilePicture={user.profilePicture} size='40px' />
				<div>
					<form onSubmit={handleSubmit}>
						<div onDrop={e => e.preventDefault()}> {/* Prevent dragging images into editor */}
							<ReactQuill dragover={false} theme="snow" value={value} onChange={handleEdit} />
						</div>
						<button className='submit' onClick={handleSubmit}
							disabled={!value && !image}
						>
							Post
						</button>
					</form>
					<ImageUploader image={image} setImage={setImage} filename={filename}/>
				</div>
			</GridColumns>
			<Line />
		</PostCreateContainer>
	)
}

const PostCreateContainer = styled.div`
	button.submit {
		border: 2px solid navy;
		border-radius: 2px;
		padding: 8px 24px;
		margin-top: 10px;
		font-weight: 600;
		font-size: 90%;
	}
	${props => props.$headerType === 'banner' && `
			h2 {
				background: #fff;
				padding: 20px;
				border-radius: 4px;
				margin-top: 0;
			}
	`}
`
