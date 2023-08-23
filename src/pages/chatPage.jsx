import styled from 'styled-components'
import { useState } from 'react'
import useAuth from '../context/authContext'
import FriendsStatus from '../components/friendsStatus'
import Chat from '../components/chat'
import { TABLET_SMALL, headerBlue } from '../styles/sharedComponentStyles'
import { SimpleLink } from '../styles/sharedComponentStyles'

export default function ChatPage () {
	document.title = 'Chat'
	const [activeFriend, setActiveFriend] = useState(null)
	const { user } = useAuth()

	return (
		<main>
			<Container>
				{user.friends.length ?
					<>
						<FriendsStatus
							activeFriend={activeFriend}
							setActiveFriend={friend => setActiveFriend(friend)}
						/>
						<Chat activeFriendId={activeFriend?.id} />
					</> :
					<NoFriends>
						<p>Add friends to start a conversation</p>
						<SimpleLink to='/people'>Find Friends</SimpleLink>
					</NoFriends>
				}
			</Container>
		</main>
	)
}

const Container = styled.div`
	flex-grow: 1;
	display: flex;
	gap: 32px;
	min-height: 300px;
	max-height: 590px;
	@media (max-width: ${TABLET_SMALL}) {
		flex-direction: column;
		gap: 10px;
		min-height: auto;
		max-height: max-content;
		.FriendsStatus {
			max-height: 290px;
		}
		.Chat {
			min-height: 300px;
			max-height: 396px;
		}
	}
`

const NoFriends = styled.div`
	margin: 10% auto;
	height: fit-content;
	border: 5px dotted ${headerBlue};
	padding: 32px;
	text-align: center;
`

