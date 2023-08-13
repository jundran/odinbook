import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { blobToDataURL } from '../utilities/file-utils'

export default function ImageUploader ({ image, setImage, filename }) {
	const [fileError, setFileError] = useState('')
	const ref = useRef()

	async function handleUpload (e) {
		const file = e.target.files[0]
		if (!file.type.match('image')) return setFileError('File must be an image')

		filename.current = file.name
		setImage(await blobToDataURL(file))
		setFileError('')
	}

	function handleRemove () {
		setImage(null)
		ref.current.reset()
	}

	useEffect(() => {
		// Clear file upload input when image is removed
		if (!image) ref.current.reset()
	}, [image])

	return (
		<ImageUploaderContainer>
			<form ref={ref} onChange={handleUpload}>
				<label htmlFor="upload">Add image</label>
				<input name='upload' id='upload' type="file" />
				<p>{fileError}</p>
			</form>
			{image &&
				<>
					<img src={image} alt='uploaded' />
					<button onClick={handleRemove}>Remove image</button>
				</>
			}
		</ImageUploaderContainer>
	)
}

const ImageUploaderContainer = styled.div`
	padding: 20px 0;
	img {
		display: block;
		max-height: 300px;
		max-width: 100%;
	}
	label {
		display: block;
		font-weight: 600;
		margin-bottom: 10px;
	}
	button {
		margin-top: 4px;
		border: none;
		background: none;
		color: navy;
		padding-left: 0;
		&:hover { text-decoration: underline;	}
	}
`
