import styled from 'styled-components'
import { BadgeWithStatus } from './userComponents'
import useAuth from '../context/authContext'

export default function FriendsStatus () {
	const { user } = useAuth()

	return (
		<Container>
			{user.friends.map(friend =>
				<BadgeWithStatus key={friend.id} userData={friend} />
			)}
		</Container>
	)
}

const Container = styled.div`
	> div {
		margin-bottom: 20px;
	}
`
