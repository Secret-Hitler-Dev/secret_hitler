import React, { Component } from 'react';
import './App.css';

import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';
import { Box, Heading, Grommet } from 'grommet';

import { Home, Login, Logout, Guest, Register, Loading, Verify, Profile, Game } from 'Pages';
import { parseToHsl } from 'polished';


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
            code: '',
            playerNickName: "",
            create: false,
            players: [] // format: [{playerTag: .., playerNickName: ..}, ..]
            
        };

        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        this.setPlayerTag = this.setPlayerTag.bind(this);
        this.updateRoom = this.updateRoom.bind(this);
        this.setInfo = this.setInfo.bind(this);

    }

    login(data) {
        this.setState({isLoggedIn: true, playerTag:data.playerTag, verified:data.verified, totalUsers: data.totalUsers, guest:data.guest, playerNickName: data.playerNickName});
    }

    updateRoom(code, tag, nickName) {
        var newListOfPlayers = this.state.players;
        newListOfPlayers.push({playerTag: tag, playerNickName: nickName});
        this.setState({
            code:code,
            players: newListOfPlayers
        });
    }

    setInfo(code, playerTag, playerNickName, isCreator) {
        this.setState({
            code:code,
            playerTag: playerTag,
            playerNickName: playerNickName,
            create:isCreator
        });
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
                if (this._isMounted) {
                    this.setState({
                        playerTag: data.playerTag,
                        playerNickName: data.playerNickName,
                        msg: "USER LOGGED IN!",
                        isLoggedIn:true,
                        loading:false,
                        verified: data.verified,
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
            logout:this.logout,
            setInfo: this.setInfo,
            updateRoom:this.updateRoom,
            setPlayerTag: this.setPlayerTag,
            playerTag:this.state.playerTag,
            verified:this.state.verified,
            isLoggedIn:this.state.isLoggedIn,
            totalUsers:this.state.totalUsers,
            currentGames:this.state.currentGames,
            totalLiberalWins:this.state.totalLiberalWins,
            totalFascistWins:this.state.totalFascistWins,
            guest:this.state.guest,
            create:this.state.create,
            code: this.state.code,
            players: this.state.players,
            playerNickName: this.state.playerNickName
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
