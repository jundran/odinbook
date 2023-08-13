import styled from 'styled-components'
import Book from '../assets/book.svg'

export default function Logo () {
	return (
		<LogoStyled>
			<p>OdinBook</p>
			<img src={Book} alt="book" />
		</LogoStyled>
	)
}

const LogoStyled = styled.div`
	border: 4px dotted #6cabc0;
	padding: 15px 30px;
	p {
		text-align: center;
		font-weight: 600;
		font-size: 2.5rem;
		font-family: serif;
		font-style: italic;
		margin: 0 0 10px 0;
	}
	img {
		display: block;
		width: 130px;
		margin: auto;
	}
`
