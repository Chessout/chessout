import React, { useEffect, useState } from 'react';
import {firebaseApp, database} from "../config/firebase";
import { Container, Row, Col } from "react-bootstrap";
import {get, getDatabase, ref, push, set, onValue, query, orderByChild, limitToLast} from "firebase/database";
import * as RefTools from "../utils/refTools";


const PostsComponent = (props) => {


  const dbRef = RefTools.getUserHomePostsRef(props.firebaseUser);
  
  const postsRef = ref(database, dbRef);
  const last300Posts = query(postsRef, limitToLast(5), orderByChild('reversedDateCreated'));
  onValue(last300Posts, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
  });

  // listen on ganges an log the changes
  


  return (
    <Container className="mt-2 mb-5">
      <Row>
        <Col xs={12} lg={{ offset: 3, span: 6 }}>
          <h1>Posts Component</h1>
          <p>Hello posts component</p>
        </Col>
      </Row>
    </Container>
  );
};

export default PostsComponent;