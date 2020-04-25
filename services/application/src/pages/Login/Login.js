import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "./Login.css";

class Login extends Component {

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
        
        return (
            <div>Login</div>
        );
      }
    
}

export default withRouter(Login);