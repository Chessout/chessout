//import database from '@react-native-firebase/database';
import {get, getDatabase, ref, push, set} from "firebase/database";
//import {exp} from 'react-native-reanimated';

const CLUB_KEY = '$clubKey';
const TOURNAMENT_KEY = '$tournamentKey';
const TOURNAMENTS = 'tournaments';

const LOCATION_TOURNAMENTS = TOURNAMENTS + '/' + CLUB_KEY;
const LOCATION_TOURNAMENT = LOCATION_TOURNAMENTS + '/' + TOURNAMENT_KEY;

const USER_SETTINGS = 'userSettings';
const USER_KEY = '$userKey';
const DEVICE_KEY = '$deviceKey';
const DEFAULT_CLUB = 'defaultClub';
const MY_CLUBS = 'myClubs';
const MY_DEVICES = 'myDevices';
const PROFILE_PICTURES = 'profilePictures';
const MEDIA = 'media';
const LOCATION_DEFAULT_CLUB = `${USER_SETTINGS}/${USER_KEY}/${DEFAULT_CLUB}`;
const LOCATION_MY_CLUBS = `${USER_SETTINGS}/${USER_KEY}/${MY_CLUBS}`;
const CLUB_PLAYERS = 'clubPlayers';
const LOCATION_CLUB_PLAYERS = `${CLUB_PLAYERS}/${CLUB_KEY}`;

const USER_STREAM = 'userStream';

const CLUB_POSTS = 'clubPosts';
const CLUB_POST_PICTURES = 'clubPostPictures';
const PICTURE_KEY = '$pictureKey';
const POST_ITEMS = 'postItems';
const POST_KEY = '$postKey';
const POST_LIKES = 'postLikes';

const LOCATION_USER_STREAM_POSTS = `${USER_SETTINGS}/${USER_KEY}/${USER_STREAM}/${POST_ITEMS}`;

const USER_PUBLIC_INFO = 'userPublicInfo';
const PROFILE_PICTURE = 'profilePicture';
const LOCATION_USER_PROFILE_PICTURE = `${USER_PUBLIC_INFO}/${USER_KEY}/${PROFILE_PICTURE}`;

const TOURNAMENT_PLAYERS = 'tournamentPlayers';
const LOCATION_TOURNAMENT_PLAYERS = `${TOURNAMENT_PLAYERS}/${CLUB_KEY}/${TOURNAMENT_KEY}`;
const CLUB = 'club';
const CLUBS = 'clubs';
const PLAYER = 'player';
const PLAYER_KEY = '$playerKey';
const LOCATION_CLUB = `${CLUBS}/${CLUB_KEY}`;
const LOCATION_CLUB_PROFILE_PICTURE = `${CLUBS}/${CLUB_KEY}/picture`;

const CLUB_USER_SETTINGS = 'clubUsersSettings';
const LOCATION_CLUB_USERS_SETTINGS = `${CLUB_USER_SETTINGS}/${CLUB_KEY}`;
const LOCATION_CLUB_USER_SETTINGS = `${LOCATION_CLUB_USERS_SETTINGS}/${USER_KEY}`;
const LOCATION_USER_PROFILE_PICTURES = `${USER_PUBLIC_INFO}/${USER_KEY}/${MEDIA}/${PROFILE_PICTURES}/${PICTURE_KEY}`;

const ROUND_NUMBER = '$roundNumber';
const ROUND_ABSENT_PLAYERS = 'absentPlayers';
const TOURNAMENT_ROUNDS = 'tournamentRounds';
const LOCATION_ROUND_ABSENT_PLAYERS = `${TOURNAMENT_ROUNDS}/${CLUB_KEY}/${TOURNAMENT_KEY}/${ROUND_NUMBER}/${ROUND_ABSENT_PLAYERS}`;

const LOCATION_MY_DEVICES = `${USER_SETTINGS}/${USER_KEY}/${MY_DEVICES}`;
const LOCATION_MY_DEVICE = `${LOCATION_MY_DEVICES}/${DEVICE_KEY}`;

const LOCATION_PLAYER_MEDIA = `${MEDIA}/${CLUB}/${CLUB_KEY}/${PLAYER}/${PLAYER_KEY}`;
const LOCATION_PLAYER_MEDIA_PROFILE_PICTURE = `${LOCATION_PLAYER_MEDIA}/${PROFILE_PICTURE}`;

const PLAYER_FOLLOWERS = 'playerFollowers';
const LOCATION_PLAYER_FOLLOWERS = `${PLAYER_FOLLOWERS}/${PLAYER_KEY}/${USER_KEY}`;
const FOLLOWED_PLAYERS = 'followedPlayers';
const LOCATION_USER_FOLLOWED_PLAYERS = `${USER_SETTINGS}/${USER_KEY}/${FOLLOWED_PLAYERS}/${PLAYER_KEY}`;

const GAMES = 'games';
const LOCATION_ROUND_GAMES = `${TOURNAMENT_ROUNDS}/${CLUB_KEY}/${TOURNAMENT_KEY}/${ROUND_NUMBER}/${GAMES}`;

export function getUserHomePostsRef(user, callBack) {
  let returnVal = LOCATION_USER_STREAM_POSTS.replace(USER_KEY, user.uid);
  return returnVal;
}

export function getUserProfilePicture(user) {
  let returnVal = LOCATION_USER_PROFILE_PICTURE.replace(USER_KEY, user.uid);
  return returnVal;
}

export function userProfilePictureFolder(user) {
  let returnVal = LOCATION_USER_PROFILE_PICTURES.replace(
    USER_KEY,
    user.uid,
  ).replace('/' + PICTURE_KEY, '');
  return returnVal;
}

export function userProfilePictureItem(userId, pictureId) {
  let returnVal = LOCATION_USER_PROFILE_PICTURES.replace(
    USER_KEY,
    userId,
  ).replace(PICTURE_KEY, pictureId);
  return returnVal;
}

export function getMyClubs(user) {
  let returnVal = LOCATION_MY_CLUBS.replace(USER_KEY, user.uid).replace(
    CLUB_KEY,
    '', // exclude club key
  );
  return returnVal;
}
export function getMyClubsClub(userId, clubId) {
  let returnVal = LOCATION_MY_CLUBS.replace(USER_KEY, userId).concat(
    `/${clubId}`,
  );
  return returnVal;
}

export function getClub(clubId) {
  let returnVal = LOCATION_CLUB.replace(CLUB_KEY, clubId);
  return returnVal;
}

export function getTournamentRef({clubId, tournamentId}) {
  let returnVal = LOCATION_TOURNAMENT.replace(CLUB_KEY, clubId).replace(
    TOURNAMENT_KEY,
    tournamentId,
  );
  return returnVal;
}

export function getTournamentsRef(clubId) {
  let returnVal = LOCATION_TOURNAMENTS.replace(CLUB_KEY, clubId);
  return returnVal;
}

export function getTournamentPlayersRef({clubId, tournamentId}) {
  return LOCATION_TOURNAMENT_PLAYERS.replace(CLUB_KEY, clubId).replace(
    TOURNAMENT_KEY,
    tournamentId,
  );
}

export function getClubProfilePicture(clubId) {
  return LOCATION_CLUB_PROFILE_PICTURE.replace(CLUB_KEY, clubId);
}

export function getDefaultClub(userId) {
  return LOCATION_DEFAULT_CLUB.replace(USER_KEY, userId);
}

export function getClubUsersSettings(clubId) {
  return LOCATION_CLUB_USERS_SETTINGS.replace(CLUB_KEY, clubId);
}

export function getClubUserSettings(clubId, userId) {
  return LOCATION_CLUB_USER_SETTINGS.replace(CLUB_KEY, clubId).replace(
    USER_KEY,
    userId,
  );
}

export function getCompletedRoundsListener(clubId, tournamentId) {
  let sectionNotRequired = '/' + ROUND_NUMBER + '/' + ROUND_ABSENT_PLAYERS;
  let returnVal = LOCATION_ROUND_ABSENT_PLAYERS.replace(CLUB_KEY, clubId)
    .replace(TOURNAMENT_KEY, tournamentId)
    .replace(sectionNotRequired, '');
  console.log('returnVal', returnVal);
  return returnVal;
}

export function getDeviceLocation(userId, firebaseToken) {
  return LOCATION_MY_DEVICE.replace(USER_KEY, userId).replace(
    DEVICE_KEY,
    firebaseToken,
  );
}

export function getClubPlayersRef(clubId) {
  return LOCATION_CLUB_PLAYERS.replace(CLUB_KEY, clubId);
}

export function getPlayerProfilePicture(clubId, playerId) {
  return LOCATION_PLAYER_MEDIA_PROFILE_PICTURE.replace(
    CLUB_KEY,
    clubId,
  ).replace(PLAYER_KEY, playerId);
}

export function getFollowPlayerSettings(playerId, userId) {
  return LOCATION_PLAYER_FOLLOWERS.replace(PLAYER_KEY, playerId).replace(
    USER_KEY,
    userId,
  );
}

export function getFollowedPlayer(userId, playerId) {
  return LOCATION_USER_FOLLOWED_PLAYERS.replace(USER_KEY, userId).replace(
    PLAYER_KEY,
    playerId,
  );
}

export function getTournamentRoundGames(clubId, tournamentId, roundId) {
  return LOCATION_ROUND_GAMES.replace(CLUB_KEY, clubId)
    .replace(TOURNAMENT_KEY, tournamentId)
    .replace(ROUND_NUMBER, roundId);
}
