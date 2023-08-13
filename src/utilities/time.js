export function getTimeFrame (date) {
	const postDateUnixTime = new Date(date).valueOf() / 1000
	const diff = Date.now() / 1000 - postDateUnixTime
	if (diff < 60) {
		return 'Just now'
	}	else if (diff < 60 * 60) {
		const minutes =  Math.floor(diff / 60)
		return `${minutes} ${minutes > 1 ? ' minutes' : ' minute'} ago`
	}	else if (diff < 60 * 60 * 24) {
		const hours = Math.floor(diff / 60 / 60)
		return `${hours} ${hours > 1 ? ' hours' : ' hour'} ago`
	}	else {
		const days = Math.floor(diff / 60 / 60 / 24)
		return `${days} ${days > 1 ? ' days' : ' day'} ago`
	}
}

export function formatDate (date) {
	return new Date(date).toLocaleDateString(undefined, {
		year: 'numeric', month: 'long', day: 'numeric',
		timeZone: 'UTC'
	})
}

export function getAge (dob) {
	const [y, m, d] = dob.split(/-|T/)
	const now = new Date()
	let age = now.getFullYear() - y
	// If birthday for this year has not yet occurred (month is zero indexed so add 1)
	if ((now.getMonth() + 1 <= m) && (now.getDate() < d )) --age
	return age
}
