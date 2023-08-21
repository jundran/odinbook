import styled from 'styled-components'
import { useRef } from 'react'
import useAuth from '../context/authContext'
import { SimpleLink, headerBlue } from '../styles/sharedComponentStyles'

export default function UserIcon ({ profilePicture, size }) {
	return <Icon src={import.meta.env.VITE_SERVER + profilePicture} $size={size} alt="user icon" />
}

export function UserBadge ({ user, showDropdown, setShowDropdown }) {
	const dropdownRef = useRef()

	function handleClick () {
		setShowDropdown(!showDropdown)
	}

	function handleBlur (e) {
		// If blur event is not triggered by clicking button inside this
		if (e.relatedTarget === null) setShowDropdown(false)
	}

	return (
		<UserBadgeContainer
			onClick={handleClick}
			ref={dropdownRef}
			onBlur={handleBlur}
		>
			<button>
				<span>{user.fullname}</span>
				<UserIcon profilePicture={user.profilePicture} size='40px' />
			</button>
			{showDropdown && <BadgeDropdown />}
		</UserBadgeContainer>
	)
}

function BadgeDropdown () {
	const { logout } = useAuth()

	return (
		<BadgeDropdownContainer>
			<button onClick={() => logout()}>Logout</button>
		</BadgeDropdownContainer>
	)
}

export function Badge ({ userData, style }) {
	return (
		<BadgeContainer style={style}>
			<UserIcon profilePicture={userData.profilePicture} size='96px'/>
			<SimpleLink to={'/user/' + userData.id} style={{ color: '#000' }}>
				{userData.fullname}
			</SimpleLink>
		</BadgeContainer>
	)
}

export function ChatFriend ({ userData, isActive, onClick, style }) {
	return (
		<ChatFriendContainer onClick={onClick} $isActive={isActive} style={style}>
			<UserIcon profilePicture={userData.profilePicture} size='48px'/>
			<div>
				<p to={'/user/' + userData.id}>{userData.fullname}</p>
				<Status $online={userData.isOnline }>{userData.isOnline ? 'Online' : 'Offline'}</Status>
			</div>
		</ChatFriendContainer>
	)
}

const Icon = styled.img`
	width: ${({ $size }) => $size ? $size : '24px'};
	height: ${({ $size }) => $size ? $size : '24px'};
	border-radius: 50%;
`

const ChatFriendContainer = styled.button`
	display: flex;
	gap: 15px;
	align-items: center;
	border: none;
	min-width: 200px;
	width: 100%;
	padding: 10px;
	border-radius: 8px;
	background: ${props => props.$isActive ? headerBlue : 'none'};
	p {
		text-align: start;
		margin: 10px 0;
	}
`

const Status = styled.p`
	font-size: 80%;
	font-weight: 600;
	color: ${props => props.$online ? 'green' : 'grey' }
`

const UserBadgeContainer = styled.div`
	position: relative;
	button {
		background: none;
		border: none;
		display: flex;
		align-items: center;
		gap: 10px;
		span {
			color: #fff;
			font-weight: 600;
		}
	}
`

const BadgeDropdownContainer = styled.div`
	position: absolute;
	top: 50px;
	right: 0;
	button {
		display: flex;
		justify-content: center;
		text-align: center;
		padding: 15px 30px;
		background: #6cabc0;
		border: 2px solid #222;
		border-radius: 5px;
		font-weight: 600;
		font-size: .9rem;
		&:hover {
			background: #82abb8;
		}
	}
`
const BadgeContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
	margin-bottom: 16px;
`
