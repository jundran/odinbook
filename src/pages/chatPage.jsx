import styled from 'styled-components'
import { useState } from 'react'
import FriendsStatus from '../components/friendsStatus'
import Chat from '../components/chat'
import { TABLET_SMALL } from '../styles/sharedComponentStyles'

export default function ChatPage () {
	document.title = 'Chat'
	const [activeFriend, setActiveFriend] = useState(null)

	return (
		<main>
			<Container>
				<FriendsStatus
					activeFriend={activeFriend}
					setActiveFriend={friend => setActiveFriend(friend)}
				/>
				<Chat activeFriendId={activeFriend?.id} />
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
