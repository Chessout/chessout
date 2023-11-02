import React, {useEffect, useState} from 'react';
import { Avatar, Typography, CardHeader, CardContent, CardMedia, Card, CardActions, IconButton } from "@mui/material";
import {Button} from "react-bootstrap";
import { Collapse } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getUserHomePosts, getPostsLikes, getPostChat, getUserProfilePicture, getClub, getTournament, getTournamentPlayers, getTournamentRoundGamesDecoded } from "../utils/firebaseTools";
import {get, getDatabase, push, set} from "firebase/database";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {firebaseApp} from "../config/firebase";
import {getPostTime} from "../utils/generalTools";

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

const UserPost = ({post, userId}) => {

	const storage = getStorage(firebaseApp);
	const [likes, setLikes] = useState([]);
	const [comments, setComments] = useState([]);
	const [image, setImage] = useState(null);
	const [userImage, setUserImage] = useState(null);

	useEffect(()=>{
		getPostsLikes('', post?.clubId, post?.postId, setLikes);
		getPostChat(post?.postId, setComments);
	}, []);

	const getPostDetails = async () => {
		//Get the picture
		let new_image = null;
		if (post?.pictures) {
			try {
				new_image = await getDownloadURL(ref(storage, post.pictures[0].stringUri));
			} catch (error) {
				new_image = null;
			}
		}
		setImage(new_image);

		//get the image of user
		let user_image = null;
		post.userImage = await getUserProfilePicture(post.userId);
		if (post.userImage.uploadComplete) {
			try {
				user_image = await getDownloadURL(ref(storage, post.userImage.stringUri));
			} catch (error) {
				user_image = null;
			}
		} else {
			user_image = post.userImage.stringUri;
		}
		setUserImage(user_image);
	};

	useEffect(()=>{
		getPostDetails();
	}, []);

	const [isCommentVisible, setIsCommentVisible] = useState(false);
	const toggleCommentVisibility = () => {
		setIsCommentVisible(!isCommentVisible);
	};

	const [anchorEl, setAnchorEl] = useState(null);
	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<Card className="b-r-sm">
			<CardHeader
				avatar={
					<Avatar aria-label="User" src={userImage}>
						U
					</Avatar>
				}
				title={
					<React.Fragment>
						<span>{post?.userName}</span>
						<div className="float-end">
							<IconButton
								aria-controls="post-menu"
								aria-haspopup="true"
								onClick={handleMenuOpen}
							>
								<MoreVertIcon />
							</IconButton>
							<Menu
								id="post-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
								style={{
									transform: 'translateX(-4.1%)',
								}}
							>
								<MenuItem onClick={handleMenuClose}>Delete post</MenuItem>
							</Menu>
						</div>
					</React.Fragment>
				}
				subheader={getPostTime(post?.dateCreated.timestamp)}
			/>
			{post.message &&
				<CardContent style={{marginTop: '-15px'}}>
					<Typography variant="body1" color="textPrimary">
						{post?.message}
					</Typography>
				</CardContent>
			}
			<Divider color={"#2f2f2f"} />
			{image &&
				<div className="d-flex justify-content-center" style={{backgroundColor: '#2f2f2f'}}>
					<CardMedia
						component="img"
						alt="Post Image"
						image={image}
						title="Post Image"
						style={{
							maxHeight: '600px',
							width: 'auto'
						}}
					/>
				</div>
			}
			<Divider color={"#2f2f2f"} />
			<CardActions className="d-flex justify-content-between">
				<div>
					{likes.some((like) => like.userId === userId) ? (
						<Tooltip key="unlike" title="Unlike the post" arrow placement="bottom" componentsProps={componentsProps}>
							<IconButton aria-label="unlike" size="small" className="text-danger">
								<FavoriteIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					) : (
						<Tooltip key="like" title="Like the post" arrow placement="bottom" componentsProps={componentsProps}>
							<IconButton aria-label="Like" size="small" className="text-danger">
								<FavoriteBorderIcon />
							</IconButton>
						</Tooltip>
					)}
					<span className="font-size-xs">{likes.length} Likes</span>
				</div>
				<div>
					<Tooltip key="comment" title={!isCommentVisible ? `Show comments section` : 'Hide comments section'} arrow placement="bottom" componentsProps={componentsProps}>
						<Button variant="link" className="font-size-xs text-light text-decoration-none" onClick={toggleCommentVisibility}>{comments.length} Comments</Button>
					</Tooltip>
				</div>
			</CardActions>

			<Collapse in={isCommentVisible}>
				<Divider color={"#2f2f2f"} />
				{comments? (
					comments.map((comment) =>(
						<React.Fragment key={comment.chatId + comment.userId}>
							<Divider color={"#2f2f2f"} style={{width: '90%', marginLeft: '11%', marginTop: '-1px'}}/>
							<CardHeader
								avatar={
									<Avatar aria-label="User" src={comment.userImage?.img_src} size={"small"}>
										U
									</Avatar>
								}
								title={
									<div>
										<Typography variant="subtitle2" component="span">
											{comment?.userName}
										</Typography>
										<Typography variant="caption" component="span" className="ms-1">
											{comment.time ? (` - ${comment.time}`):('')}
										</Typography>
									</div>
								}
								subheader={
									<div>
										<Typography variant="body2" component="span" className="text-justified">
											{comment?.textValue}
										</Typography>
									</div>
								}

							/>
						</React.Fragment>
					))
				) : (
					''
				)}
			</Collapse>
		</Card>
	);
};

export default UserPost;
