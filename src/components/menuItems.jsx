import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../context/authContext'
import { getTimeFrame } from '../utilities/time'
import { headerBlue } from '../styles/sharedComponentStyles'
import friendsIcon from '../assets/friends.svg'
import notificationsIcon from '../assets/notifications.svg'
import notificationsPendingIcon from '../assets/notifications-pending.svg'
import chatIcon from '../assets/chat.svg'

export function ChatIcon () {
	const { user, messages } = useAuth()
	const location = useLocation()

	const unreadMessageCount = messages.filter(m => m.sender !== user.id && !m.isRead).length || ''

	return (
		<MenuItemContainer>
			<Link to='/chat'>
				<HeaderIcon src={chatIcon} alt='' />
				{location.pathname !== '/chat' && <span>{unreadMessageCount}</span>}
			</Link>
		</MenuItemContainer>
	)
}

export function Friends ({ showDropdown, setShowDropdown }) {
	const { user, acceptFriendRequest, rejectFriendRequest } = useAuth()

	const hasItems = user.incomingFriendRequests.length ? user.incomingFriendRequests.length : false
	return (
		<MenuItemContainer onBlur={e => e.relatedTarget === null && setShowDropdown(false)}>
			<button aria-label='Incoming friend requests' className='icon-button' onClick={setShowDropdown}>
				<HeaderIcon src={friendsIcon} alt='' />
				{hasItems && <span>{hasItems}</span>}
			</button>
			{showDropdown &&
				<DropdownContainer>
					<DropdownTitle>Incoming Friend Requests</DropdownTitle>
					<Items>
						{user.incomingFriendRequests.map(requestingUser =>
							<Item key={requestingUser.id}>
								<p>
									<Link to={`/user/${requestingUser.id}`}>{requestingUser.fullname}</Link>
									<span> sent you a friend request</span>
								</p>
								<div className= 'buttons'>
									<ResponseButton onClick={() => acceptFriendRequest(requestingUser.id)} >
										Accept
									</ResponseButton>
									<ResponseButton onClick={() => rejectFriendRequest(requestingUser.id)} className='reject'>
										Reject
									</ResponseButton>
								</div>
							</Item>
						)}
					</Items>
					{!hasItems &&
						<NoItems>You don&apos;t have any incoming friend requests</NoItems>
					}
				</DropdownContainer>
			}
		</MenuItemContainer>
	)
}

export function Notifications ({ showDropdown, setShowDropdown }) {
	const { user, clearNotification } = useAuth()

	const hasItems = user.notifications.length ? user.notifications.length : false
	return (
		<MenuItemContainer onBlur={e => e.relatedTarget === null && setShowDropdown(false)}>
			<button aria-label='unread notifications' className='icon-button' onClick={setShowDropdown}>
				<HeaderIcon src={hasItems ? notificationsPendingIcon : notificationsIcon} alt='' />
				{hasItems && <span>{hasItems}</span>}
			</button>
			{showDropdown &&
				<DropdownContainer>
					<DropdownTitle>Notifications</DropdownTitle>
					<Items> {/* toReversed() returns copy of the array */}
						{user.notifications.toReversed().map(notification =>
							<Item key={notification.id || notification._id}>
								<p>
									{notification.user &&
										<Link to={`/user/${notification.user.id}`}>{notification.user.fullname}</Link>
									}
									<span> {notification.message}</span>
									<span className='time'>{getTimeFrame(notification.createdAt)}</span>
								</p>
								<div className= 'buttons'>
									<ResponseButton onClick={() => clearNotification(notification)}>
										Dismiss
									</ResponseButton>
								</div>
							</Item>
						)}
					</Items>
					{!hasItems && <NoItems>You don&apos;t have any notifications</NoItems>}
				</DropdownContainer>
			}
		</MenuItemContainer>
	)
}

const HeaderIcon = styled.img`
	width: 32px;
	filter: invert(100%);
	&:hover { filter: invert(85%); }
`

const MenuItemContainer = styled.div`
	a span, button span {
		color: #fff;
		font-size: 1rem;
	}
`

const DropdownContainer = styled.div`
	position: absolute;
	top: 70px;
	right: 20px;
	border: 5px solid #222;
	border-radius: 5px;
	z-index: 1;
	background: ${headerBlue};
	width: max-content;
	max-width: calc(100vw - 40px);
`

const DropdownTitle = styled.p`
	margin: 15px;
	text-align: center;
	font-size: 1.1rem;
	font-weight: 600;
`

const NoItems = styled.p`
	text-align: center;
	margin: 16px;
`

const Items = styled.div`
	> :not(:first-child)  { border-top: 2px solid #222; }
	> :nth-child(odd) { background: #6b9b9b }
`

const Item = styled.div`
	padding: 20px 15px;
	&:hover { background: teal }
	p {
		margin: 0 0 15px 0;
		color: #fff;
		text-align: start;
		font-size: .9rem;
		a {
			font-size: inherit;
			color: navy;
			&:hover {
				color: navy;
				text-decoration: underline;
			}
		}
	}
	.time {
		display: block;
		margin-top: 8px;
		font-size: .8rem;
		font-weight: 600;
	}
	.buttons {
		display: flex;
		justify-content: space-between;
	}
`

const ResponseButton = styled.button`
	padding: 8px 16px;
	border: 1px solid #222;
	border-radius: 4px;
	font-weight: 600;
	font-size: .8rem;
	&:hover {
		background: green;
		color: #fff;
		&.reject { background: red; }
	}
`
