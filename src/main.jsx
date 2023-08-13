import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/authContext'
import App from './app.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AuthProvider>
			<App />
		</AuthProvider>
	</React.StrictMode>
)
