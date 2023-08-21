import styled from 'styled-components'
import { ChatFriend } from './userComponents'
import useAuth from '../context/authContext'

export default function FriendsStatus ({ activeFriend, setActiveFriend }) {
	const { user } = useAuth()

	return (
		<Container className='FriendsStatus'>
			{user.friends.map(friend =>
				<ChatFriend
					key={friend.id}
					userData={friend}
					isActive={activeFriend?.id === friend.id}
					onClick={() => setActiveFriend(friend)}
				/>
			)}
		</Container>
	)
}

const Container = styled.section`
	overflow: auto;
`
