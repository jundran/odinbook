import styled from 'styled-components'
import { useState } from 'react'
import { TextButton, SimpleLink } from '../styles/sharedComponentStyles'

export default function Others ({ likes }) {
	const [showTooltip, setShowTooltip] = useState(false)
	const others = likes.slice(3)

	if (!others.length) return <span>others</span>

	return (
		<OthersContainer>
			<TextButton onClick={() => setShowTooltip(!showTooltip)}>
				{others.length > 1 ? 'others' : 'other'}
			</TextButton>
			{showTooltip && <Tooltip others={others}/>}
		</OthersContainer>
	)
}

function Tooltip ({ others }) {
	return (
		<TooltipContainer>
			{others.map(otherUser =>
				<SimpleLink key={otherUser.id} to={`/user/${otherUser.id}`}>{otherUser.fullname}</SimpleLink>
			)}
		</TooltipContainer>
	)
}

const OthersContainer = styled.span`
	position: relative;
`

const TooltipContainer = styled.span`
	position: absolute;
	bottom: 20px;
	right: -10px;
	background: lightblue;
	border: 1px solid #000;
	border-radius: 5px;
	> a {
		display: block;
		width: max-content;
		margin: 20px;
		color: #000;
		font-weight: 600;
	}
`

