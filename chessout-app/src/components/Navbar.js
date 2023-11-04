import React, {useState, useEffect} from 'react';
import { AppBar, Toolbar, IconButton, Typography, List, ListItem, ListItemText } from '@mui/material';
import { DarkMode, LightMode, Menu as MenuIcon } from '@mui/icons-material';
import { Home as HomeIcon } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import StarRateIcon from '@mui/icons-material/StarRate';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Divider from "@mui/material/Divider";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from "react-bootstrap/Button";
import { Link, useLocation  } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ImageLogo from 'assets/images/ImageLogo.png';
import "assets/css/navbar.css";
import "assets/css/globals.css";
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {firebaseApp} from "config/firebase";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';


function CustomNavbar(props) {
  // Dark Theme constant
  const isDarkTheme = props.theme === 'dark';

  // Page name
  const location = useLocation();
  const pathnameSegments = location.pathname.split('/');
  const activePage = pathnameSegments[pathnameSegments.length - 1];

  let activePageLabel;
  switch (activePage) {
    case '': activePageLabel = "Home"; break;
    case 'about-us': activePageLabel = "About Us"; break;
    case 'dashboard': activePageLabel = "Dashboard"; break;
    case 'followed-players': activePageLabel = "Followed Players"; break;
    case 'my-club': activePageLabel = "My Club"; break;
    case 'my-clubs': activePageLabel = "My Clubs"; break;
    case 'my-profile': activePageLabel = "My Profile"; break;
    case 'club-players': activePageLabel = "Club Players"; break;
    case 'team': activePageLabel = "Team"; break;
    case 'tournaments': activePageLabel = "Tournaments"; break;
    default:
      if (pathnameSegments[1] === 'tournament') {
        activePageLabel = "Tournament Details";
      } else {
        activePageLabel = "Home";
      }
  }

  // The login right drawer
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  const toggleLoginDrawer = (open) => {
    setIsLoginDrawerOpen(open);
  };

  // The menu left drawer
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const toggleMenuDrawer = (open) => {
    setIsMenuDrawerOpen(open);
  };

  // Firebase login
  const authInstance = getAuth(firebaseApp);
  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(authInstance, provider);
      const user = result.user;
      navigate(`/home/${user?.uid}`);
    } catch (error) {
      console.error(error);
    }
  };

  // Firebase logout
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut(authInstance);
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Menu drawer item function
  const handleHomeClick = (route) => {
    navigate(route);
    toggleMenuDrawer(false);
  };

  const [defaultClub, setDefaultClub] = useState(null);
  useEffect(()=>{
    if(props.firebaseUser){
      const getClub = async () => {
        return await props.getMyDefaultClub();
      };
      getClub().then((r) => {
        setDefaultClub(r);
      })
    }
  }, []);

  return (
    <>
      <AppBar position="static" color={isDarkTheme ? 'default' : 'grey'}>
        <Toolbar>
          <Button
            variant={isDarkTheme ? 'outline-light' : 'outline-dark'}
            size="sm"
            className="me-2 b-r-xs"
            onClick={() => toggleMenuDrawer(true)}
          >
            <MenuIcon />
          </Button>
          <Link to={`/home/${props.firebaseUser?.uid}`}>
            <img className="navbar-logo" src={ImageLogo} alt="Logo" />
          </Link>
          <Typography
            variant="h6"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: props.isMobile ? 'none' : 'flex',
              flexGrow: 50,
              justifyContent: 'center',
            }}
            className="ms-3"
          >
            {activePageLabel}
          </Typography>
          <div style={{ flexGrow: 1 }} />

          {/* Show Login / my account if the user is logged out / logged in */}
          {props.firebaseUser ? (
            <Button
              variant={isDarkTheme ? 'outline-light' : 'outline-dark'}
              size="sm"
              className="me-2 b-r-xs"
              onClick={() => toggleLoginDrawer(true)}
            >
              My Account
            </Button>
          ):(
            <Button
              variant={isDarkTheme ? 'outline-light' : 'outline-dark'}
              size="sm"
              className="me-2 b-r-xs"
              onClick={() => toggleLoginDrawer(true)}
            >
              Login
            </Button>
          )}

          <IconButton
            color="inherit"
            onClick={() => props.handleThemeChange(isDarkTheme ? 'light' : 'dark')}
          >
            {isDarkTheme ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Login drawer content*/}
      <SwipeableDrawer
        anchor="right"
        open={isLoginDrawerOpen}
        onClose={() => toggleLoginDrawer(false)}
        onOpen={() => toggleLoginDrawer(true)}
      >
        <div
          role="presentation"
          onClick={() => toggleLoginDrawer(false)}
          onKeyDown={() => toggleLoginDrawer(false)}
          className="px-3"
          style={{minWidth: '300px'}}
        >
          {props.firebaseUser ? (
            <>
              <p className="text-center h5 mt-3">Account Details:</p>
              <p className="text-center mt-2">{props.firebaseUser.email}</p>
              <div className="d-flex justify-content-center">
                <Button
                  size="sm"
                  variant={"light"}
                  onClick={() => handleSignOut()}
                  className="mt-2 btn-block b-r-xs ms-3 me-3 font-size-xs"
                >
                  Sign out
                </Button>
              </div>
            </>
          ):(
            <>
              <p className="text-center h5 mt-3">Platform Login:</p>
              <div className="d-flex justify-content-center">
                <Button
                  size="sm"
                  variant={"light"}
                  onClick={() => handleSignInWithGoogle()}
                  className="mt-2 btn-block b-r-xs ms-3 me-3"
                >
                  Sign in with google
                </Button>
              </div>
            </>
          )}
        </div>
      </SwipeableDrawer>

      {/* Menu drawer content*/}
      <SwipeableDrawer
        anchor="left"
        open={isMenuDrawerOpen}
        onClose={() => toggleMenuDrawer(false)}
        onOpen={() => toggleMenuDrawer(true)}
      >
        <div
          role="presentation"
          onClick={() => toggleMenuDrawer(false)}
          onKeyDown={() => toggleMenuDrawer(false)}
          className="px-3"
          style={{minWidth: '300px'}}
        >
          <p className=" h5 mt-3">Menu</p>
          <List>
            <ListItem key="home" disablePadding>
              <ListItemButton onClick={() => handleHomeClick(`/home/${props.firebaseUser?.uid}`)}>
                <ListItemIcon> <HomeIcon /> </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem key="about-us" disablePadding>
              <ListItemButton onClick={() => handleHomeClick('/about-us')}>
                <ListItemIcon> <InfoIcon /> </ListItemIcon>
                <ListItemText primary="About Us"/>
              </ListItemButton>
            </ListItem>
            <ListItem key="my-club" disablePadding>
              <ListItemButton onClick={() => handleHomeClick('/my-club')}>
                <ListItemIcon> <StarRateIcon /> </ListItemIcon>
                <ListItemText primary="My Club"/>
              </ListItemButton>
            </ListItem>
            <ListItem key="my-clubs" disablePadding>
              <ListItemButton onClick={() => handleHomeClick('/my-clubs')}>
                <ListItemIcon> <PersonIcon /> </ListItemIcon>
                <ListItemText primary="My Clubs"/>
              </ListItemButton>
            </ListItem>
            <ListItem key="club-players" disablePadding>
              <ListItemButton onClick={() => handleHomeClick('/club-players')}>
                <ListItemIcon> <GroupsIcon /> </ListItemIcon>
                <ListItemText primary="Club Players"/>
              </ListItemButton>
            </ListItem>
            <ListItem key="followed-players" disablePadding>
              <ListItemButton onClick={() => handleHomeClick('/followed-players')}>
                <ListItemIcon> <PeopleIcon /> </ListItemIcon>
                <ListItemText primary="Followed Players"/>
              </ListItemButton>
            </ListItem>
            <ListItem key="tournaments" disablePadding>
              <ListItemButton onClick={() => handleHomeClick(`/tournaments/${defaultClub?.clubKey}`)}>
                <ListItemIcon> <EmojiEventsIcon /> </ListItemIcon>
                <ListItemText primary="Tournaments"/>
              </ListItemButton>
            </ListItem>
          </List>
          <Divider color={"white"} style={{width: '115%', marginLeft: '-9%'}} className="mt-3"/>
        </div>
      </SwipeableDrawer>
      <Toaster/>
    </>
  );
}

export default CustomNavbar;
