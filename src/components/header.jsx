import styled from 'styled-components'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../context/authContext'
import { UserBadge } from './userComponents'
import { Friends, Notifications, ChatIcon } from './menuItems'
import { Hamburger, MobileMenu } from './mobileMenu'
import { headerBlue, DESKTOP, MOBILE } from '../styles/sharedComponentStyles'

export default function Header () {
	const [showMenu, setShowMenu] = useState(false)
	const { user } = useAuth()

	return (
		<div>
			<HeaderContainer>
				<div>
					<Left>
						<Link to='/'>Feed</Link>
						<Link to='/friends'>Friends</Link>
						<Link to='/people'>People</Link>
						<Link to='/profile'>Profile</Link>
						<Link to='/about'>About</Link>
					</Left>
					<Hamburger showMenu={showMenu} setShowMenu={() => setShowMenu(!showMenu)}/>
					<Right>
						{user && <>
							<ChatIcon />
							<Friends />
							<Notifications />
							<UserBadge user={user} />
						</>}
					</Right>
				</div>
			</HeaderContainer>
			<MobileMenu isOpen={showMenu} close={() => setShowMenu(false)} />
		</div>
	)
}

const HeaderContainer = styled.header`
	position: relative;
	background: ${headerBlue};
	padding: 16px;
	> div {
		@media (min-width: ${MOBILE}) {
			// To position DropdownContainer
			position: relative;
		}
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: auto;
		> div {
			display: flex;
			align-items: center;
			flex-grow: 1;
		}
	}
	a {
		font-size: 2rem;
		color: #fff;
		text-decoration: none;
		&:hover { color: #e1e1e1; }
	}
`

const Left = styled.div`
	gap: 40px;
	@media (max-width: ${DESKTOP}) { display: none !important; }
`

const Right = styled.div`
	justify-content: flex-end;
	gap: 10px;
	@media (max-width: ${MOBILE}) { gap: 0px; }
`
