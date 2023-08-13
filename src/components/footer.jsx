import styled from 'styled-components'
import github from '../assets/github.svg'
import odinProject from '../assets/logo.svg'

export default function Footer () {
	return (
		<FootererContainer>
			<div>
				<a className='withsvg' href="https://www.theodinproject.com/lessons/nodejs-odin-book"
					target="_blank" rel="noopener noreferrer">
					<img src={odinProject} alt="The Odin project" />
				</a>
				<a className='withsvg' href="https://github.com/jundran/odinbook"
					target="_blank" rel="noopener noreferrer">
					<img src={github} alt="Github" />
					<span>Code</span>
				</a>
			</div>
		</FootererContainer>
	)
}

const FootererContainer = styled.footer`
	background: lightblue;
	padding: 32px;
	> div {
		max-width: 1200px;
		margin: auto;
	}
	a {
		font-size: 1rem;
		color: #000;
		text-decoration: none;
		display: block;
		margin-bottom: 24px;
		padding: 10px;
		width: 180px;
		border-bottom: 1px solid transparent;
		&.withsvg {
			display: flex;
			align-items: center;
			gap: 24px;
		}
		&:hover {
			border-color: #000;
		}
	}
	img {
		height: 48px;
	}
`
