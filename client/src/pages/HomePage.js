import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { ActivityList, NewsList } from '../components';

import './HomePage.scss';

class HomePage extends React.Component {
    render() {
        return (
            <div>
                <Container fluid>
                    <h2>Page d'accueil</h2>
                    <Row>
                        <Col>
                            <NewsList />
                        </Col>
                        <Col>
                            <ActivityList />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default HomePage;