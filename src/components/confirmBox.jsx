import styled from 'styled-components'
import { useEffect, useState } from 'react'

function disableBackground () {
	// Stop scroll when modal open and keep interactivity locked to it
	document.body.style.overflowY = 'hidden'
	Array.from(document.getElementById('root').children).forEach(child => {
		if ( child.id !== 'modal') child.inert = true
	})
}

function enableBackground () {
	document.body.style.overflowY = 'initial'
	Array.from(document.getElementById('root').children).forEach(child => {
		child.inert = false
	})
}

export default function ConfirmBox ({ message, onResponse }) {
	useEffect(() => {
		disableBackground()
		return () => enableBackground()
	}, [])

	return (
		<ConfirmBoxContainer>
			<p>{message}</p>
			<div>
				<button onClick={() => onResponse(false)}>No</button>
				<button onClick={() => onResponse(true)}>Yes</button>
			</div>
		</ConfirmBoxContainer>
	)
}

export function ConfirmBoxWithPassword ({ message, onResponse, error }) {
	const [password, setPassword] = useState('')

	useEffect(() => {
		disableBackground()
		return () => enableBackground()
	}, [])

	return (
		<ConfirmBoxContainer>
			<p style={{ color: 'orange' }}>{message}</p>
			<input placeholder='Enter your password' onChange={e => setPassword(e.target.value)}
				aria-label='Current password needed to confirm account deletion'
				type='password' autoComplete='' required
			/>
			{error && <p className='error'>{error}</p> }
			<div>
				<button onClick={() => onResponse(false, password)}>No</button>
				<button onClick={() => onResponse(true, password)}>Yes</button>
			</div>
		</ConfirmBoxContainer>
	)
}

const ConfirmBoxContainer = styled.div`
	min-width: 250px;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 1;
	border: 4px solid teal;
	color: #fff;
	background: #292929;
	padding: 20px;
	border-radius: 8px;
	p {
		margin-top: 0;
	}
	div {
		display: flex;
		justify-content: space-between;
	}
	button {
		border: none;
		padding: 8px 24px;
		border: 2px solid transparent;
		border-radius: 2px;
		color: #000;
		&:hover{ border-color: teal; }
	}
	input {
		margin-bottom: 20px;
		width: 200px;
		padding: 10px;
	}
	.error {
		color: orange;
	}
`
