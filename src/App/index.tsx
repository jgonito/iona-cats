import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Container } from 'react-bootstrap';
import CatBrowser from '../pages/CatBrowser';
import CatDetails from '../pages/CatDetails';

class App extends Component {
    render () {
        return (
            <Container fluid className="my-4">
                <Router>
                    <Switch>
                        <Route path="/browser" component={ CatBrowser } />
                        <Route path="/details" component={ CatDetails } />
                        <Route path="/" exact>
                            <Redirect to="/browser" />
                        </Route>
                    </Switch>
                </Router>
            </Container>
        );
    }
}

export default App;
