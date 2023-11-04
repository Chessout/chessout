import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import CustomNavbar from 'components/Navbar';
import "assets/css/globals.css";

import About from 'pages/about';
import ClubPlayers from 'pages/club_players';
import Dashboard from 'pages/dashboard';
import Home from 'pages/home';
import FollowedPlayers from 'pages/followed_players';
import MyClub from 'pages/my_club';
import MyClubs from 'pages/my_clubs';
import MyProfile from 'pages/my_profile';
import Team from 'pages/team';
import TournamentPlayers from 'pages/tournamentPlayers';
import TournamentRounds from 'pages/tournamentRounds';
import TournamentStandings from 'pages/tournamentStandings';
import Tournaments from 'pages/tournaments';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {firebaseApp} from "./config/firebase";
import {readMyDefaultClub} from "utils/firebaseTools";

const lightTheme = createTheme();
const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
});

function App() {
  // Theme options
  const [theme, setTheme] = useState('dark');
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  // Check if the screen is mobile
  const isMobile = useMediaQuery('(max-width:600px)');

  //firebase user data
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authStateLoaded, setAuthStateLoaded] = useState(false);
  useEffect(() => {
    const auth = getAuth(firebaseApp);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthStateLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  // get the default user club
  const getMyDefaultClub = async () => {
    return await readMyDefaultClub(firebaseUser?.uid);
  };
//sd
  return (
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        <Router>
          <CustomNavbar theme={theme} handleThemeChange={handleThemeChange} isMobile={isMobile} firebaseUser={firebaseUser ? firebaseUser: null}/>
          <Routes>
            <Route
              path="/"
              element={
                authStateLoaded ? (
                  firebaseUser ? (
                    <Navigate to={`/home/${firebaseUser.uid}`} />
                  ) : (
                    <Navigate to="/home/undefined" />
                  )
                ) : null
              }
            />
            <Route path="/about-us" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home/:userId" element={<Home firebaseUser={firebaseUser} />} />
            <Route path="/followed-players" element={<FollowedPlayers />} />
            <Route path="/my-club" element={<MyClub />} />
            <Route path="/my-clubs" element={<MyClubs firebaseUser={firebaseUser} />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/club-players" element={<ClubPlayers />} />
            <Route path="/team" element={<Team />} />
            <Route path="/tournament-players/:tournamentId" element={<TournamentPlayers isMobile={isMobile} firebaseUser={firebaseUser} getMyDefaultClub={getMyDefaultClub}/>} />
            <Route path="/tournament-rounds/:tournamentId/:activeRoundId" element={<TournamentRounds isMobile={isMobile} firebaseUser={firebaseUser} getMyDefaultClub={getMyDefaultClub}/>} />
            <Route path="/tournament-standings/:tournamentId" element={<TournamentStandings isMobile={isMobile} firebaseUser={firebaseUser} getMyDefaultClub={getMyDefaultClub}/>} />
            <Route path="/tournaments" element={<Tournaments isMobile={isMobile} firebaseUser={firebaseUser} getMyDefaultClub={getMyDefaultClub}/>} />
          </Routes>
        </Router>
      </ThemeProvider>
  );
}

export default App;