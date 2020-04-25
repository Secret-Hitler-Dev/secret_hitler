import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "./Loading.css";

class Loading extends Component {

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
            <div>Loading</div>
        );
      }
    
}

export default withRouter(Loading);