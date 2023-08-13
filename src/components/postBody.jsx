import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'

export default function PostBody ({ text, image }) {
	const [lineClamp, setLineClamp] = useState(4)
	const [hasMoreContent, setHasMoreContent] = useState(false)
	const [expanded, setExpanded] = useState(false)
	const contentRef = useRef()

	useEffect(() => {
		// If post body has content that exceeds CSS line clamp value
		if (contentRef.current.scrollHeight > contentRef.current.clientHeight) {
			setHasMoreContent(true)
		} else {
			setHasMoreContent(false)
		}
	}, [lineClamp])

	function showMore () {
		setExpanded(true)
		// Expand content by up to 40 lines, allowing for posts of any length
		// while preventing long posts from taking up too much of the feed height
		// unless incrementally expanded by the user
		setLineClamp(lineClamp + 40)
	}

	function showLess () {
		setExpanded(false)
		setLineClamp(4)
	}

	return (
		<Container>
			<Content ref={contentRef} $lineClamp={lineClamp} dangerouslySetInnerHTML={{ __html: text }} />
			{expanded && <ShowMoreButton onClick={showLess}>Show Less</ShowMoreButton>}
			{hasMoreContent && <ShowMoreButton onClick={showMore}>Show More</ShowMoreButton>}
			{image && <img src={import.meta.env.VITE_SERVER + image} alt='posted' /> }
		</Container>
	)
}

const Container = styled.div`
	h2, p {
		margin: 4px 0;
		text-align: justify;
	}
	img {
		max-height: 300px;
		max-width: 100%;
		display: block;
		margin: 10px 0;
	}
`

const Content = styled.div`
	line-height: 1.4;
	overflow: clip;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${props => props.$lineClamp};
`

export const ShowMoreButton = styled.button`
	margin: 10px 0 2px 0;
	border: none;
	background: none;
	padding: 0;
	font-weight: 600;
	font-size: 90%;
	color: navy;
	& + & { margin-left: 20px; }
	&:hover { color: #000 }
`

