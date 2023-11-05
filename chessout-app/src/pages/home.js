import React, {useEffect, useReducer} from "react";
import { getSyncUserHomePosts } from "../utils/firebaseTools";
import { Container, Row, Col } from "react-bootstrap";
import UserPost from "../components/userPost";
import TournamentPost from "../components/tournamentPost";
import {Link, useParams} from 'react-router-dom';
import {useApp} from "../components/context";

function homePostsReducer(state, action) {
	if (action.type === 'RECEIVE_POSTS') {
		return {
			...state,
			...action.posts,
		};
	}
	if (action.type === 'REMOVE_POST') {
		const newState = { ...state };
		delete newState[action.postId];
		return newState;
	}
}

function Home(props) {
	const { userId } = useParams();
	const { firebaseUser, theme } = useApp();
	const [posts, dispatchPosts] = useReducer(homePostsReducer, {});
	let myPostsArray = posts ? Object.values(posts) : [];
	myPostsArray.sort((a, b) => b.dateCreated.timestamp - a.dateCreated.timestamp);

	useEffect(() => {
		getSyncUserHomePosts(userId, dispatchPosts);
	}, [userId]);

	if(!userId || userId === 'undefined'){
		return (
			<Container className="mt-2 mb-5">
				<Row>
					<Col xs={12} lg={{ offset: 3, span: 6 }}>
						<div className="text-center align-content-center b-r-sm mt-5" style={{backgroundColor: "#2f2f2f", paddingTop: '25px', paddingBottom: '10px'}}>
							<p>You are not logged in</p>
						</div>
					</Col>
				</Row>
			</Container>
		);
	}

	return (
		<Container className="mt-2 mb-5">
			<Row>
				<Col xs={12} lg={{ offset: 3, span: 6 }}>
					{myPostsArray && myPostsArray.length > 0? (
						<Row>
							{myPostsArray.map((post) => (
								<React.Fragment key={post.postId}>
									{post.postType === "USER_POST" && (
										<Col xs={12} className="mt-4">
											<UserPost
												post={post}
												userId={firebaseUser?.uid}
											/>
										</Col>
									)}
									{post.postType === "TOURNAMENT_CREATED" && (
										<Col xs={12} className="mt-4">
											<TournamentPost
												post={post}
												userId={firebaseUser?.uid}
												title={"New tournament created"}
												isPairingsType={false}
												goToLabel="View Tournament"
												goToLink={`/tournament-players/${post.clubId}/${post.tournamentId}`}
											/>
										</Col>
									)}
									{post.postType === "TOURNAMENT_PAIRINGS_AVAILABLE" && (
										<Col xs={12} className="mt-4">
											<TournamentPost
												post={post}
												userId={firebaseUser?.uid}
												image={post.img_src}
												title={`Round ${post.roundId} pairings available`}
												isPairingsType={true}
												goToLabel="View Pairings"
												goToLink={`/tournament-rounds/${post.clubId}/${post.tournamentId}/${post.roundId - 1}`}
											/>
										</Col>
									)}
								</React.Fragment>
							))}
						</Row>
					) : (
						<div className="text-center align-content-center b-r-sm mt-5" style={{backgroundColor: "#2f2f2f", paddingTop: '25px', paddingBottom: '10px'}}><p>No posts available.</p></div>
					)}
				</Col>
			</Row>
		</Container>
	);
}

export default Home;
