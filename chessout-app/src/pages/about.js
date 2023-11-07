import React from 'react';
import {Button} from  "@mui/material";
import { Container, Row, Col, Image } from "react-bootstrap";
import {openInNewTab} from "../utils/generalTools";

import {useApp} from "../components/context";
import Horse from '../assets/images/horse.png';
import Wireframe1 from '../assets/images/wireframe1.png';
import Wireframe2 from '../assets/images/wireframe2.png';
import Wireframe3 from '../assets/images/wireframe3.png';
import Wireframe4 from '../assets/images/wireframe4.png';
import Wireframe5 from '../assets/images/wireframe5.png';
import GooglePlay from '../assets/images/google_play.png';

function About() {
	const { theme } = useApp();

	return(
		<Container className="mt-3 mb-5">
			<Row>
				<Col xs={12} lg={{offset: 1, span:10}}>
					<Row className="mt-5">
						<Col xs={6}>
							<Image src={Horse} alt="Image" fluid />
						</Col>
						<Col xs={6}>
							<p className="mt-5" style={{fontSize: '50px', lineHeight: '55px'}}>Connect, Compete and Cherish Chess in the City</p>
							<p className="h4 mt-4">Unleash Your Strategic Brilliance in Urban Chess Battles</p>
							<Button variant="contained" color="error" size="large" className="mt-3" style={{backgroundColor: '#D65551'}}>Join the Chessout Community</Button>
						</Col>
					</Row>

					<Row className="mt-5">
						<Col xs={4}>
							<Image src={Wireframe1} alt="Image" fluid />
						</Col>
						<Col xs={8}>
							<p className="mt-5" style={{fontSize: '30px', lineHeight: '35px'}}>Play Chess in the Heart of the City</p>
							<p className="h5 mt-4 text-justified">
								Step outside and immerse yourself in the vibrant city life while enjoying a game of chess. Chessout brings the game to urban settings, allowing you to engage
								in strategic battles amidst the bustling streets, lively parks, or cozy cafes. Experience the thrill of playing chess while surrounded by the energy and social
								interactions of the city. Embrace the calm and seize the opportunity to savor life's beautiful moments as you make your moves on the chessboard.
								Unleash your strategic brilliance in the heart of the city, where the pulse of the urban landscape becomes the backdrop to your chess adventures.
							</p>
						</Col>
					</Row>

					<Row style={{marginTop: '100px'}}>
						<Col xs={8}>
							<p className="mt-5" style={{fontSize: '30px', lineHeight: '35px'}}>Connect and Compete</p>
							<p className="h5 mt-4 text-justified">
								Chessout is a thriving community where chess enthusiasts come together to connect, learn, and challenge one another. Engage in friendly matches or intense
								competitive battles with players from all walks of life. Discover new strategies, exchange ideas, and improve your skills as you navigate the diverse chess
								scene in the city. Forge lasting connections and build friendships with fellow chess lovers who share your passion for the game.
							</p>
						</Col>
						<Col xs={4}>
							<Image src={Wireframe2} alt="Image" fluid />
						</Col>
					</Row>

					<Row className="mt-5">
						<Col xs={4}>
							<Image src={Wireframe3} alt="Image" fluid />
						</Col>
						<Col xs={8}>
							<p className="mt-5" style={{fontSize: '30px', lineHeight: '35px'}}>Seamless and User-Friendly</p>
							<p className="h5 mt-4 text-justified">
								Chessout aims to make your chess journey smooth and enjoyable, whether you're an experienced player or a newcomer to the game. Find opponents and arrange chess meetups
								in the city. Join tournaments, participate in chess events, or simply find a local chess spot to indulge in your love for the game. Chessout empowers you to embrace the
								city's chess culture effortlessly.
							</p>
						</Col>
					</Row>

					<Row style={{marginTop: '100px'}}>
						<Col xs={8}>
							<p className="mt-5" style={{fontSize: '30px', lineHeight: '35px'}}>Stay Updated and Inspired</p>
							<p className="h5 mt-4 text-justified">
								Follow your favorite players, get notified about their achievements, and stay updated on the latest chess events happening in the city. Chessout keeps you connected with
								the chess community, providing you with the inspiration and motivation to elevate your game. Discover chess exhibitions, workshops, and gatherings that enrich your chess
								experience and deepen your appreciation for the city's vibrant chess scene.
							</p>
							<p className="h5 mt-4 text-justified">
								Join the Chessout community today and unlock a world of urban chess adventures. Connect with fellow chess enthusiasts, compete in thrilling matches, and cherish the magic
								of chess in the heart of the city. Unleash your strategic brilliance with Chessout.
							</p>
						</Col>
						<Col xs={4}>
							<Image src={Wireframe4} alt="Image" fluid />
						</Col>
					</Row>

					<Row className="mt-5">
						<Col xs={4}>
							<Image src={Wireframe5} alt="Image" fluid />
						</Col>
						<Col xs={8}>
							<p className="mt-5" style={{fontSize: '30px', lineHeight: '35px'}}>Empowering Chess Events with Seamless Financial Solutions</p>
							<p className="h5 mt-4 text-justified">
								In the near future, Chessout is committed to expanding its features to enhance the experience for event organizers. We are working towards enabling event organizers
								to accept subscription payments directly within the app, distribute prizes, organize event lotteries, and even facilitate additional services like barbecues or selling
								coffee, beer, sandwiches, or any other items required during chess gatherings.
							</p>
							<p className="h5 mt-4 text-justified">
								With the implementation of smart contracts and utilizing the advantages of blockchain technology, Chessout aims to revolutionize the financial aspects of chess events.
								Event organizers will enjoy the benefits of low transaction fees compared to traditional financial systems, ensuring a seamless and cost-effective process for managing
								funds and providing additional services to enhance the overall chess event experience.
							</p>
							<p className="h5 mt-4 text-justified">
								Stay tuned for the exciting future updates as Chessout evolves to empower event organizers and create a truly immersive and convenient chess ecosystem.
							</p>
							<Image className="mt-4" style={{ cursor: 'pointer' }} src={GooglePlay} alt="Image" fluid width={200} onClick={() => openInNewTab("https://play.google.com/store/apps/details?id=eu.chessout.v2&pcampaignid=web_share")}/>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
}

export default About;