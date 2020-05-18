import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';

import "./GameDash.css";

import { 
    grommet, 
    Grommet, 
    Text, 
    Box, 
    Button, 
    Avatar, 
    Image
} from 'grommet';

import { StatusInfoSmall } from "grommet-icons";

import { AiFillEye } from "react-icons/ai";
import { FaHandPaper, FaSkull } from "react-icons/fa";
import { BsXCircleFill, BsCircle, BsPlayFill } from "react-icons/bs";
import { GiCardDraw, GiCardDiscard, GiEagleEmblem } from "react-icons/gi";
import { GrPowerCycle } from "react-icons/gr";

import { deepMerge } from 'grommet/utils';
import ReactTooltip from "react-tooltip";

import {GameEnvelope, GameBoard} from 'Components';


import {
    Envelope,
    VoteJa,
    VoteNein,
    MemberFascist,
    MemberLiberal,
    PolicyFascist,
    PolicyLiberal,
    RoleFascist,
    RoleHitler,
    RoleLiberal,
    Policy
} from 'GameAssets';

const customFocus = deepMerge(grommet, {
    global: {
      colors: {
        focus: "#fbb867"
      }
    }
});

const GAMEPHASE = {
    CHANCELLOR_NOMINATION : 'chancellor_nomination',
    ELECTION : 'election',
    LEGISLATIVE_SESSION_PRESIDENT : 'legislative_session_president',
    LEGISLATIVE_SESSION_CHANCELLOR : 'legislative_session_chancellor',
    WAITING: 'waiting'
}

const VOTE = {
    JA: "JA",
    NEIN: "NEIN",
    NONE: "NONE"
}

class GameDash extends Component {
    

    constructor(props) {
        super(props)
        this.state = {
            msg: '',
            reveal: 0,
            envWidth: 80,
            role:null, 
            member:null, 
            fascist:false,
            hitler:false,
            intel: '',
            drawPile: 0,
            discardPile: 0,
            electionTracker: 0,
            numberOfFascists:0,
            numberOfLiberals:0,
            host:false,
            gamePhase: GAMEPHASE.CHANCELLOR_NOMINATION,
            electionPolicies: [Policy, Policy, Policy],
            votePicked: false,
            vote:VOTE.NONE,
            gameStarted: false,
            status: ''
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

    resetGame = () => {
        console.log("RESET GAME!");
        this.setStatus("RESET GAME");
    }

    startGame = () => {
        console.log("RESET GAME!");
        this.setStatus("START GAME");
    }

    leaveGame = () => {
        console.log("LEAVE GAME!");
        this.setStatus("LEAVE GAME");
    }

    pickFirst = () => {
        this.setState({gamePhase: GAMEPHASE.WAITING});
        
    }

    pickSecond = () => {
        this.setState({gamePhase: GAMEPHASE.WAITING});
    }

    pickThird = () => {
        this.setState({gamePhase: GAMEPHASE.WAITING});
    }

    setStatus = (status) => {
        this.setState({status: status});
    }

    voteJa = () => {
        this.setState({votePicked: true, vote:VOTE.JA});
    }

    voteNein = () => {
        this.setState({votePicked: true, vote:VOTE.NEIN});
    }
    
    reveal = (event) => {
        if (this.state.reveal > 0) {
            this.setState({reveal: 0});
        }
        else {
            this.setState({reveal: this.state.envWidth});
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.setState(this.props.data);

            var playerNum = this.props.data.players.length;

            var testData = {
                role:RoleHitler, 
                host: true,
                member:MemberFascist, 
                fascist:true,
                hitler:false,
                intel:'',
                drawPile: 8,
                discardPile: 3,
                electionTracker: 2,
                numberOfFascists: playerNum >= 9 ? 4 : playerNum >= 7 ? 3 : 2,
                numberOfLiberals: playerNum >= 9 ? playerNum - 4 : playerNum >= 7 ? playerNum - 3 : playerNum - 2,
                electionPolicies: [Policy, Policy, Policy],
                votePicked: false,
                gamePhase: GAMEPHASE.LEGISLATIVE_SESSION_PRESIDENT,
                gameStarted: true,
                status:"CHANCELLOR IS SELECTING A POLICY!"
            }

            if (testData.fascist) {
                if (testData.hitler) {
                    testData.intel = playerNum >= 9 ? "YOU HAVE 3 ALLY FASCISTS." : 
                    playerNum >= 7 ? "YOU HAVE 2 ALLY FASCISTS." : "YOU HAVE 1 ALLY FASCIST <NAME>."; 
                }
                else {
                    testData.intel = playerNum >= 9 ? "YOU HAVE 3 ALLY FASCISTS. <NAME 1>, <NAME 2> and <NAME 3>, <NAME #> IS HITLER." : 
                    playerNum >= 7 ? "YOU HAVE 3 ALLY FASCISTS. <NAME 1> and <NAME 2>, <NAME #> IS HITLER." : "YOU HAVE 1 ALLY FASCIST <NAME>. <NAME> IS HITLER."; 
                }
            }
            else {
                testData.intel = playerNum >= 9 ? "YOU HAVE NO ALLIES. THERE ARE 4 FASCISTS." : 
                playerNum >= 7 ? "YOU HAVE NO ALLIES. THERE ARE 3 FASCISTS." : "YOU HAVE NO ALLIES. THERE ARE 2 FASCISTS.";
            }
            
            // test Data
            this.setState(testData);
        }
    }

    render() {

        const grey = "#474442";
        const grey2 = "#79706d";
        const yellow = "#fbb867";
        const brightYellow = "#fdde4e";
        const orange = "#f2664a";
        const back = "	#fbb867";
        const offWhite = "#fde0bc";
        const blue = "#6d97b9";

        return (
            <Grommet 
                theme={customFocus} 
                background="none" 
                full 
            >
                <Box
                    width="100%"
                    height="100%"
                    direction="row"
                    align="center"
                    justify="evenly"
                    pad="small"
                >
                    <Box
                        width="12%"
                        height="100%"
                        direction="column"
                        align="center"
                        justify="between"
                        background={grey}
                        round="xsmall"
                        pad="small"
                    >
                        <Box
                            width="100%"
                            height="70%"
                            direction="column"
                            align="center"
                            justify="start"
                            pad="10px"
                            overflow="auto"
                        >
                            <Text color={offWhite} style={{"textAlign": "center"}}>Party Membership &amp; Secret Role</Text>
                            <Box height="60px"/>
                            <GameEnvelope 
                                data={{
                                    envWidth:90, 
                                    role:this.state.role, 
                                    member:this.state.member, 
                                    fascist:this.state.fascist,
                                    hitler:this.state.hitler
                                }}
                            />
                        </Box>
                        <Box>
                            {// LOBBY INFORMATION
                            }
                        </Box>
                        
                    </Box>
                    <Box
                        width="64%"
                        height="100%"
                        direction="column"
                        align="center"
                        justify="between"
                        background={grey}
                        round="xsmall"
                        pad="medium"
                        gap="small"
                        overflow="none"
                    >
                        <Box 
                            width="60%" 
                            height="50px" 
                            direction="row"
                            background={grey2}
                            gap="medium"
                            align="center"
                            justify="center"
                            round="10px"
                        >
                            {// draw pile, number of faschists, election tracker, liberals, discard pile
                            }
                            <Box
                                direction="row"
                                gap="xsmall"
                                align="center"
                                justify="center"
                                data-tip data-for="drawPile"
                            >
                                <GiCardDraw color={offWhite}/>
                                <Text color={offWhite}>{this.state.drawPile}</Text>
                                <ReactTooltip id="drawPile" type='info' backgroundColor={offWhite} textColor={grey}>
                                    DRAW PILE
                                </ReactTooltip>
                            </Box>

                            <Box
                                direction="row"
                                gap="xsmall"
                                align="center"
                                justify="center"
                                data-tip data-for="numFas"
                            >
                                <FaSkull color={orange}/>
                                <Text color={orange}>{this.state.numberOfFascists}</Text>
                                <ReactTooltip id="numFas" type='info' backgroundColor={orange} >
                                    NUMBER OF FASCISTS
                                </ReactTooltip>
                            </Box>

                            <Box
                                direction="row"
                                gap="xsmall"
                                align="center"
                                justify="center"
                                data-tip data-for="eTracker"
                            >
                                {this.state.electionTracker > 0 ? 
                                    <BsXCircleFill color={orange}/>
                                :
                                    <BsCircle color={offWhite}/>
                                }
                                {this.state.electionTracker > 1 ? 
                                    <BsXCircleFill color={orange}/>
                                :
                                    <BsCircle color={offWhite}/>
                                }
                                {this.state.electionTracker > 2 ? 
                                    <BsXCircleFill color={orange}/>
                                :
                                    <BsCircle color={offWhite}/>
                                }

                                <ReactTooltip id="eTracker" type='info' backgroundColor={offWhite} textColor={grey}>
                                    ELECTION TRACKER
                                </ReactTooltip>
                            </Box>

                            <Box
                                direction="row"
                                gap="xsmall"
                                align="center"
                                justify="center"
                                data-tip data-for="numLib"
                            >
                                <GiEagleEmblem color={blue}/>
                                <Text color={blue}>{this.state.numberOfLiberals}</Text>
                                <ReactTooltip id="numLib" type='info' backgroundColor={blue}>
                                    NUMBER OF LIBERALS
                                </ReactTooltip>
                            </Box>

                            <Box
                                direction="row"
                                gap="xsmall"
                                align="center"
                                justify="center"
                                data-tip data-for="discardPile"
                            >
                                <GiCardDiscard color={offWhite}/>
                                <Text color={offWhite}>{this.state.discardPile}</Text>
                                <ReactTooltip id="discardPile" type='info' backgroundColor={offWhite} textColor={grey}>
                                    DISCARD PILE
                                </ReactTooltip>
                            </Box>
                        </Box>
                        <Box
                            width="90%"
                            direction="column"
                            align="center"
                            justify="center"
                            gap="medium"
                            id="gameboards"
                        >
                            <GameBoard 
                                width="95%"
                                data={{
                                    fascist:false,
                                    playerNum: this.props.data.players.length,
                                }}
                            />
                            <GameBoard 
                                width="95%"
                                data={{
                                    fascist:true,
                                    playerNum: this.props.data.players.length,
                                }}
                            />
                            
                        </Box>

                        <Box
                            width="100%" 
                            height="60px" 
                            direction="row"
                            background={grey2}
                            align="center"
                            justify="between"
                            round="10px"
                            pad="10px"
                        >
                            {// controls, policy pick, vode
                            }

                            <Box
                                height="100%" 
                                direction="row"
                                gap="small"
                                align="center"
                                justify="start"
                            >
                                {// add start game too
                                }
                                {this.state.host && this.state.gameStarted && 
                                    <Box
                                        direction="row"
                                        gap="3px"
                                        align="center"
                                        justify="start"
                                        onClick={()=>this.resetGame()}
                                        pad="10px"   
                                        background={offWhite}
                                        round="20px"                                     
                                    >
                                        <GrPowerCycle color={grey2} />
                                        <Text color={grey}>RESET</Text>
                                    </Box>
                                }
                                {this.state.host && !this.state.gameStarted && 
                                    <Box
                                        direction="row"
                                        gap="3px"
                                        align="center"
                                        justify="start"
                                        onClick={()=>this.startGame()}
                                        pad="10px"   
                                        background={offWhite}
                                        round="20px"                                     
                                    >
                                        <BsPlayFill color={grey2} />
                                        <Text color={grey}>START GAME</Text>
                                    </Box>
                                }
                                <Box
                                    direction="row"
                                    gap="3px"
                                    align="center"
                                    justify="start"
                                    onClick={()=>this.leaveGame()}
                                    pad="10px"   
                                    background={offWhite}
                                    round="20px"                                     
                                >
                                    <GrPowerCycle color={grey2} />
                                    <Text color={grey}>LEAVE GAME</Text>
                                </Box>   
                            </Box>
                            {(this.state.gamePhase === GAMEPHASE.LEGISLATIVE_SESSION_CHANCELLOR ||
                                this.state.gamePhase === GAMEPHASE.LEGISLATIVE_SESSION_PRESIDENT) ?
                                <Box
                                    width="30%"
                                    height="100%" 
                                    direction="row"
                                    align="end"
                                    justify="center"
                                >

                                    <Image 
                                        src={this.state.electionPolicies[0]} 
                                        width="30%"
                                        className="fanCard"
                                        onClick={() => this.pickFirst()}
                                    />

                                    <Image 
                                        src={this.state.electionPolicies[1]} 
                                        width="30%"
                                        className="fanCard"
                                        onClick={() => this.pickSecond()}
                                    />

                                    <Image 
                                        src={this.state.electionPolicies[2]} 
                                        width="30%"
                                        className="fanCard"
                                        onClick={() => this.pickThird()}
                                    />
                                </Box>
                            :
                                <Box
                                    width="50%"
                                    direction="row"
                                    align="center"
                                    justify="center"
                                >
                                    <Text color={offWhite}>{this.state.status}</Text>
                                </Box>
                            }

                            {this.state.gamePhase === GAMEPHASE.ELECTION ? 
                                <Box
                                    width="25%"
                                    height="100%" 
                                    direction="row"
                                    align="end"
                                    justify="between"
                                >
                                    <Image 
                                        src={VoteJa} 
                                        width="50%"
                                        className="fanCard"
                                        onClick={() => this.voteJa()}
                                    />

                                    <Image 
                                        src={VoteNein} 
                                        width="50%"
                                        className="fanCard"
                                        onClick={() => this.voteNein()}
                                    />
                                    
                                    <Box
                                        width={{"min":"25%"}}
                                        direction="row"
                                        align="center"
                                        justify="center"
                                    >
                                        <Text data-tip data-for="curentVote" color={offWhite}>{this.state.vote}</Text>
                                        <ReactTooltip id="curentVote" type='info' backgroundColor={offWhite} textColor={grey} >
                                            CURRENT VOTE
                                        </ReactTooltip>
                                    </Box>
                                    
                                </Box>
                            :
                                <Box width="25%"></Box>
                            }

                        </Box>
                        
                    </Box>
                    <Box
                        width="22%"
                        height="100%"
                        direction="column"
                        align="center"
                        justify="between"
                        background={grey}
                        round="xsmall"
                    >
                        {// CHAT LOG AND ALLY INFORMATION
                        }
                    </Box>
                </Box>

                
            </Grommet>
             
        );
    }
    
}

export default GameDash;