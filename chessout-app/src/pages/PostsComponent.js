import React from 'react';
import { Container, Row, Col } from "react-bootstrap";

const PostsComponent = (props) => {

  console.log('props', props);

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