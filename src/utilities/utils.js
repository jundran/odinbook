export function checkNameValidity (e) {
	if (e.target.value.trim().length < 2) {
		e.target.setCustomValidity('Name must be at least 2 letters')
		e.target.reportValidity()
	} else {
		e.target.setCustomValidity('')
		e.target.reportValidity()
	}
}
