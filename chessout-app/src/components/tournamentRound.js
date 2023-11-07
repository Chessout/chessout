import React, {useEffect, useState} from "react";
import { Link, useParams } from 'react-router-dom';
import {
	getTournament,
	getTournamentRoundGamesDecoded,
	getSyncTournamentRoundGames,
	getSyncPostsLikes,
	getSyncPostChat,
	getSyncClub,
	getSyncTournament,
	getSyncTournamentPlayers,
	getSyncTournamentRoundGamesDecoded,
	decodeGames,
	getSyncTournamentPlayerImages
} from "../utils/firebaseTools";
import {Col, Container, Row} from "react-bootstrap";
import {firebaseApp} from "config/firebase";
import {getDownloadURL, getStorage, ref} from "@firebase/storage";
import { Avatar, Typography, ButtonGroup, Button as MuiButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Carousel from 'react-bootstrap/Carousel';
import {useApp} from "../components/context";
import {getDatabase, ref as dbRef, update} from "@firebase/database";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField/TextField";

const componentsProps={
	tooltip: {
		sx: {
			maxWidth: '200px',
			backgroundColor: 'black',
			color: 'white',
			fontSize: '14px',
			fontWeight: '400',
			textAlign: 'center',
			borderRadius: '10px',
			padding: '10px',
			top: '-10px'
		},
	},
	arrow: {
		sx: {
			color: 'black',
		},
	},
	TransitionComponent: Fade,
};

function roundResultWinnerColor(result){
	switch (result) {
		case 0: return {whitePlayer: '', blackPlayer: ''};
		case 1: return {whitePlayer: 'text-light-success', blackPlayer: ''};
		case 2: return {whitePlayer: '', blackPlayer: 'text-light-success'};
		case 3: return {whitePlayer: 'text-light-success', blackPlayer: 'text-light-success'};
		case 4: return {whitePlayer: 'text-light-success', blackPlayer: ''};
		case 5: return {whitePlayer: 'text-light-success', blackPlayer: ''};
		case 6: return {whitePlayer: '', blackPlayer: 'text-light-success'};
		case 7: return {whitePlayer: '', blackPlayer: ''};
		case 8: return {whitePlayer: '', blackPlayer: ''};
	}
}

function roundResultTooltips(result, whitePlayerName, blackPlayerName){
	switch (result) {
		case 0: return '';
		case 1: return whitePlayerName + ' wins';
		case 2: return blackPlayerName + ' wins';
		case 3: return 'Draw';
		case 4: return '1(Bye)';
		case 5: return whitePlayerName + ' wins by forfeit';
		case 6: return blackPlayerName + ' wins by forfeit';
		case 7: return 'Double forfeit';
		case 8: return 'Referee decision';
	}
}


export const TournamentRound = ({clubId, tournamentId, roundId, isManager}) => {
	const { firebaseUser, theme, isMobile } = useApp();
	const storage = getStorage(firebaseApp);

	async function getImage(url) {
		return url ? await getDownloadURL(ref(storage, url)) : null;
	}

	function roundResultLabels(result){
		switch (result) {
			case 0: return (<Typography variant="body1" fontSize="20px"><span className="font-bold">---</span></Typography>);
			case 1: return (<Typography variant="body1" fontSize="17px"><span className="text-light-success font-bold">1</span> - 0</Typography>);
			case 2: return (<Typography variant="body1" fontSize="17px">0 - <span className="text-light-success font-bold">1</span></Typography>);
			case 3: return (<Typography variant="body1" fontSize={isMobile ? '12px' : '15px'}><span className="text-light-success">1/2 - 1/2</span></Typography>);
			case 4: return (<Typography variant="body1" fontSize="15px"><span className="text-light-success text-capitalize">1 (Bye)</span></Typography>);
			case 5: return (<Typography variant="body1" fontSize="17px"><span className="text-light-success font-bold text-lowercase">1ff</span> - 0</Typography>);
			case 6: return (<Typography variant="body1" fontSize="17px">0 - <span className="text-light-success font-bold  text-lowercase">1ff</span></Typography>);
			case 7: return (<Typography variant="body1" fontSize={isMobile ? '12px' : '15px'} className="text-lowercase">0ff - 0ff</Typography>);
			case 8: return (<Typography variant="body1" fontSize={isMobile ? '12px' : '15px'} className="text-lowercase">1/2ff - 1/2ff</Typography>);
		}
	}


	const [round, setRound] = useState([]);
	const [playerImages, setPlayerImages] = useState({});
	useEffect(()=>{
		getSyncTournamentRoundGames(clubId, tournamentId, roundId, setRound);
		getSyncTournamentPlayerImages(clubId,tournamentId, setPlayerImages);
	}, []);

	const setGameResult = async (tableNumber, result, stringResult) => {
		const database = getDatabase(firebaseApp);
		const updateData = {
			[`tournamentRounds/${clubId}/${tournamentId}/${roundId}/games/${tableNumber}/result`]: result,
			[`tournamentRounds/${clubId}/${tournamentId}/${roundId}/games/${tableNumber}/theResult`]: stringResult,
		};

		update(dbRef(database), updateData)
			.then(() => {
				console.log("Changed Game Result.");
				closeModal();
			})
			.catch((error) => {
				console.error("Error Changing Game Result:", error);
			});
	};

	//Modal
	const [open, setOpen] = useState(false);
	const openModal = () => {
		setOpen(true);
	};
	const closeModal = () => {
		setOpen(false);
	};

	const [resultItems, setResultItems] = useState({
		tableNumber: 1,
		whitePlayer: '',
		blackPlayer: ''
	});

	return (
		<>
			<Typography variant="subtitle2" className="text-center text-light-success mt-2">Round progress {decodeGames(round).completedGames} / {decodeGames(round).totalGames}</Typography>
			<div className="mt-5" style={{marginBottom: '100px'}}>
				<TableContainer className="custom-table-container">
					<Table aria-label="simple table" className="custom-table">
						<TableBody>
							{round.map((result, index2) => (
								<TableRow
									key={index2}
								>
									<TableCell width={isMobile ? '' : '42%'} align="center" style={isMobile ? {} : { paddingLeft: '30%' }}>
										<div className="d-flex justify-content-center">
											{playerImages[result.whitePlayer.playerKey]?.image ? (
												<Avatar aria-label="player" src={playerImages[result.whitePlayer.playerKey].image} sx={{ width: 55, height: 55}} />
											):(
												<Avatar aria-label="player" sx={{ width: 55, height: 55, backgroundColor: 'transparent'}}>
													<AccountCircleIcon sx={{ width: 60, height: 60, color: 'white'}}/>
												</Avatar>
											)}
										</div>
										<span className={`${roundResultWinnerColor(result.result)?.whitePlayer}`}>{result.whitePlayer?.name}</span>
									</TableCell>
									<TableCell align="center">
										<Tooltip key="details" title={roundResultTooltips(result.result, result.whitePlayer?.name, result.blackPlayer?.name)} arrow placement="bottom" componentsProps={componentsProps}>
											{(index2 +1 !== 3) && isManager ? (
												<Button
													variant="text"
													color="primary"
													className="text-white"
													onClick={() => {
														openModal();
														setResultItems({tableNumber: (index2 +1), whitePlayer: result.whitePlayer?.name, blackPlayer: result.blackPlayer?.name})
													}}
												> {roundResultLabels(result.result)}
												</Button>
											) : (
												roundResultLabels(result.result)
											)}
										</Tooltip>
									</TableCell>
									<TableCell width={isMobile ? '' : '42%'} align="center" style={isMobile ? {} : { paddingRight: '30%' }}>
										<div className="d-flex justify-content-center">
											{result.blackPlayer?.name ? (
												<div>
													{playerImages[result.blackPlayer.playerKey]?.image ? (
														<Avatar aria-label="player" src={playerImages[result.blackPlayer.playerKey].image} sx={{ width: 55, height: 55}} />
													):(
														<Avatar aria-label="player" sx={{ width: 55, height: 55, backgroundColor: 'transparent'}}>
															<AccountCircleIcon sx={{ width: 60, height: 60, color: 'white'}}/>
														</Avatar>
													)}
												</div>
											) : (
												''
											)}
										</div>
										<span className={`${roundResultWinnerColor(result.result)?.blackPlayer}`}>{result.blackPlayer?.name}</span>
									</TableCell>
								</TableRow>

							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>

			{/*	Set round results modal*/}
			<Modal open={open} onClose={closeModal} >
				<Fade in={open}>
					<Box
						sx={{
							position: 'absolute',
							width: 500,
							backgroundColor: '#121212',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							padding: '40px',
							borderRadius: 2,
							opacity: 1,
						}}
					>
						<h3 className="mb-4 text-center">Set result</h3>
						<Row>
							<Col xs={12}>
								<Button
									onClick={() => setGameResult(resultItems.tableNumber, 1, 'WHITE_WINS')}
									className="mt-2 text-light-success b-r-xs"
								>
									1 - 0: {resultItems.whitePlayer} wins
								</Button>
							</Col>
							<Col xs={12}>
								<Button
									onClick={() => setGameResult(resultItems.tableNumber, 3, 'DRAW_GAME')}
									className="mt-2 text-light-success b-r-xs"
								>
									1/2 - 1/2: Draw
								</Button>
							</Col>
							<Col xs={12}>
								<Button
									onClick={() => setGameResult(resultItems.tableNumber, 2, 'BLACK_WINS')}
									className="mt-2 text-light-success b-r-xs"
								>
									0 - 1: {resultItems.blackPlayer} wins
								</Button>
							</Col>
							<Col xs={12}>
								<Button
									onClick={() => setGameResult(resultItems.tableNumber, 5, 'WHITE_WINS_BY_FORFEIT')}
									className="mt-2 text-light-success b-r-xs"
								>
									1ff - 0: {resultItems.whitePlayer} wins by forfeit
								</Button>
							</Col>
							<Col xs={12}>
								<Button
									onClick={() => setGameResult(resultItems.tableNumber, 6, 'BLACK_WINS_BY_FORFEIT')}
									className="mt-2 text-light-success b-r-xs"
								>
									0 - 1ff: {resultItems.blackPlayer} wins by forfeit
								</Button>
							</Col>
							<Col xs={12}>
								<Button
									onClick={() => setGameResult(resultItems.tableNumber, 8, 'DRAW_REFEREE_DECISION')}
									className="mt-2 text-light-success b-r-xs"
								>
									1/2ff - 1/2ff: Referee decision
								</Button>
							</Col>
							<Col xs={12}>
								<Button
									onClick={() => setGameResult(resultItems.tableNumber, 7, 'DOUBLE_FORFEIT')}
									className="mt-2 text-light-success b-r-xs"
								>
									0ff - 0ff: Double forfeit
								</Button>
							</Col>
							<Col xs={12}>
								<Button
									onClick={() => setGameResult(resultItems.tableNumber, 0, 'NOT_DECIDED')}
									className="mt-2 text-light-success b-r-xs"
								>
									Still playing
								</Button>
							</Col>
						</Row>
					</Box>
				</Fade>
			</Modal>
		</>
	);
};