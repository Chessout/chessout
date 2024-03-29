import React, {useEffect, useState} from "react";
import { Link, useParams } from 'react-router-dom';
import {getTournament, getTournamentPlayers, addTournamentPlayerRequest, getClubPlayers} from "utils/firebaseTools";
import {Col, Container, Row} from "react-bootstrap";
import {firebaseApp} from "config/firebase";
import {getDownloadURL, getStorage, ref} from "@firebase/storage";
import { Avatar, Typography, ButtonGroup, Button as MuiButton } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import chessoutAbi from 'abiFiles/chessout.abi.json';
import {customConfig, networkId} from "../config/customConfig";
import {networkConfig} from "../config/networks";
import {ProxyNetworkProvider} from "@multiversx/sdk-network-providers/out";
import {useGetAccountInfo, useGetActiveTransactionsStatus} from "@multiversx/sdk-dapp/hooks";
import {AbiRegistry, Address, AddressValue, BigUIntValue, BytesValue, SmartContract, TokenTransfer} from "@multiversx/sdk-core/out";
import {BigNumber} from "bignumber.js";
import {refreshAccount} from "@multiversx/sdk-dapp/__commonjs/utils";
import {sendTransactions} from "@multiversx/sdk-dapp/services";
import {contractQuery} from "../utils/multiversxTools";
import { useGetPendingTransactions } from "@multiversx/sdk-dapp/hooks/transactions";
import {U64Value} from "@multiversx/sdk-core/out";
import {multiplier} from "../utils/generalTools";
import Fade from "@mui/material/Fade/Fade";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

function TournamentPlayers(props) {
	const { tournamentId } = useParams();
	const storage = getStorage(firebaseApp);
	const [tournament, setTournament] = useState(null);
	const [defaultClubInfo, setDefaultClubInfo] = useState([]);

	//MultiversX config
	const {address} = useGetAccountInfo();
	const isLoggedIn = address.startsWith("erd");
	const config = customConfig[networkId];
	const networkProvider = new ProxyNetworkProvider(config.provider);
	const scAddress = config.scAddress;
	const scToken = config.scToken;
	const scName = "Chessout";
	const chainID = networkConfig[networkId].shortId;
	const tokensAPI = config.apiLink + address + "/tokens?size=2000";

	//Get tournament
	const getMyTournament = async () => {
		const defaultClub = await props.getMyDefaultClub();
		setDefaultClubInfo(defaultClub);
		const myTournamentData = await getTournament(defaultClub?.clubKey, tournamentId);

		// tournament players
		const tournamentPlayers = await getTournamentPlayers(defaultClub?.clubKey, tournamentId);
		const tournamentPlayersArray = tournamentPlayers ? Object.values(tournamentPlayers) : [];
		const tournamentPlayersCount = tournamentPlayers ? Object.keys(tournamentPlayers).length : 0;
		const tournamentPlayersDetails = await Promise.all(tournamentPlayersArray.map(async (player) => {
			const imageData = player.profilePictureUri ? await getDownloadURL(ref(storage, player.profilePictureUri)) : null;
			return {
				...player,
				playerImage: imageData,
			};
		}));

		//sort players based on elo
		tournamentPlayersDetails.sort((a, b) => b.elo - a.elo);
		myTournamentData.players = tournamentPlayersDetails ? tournamentPlayersDetails: null;
		myTournamentData.playersCount = tournamentPlayersCount;

		setTournament(myTournamentData);
	};

	useEffect(() => {
		if (props.firebaseUser) {
			getMyTournament();
		}
	}, [props.firebaseUser]);

	// join tournament function
	const loadingTransactions = useGetPendingTransactions().hasPendingTransactions;
	const transactionSuccess = useGetActiveTransactionsStatus().success;

	const joinXTournament = async () => {
		try {
			let abiRegistry = AbiRegistry.create(chessoutAbi);
			let contract = new SmartContract({
				address: new Address(scAddress),
				abi: abiRegistry
			});

			const transaction = contract.methodsExplicit
				.joinTournament([new U64Value(tournament.multiversXTournamentId)])
				.withChainID(chainID)
				.withSingleESDTTransfer(
					TokenTransfer.fungibleFromAmount(scToken, tournament.entryFee / multiplier, 18)
				)
				.buildTransaction();
			const createTournamentTransaction = {
				value: 0,
				data: Buffer.from(transaction.getData().valueOf()),
				receiver: scAddress,
				gasLimit: '15000000'
			};
			await refreshAccount();

			const { sessionId } = await sendTransactions({
				transactions: createTournamentTransaction,
				transactionsDisplayInfo: {
					processingMessage: 'Processing Create Tournament transaction',
					errorMessage: 'An error has occurred during Create Tournament transaction',
					successMessage: 'Create Tournament transaction successful'
				},
				redirectAfterSign: false
			});

		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if(transactionSuccess) {
			const newPlayer = {
				archived: false,
				clubElo: 0,
				clubKey: defaultClubInfo?.clubKey,
				elo: 1056,
				email: props.firebaseUser.email,
				name: props.firebaseUser.displayName,
				multiversXAddress: address
			};
			addTournamentPlayerRequest(defaultClubInfo?.clubKey, tournament.tournamentId, newPlayer);
		}
	}, [transactionSuccess]);

	return(
		<Container className="mt-2 mb-5">
			{/*<Row>*/}
			{/*	<Col xs={6} lg={{offset: 9, span: 2}} className="mt-3">*/}
			{/*		<button className="btn btn-outline-success b-r-xs btn-block btn-sm" onClick={()=> joinXTournament()}>*/}
			{/*			Join Tournament*/}
			{/*		</button>*/}
			{/*	</Col>*/}
			{/*</Row>*/}
			<Row>
				<Col xs={12} lg={{offset: 8, span: 3}} className="mt-3">
					<button className="btn btn-outline-success b-r-xs btn-block btn-sm">
						Convert Into MultiversX Tournament
					</button>
				</Col>
			</Row>
			<Row>
				<Col xs={12} lg={{ offset: 1, span: 10 }}>
					<div className="p-3 b-r-sm mt-4" style={{backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))"}}>
						<Row style={{ display: 'flex', alignItems: "center" }}>
							<Col xs={12} lg={3} className={`border-start ${props.isMobile ? 'mt-3' : 'text-center'}`}>
								<Typography color={'#66bb6a'} variant="caption">Tournament Name</Typography>
								<Typography>{tournament?.name}</Typography>
							</Col>
							<Col xs={12} lg={3} className={`border-start ${props.isMobile ? 'mt-3' : 'text-center'}`}>
								<Typography color={'#66bb6a'} variant="caption">Tournament Location</Typography>
								<Typography>{tournament?.location}</Typography>
							</Col>
							<Col xs={12} lg={3} className={`border-start ${props.isMobile ? 'mt-3' : 'text-center'}`}>
								<Typography color={'#66bb6a'} variant="caption">Tournament Rounds</Typography>
								<Typography>{tournament?.totalRounds}</Typography>
							</Col>
							<Col xs={12} lg={3} className={`border-start ${props.isMobile ? 'mt-3' : 'text-center border-end'}`}>
								<Typography color={'#66bb6a'} variant="caption">MultiversX Tournament</Typography>
								<div>
									{tournament?.multiversXTournamentId ? (
										<CheckIcon />
									) : (
										<CloseIcon />
									)}
								</div>
							</Col>
						</Row>

						<div className="text-center">
							<ButtonGroup
								variant="text"
								aria-label="navigation buttons"
								className="mt-5"
							>
								<MuiButton
									color={'success'}
									variant="text"
									className="me-2"
									style={{
										borderBottom: ' 1px solid #66bb6a',
										borderRadius: 0,
										borderRight: 'none',
										backgroundColor: 'transparent'
									}}
								>
									Players
								</MuiButton>
								<MuiButton
									component={Link}
									to={`/tournament-rounds/${tournamentId}/0`}
									variant="text"
									style={{
										borderRadius: 0,
										border: 'none',
										backgroundColor: 'transparent',
										color: 'white'
									}}
								>
									Rounds
								</MuiButton>
								<MuiButton
									component={Link}
									to={`/tournament-standings/${tournamentId}`}
									variant="text"
									className="ms-2"
									style={{
										borderRadius: 0,
										border: 'none',
										backgroundColor: 'transparent',
										color: 'white'
									}}
								>
									Standings
								</MuiButton>
							</ButtonGroup>
						</div>
					</div>

					<div className="p-3 b-r-sm mt-4" style={{backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))"}}>
						<Typography variant="h6" className="text-center">Tournament Players</Typography>
						{tournament?.players && tournament?.players.length > 0 ? (
							<TableContainer>
								<Table sx={{ minWidth: 650 }} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell align={"center"} width={"10%"} style={{color: '#66bb6a'}}>No</TableCell>
											<TableCell style={{color: '#66bb6a'}}>Avatar</TableCell>
											<TableCell style={{color: '#66bb6a'}}>Name</TableCell>
											<TableCell style={{color: '#66bb6a'}}>Elo</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{tournament.players.map((player, index) => (
											<TableRow
												key={index}
												sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											>
												<TableCell component="th" scope="row" align={"center"}>
													{index + 1}.
												</TableCell>
												<TableCell>
													{player.playerImage ? (
														<Avatar aria-label="player" src={player.playerImage} sx={{ width: 55, height: 55}}/>
													):(
														<Avatar aria-label="player" sx={{ width: 55, height: 55, backgroundColor: 'transparent'}}>
															<AccountCircleIcon sx={{ width: 60, height: 60, color: 'white'}}/>
														</Avatar>
													)}
												</TableCell>
												<TableCell component="th" scope="row">
													{player.name}
												</TableCell>
												<TableCell>{player.elo}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						) : (
							<div className="text-center align-content-center b-r-sm mt-5" style={{backgroundColor: "#2f2f2f", paddingTop: '20px', paddingBottom: '5px'}}><p>No players.</p></div>
						)}
					</div>
				</Col>
			</Row>

			{/* convert tournament*/}
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
							textAlign: 'center'
						}}
					>
						<h3 className="mb-4">New Tournament</h3>
						<div className="mt-3">
							<div className="mt-3">
								<TextField
									name="firstTableNumber"
									label="First Table Number"
									type="number"
									value={tournamentData.firstTableNumber}
									onChange={handleChange}
									size="small"
									style={{minWidth: '85%'}}
								/>
							</div>
							<div className="mt-3">
								<TextField
									name="entryFee"
									label="Entry Fee"
									type="number"
									value={tournamentData.entryFee}
									onChange={handleChange}
									size="small"
									style={{minWidth: '85%'}}
								/>
							</div>
						</div>
						<Button variant="contained" color="primary" className="mt-4 text-center btn btn-success b-r-xs">
								Convert Tournament
						</Button>
					</Box>
				</Fade>
			</Modal>
		</Container>
	);
}

export default TournamentPlayers;