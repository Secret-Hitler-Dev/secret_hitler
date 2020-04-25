import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';

import { Box, Heading, Grommet } from 'grommet';
import "./Home.css";

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            
        };
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
    }

    componentDidMount() {
        
    }

    render() {

        {console.log("here 4")}
        return (
            <div>
                {console.log("here 5")}
                Home
                {console.log("here 6")}
            </div>
        );
    }
    
}

export default withRouter(Home);