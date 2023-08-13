import styled from 'styled-components'
import Feed from '../components/feed'
import useAuth from '../context/authContext'

export default function HomeLoggedIn () {
	document.title = 'Feed'
	const { user } = useAuth()

	return (
		<main>
			<Container>
				{/* Friend's posts show on the user's feed. If a friend is added or removed
				then this key prop makes the feed rerender and update accordingly */}
				<Feed key={user.friends} />
			</Container>
		</main>
	)
}

const Container = styled.div`
	width: 700px;
	max-width: 100%;
	margin: 0 auto;
`
