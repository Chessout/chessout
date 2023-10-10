import React, {useState} from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { DarkMode, LightMode, ContentCopy, Check, Menu as ListIcon } from '@mui/icons-material';
import Divider from "@mui/material/Divider";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useLocation  } from 'react-router-dom';
import ImageLogo from 'assets/images/ImageLogo.png';
import "assets/css/navbar.css";
import "assets/css/globals.css";
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithRedirect } from "firebase/auth";
import {firebaseApp} from "config/firebase";
import { ExtensionLoginButton, WalletConnectLoginButton, LedgerLoginButton, WebWalletLoginButton, } from "@multiversx/sdk-dapp/UI";
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks/account";
import {logout} from "@multiversx/sdk-dapp/utils";

function CustomNavbar(props) {
  // Dark Theme constant
  const isDarkTheme = props.theme === 'dark';

  // Page name
  const location = useLocation();
  const pathnameSegments = location.pathname.split('/');
  const activePage = pathnameSegments[pathnameSegments.length - 1];

  let activePageLabel;
  switch (activePage) {
    case '': activePageLabel = "About Us"; break;
    case 'about-us': activePageLabel = "About Us"; break;
    case 'dashboard': activePageLabel = "Dashboard"; break;
    case 'my-clubs': activePageLabel = "My Clubs"; break;
    case 'my-profile': activePageLabel = "My Profile"; break;
    case 'club-players': activePageLabel = "Club Players"; break;
    case 'team': activePageLabel = "Team"; break;
    case 'tournaments': activePageLabel = "Tournaments"; break;
    default: activePageLabel = "Home";
  }

  // The login right drawer
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  const toggleLoginDrawer = (open) => {
    setIsLoginDrawerOpen(open);
  };

  // Firebase login
  const authInstance = getAuth(firebaseApp);
  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(authInstance, provider);
    } catch (error) {
      console.error(error);
    }
  };

  // Firebase logout
  const handleSignOut = async () => {
    try {
      await signOut(authInstance);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Multiversx account info
  const { address, account } = useGetAccountInfo();

  //Copy to Clipboard Utility
  const [isCopied, setIsCopied] = React.useState(false);
  function CopyToClipboard(text) {
    navigator.clipboard.writeText(text).then(r => {
      // then branch
    });
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  }

  return (
    <>
      <AppBar position="static" color={isDarkTheme ? 'default' : 'grey'}>
        <Toolbar>
          <Button
            variant={isDarkTheme ? 'outline-light' : 'outline-dark'}
            size="sm"
            className="me-2 b-r-xs"
          >
            <ListIcon />
          </Button>
          <Link to="/">
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
              <p className="text-center h5 mt-3">Platform Account:</p>
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
          <Divider color={"white"} style={{width: '115%', marginLeft: '-10%'}} className="mt-3"/>
          {address ? (
            <>
              <p className="text-center h5 mt-3">MultiversX Account:</p>
              <div className="d-flex justify-content-center">
                <p className="font-size-sm font-lighter">
                  {address.slice(0, 17)} ... {address.slice(50, 62)}
                </p>
                {!isCopied ? (
                  <Button
                    variant="link"
                    onClick={() => CopyToClipboard(address)}
                    className="text-white m-t-n-sm"
                  >
                    <ContentCopy fontSize="10px" style={{marginTop: '-10px'}}/>
                  </Button>
                ) : (
                  <Button variant="link" className="text-white m-t-n-sm">
                    <Check fontSize="10px" style={{marginTop: '-10px'}}/>
                  </Button>
                )}
              </div>
              <div className="d-flex justify-content-center">
                <Button
                  size="sm"
                  variant={"light"}
                  onClick={() => logout()}
                  className="mb-2 btn-block b-r-xs font-size-xs"
                >
                  Sign out
                </Button>
              </div>
            </>
          ):(
            <>
              <p className="text-center h5 mt-2">MultiversX Login:</p>
              <div className="d-flex justify-content-center mt-2">
                <WebWalletLoginButton
                  callbackRoute="/home"
                  nativeAuth={true}
                  loginButtonText="Web wallet"
                  className="btn btn-sm btn-light b-r-xs font-size-xs btn-block"
                />
              </div>
              <div className="d-flex justify-content-center w-auto">
                <LedgerLoginButton
                  callbackRoute="/home"
                  loginButtonText="Ledger"
                  nativeAuth={true}
                  className="btn btn-sm btn-light b-r-xs font-size-xs btn-block"
                />
              </div>
              <div className="d-flex justify-content-center">
                <WalletConnectLoginButton
                  callbackRoute="/home"
                  nativeAuth={true}
                  loginButtonText={"xPortal App"}
                  isWalletConnectV2={true}
                  className="btn btn-sm btn-light b-r-xs font-size-xs btn-block"
                />
              </div>
              <div className="d-flex justify-content-center">
                <ExtensionLoginButton
                  callbackRoute="/home"
                  nativeAuth={true}
                  loginButtonText="Extension"
                  className="btn btn-sm btn-light b-r-xs font-size-xs btn-block"
                />
              </div>
            </>
          )}
        </div>
      </SwipeableDrawer>
    </>
  );
}

export default CustomNavbar;
