export async function blobToDataURL (blob) {
	const reader = new FileReader()
	return new Promise(resolve => {
		reader.onload = () => {
			const dataUrl = reader.result
			resolve(dataUrl)
		}
		reader.fileName = 'profile.jpg'
		reader.readAsDataURL(blob)
	})
}

export async function dataUrlToBlob (url) {
	const res = await fetch(url)
	return res.blob()
}
