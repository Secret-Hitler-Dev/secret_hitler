import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "./Logout.css";

class Logout extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email : '',
            password: '',
            isLoggedIn: false
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
        document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;"
        fetch('/api/signout', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    isLoggedIn:false
                });
                this.props.logout();
            } else {
                this.setState({
                    isLoggedIn:true
                });
            }
            this.props.history.push('/');
        })
        .catch(err => {
            console.error(err);
            alert('Error checking token');
        });
    }

    render() {
        
        return (
            <div>hmmmm Logged out!</div>
        );
      }
    
}

export default withRouter(Logout);