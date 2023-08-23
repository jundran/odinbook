import styled from 'styled-components'
import useAuth from '../context/authContext'
import { getTimeFrame } from '../utilities/time'
import UserIcon from './userComponents'

export default function Message ({ data, friend }) {
	const { user } = useAuth()
	const userIsSender = data.sender === user.id
	// Mark as read if user is sender because only recipient should mark message as read
	const isRead = userIsSender || data.isRead

	return (
		<MessageContainer>
			<UserIcon
				profilePicture={userIsSender ? user.profilePicture : friend.profilePicture}
				size='24px'
			/>
			<div>
				<MessageHeader $isSender={userIsSender} $isRead={isRead}>
					<span className='name'>{userIsSender ? user.firstname : friend.firstname}</span>
					<span className='time'>{getTimeFrame(data.createdAt)}</span>
				</MessageHeader>
				<MessageText>{data.text}</MessageText>
			</div>
		</MessageContainer>
	)
}

const MessageContainer = styled.div`
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 10px;
`

const MessageHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	.name {
		display: block;
		color: ${props => props.$isSender ? 'navy' : 'teal'};
		font-size: .8rem;
		font-weight: 600;
	}
	.time {
		font-size: .6rem;
		font-weight: 600;
		color: #444444;
	}
	${props => props.$isRead === false && `
		&:after {
			content: 'new';
			font-size: .6rem;
			font-weight: 600;
			color: seagreen;
		}
	`}
`

const MessageText = styled.p`
	margin: 5px 0 0 0;
	line-height: 1.3;
`
