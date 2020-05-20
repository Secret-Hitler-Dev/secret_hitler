import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import queryString from 'query-string'

import "./Game.css";

import { Grommet, Box, Text, Button, Layer, Image} from 'grommet';

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

class Game extends Component {
    _isMounted = false;

    constructor(props) {
        super(props)
        this.state = {
            msg: '',
            gameInProgress: true,
            players: [
                "mb",
                "Roomba64",
                "mvfizan",
                "angela",
                "GucciKage",
                "soda",
                "venky",
                "radsouza",
                "cheena",
                "laddoo"
            ],
            code:''
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
                    {!this.state.gameInProgress ? 
                        <Lobby data={{players:this.state.players}} />
                    :
                        <GameDash data={{players:this.state.players, code:this.state.code}} />
                    }
                </Box>
            </Grommet>
        );
    }
    
}

export default withRouter(Game);