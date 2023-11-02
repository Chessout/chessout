import {get, getDatabase, ref, push, set, query, limitToFirst, limitToLast, orderByChild, onValue} from "firebase/database";
import {getDownloadURL, getStorage, ref as refStorage} from "firebase/storage";
import {firebaseApp} from "../config/firebase";
import * as RefTools from "./refTools";
import {database} from "../config/firebase";
import {getCommentTime} from "./generalTools";

const storage = getStorage(firebaseApp);

const USER_SETTINGS = 'userSettings';
const USER_KEY = '$userKey';
const DEFAULT_CLUB = 'defaultClub';
const MY_CLUBS = 'myClubs';
const CLUB_POSTS = 'clubPosts';
const POST_LIKES = "postLikes";
const USER_STREAM = 'userStream';
const POST_ITEMS = 'postItems';
const CHAT = "chat";
const CHAT_ITEMS = "chatItems";
const USER_PUBLIC_INFO = "userPublicInfo";
const PROFILE_PICTURE = "profilePicture";
const CLUBS = 'clubs';
const TOURNAMENTS = 'tournaments';
const TOURNAMENT_PLAYERS = 'tournamentPlayers';
const TOURNAMENT_PLAYERS_REQUESTS = 'tournamentPlayersRequests';
const TOURNAMENT_ROUNDS = 'tournamentRounds';
const GAMES = 'games';
const STANDINGS = "standings";
const CATEGORY_DEFAULT = "defaultCategory";
const CLUB_PLAYERS = "clubPlayers";

export async function readMyDefaultClub(userId) {
	const LOCATION_DEFAULT_CLUB = `${USER_SETTINGS}/${userId}/${DEFAULT_CLUB}`;
	const defaultClubData = await get(ref(getDatabase(firebaseApp), LOCATION_DEFAULT_CLUB));

	if (defaultClubData.exists()) {
		return defaultClubData.val();
	} else {
		return null;
	}
}

export async function readMyClubs(user) {
	const LOCATION_DEFAULT_CLUB = `${USER_SETTINGS}/${USER_KEY}/${DEFAULT_CLUB}`;
	const LOCATION_MY_CLUBS = `${USER_SETTINGS}/${USER_KEY}/${MY_CLUBS}`;

	const locationDefaultClub = LOCATION_DEFAULT_CLUB.replace(USER_KEY, user.uid);
	const defaultClub = await get(ref(getDatabase(firebaseApp), locationDefaultClub));

	const locationMyClubs = LOCATION_MY_CLUBS.replace(USER_KEY, user.uid);
	const myClubsSnapshot = await get(ref(getDatabase(firebaseApp), locationMyClubs));

	const myClubs = [];
	if(myClubsSnapshot){
		myClubsSnapshot.forEach(club => {
			const clubData = club.val();
			const isDefaultClub = defaultClub && defaultClub.val().clubKey === clubData.clubId;
			myClubs.push({ ...clubData, isDefaultClub });
		})
	}

	return myClubs;
}

export async function getUserHomePosts(user) {
	const LOCATION_USER_STREAM_POSTS = `${USER_SETTINGS}/${USER_KEY}/${USER_STREAM}/${POST_ITEMS}`;
	let postsLocation = LOCATION_USER_STREAM_POSTS.replace(USER_KEY, user);

	const userHomePosts = await get(ref(getDatabase(firebaseApp), postsLocation));
	if (userHomePosts.exists()) {
		return userHomePosts.val();
	} else {
		return null;
	}
}

export async function getPostsLikes(user, club, post) {
	const CLUB_POST_LIKE = `${CLUB_POSTS}/${club}/${POST_LIKES}/${post}/${user}`;
	const postsLikesData = await get(ref(getDatabase(firebaseApp), CLUB_POST_LIKE));

	if (postsLikesData.exists()) {
		return postsLikesData.val();
	} else {
		return null;
	}
}

export function newGenericInstance(locationType, chatClubId, chatTournamentId, chatRoundId, userId) {
	const chat = {
		locationType,
		chatClubId,
		chatTournamentId,
		chatRoundId,
		userId,
		timeStampCreate: new Date().getTime(),
		timeStampEdit: new Date().getTime(),
	};
	return chat;
}

export function newTextInstance(locationType, chatClubId, chatTournamentId, chatRoundId, itemType, userId, userName, textValue) {
	const chat = newGenericInstance(locationType, chatClubId, chatTournamentId, chatRoundId, userId);
	chat.itemType = itemType;
	chat.userId = userId;
	chat.userName = userName;
	chat.textValue = textValue;
	return chat;
}

export async function getTournamentChat(tournamentId, roundId) {
	const chatFolderKey = `${tournamentId}-round-${roundId}`;
	const CHAT_LOCATION = `${CHAT}/${chatFolderKey}/${CHAT_ITEMS}`;
	const chatData = await get(ref(getDatabase(firebaseApp), CHAT_LOCATION));

	if (chatData.exists()) {
		return chatData.val();
	} else {
		return null;
	}
}

export async function getPostChat(postId) {
	const CHAT_LOCATION = `${CHAT}/${postId}/${CHAT_ITEMS}`;
	const chatData = await get(ref(getDatabase(firebaseApp), CHAT_LOCATION));

	if (chatData.exists()) {
		return chatData.val();
	} else {
		return null;
	}
}

export async function getUserProfilePicture(userId) {
	const LOCATION_USER_PROFILE_PICTURE = `${USER_PUBLIC_INFO}/${userId}/${PROFILE_PICTURE}`;
	const imageData = await get(ref(getDatabase(firebaseApp), LOCATION_USER_PROFILE_PICTURE));

	if (imageData.exists()) {
		return imageData.val();
	} else {
		return null;
	}
}

export async function getClub(clubId) {
	const LOCATION_CLUB = `${CLUBS}/${clubId}`;
	const clubData = await get(ref(getDatabase(firebaseApp), LOCATION_CLUB));

	if (clubData.exists()) {
		return clubData.val();
	} else {
		return null;
	}
}

export async function getTournament(clubId, tournamentId) {
	const LOCATION_TOURNAMENT = `${TOURNAMENTS}/${clubId}/${tournamentId}`;
	const tournamentData = await get(ref(getDatabase(firebaseApp), LOCATION_TOURNAMENT));

	if (tournamentData.exists()) {
		return tournamentData.val();
	} else {
		return null;
	}
}

export async function getTournamentPlayers(clubId, tournamentId) {
	const LOCATION_TOURNAMENT_PLAYERS = `${TOURNAMENT_PLAYERS}/${clubId}/${tournamentId}`;
	const tournamentPlayersData = await get(ref(getDatabase(firebaseApp), LOCATION_TOURNAMENT_PLAYERS));

	if (tournamentPlayersData.exists()) {
		return tournamentPlayersData.val();
	} else {
		return null;
	}
}

function decodeGames(games) {
	let totalGames = 0;
	let completedGames = 0;

	if (games == null) {
		return {completedGames, totalGames};
	}
	for (const [key, game] of Object.entries(games)) {
		if (game != null) {
			let result = game.result;
			if (result != null) {
				totalGames += 1;
			}
			if (result != null && result != '0') {
				completedGames += 1;
			}
		}
	}
	return {completedGames, totalGames};
}

export async function getTournamentRoundGames(clubId, tournamentId, roundId) {
	const LOCATION_ROUND_GAMES = `${TOURNAMENT_ROUNDS}/${clubId}/${tournamentId}/${roundId}/${GAMES}`;
	const roundData = await get(ref(getDatabase(firebaseApp), LOCATION_ROUND_GAMES));

	if (roundData.exists()) {
		return roundData.val();
	} else {
		return null;
	}
}

export async function getTournamentRoundGamesDecoded(clubId, tournamentId, roundId) {
	const LOCATION_ROUND_GAMES = `${TOURNAMENT_ROUNDS}/${clubId}/${tournamentId}/${roundId}/${GAMES}`;
	const roundData = await get(ref(getDatabase(firebaseApp), LOCATION_ROUND_GAMES));

	if (roundData.exists()) {
		const decodedGames = decodeGames(roundData.val());
		return {completedGames: decodedGames.completedGames, totalGames: decodedGames.totalGames};
	} else {
		return null;
	}
}

export async function getTournaments(clubId) {
	const LOCATION_TOURNAMENTS = `${TOURNAMENTS}/${clubId}`;
	const tournamentsData = await get(ref(getDatabase(firebaseApp), LOCATION_TOURNAMENTS));

	if (tournamentsData.exists()) {
		return tournamentsData.val();
	} else {
		return null;
	}
}

export async function getClubProfilePicture(clubId) {
	const LOCATION_CLUB_PROFILE_PICTURE = `${CLUBS}/${clubId}/picture`;
	const profilePictureData = await get(ref(getDatabase(firebaseApp), LOCATION_CLUB_PROFILE_PICTURE));

	if (profilePictureData.exists()) {
		return profilePictureData.val();
	} else {
		return null;
	}
}

export async function getTournamentStandings(clubId, tournamentId, roundId, standingId) {
	const LOCATION_TOURNAMENT_STANDINGS = `${TOURNAMENT_ROUNDS}/${clubId}/${tournamentId}/${roundId}/${STANDINGS}/${CATEGORY_DEFAULT}/${standingId}`;
	const tournamentStandingsData = await get(ref(getDatabase(firebaseApp), LOCATION_TOURNAMENT_STANDINGS));

	if (tournamentStandingsData.exists()) {
		return tournamentStandingsData.val();
	} else {
		return null;
	}
}

export async function addTournament(newTournament) {
	const db = getDatabase();
	const tournamentsRef = ref(db, `${TOURNAMENTS}/${newTournament.clubId}`);

	// Generate a new unique key for the tournament using push
	const newTournamentRef = push(tournamentsRef);

	// Get the key of the new tournament and set it in the tournament object
	newTournament.tournamentId = newTournamentRef.key;

	// Set the new tournament data in the database
	await set(newTournamentRef, newTournament);

	return newTournament.tournamentId;
}

export async function getTournamentPlayersRequests(clubId, tournamentId) {
	const LOCATION_TOURNAMENT_PLAYERS_REQUESTS = `${TOURNAMENT_PLAYERS_REQUESTS}/${clubId}/${tournamentId}`;
	const tournamentPlayersRequestsData = await get(ref(getDatabase(firebaseApp), LOCATION_TOURNAMENT_PLAYERS_REQUESTS));

	if (tournamentPlayersRequestsData.exists()) {
		return tournamentPlayersRequestsData.val();
	} else {
		return null;
	}
}

export async function addTournamentPlayerRequest(clubId, tournamentId, playerRequest) {
	const database = getDatabase(firebaseApp);
	const tournamentPlayersRequestsRef = ref(database, `${TOURNAMENT_PLAYERS_REQUESTS}/${clubId}/${tournamentId}`);

	try {
		const newPlayerRequestRef = await push(tournamentPlayersRequestsRef, playerRequest);
		playerRequest.playerKey = newPlayerRequestRef.key;
		await set(newPlayerRequestRef, playerRequest);
		console.log("Player request added successfully!");
		return newPlayerRequestRef;
	} catch (error) {
		console.error("Error adding player request:", error);
	}
}

export async function getClubPlayers(clubId) {
	const LOCATION_CLUB_PLAYERS = `${CLUB_PLAYERS}/${clubId}`;
	const clubData = await get(ref(getDatabase(firebaseApp), LOCATION_CLUB_PLAYERS));

	if (clubData.exists()) {
		return clubData.val();
	} else {
		return null;
	}
}

export async function getClubPlayer(clubId, playerId) {
	const LOCATION_CLUB_PLAYER = `${CLUB_PLAYERS}/${clubId}/${playerId}`;
	const playerData = await get(ref(getDatabase(firebaseApp), LOCATION_CLUB_PLAYER));

	if (playerData.exists()) {
		return playerData.val();
	} else {
		return null;
	}
}

// functions that use firebase onValue syntax
export function getSyncUserHomePosts(user, dispatchPosts) {
	const postsLocation = `${USER_SETTINGS}/${user}/${USER_STREAM}/${POST_ITEMS}`;
	const posts = query(ref(getDatabase(firebaseApp), postsLocation), limitToFirst(100));

	onValue(posts, (snapshot) => {
		const data = snapshot.val();
		dispatchPosts({
			type: 'RECEIVE_POSTS',
			posts: data,
		});

		// Check for deleted posts here
		const existingPostIds = Object.keys(data || {});
		// Compare with the previously stored post IDs, and find the deleted ones
		const deletedPostIds = Object.keys(prevData).filter((postId) => !existingPostIds.includes(postId));
		// Dispatch action to remove deleted posts
		deletedPostIds.forEach((postId) => {
			dispatchPosts({
				type: 'REMOVE_POST',
				postId,
			});
		});

		// Store the current data for comparison in the next update
		prevData = data;
	});
}
let prevData = {};


export function getSyncPostsLikes(user, club, post, setData) {
	const CLUB_POST_LIKE = `${CLUB_POSTS}/${club}/${POST_LIKES}/${post}/${user}`;
	const postsLikesData = query(ref(getDatabase(firebaseApp), CLUB_POST_LIKE));

	onValue(postsLikesData, (snapshot) => {
		const data = snapshot.val();
		if(data){
			const dataArray = Object.values(data);
			setData(dataArray);
		}else {
			setData([]);
		}
	});
}

export async function getSyncPostChat(postId, setData) {
	const currentTimestamp = Date.now();
	const CHAT_LOCATION = `${CHAT}/${postId}/${CHAT_ITEMS}`;
	const chatData = query(ref(getDatabase(firebaseApp), CHAT_LOCATION));

	onValue(chatData, async (snapshot) => {
		const data = snapshot.val();
		if(data){
			const dataArray = Object.values(data);
			if(dataArray){
				for (const comment of dataArray) {
					comment.userImage =  await getUserProfilePicture(comment.userId);
					if (comment.userImage?.uploadComplete) {
						try {
							comment.userImage.img_src = await getDownloadURL(refStorage(storage, comment.userImage.stringUri));
						} catch (error) {
							comment.userImage.img_src = null;
						}
					} else {
						comment.userImage.img_src = comment.userImage.stringUri;
					}
					comment.time = getCommentTime(comment?.timeStampCreate);
				}
				setData(dataArray);
			}
		}
	});
}

export async function getSyncUserProfilePicture(userId) {
	return new Promise((resolve, reject) => {
		const LOCATION_USER_PROFILE_PICTURE = `${USER_PUBLIC_INFO}/${userId}/${PROFILE_PICTURE}`;
		const imageData = query(ref(getDatabase(firebaseApp), LOCATION_USER_PROFILE_PICTURE));

		onValue(imageData, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				resolve(data);
			} else {
				resolve(null);
			}
		});
	});
}


export function getSyncClub(clubId, setData) {
	const LOCATION_CLUB = `${CLUBS}/${clubId}`;
	const clubData = query(ref(getDatabase(firebaseApp), LOCATION_CLUB));

	onValue(clubData, (snapshot) => {
		const data = snapshot.val();
		if(data){
			setData(data);
		}
	});
}

export function getSyncTournament(clubId, tournamentId, setData) {
	const LOCATION_TOURNAMENT = `${TOURNAMENTS}/${clubId}/${tournamentId}`;
	const tournamentData = query(ref(getDatabase(firebaseApp), LOCATION_TOURNAMENT));

	onValue(tournamentData, (snapshot) => {
		const data = snapshot.val();
		if(data){
			setData(data);
		}
	});
}

export function getSyncTournamentPlayers(clubId, tournamentId, setData) {
	const LOCATION_TOURNAMENT_PLAYERS = `${TOURNAMENT_PLAYERS}/${clubId}/${tournamentId}`;
	const tournamentPlayersData = query(ref(getDatabase(firebaseApp), LOCATION_TOURNAMENT_PLAYERS));

	onValue(tournamentPlayersData, (snapshot) => {
		const data = snapshot.val();
		if(data){
			const dataArray = Object.values(data);
			setData(dataArray);
		}
	});
}

export function getSyncTournamentRoundGamesDecoded(clubId, tournamentId, roundId, setData) {
	const LOCATION_ROUND_GAMES = `${TOURNAMENT_ROUNDS}/${clubId}/${tournamentId}/${roundId}/${GAMES}`;
	const roundData = query(ref(getDatabase(firebaseApp), LOCATION_ROUND_GAMES));

	onValue(roundData, (snapshot) => {
		const data = snapshot.val();
		if(data){
			const decodedGames = decodeGames(data);
			setData({completedGames: decodedGames.completedGames, totalGames: decodedGames.totalGames});
		}
	});
}

export function getSyncTournaments(clubId, setData) {
	const LOCATION_TOURNAMENTS = `${TOURNAMENTS}/${clubId}`;
	const tournamentsData = query(ref(getDatabase(firebaseApp), LOCATION_TOURNAMENTS));

	onValue(tournamentsData, (snapshot) => {
		const data = snapshot.val();
		if(data){
			const dataArray = Object.values(data);
			setData(dataArray);
		}
	});
}