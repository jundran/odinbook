import styled from 'styled-components'
import likeImage from '../assets/like.svg'
import useAuth from '../context/authContext'

export default function Like ({ likes, onLikeOrUnlike, dataType }) {
	const { user } = useAuth()
	const userLikes = likes.some(like => like.id === user.id)

	return (
		<StyledLike>
			<button aria-label={userLikes ? 'unlike' : 'like' + dataType} onClick={onLikeOrUnlike}>
				<img src={likeImage} alt='like or unlike' />
			</button>
			<span>
				{userLikes ?
					<>
						{likes.length === 1 ?
							`You like this ${dataType}` :
							`You and ${likes.length - 1} other
							${likes.length > 2 ? 'people like' : 'person likes'} this ${dataType}`
						}
					</>
					:
					<>
						{likes.length === 1 ?
							`1 person likes this ${dataType}` :
							`${likes.length} people like this ${dataType}`
						}
					</>
				}
			</span>
		</StyledLike>
	)
}

const StyledLike = styled.div`
	display: flex;
	align-items: center;
	button {
		color: navy;
		margin-top: 4px;
		border: none;
		background: none;
		padding: 0;
	}
	img {
		width: 40px;
		margin: -4px 0 0 -10px;
	}
	span {
		font-size: .7rem;
	}
`
