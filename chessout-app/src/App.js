import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { AppProvider} from "./components/context";
import useMediaQuery from "@mui/material/useMediaQuery";

function App() {
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

  return (
      <AppProvider>
        <Router>
          <CustomNavbar getMyDefaultClub={getMyDefaultClub}/>
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
            <Route path="/home/:userId" element={<Home />} />
            <Route path="/followed-players" element={<FollowedPlayers />} />
            <Route path="/my-club" element={<MyClub />} />
            <Route path="/my-clubs" element={<MyClubs />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/club-players" element={<ClubPlayers />} />
            <Route path="/team" element={<Team />} />
            <Route path="/tournament-players/:clubId/:tournamentId" element={<TournamentPlayers getMyDefaultClub={getMyDefaultClub}/>} />
            <Route path="/tournament-rounds/:clubId/:tournamentId/:activeRoundId" element={<TournamentRounds getMyDefaultClub={getMyDefaultClub}/>} />
            <Route path="/tournament-standings/:clubId/:tournamentId" element={<TournamentStandings getMyDefaultClub={getMyDefaultClub}/>} />
            <Route path="/tournaments/:clubId" element={<Tournaments getMyDefaultClub={getMyDefaultClub}/>} />
          </Routes>
        </Router>
      </AppProvider>
  );
}

export default App;