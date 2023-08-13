import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const DESKTOP = '1200px'
export const TABLET_SMALL = '700px'
export const MOBILE = '500px'
export const MOBILE_SMALL = '350px'

export const headerBlue = '#6cabc0'

export const GridColumns = styled.div`
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 10px;
	font-size: 90%;
`

export const Line = styled.hr`
	margin: 16px 0 0 0;
	color: #000080b9;
`

export const TextButton = styled.button`
	background: none;
	border: none;
	color: navy;
	padding: 0;
	&:hover { text-decoration: underline; }
`

export const SimpleLink = styled(Link)`
	color: navy;
	text-decoration: none;
	&:hover {
		text-decoration: underline;
	}
`

export const SimpleLinkMajor = styled(SimpleLink)`
	color: #000;
	font-weight: 600;
`

export const SimpleLinkMinor = styled(SimpleLinkMajor)`
	font-size: 90%;
`

export const Status = styled.span`
	font-size: 90%;
	color: ${props => props.$modified ? 'orange' : 'green'};
`
