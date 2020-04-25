import React, { Component } from 'react';
import './App.css';

import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';
import { Box, Heading, Grommet } from 'grommet';

import {Home, Login, Logout, Register, Loading} from 'Pages';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mag:'',
            loading:true,
            isLoggedIn:false,
            playerTag:''
        };

        this.logout = this.logout.bind(this);
        this.setPlayerTag = this.setPlayerTag.bind(this);
        this.setAdmin = this.setAdmin.bind(this);
    }

    login() {
        this.setState({isLoggedIn: true});
    }

    logout() {
        this.setState({isLoggedIn: false});
    }

    setPlayerTag(tag) {
        this.setState({playerTag: tag});
    }

    setAdmin(admin) {
        this.setState({isAdmin: admin});
    }

    componentDidMount() {
        console.log("component did mount");
        fetch('/api/checkToken', {
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(res.status);
            if (res.status === 200) {
                this.setState({
                    msg: "USER LOGGED IN!",
                    isLoggedIn:true,
                    loading:false
                });
                return res.json();
            } else {
                this.setState({
                    msg: "PLEASE LOGIN FIRST.",
                    isLoggedIn:false,
                    loading:false
                });
            }
        })
        .then(data => {
            if (data) {
                //console.log(data);
                this.setState({
                    playerTag: data.playerTag,
                    isAdmin: data.isAdmin
                });
            }
            
        }) 
        .catch(err => {
            console.error(err);
            alert('Error checking token');
        });
        
    }


    render() {
        var propsData = {
            login: this.login,
            logout:this.logout,
            setPlayerTag: this.setPlayerTag,
            setAdmin:this.setAdmin,
            playerTag:this.state.playerTag,
            isLoggedIn:this.state.isLoggedIn
        };

        var content = this.state.loading ? <Loading /> :
            <Home data={propsData}/>
        console.log("herer 1", content, this.state.loading );
        return (
            
            
          <BrowserRouter>
                <div>NAVIGATION</div>
                <Switch>
                    <Route exact path="/" component={() => 
                        content
                    }/>
                    <Route exact path="/login" component={() =>
                        <Login data={propsData}/>
                    }/>
                    <Route exact path="/logout" component={() =>
                        <Logout data={propsData}/>
                    }/>
                    <Route exact path="/register" component={() =>
                        <Registration data={propsData}/>
                    }/>
                    
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
