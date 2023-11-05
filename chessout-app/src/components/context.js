import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {firebaseApp} from "../config/firebase";
import {ThemeProvider, CssBaseline, useMediaQuery, createTheme} from '@mui/material';

const lightTheme = createTheme();
const darkTheme = createTheme({
	palette: {
		mode: 'dark'
	},
});

const AppContext = createContext();

export function AppProvider({ children }) {
	const [firebaseUser, setFirebaseUser] = useState(null);
	const [authStateLoaded, setAuthStateLoaded] = useState(false);
	const [theme, setTheme] = useState('dark');
	const isMobile = useMediaQuery('(max-width:600px)');

	useEffect(() => {
		const auth = getAuth(firebaseApp);

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setFirebaseUser(user);
			setAuthStateLoaded(true);
		});
		return () => unsubscribe();
	}, []);

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
	};

	return (
		<ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
			<CssBaseline />
			<AppContext.Provider value={{ firebaseUser, authStateLoaded, theme, handleThemeChange, isMobile }}>
				{children}
			</AppContext.Provider>
		</ThemeProvider>
	);
}

export function useApp() {
	return useContext(AppContext);
}
