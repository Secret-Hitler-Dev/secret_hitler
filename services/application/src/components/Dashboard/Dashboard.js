import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';
import io from "socket.io-client";


import "./Dashboard.css";

import { 
    grommet, 
    Grommet, 
    Text, 
    Box, 
    Button, 
    TextInput, 
    Image, 
    ResponsiveContext
} from 'grommet';

import { Login, Menu, Logout, Add, Close, Analytics, Chat, Clock, Configure, Help, Projects, StatusInfoSmall } from "grommet-icons";

import {Banner, BannerAlt} from 'Media';
import { RiUser4Line } from "react-icons/ri";
import { AiFillEdit, AiOutlineUsergroupAdd } from "react-icons/ai";

import {Rules} from 'Components';

const socket = io("http://localhost:8080/")

class Dashboard extends Component {
    

    constructor(props) {
        super(props)
        this.state = {
            roomCode:'',
            error: '',
            joining: true,
            socket: null
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

    joinGame = () => {
        console.log("___________________________")
        console.log(this.props.data);
        console.log(this.state.roomCode);
        console.log(this.props.data.playerTag);
        console.log(this.props.data.playerId)
        console.log("___________________________")

        socket.emit('playerJoin', this.props.data.playerId, this.state.roomCode);
        // // display an error if room is invalid 
    }

    createGame = () => {
        console.log("CREATE GAME!!!");
    }

    componentDidMount() {
        this.setState(this.props.data);

        console.log("data from inside dashboard:");
        console.log(this.props.data);

        socket.on("joinResult", (result) => {
            console.log("result of JOIN");
            if (result.status === "error") {
                console.log(result);
                var rc = this.state.roomCode;
                this.setState({error:result.message});
            } else {
                console.log(result)
                if (result.status === "success") {
                    console.log("redirect to game lobby: " + result.data)
                } else {
                    this.setState({
                        error: true
                    });
                }
            }
            console.log("yeeaa buddy")
            this.setState({
                joining: false
            });
        });

    }
    

    render() {

        const grey = "#474442";
        const grey2 = "#a89e9b";
        const yellow = "#fbb867";
        const brightYellow = "#fdde4e";
        const orange = "#f2664a";
        const back = "	#fbb867";
        const offWhite = "#fde0bc";
        const blue = "#6d97b9";

        const Liberals = <Text color={blue}>Liberals</Text>;
        const Liberal = <Text color={blue}>Liberal</Text>;
        const Fascists = <Text color={orange}>Fascists</Text>;
        const Fascist = <Text color={orange}>Fascist</Text>;
        const Hitler = <Text color={orange}>Hitler</Text>;

        const rs =
            <Rules />
        ;
        const ls =
            <Box 
                fill 
                background={grey} 
                round="xsmall" 
                direction="column"
                gap="xsmall"
                justify="start"
                align="center"
                overflow="auto"
                pad="small"
            >
                <Box width="100%" height={{"min":"153px"}} direction="row" justify="evenly">
                    <Box 
                        width="100px" 
                        height={{"min":"150px"}} 
                        direction="column" 
                        align="center" 
                        justify="between"
                    >
                        <Text color={offWhite} size="80px">{this.props.data.totalUsers}</Text>
                        <Text color={offWhite} size="small" style={{"textAlign":"center"}}>Total Users</Text>

                    </Box>
                    <Box 
                        width="100px" 
                        height={{"min":"150px"}} 
                        direction="column" 
                        align="center" 
                        justify="between"
                    >
                        <Text color={back} size="80px">{this.props.data.currentGames}</Text>
                        <Text color={offWhite} size="small" style={{"textAlign":"center"}}>Current Games</Text>

                    </Box>
                    <Box 
                        width="100px" 
                        height={{"min":"150px"}} 
                        direction="column" 
                        align="center" 
                        justify="between"
                    >
                        <Text color={blue} size="80px">{this.props.data.totalLiberalWins}</Text>
                        <Text color={offWhite} size="small" style={{"textAlign":"center"}}>Total Liberal Wins</Text>

                    </Box>
                    <Box 
                        width="100px" 
                        height={{"min":"150px"}}  
                        direction="column" 
                        align="center" 
                        justify="between"
                    >
                        <Text color={orange} size="80px">{this.props.data.totalFascistWins}</Text>
                        <Text color={offWhite} size="small" style={{"textAlign":"center"}}>Total Fascist Wins</Text>

                    </Box>
                </Box>
                <Box width="98%" height="2px" background={offWhite} margin={{"top":"15px", "bottom":"20px"}} />

                {this.state.error != '' && 
                    <Box 
                        width="100%" 
                        height={{"min":"80px"}} 
                        direction="row" 
                        align="center" 
                        justify="between" 
                        background={orange}
                        round="small"
                        pad="medium"
                    >
                        <Text color={offWhite} size="large">{this.state.error}</Text>
                    </Box>
                }


                <Box width="100%" height={{"min":"120px"}} direction="row" align="center" justify="between">
                    <TextInput
                        placeholder="Room ID"
                        value={this.state}
                        name="roomCode"
                        style={{"fontSize":"68px"}}
                        onChange={event => this.handleInputChange(event)}
                    />
                    <Button 
                        primary 
                        icon={<AiOutlineUsergroupAdd />}
                        label="Join" 
                        color={back} 
                        margin={{"left":"30px"}} 
                        style={{"fontSize":"45px", "width":"200px", "height":"100px", "borderRadius":"10px"}}
                        onClick={() => this.joinGame()}
                    />
                </Box>
                <Box width="100%" height={{"min":"120px"}} direction="row" align="center" justify="between" margin={{"top":"25px"}}>
                    
                    <Button 
                        primary 
                        icon={<AiFillEdit />}
                        label="Create Game" 
                        color={back} 
                        style={{"fontSize":"45px", "width":"100%", "height":"100px", "borderRadius":"10px"}}
                        onClick={() => this.createGame()}
                    />
                </Box>
            </Box>
        ;

        return (
            <Grommet theme={grommet} full background={back}>
                <Box
                    direction="column"
                    pad="none"
                    background={back}
                    fill
                    align="center"
                    justify="center"
                >
                 
                    {this.state.isLoggedIn ?
                        // ADD the logged in dash
                        // join game
                        // create game
                        <ResponsiveContext.Consumer>
                            {responsive =>
                                responsive === "small" ? (
                                    <Box
                                        margin="small" 
                                        width="98%" 
                                        height={{"min":"96.5%"}} 
                                        direction="column" 
                                        gap="small"
                                    >
                                        <Box width="100%" height={{"min":"80%"}}>
                                            {ls}
                                        </Box>
                                        <Box width="100%"  height={{"min":"80%"}}>
                                            {rs}
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box 
                                        margin="small" 
                                        width="98%" 
                                        height="96.5%" 
                                        direction="row" 
                                        align="center"
                                        justify="between"
                                    >
                                        <Box width="65%" height="100%">
                                            {rs}
                                        </Box>
                                        <Box width="34%" height="100%">
                                            {ls}
                                        </Box>
                                    </Box>
                                )
                            }
                        </ResponsiveContext.Consumer>
                        
                    :
                        <Box width="80%" height="auto">
                            <Image src={Banner} fit="contain"/>
                        </Box>
                    }

                </Box>
            </Grommet>
        );
    }
    
}

export default Dashboard;