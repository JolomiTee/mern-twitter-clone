import { useState } from "react";
import { Routes } from "react-router-dom";

const App = () => {
	const [authUser, setauthUser] = useState(false);
	return (
		<div className="flex max-w-full mx-auto">
			<Routes>
				{authUser && <Sidebar />}
				<Routes>
					<Route
						path="/"
						element={authUser ? <HomePage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/login"
						element={!authUser ? <LoginPage /> : <Navigate to="/" />}
					/>
					<Route
						path="/signup"
						element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
					/>
					<Route
						path="/notifications"
						element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/profile/:username"
						element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
					/>
				</Routes>
				{authUser && <RightPanel />}
				<Toaster />
			</Routes>
		</div>
	);
};

export default App;
