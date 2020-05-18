import React, { Component } from 'react';
import './App.css';

import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';
import { Box, Heading, Grommet } from 'grommet';

import { Home, Login, Logout, Guest, Register, Loading, Verify, Profile, Game } from 'Pages';


class App extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            mag:'',
            loading:true,
            isLoggedIn:false,
            playerTag:'',
            verified:false,
            totalUsers: 0,
            currentGames: 0,
            totalLiberalWins: 0,
            totalFascistWins: 0,
            guest: false,
            playerId: ''
        };

        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        this.loginAsGuest = this.loginAsGuest.bind(this);
        this.setPlayerTag = this.setPlayerTag.bind(this);
    }

    login(data) {
        this.setState({isLoggedIn: true, playerTag:data.playerTag, verified:data.verified, totalUsers: data.totalUsers, guest:data.guest, playerId: data.playerId});
    }

    loginAsGuest(data) {
        this.setState({isLoggedIn: true, playerTag:data.playerTag, verified:data.verified, totalUsers: data.totalUsers, guest:data.guest, playerId: data.playerId});
    }

    logout() {
        this.setState({
            mag:'',
            isLoggedIn:false,
            playerTag:'',
            verified:false,
            totalUsers: 0,
            currentGames: 0,
            totalLiberalWins: 0,
            totalFascistWins: 0,
            guest:false
        });

    }

    setPlayerTag(tag) {
        this.setState({playerTag: tag});
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

        fetch('/api/checkToken', {
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(res.status);
            if (res.status === 200) {
                return res.json();
            } else {
                if (this._isMounted) {
                    this.setState({
                        msg: "PLEASE LOGIN FIRST.",
                        isLoggedIn:false,
                        loading:false
                    });
                }
            }
        })
        .then(data => {
            if (data) {
                console.log("data from cookies:");
                console.log(data);
                if (this._isMounted) {
                    this.setState({
                        playerTag: data.playerTag,
                        msg: "USER LOGGED IN!",
                        isLoggedIn:true,
                        loading:false,
                        verified: data.verified,
                        playerId: data.playerId,
                        totalUsers: data.totalUsers
                    });
                }
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
            loginAsGuest:this.loginAsGuest,
            setPlayerTag: this.setPlayerTag,
            playerTag:this.state.playerTag,
            verified:this.state.verified,
            isLoggedIn:this.state.isLoggedIn,
            totalUsers:this.state.totalUsers,
            currentGames:this.state.currentGames,
            totalLiberalWins:this.state.totalLiberalWins,
            totalFascistWins:this.state.totalFascistWins,
            guest:this.state.guest,
            playerId: this.state.playerId
        };

        var content = this.state.loading ? <Loading /> :
            <Home data={propsData}/>
        return (
          <BrowserRouter>
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
                        <Register data={propsData}/>

                    }/>
                    <Route exact path="/verify" component={() =>
                        <Verify data={propsData}/>

                    }/>
                    <Route exact path="/profile" component={() =>
                        <Profile data={propsData}/>

                    }/>
                    <Route exact path="/game" component={() =>
                        <Game data={propsData}/>

                    }/>
                    <Route exact path="/guest" component={() =>
                        <Guest data={propsData}/>

                    }/>

                    
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
