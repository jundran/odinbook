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
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: 1fr;
	gap: 32px;
	@media (max-width: ${TABLET_SMALL}) {
		grid-template-columns: 1fr;
		grid-template-rows: auto 400px;
	}
`
