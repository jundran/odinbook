import styled from 'styled-components'

export default function AboutPage () {
	document.title = 'About Page'

	return (
		<main>
			<AboutContainer>
				<h1>Odin Book</h1>
				<p>
					This is the final project of the <a href='https://www.theodinproject.com/lessons/nodejs-odin-book' target='_blank' rel='noreferrer'>Odin Project</a>. The client is written using React with Styled Components. The backend uses an Express server along with SocketIO for realtime notifications. Images are persisted to the server using the Multer library and other data is stored in a MongoDB Atlas database.
				</p>
				<h2>About this app</h2>
				<p>
					Welcome to the Odin Book. This is the latest and greatest social media website for you to give away your personal data and let the whole world know about everything you do. No, not really, unfortunately this app is not likely to be the next Facebook but it serves as a tool for me to practise web development.
				</p>
				<p>
					As nobody will actually use this app I have made five demo accounts, which are programtically created in case the database needs to be wiped during development. You can quickly log into one of them from the home page without a password. This allows real time testing of the site by logging into two or more accounts using different browsers or quickly switching between accounts. It is also possible to create and sign into accounts using the sign up or login forms. The demo accounts only have one limitation to user created accounts which is that they cannot actually be deleted.
				</p>
				<h2>The Feed</h2>
				<p>The feed is the main page of the site for logged in users. It shows all of the user&apos;s posts along with the posts of their friends in the order they were posted, starting with the most recent.</p>
				<h2>Posts and comments</h2>
				<p>Users make make posts containing text and / or an image. Users can also leave comments on posts and like both posts and comments. There is no dislike button but a user can click the like button again to remove a like. I wanted to keep posts together on one page with scrolling so to prevent one post from taking up too much vertical space there are show more buttons for long content and comments.</p>
				<h2>Friends</h2>
				<p>
					The friends page allows users to see the other users that they have befriended and which users they have sent friend requests to, or received friend requests from. Friend requests are also shown in the header with a dropdown notification icon. Friend requests are sent in realtime using web sockets. If the potential friend is logged in they will see the incomming friend request notification imediately, otherwise they will see it when they log in again. Notifications are also sent when a friend request has been acccepted or rejected as well as if friend status is revoked.
				</p>
				<h2>People</h2>
				<p>
					The people page allows users to find other users that they can send friend requests to. It shows all registered users. It has a search feature that would be useful if there were more users.
				</p>
				<h2>User Page</h2>
				<p>
					The user page or profile page for the logged in user shows the user&apos;s profile photo and general information about them. If the user page is for a friend then it will show that person&apos;s posts as well as their friends. Otherwise it will not show posts and show only mutual friends shared between the logged in user and the user for privacy. If the user page (profile) belongs to the user then they can edit it. They can change their profile picture and information including password and email address. Email addresses must be unique in the database. User profile pictures must be squared and crop tool is provided to do this. Users can also delete their account with password verification. A demo account cannot be deleted but if you enter the password (literally &apos;password&apos; unless someone has changed it) then you will be logged out as if it was.
				</p>
				<h2>Chat</h2>
				<p>
					Users can send messages to befriended users usng the socketIO server. The number of unread messages is shown in the header next to the icon which takes users to the chat page. On the chat page users can select friends to see the chat window. Unread messages for each friend are shown on the friend selector component rather than in the header when on the chat page. User online status is also show and updated in real time. Inside the chat area the user can see the conversation with unread messages highlighted. Unread messages are marked as read in the database after they have been viewed. Messages sent to offline users will be available to them when they log in again.
				</p>
				<h2>Multiple client connections</h2>
				<p>
					Users can open the app in multiple tabs or browsers, even from different devices or locations and each will remain in sync as the server manages an array of web socket connections, one for each client logged in with a given account. Only when the last client is closed or logged out, is the user marked as offline, and only when the first client is logged in, will the user be marked as coming online in order to notify friends of that user that their online status has changed.
				</p>
				<h2>Login and Security</h2>
				<p>
					The app uses JSON web tokens to keep the user logged in. The token is saved using local storage so that the user is automatically logged in when they visit the website but is deleted on log out. The token is sent with every request that requires a signed in user to verify them on the express server. The token is also used to authorize and manage their connection to the web socket server. Password changes require the user enter the new password twice and the old password. Passwords are hashed using the bcrypt library and never sent to the client.
				</p>
				<h2>Routing</h2>
				<p>
					React Router along with React context manages client side routing depending on if the user is logged in or not. Only this About page can be viewed if not logged in otherwise the user will be shown the login page. This is managed using hash router from React Router. Hash router is preferable to the standard router because it allowes refreshing the page and direct navigation via links or pasting in a URL without 404s. Furthermore, document titles are set for each page to aid with navigating using the browser history API.
				</p>
			</AboutContainer>
		</main>
	)
}

const AboutContainer = styled.div`
	margin: auto;
	max-width: 700px;
	line-height: 1.5;
	a {
		color: navy;
		text-decoration: none;
		&:hover {
			text-decoration: underline;
		}
	}
	h1 { margin-bottom: 16px; }
	h2 { margin-bottom: 10px;	}
	p {	margin: 10px 0;	}
`
