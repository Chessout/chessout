import React, {useEffect, useState} from "react";
import { Link, useParams } from 'react-router-dom';
import {
	getTournament,
	getTournamentRoundGamesDecoded,
	getTournamentRoundGames,
	getSyncTournament,
} from "../utils/firebaseTools";
import {Col, Container, Row} from "react-bootstrap";
import { Avatar, Typography, ButtonGroup, Button as MuiButton } from "@mui/material";
import Carousel from 'react-bootstrap/Carousel';
import {useApp} from "../components/context";
import {TournamentRound} from '../components/tournamentRound';



function TournamentRounds(props) {
	const { clubId, tournamentId, activeRoundId } = useParams();
	const { firebaseUser, theme, isMobile } = useApp();
	const [tournament, setTournament] = useState(null);
	const [rounds, setRounds] = useState(null);

	const [tournamentS, setTournamentS] = useState(null);
	useEffect(()=>{
		getSyncTournament(clubId, tournamentId, setTournamentS);
	}, []);

	//Get tournament
	const getMyTournament = async () => {
		const myTournamentData = await getTournament(clubId, tournamentId);

		const roundsInfo = [];
		for (let i = 1; i <= myTournamentData?.totalRounds; i++) {
			const tournamentRoundGamesDecodedData = await getTournamentRoundGamesDecoded(clubId, tournamentId, i);
			if (tournamentRoundGamesDecodedData) {
				const tournamentRoundGames = await getTournamentRoundGames(clubId, tournamentId, i);

				const roundsGamesResults = [];
				for (const result of tournamentRoundGames) {
					if (result) {
						roundsGamesResults.push({
							result: result.result,
						})
					}
				}

				roundsInfo.push({
					round: i,
					results: roundsGamesResults
				})
			}
		}

		setTournament(myTournamentData);
		setRounds(roundsInfo);
	};

	useEffect(() => {
		if (firebaseUser) {
			getMyTournament();
		}
	}, [firebaseUser]);

	const [index, setIndex] = useState(parseInt(activeRoundId, 10));
	const handleSelect = (selectedIndex) => {
		setIndex(selectedIndex);
	};

	return(
		<Container className="mt-2 mb-5">
			<Row>
				<Col xs={12} lg={{ offset: 1, span: 10 }}>
					<div className="p-3 b-r-sm mt-4" style={{backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))"}}>
						<Row style={{ display: 'flex', alignItems: "center" }}>
							<Col xs={12} lg={4} className={`border-start ${isMobile ? 'mt-3' : 'text-center'}`}>
								<Typography color={'#66bb6a'} variant="caption">Tournament Name</Typography>
								<Typography>{tournament?.name}</Typography>
							</Col>
							<Col xs={12} lg={4} className={`border-start ${isMobile ? 'mt-3' : 'text-center'}`}>
								<Typography color={'#66bb6a'} variant="caption">Tournament Location</Typography>
								<Typography>{tournament?.location}</Typography>
							</Col>
							<Col xs={12} lg={4} className={`border-start ${isMobile ? 'mt-3' : 'text-center border-end'}`}>
								<Typography color={'#66bb6a'} variant="caption">Tournament Rounds</Typography>
								<Typography>{tournament?.totalRounds}</Typography>
							</Col>
						</Row>

						<div className="text-center">
							<ButtonGroup
								variant="text"
								aria-label="navigation buttons"
								className="mt-5"
							>
								<MuiButton
									component={Link}
									to={`/tournament-players/${clubId}/${tournamentId}`}
									variant="text"
									className="me-2"
									style={{
										borderRadius: 0,
										border: 'none',
										backgroundColor: 'transparent',
										color: 'white'
									}}
								>
									Players
								</MuiButton>
								<MuiButton
									variant="text"
									color={'success'}
									style={{
										borderBottom: ' 1px solid #66bb6a',
										borderRadius: 0,
										borderRight: 'none',
										backgroundColor: 'transparent'
									}}
								>
									Rounds
								</MuiButton>
								<MuiButton
									component={Link}
									to={`/tournament-standings/${clubId}/${tournamentId}`}
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
						<Typography variant="h6" className="text-center">Tournament Rounds</Typography>
						{rounds && rounds.length > 0 ? (
							<Carousel activeIndex={index} onSelect={handleSelect} interval={null} wrap={false}>
								{rounds.map((round, index) => (
									<Carousel.Item key={index}>
										<TournamentRound clubId={clubId} tournamentId={tournamentId} roundId={index+1}/>
									</Carousel.Item>
								))}
							</Carousel>
						):(
							<div className="text-center align-content-center b-r-sm mt-5" style={{backgroundColor: "#2f2f2f", paddingTop: '20px', paddingBottom: '5px'}}><p>Round not started.</p></div>
						)}
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default TournamentRounds;