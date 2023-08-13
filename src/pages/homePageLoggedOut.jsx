import styled from 'styled-components'
import { useState } from 'react'
import axios from 'axios'
import useAuth from '../context/authContext'
import { LoginForm, SignupForm } from '../components/forms'
import Logo from '../components/logo'
import { TABLET_SMALL, headerBlue } from '../styles/sharedComponentStyles'

export default function HomeLoggedOut () {
	document.title = 'Log in'
	const [formIsLogin, setFormIsLogin] = useState(true)
	const { login } = useAuth()

	function loginDemoAccount (id) {
		axios.post(import.meta.env.VITE_API + '/auth/demo/' + id)
			.then(res => {
				if (res.status === 200) login(res.data.document, res.data.token)
				else console.log('Unable to login demo user. Server returned code:', res.status)
			}).catch(err => { console.log(err.message) })
	}

	return (
		<main>
			<Container>
				<div>
					<Logo />
				</div>
				<div>
					{formIsLogin ?	<LoginForm /> : <SignupForm /> }
					<ButtonStyled className='create' onClick={() => setFormIsLogin(!formIsLogin)}>
						{formIsLogin ?	'Create a new account' : 'Log in with existing account' }
					</ButtonStyled>
					<ButtonStyled className='demo' onClick={() => loginDemoAccount(1)}>
						<span>Login as Alice</span> <span>(Demo Account)</span>
					</ButtonStyled>
					<ButtonStyled className='demo' onClick={() => loginDemoAccount(2)}>
						<span>Login as Bob</span> <span>(Demo Account)</span>
					</ButtonStyled>
					<ButtonStyled className='demo' onClick={() => loginDemoAccount(3)}>
						<span>Login as Claire</span> <span>(Demo Account)</span>
					</ButtonStyled>
					<ButtonStyled className='demo' onClick={() => loginDemoAccount(4)}>
						<span>Login as Debra</span> <span>(Demo Account)</span>
					</ButtonStyled>
					<ButtonStyled className='demo' onClick={() => loginDemoAccount(5)}>
						<span>Login as Edward</span> <span>(Demo Account)</span>
					</ButtonStyled>
				</div>
			</Container>
		</main>
	)
}

const Container = styled.section`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr;
	@media (max-width: ${TABLET_SMALL}) {
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr;
	}
	> div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	form {
		width: 370px;
		max-width: 100vw;
		padding: 0 20px;
		@media (max-width: ${TABLET_SMALL}) {
			padding: 0 10px;
		}
	}
`

const ButtonStyled = styled.button`
	margin-top: 15px;
	background: ${headerBlue};
	color: #fff;
	padding: 10px;
	font-weight: 600;
	border: 1px solid teal;
	width: 290px;
	max-width: 70%;
	line-height: 1.5;
	&.create {
		margin-top: 40px;
		background: teal;
		color: #fff;
	}
	&.demo {
		background: #fff;
		color: teal;
	}
	span {
		// When button wraps do not break up span
		display: inline-block;
	}
`
