import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import queryString from 'query-string'

import "./Game.css";

import { Grommet, Box, Text, Button, Layer, Image} from 'grommet';
import io from "socket.io-client";

import ReactTooltip from "react-tooltip";

import { grommet } from "grommet/themes";
import { deepMerge } from 'grommet/utils';

import { Login} from "grommet-icons";

import {Lobby, GameDash} from 'Components';

const customFocus = deepMerge(grommet, {
    global: {
      colors: {
        focus: "#fbb867"
      }
    }
});

const socket = io()

class Game extends Component {
    _isMounted = false;

    constructor(props) {
        super(props)
        this.state = {
            msg: '',
            gameInProgress: true,
            players: this.props.data.players,
            code:this.props.data.code,
            create:false
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

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState(this.props.data);
        console.log("Heyyyyy");
        if (this.props.data.create) {
            socket.emit('createGame', this.props.data.playerTag, this.props.data.playerNickName);
        } else {
            socket.emit('playerJoin', this.props.data.playerTag, this.props.data.playerNickName, this.state.code);
        }
        socket.on("joinResult", (result) => {
            if (result.status === "error") {
                var rc = this.state.roomCode;
                this.setState({error:result.message});
            } else {
                
                console.log("New player: " + result.data.joiningPlayerTag);
                var newListofPlayers = result.data.players; //this.state.players;
                newListofPlayers.push({playerTag: result.data.joiningPlayerTag, playerNickName: result.data.playerNickName});

                this.setState({
                    players: newListofPlayers
                })
            }
            console.log("yeeaa buddy")
            this.setState({
                joining: false
            });
        });

        socket.on("createResult", (result) => {
            if (result.status === 'error') {
                this.setState({error:result.message});
            } else {
                var newListofPlayers = this.state.players;
                newListofPlayers.push({playerTag: this.props.data.playerTag, playerNickName: this.props.data.playerNickName});

                this.setState({
                    players: newListofPlayers,
                    code: result.data
                })
            }
            console.log("yeeaa buddy")
            this.setState({
                joining: false
            });
        });

        if (this._isMounted) {
            const values = queryString.parse(this.props.location.search)
            var code = values.room;

            if (!code) {
                // print error message
            }
            else {
                this.setState({code:code});
                // get game information 

                // if game in progress, show error
                // otherwise join lobby

            }

        }
    }


    render() {

        const grey = "#474442";
        const grey2 = "#a89e9b";
        const yellow = "#fbb867";
        const brightYellow = "#fdde4e";
        const orange = "#f2664a";
        const back = "#fbb867";
        const offWhite = "#f7e1c3";
        const blue = "#6d97b9";

        const data = this.props.data;
        data.code = this.state.code;
        data.players = this.state.players;

        return (
            <Grommet 
                theme={customFocus}
                background="none"
            >
                <Box  
                    width="100vw" 
                    min-height="100vh" 
                    direction="row" 
                    align="center" 
                    justify="center" 
                    style={{"padding": "none", "margin":"none"}}
                >
                    
                    <GameDash data={data} />
                </Box>
            </Grommet>
        );
    }
    
}

export default withRouter(Game);
