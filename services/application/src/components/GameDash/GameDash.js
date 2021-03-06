import React, { Component, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';

import { Scrollbars, scrollToBottom } from 'react-custom-scrollbars';

import "./GameDash.css";

import { 
    grommet, 
    Grommet, 
    Text, 
    Box, 
    Button, 
    Avatar, 
    Image,
    Paragraph,
    Layer
} from 'grommet';

import { StatusInfoSmall, StatusGood,FormClose } from "grommet-icons";

import { AiFillEye } from "react-icons/ai";
import { FaHandPaper, FaSkull, FaCentercode } from "react-icons/fa";
import { BsXCircleFill, BsCircle, BsPlayFill } from "react-icons/bs";
import { GiCardDraw, GiCardDiscard, GiEagleEmblem, GiExitDoor } from "react-icons/gi";
import { GrPowerCycle } from "react-icons/gr";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

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

const GAME_EVENT = {
    CHANCELLOR_NOMINATION : 'CHANCELLOR_NOMINATION',
    ELECTION : 'ELECTION',
    POLICY_ELECTED : 'POLICY_ELECTED',
    POLICY_PEEK: 'POLICY_PEEK',
    INVESTIGATE_LOYALTY: 'INVESTIGATE_LOYALTY',
    SPECIAL_ELECTION: 'SPECIAL_ELECTION',
    EXECUTION: 'EXECUTION',
    GAME_WON: 'GAME_WON'
}

const GAMEPHASE = {
    CHANCELLOR_NOMINATION : 'CHANCELLOR_NOMINATION',
    ELECTION : 'ELECTION',
    LEGISLATIVE_SESSION_PRESIDENT : 'LEGISLATIVE_SESSION_PRESIDENT',
    LEGISLATIVE_SESSION_CHANCELLOR : 'LEGISLATIVE_SESSION_CHANCELLOR',
    PRESIDENT_ABILITY : 'PRESIDENT_ABILITY!',
    WAITING: 'WAITING'
}

const GAMEPHASE_MSG = {
    CHANCELLOR_NOMINATION : 'PICK YOUR CHANCELOR',
    ELECTION : 'VOTE ON THIS GOVERNMENT',
    LEGISLATIVE_SESSION_PRESIDENT : 'PICK A POLICY TO DISCARD',
    LEGISLATIVE_SESSION_CHANCELLOR : 'PICK A POLICY TO ENACT',
    WAITING: 'WAITING FOR THE NEXT PHASE'
}

const GAMEPHASE_STATUS = {
    CHANCELLOR_NOMINATION : 'PRESIDENT IS PICKING A CHANCELLOR!',
    ELECTION : 'VOTING ON GOVERNMENT!',
    LEGISLATIVE_SESSION_PRESIDENT : 'CHANCELLOR IS DISCARDING A POLICY!',
    LEGISLATIVE_SESSION_CHANCELLOR : 'CHANCELLOR IS SELECTING A POLICY!',
    PRESIDENT_ABILITY : 'PRESIDENT_ABILITY!',
    WAITING: 'WAITING FOR THE NEXT PHASE'
}

const VOTE = {
    JA: "JA",
    NEIN: "NEIN",
    NONE: "NONE"
}

class GameDash extends Component {
    

    constructor(props) {
        super(props);
        this.gameLogRef = React.createRef();
        this.state = {
            msg: '',
            reveal: 0,
            envWidth: 80,
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
            status: '',
            playerStatusIcons:{},
            selectedPlayer:{},
            log: [],
            hideLog: false,
            logHeight: "100%",
            atLogBottom: false,
            logPosition: 0
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
        console.log("START GAME!");
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

    getRandomArbitrary = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    addTestLog = () => {
        var log = this.state.log;
        log.push(
            {
                phase: GAME_EVENT.CHANCELLOR_NOMINATION,
                president: 'Roomba64',
                chancellor: 'El Momo'
            }
        );

        this.setState({log:log});
    }

    hideLog = (vals) => {

        const { scrollbars } = this.refs;

        if (this.state.hideLog) {
            this.setState({hideLog: false, logHeight: "100%"}, () => {
                console.log("restoring log positon -> ", this.state.logPosition);
                scrollbars.scrollTop(this.state.logPosition * (vals.scrollHeight - vals.clientHeight));
            });
        }
        else {
            this.setState({hideLog: true, logHeight: "0%", logPosition:vals.top});
        }
        
    }

    addToGameLog = () => {
        var log = this.state.log;

        var msgs = [

            {
                phase: GAME_EVENT.CHANCELLOR_NOMINATION,
                president: 'Roomba64',
                chancellor: 'El Momo'
            },
            {
                phase: GAME_EVENT.ELECTION,
                approvals: 7,
                rejections: 1
            },
            {
                phase: GAME_EVENT.POLICY_ELECTED,
                president: 'Roomba64',
                chancellor: 'El Momo',
                fascist: true
            },
            {
                phase: GAME_EVENT.POLICY_PEEK,
                president: 'GucciKage'
            },
            
            {
                phase: GAME_EVENT.CHANCELLOR_NOMINATION,
                president: 'GucciKage',
                chancellor: 'mb'
            },
            {
                phase: GAME_EVENT.ELECTION,
                approvals: 4,
                rejections: 3
            },
            {
                phase: GAME_EVENT.POLICY_ELECTED,
                president: 'GucciKage',
                chancellor: 'mb',
                fascist: true
            },
            {
                phase: GAME_EVENT.INVESTIGATE_LOYALTY,
                president: 'GucciKage',
                investigated: 'Roomba64'
            },

            {
                phase: GAME_EVENT.CHANCELLOR_NOMINATION,
                president: 'venkman',
                chancellor: 'angela'
            },
            {
                phase: GAME_EVENT.ELECTION,
                approvals: 6,
                rejections: 1
            },
            {
                phase: GAME_EVENT.POLICY_ELECTED,
                president: 'venkman',
                chancellor: 'angela',
                fascist: true
            },
            {
                phase: GAME_EVENT.SPECIAL_ELECTION,
                president: 'venkman',
                newPresident: 'GucciKage'
            },

            {
                phase: GAME_EVENT.CHANCELLOR_NOMINATION,
                president: 'GucciKage',
                chancellor: 'Roomba64'
            },
            {
                phase: GAME_EVENT.ELECTION,
                approvals: 5,
                rejections: 2
            },
            {
                phase: GAME_EVENT.POLICY_ELECTED,
                president: 'GucciKage',
                chancellor: 'Roomba64',
                fascist: true
            },
            {
                phase: GAME_EVENT.EXECUTION,
                president: 'GucciKage',
                executed: 'radsouza'
            },

            {
                phase: GAME_EVENT.CHANCELLOR_NOMINATION,
                president: 'angela',
                chancellor: 'venkman'
            },
            {
                phase: GAME_EVENT.ELECTION,
                approvals: 4,
                rejections: 3
            },
            {
                phase: GAME_EVENT.POLICY_ELECTED,
                president: 'angela',
                chancellor: 'venkman',
                fascist: false
            },

            {
                phase: GAME_EVENT.GAME_WON,
                fascists: false
            }
        ];

        this.setState({log:msgs});
    }

    processLog = (item, i) => {

        const grey = "#474442";
        const grey2 = "#79706d";
        const yellow = "#fbb867";
        const brightYellow = "#fdde4e";
        const orange = "#f2664a";
        const back = "	#fbb867";
        const offWhite = "#fde0bc";
        const blue = "#6d97b9";

        const style = {"wordWrap": "break-word", "borderBottom":"0px solid #9a928f", "margin":"0px", "padding":"5px 10px 5px 10px", "width":"auto", "fontSize":"12px", "backgroundColor":grey, "borderRadius":"3px"};

        const specialStyle = {"backgroundColor":offWhite, "fontSize":"12px", "marginLeft": "2px", "marginRight": "2px", "padding": "2px 5px 2px 5px", "borderRadius":"3px"};

        const styleSpacing = {"margin":"0px 10px 0px 0px", "fontSize":"12px"};

        const key="log-" + i + Date.now();
        const d = new Date();
        const h = ("0" + d.getHours()).slice(-2);
        const m = ("0" + d.getMinutes()).slice(-2);
        const s = ("0" + d.getSeconds()).slice(-2);

        const index = h+" : "+m+" : "+s;

        var event = <span></span>;

        switch(item.phase) {
            case GAME_EVENT.CHANCELLOR_NOMINATION:
                event = <Paragraph key={key} border="all" style={style} color={offWhite}>
                    President <Text color={grey} style={specialStyle}>{item.president}</Text> picks <Text color={grey} style={specialStyle}>{item.chancellor}</Text> as chancellor.
                </Paragraph>;
                break;
            case GAME_EVENT.ELECTION:
                event = <Paragraph key={key} border="all" style={style} color={offWhite}>
                    Election <Text color={grey} style={specialStyle}>{item.approvals > item.rejections ? "passed" : "failed"}</Text> with <Text color={blue}>{item.approvals}</Text> approval(s) and <Text color={orange}>{item.rejections}</Text> rejection(s).
                </Paragraph>;
                break;
            case GAME_EVENT.EXECUTION:
                event = <Paragraph key={key} border="all" style={style} color={offWhite}>
                   President <Text color={grey} style={specialStyle}>{item.president}</Text> executed <Text color={"#000"} style={specialStyle}>{item.executed}</Text>.
                </Paragraph>;
                break;
            case GAME_EVENT.INVESTIGATE_LOYALTY:
                event = <Paragraph key={key} border="all" style={style} color={offWhite}>
                    President <Text color={grey} style={specialStyle}>{item.president}</Text> investigated <Text color={grey} style={specialStyle}>{item.investigated}</Text>.
                </Paragraph>;
                break;
            case GAME_EVENT.POLICY_ELECTED:
                event = <Paragraph key={key} border="all" style={style} color={offWhite}>
                    President <Text color={grey} style={specialStyle}>{item.president}</Text> and Chancellor <Text color={grey} style={specialStyle}>{item.chancellor}</Text> elected a <Text color={item.fascist ? orange: blue} size="15px">{item.fascist ? "FASCIST" : "LIBERAL"}</Text> policy.
                </Paragraph>;
                break;
            case GAME_EVENT.POLICY_PEEK:
                event = <Paragraph key={key} border="all" style={style} color={offWhite}>
                    President <Text color={grey} style={specialStyle}>{item.president}</Text> peeked at the next 3 policies.
                </Paragraph>;
                break;
            case GAME_EVENT.GAME_WON:
                event = <Paragraph key={key} border="all" style={style} color={offWhite}>
                   <Text color={item.fascist ? orange: blue} size="16px">{item.fascist ? "FASCISTS" : "LIBERALS"}</Text> win.
                </Paragraph>;
                break;
            case GAME_EVENT.SPECIAL_ELECTION:
                event = <Paragraph key={key} border="all" style={style} color={offWhite}>
                    President <Text color={grey} style={specialStyle}>{item.president}</Text> called a special election with <Text color={grey} style={specialStyle}>{item.newPresident}</Text> as the next President.
                </Paragraph>;
                break;
            default:
                event = <Paragraph key={key} border="all" style={style} color={offWhite}>
                    {item.message}
                </Paragraph>;
                break;
            
        }

        return <Box direction="row" width="auto" height="auto">
            <Box width={{"min":"90px"}} style={{"padding":"5px 0px 5px 10px"}}><Text color={offWhite} style={styleSpacing}>{index}.</Text></Box>
            
            <Box width="100%">
                {event}
            </Box>
            

        </Box>
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.addToGameLog();
            this.setState(this.props.data);
            var playerNum = this.props.data.players.length;
            var pIcons = {};
            var selectedPlayer = {};
            var pres = this.getRandomArbitrary(0, playerNum - 1);
            var dead = this.getRandomArbitrary(0, playerNum - 1);
            var select = this.getRandomArbitrary(0, playerNum - 1);
            
            this.props.data.players.forEach((item, i) => {
                pIcons[item.playerTag] = i == pres ? <GiEagleEmblem color="#fdde4e" />: i == dead ? <FaSkull color="#ddd" /> : null;
                selectedPlayer[item.playerTag] = i == select;
            });

            var testData = {
                host: true,
                fascist:false,
                hitler:false,
                intel:'',
                drawPile: 8,
                discardPile: 3,
                electionTracker: 2,
                numberOfFascists: playerNum >= 9 ? 4 : playerNum >= 7 ? 3 : 2,
                numberOfLiberals: playerNum >= 9 ? playerNum - 4 : playerNum >= 7 ? playerNum - 3 : playerNum - 2,
                electionPolicies: [PolicyFascist, PolicyLiberal, PolicyLiberal],
                votePicked: false,
                gamePhase: GAMEPHASE.LEGISLATIVE_SESSION_PRESIDENT,
                gameStarted: true,
                status:"CHANCELLOR IS SELECTING A POLICY!",
                playerStatusIcons:pIcons,
                selectedPlayer:selectedPlayer
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
        const orangeLighter = "#e4886b";
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
                        overflow="hidden"
                    >
                        <Box
                            width="100%"
                            height={{"min":"50%","max":"50%"}}
                            direction="column"
                            align="center"
                            justify="start"
                            pad="0px"
                            gap="small"
                        >
                            <Box 
                                direction="row"
                                align="center"
                                justify="center"
                                gap="small"
                                margin={{"top":"5px"}}
                            >
                                <Text style={{"textAlign": "center"}} color={offWhite}>Lobby</Text>
                                <Box
                                    pad={{"top":"2px","bottom":"2px", "left":"10px","right":"10px"}}
                                    background='#49ad58'
                                    round="3px"
                                >
                                    <Text color={offWhite} size="14px">
                                        {this.props.data.code}
                                    </Text>
                                </Box>
                            </Box>
                            <Box
                                width="100%"
                                height={{"min":"95%","max":"95%"}}
                                direction="column"
                                align="center"
                                justify="start"
                                gap="8px"
                                overflow = "show"
                                pad={{"left":"3px","right":"3px", "top":"3px"}}
                                style={{overflowX:"none"}}
                            >
                                <Scrollbars 
                                    style={{ width: "100%", height: "100%", display:"flex", justifyContent:"center", alignItems:"center", }}
                                >
                                    {this.props.data.players.map((item, i) => (
                                        <Box
                                            width="100%"
                                            height={{"min":"30px","max":"30px"}}
                                            background={this.state.selectedPlayer[item.playerTag] ? orange: grey2}
                                            round="3px"
                                            direction="row"
                                            align="center"
                                            justify="between"
                                            pad={{"top":"2px","bottom":"2px", "left":"5px","right":"5px"}}
                                            id={"player-" + i}
                                            className="lobby-player"
                                            margin={{"bottom":"9px"}}
                                        >
                                            <Box
                                                width={{"max": "95%"}}
                                                height="100%"
                                                overflow="hidden"
                                                direction="row"
                                                align="center"
                                                justify="start"
                                            >
                                                {// player name
                                                }
                                                <Text color={back} size="15px">{item.playerNickName}</Text>
                                            </Box>
                                            <Box
                                                width="35px"
                                                height="100%"
                                                direction="row"
                                                align="center"
                                                justify="end"
                                            >
                                                {// game role (president / chancellor // executed) 
                                                }

                                                {// secret role at the end of the game
                                                }
                                                {this.state.playerStatusIcons[item.playerTag]}
                                            </Box>
                                        </Box>
                                    ))}                               
                                </Scrollbars>
                            </Box>
                        </Box>
                        <Box
                            width="100%"
                            height="40%"
                            direction="column"
                            align="center"
                            justify="start"
                            pad="10px"
                            overflow="show"
                        >
                            {/* <Text color={offWhite} style={{"textAlign": "center"}}>Party Membership &amp; Secret Role</Text> */}
                            <Box height="60px"/>
                            <GameEnvelope 
                                data={{
                                    envWidth:120, 
                                    fascist:this.state.fascist,
                                    hitler:this.state.hitler
                                }}
                            />
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
                            {// draw pile, number of fascists, election tracker, liberals, discard pile
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
                                <ReactTooltip className="tooltop-round policy-tool-tip" id="drawPile" type='info' backgroundColor={offWhite} textColor={grey}>
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
                                <ReactTooltip className="tooltop-round policy-tool-tip" id="numFas" type='info' backgroundColor={orange} >
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

                                <ReactTooltip className="tooltop-round policy-tool-tip" id="eTracker" type='info' backgroundColor={offWhite} textColor={grey}>
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
                                <ReactTooltip className="tooltop-round policy-tool-tip" id="numLib" type='info' backgroundColor={blue}>
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
                                <ReactTooltip className="tooltop-round policy-tool-tip" id="discardPile" type='info' backgroundColor={offWhite} textColor={grey}>
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
                                    <GiExitDoor color={grey2} />
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
                                        className="policy fanCard"
                                        onClick={() => this.pickFirst()}
                                        data-tip data-for="policySelectInstructions"
                                    />

                                    <Image 
                                        src={this.state.electionPolicies[1]} 
                                        width="30%"
                                        className="policy fanCard"
                                        onClick={() => this.pickSecond()}
                                        data-tip data-for="policySelectInstructions"
                                    />

                                    <Image 
                                        src={this.state.electionPolicies[2]} 
                                        width="30%"
                                        className="policy fanCard"
                                        onClick={() => this.pickThird()}
                                        data-tip data-for="policySelectInstructions"
                                    />
                                    
                                    <ReactTooltip 
                                        id="policySelectInstructions" 
                                        type='info' 
                                        backgroundColor={grey}
                                        textColor={offWhite}
                                        overridePosition={ ({ left, top },currentEvent, currentTarget, node) => {
                                            top = top - 10;
                                            return { top, left }
                                        }}
                                        effect="solid"
                                        className="policy-tool-tip"
                                    >
                                        {GAMEPHASE_MSG[this.state.gamePhase]}
                                    </ReactTooltip>
                                </Box>
                            :
                                <Box
                                    width="50%"
                                    direction="row"
                                    align="center"
                                    justify="center"
                                >
                                    <Text color={offWhite}>{GAMEPHASE_STATUS[this.state.gamePhase]}</Text>
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
                                        className="policy fanCard"
                                        onClick={() => this.voteJa()}
                                    />

                                    <Image 
                                        src={VoteNein} 
                                        width="50%"
                                        className="policy fanCard"
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
                        background="none"
                        round="xsmall"
                        pad="small"
                        background={grey}
                    >
                        {// CHAT LOG AND ALLY INFORMATION
                        }
                        <Box
                            width="100%"
                            height="34%"
                            background={grey}
                            round="5px"
                            overflow="auto"
                            direction="column"
                            align="center"
                            justify="start"
                            gap="0px"
                            style={{"border": "0px solid " + grey2}}
                        >
                            {// ally info
                            }
                        </Box>
                        
                        
                        <Box
                            width="99%"
                            height="65%"
                            background={grey}
                            round="5px"
                            overflow="auto"
                            direction="column"
                            align="center"
                            justify="end"
                            gap="0px"
                            ref = {this.gameLogRef}
                        >
                            
                            {// chat log
                            }
                            <Box
                                width="100%"
                                direction="row"
                                align="center"
                                justify="between"
                                background={offWhite}
                                style={{"border": "1px solid " + grey2}}
                            >
                                <Box 
                                    width="50px" 
                                    height={{"min":"1px"}} 
                                    pad="5px" 
                                    data-tip data-for="logCount"
                                    style={{fontSize:"15px", textAlign:"center"}}
                                >
                                    {this.state.log.length}

                                    <ReactTooltip 
                                        id="logCount" 
                                        type='info' 
                                        backgroundColor={offWhite} 
                                        textColor={grey} 
                                        effect="solid" 
                                        place="left" 
                                        className="tooltop-round policy-tool-tip"
                                    >
                                            GAME LOG COUNT
                                    </ReactTooltip>
                                </Box>
                                <Text color={grey} style={{"backgroundColor":offWhite,"width":"auto", "textAlign": "center"}}>Game Log</Text>
                                <Box 
                                    onClick={()=>{

                                        const { scrollbars } = this.refs;
                                        var vals = scrollbars.getValues();
                                        console.log("hide event values ->", vals);
                                        this.hideLog(vals);
                                    }}

                                    style={{
                                        "width":"50px",
                                        background:"none",
                                        color:{offWhite},
                                        display:"flex",
                                        justifyContent:"center",
                                        alignItems:"center",
                                        margin:"5px",
                                        padding:"5px",
                                        border:"0px solid #999"
                                    }}
                                    primary
                                >
                                    {this.state.hideLog ? <IoIosArrowUp color={grey} />
                                    :<IoIosArrowDown color={grey} />}
                                </Box>
                            </Box>
                            <Box
                                width="100%"
                                height={this.state.logHeight}
                                overflow="auto"
                                direction="column"
                                align="center"
                                justify="start"
                                gap="xsmall"
                                style={{"border": "1px solid " + grey2}}
                            >
                                <Scrollbars 
                                    style={{ width: "100%", height: "100%" }}
                                    onUpdate={(event) => {}}
                                    ref="scrollbars"
                                    universal={true}
                                    onUpdate={(event) => {
                                        console.log("update called -> ", event);
                                        if (event.top > 0.99) {
                                            if (!this.state.atLogBottom){
                                                this.setState({atLogBottom:true}, () => {console.log("botom reached")});
                                            }
                                        }
                                        else {
                                            if (this.state.atLogBottom){
                                                this.setState({atLogBottom:false}, () => {console.log("not at bottom")});
                                            }
                                        }
                                    }}
                                >
                                        <Box width="2px" height="5px"></Box>
                                        {this.state.log.map((item, i) => (
                                            this.processLog(item, i)
                                        ))}
                                        <Box width="2px" height="5px"></Box>
                                                                            
                                </Scrollbars>
                                
                                
                            </Box>
  
                            <Box
                                width="auto"
                                height="auto"
                                style={{
                                    position:"fixed",
                                    zIndex: (!this.state.atLogBottom && !this.state.hideLog) ? 2 : -1,
                                    opacity:(!this.state.atLogBottom && !this.state.hideLog) ? 1 : 0,
                                }}
                                pad="10px"
                            >
                                {
                                    //// const { scrollbars } = this.refs;
                                        // scrollbars.scrollToBottom();
                                        //(!this.state.atLogBottom && !this.state.hideLog) ? "-100px" : "0px"
                                }
                                <Box
                                    direction="row"
                                    align="center"
                                    gap="small"
                                    justify="center"
                                    round="medium"
                                    pad="5px"
                                    background="status-critical"
                                    width="65px"
                                    onClick={()=>{
                                        const { scrollbars } = this.refs;
                                        scrollbars.scrollToBottom();
                                    }}
                                    className="policy-tool-tip policy"
                                >
                                    <IoIosArrowDown color={offWhite} style={{fontSize:"18px"}} />
                                </Box>
                            </Box> 
                        </Box>
                    </Box>
                </Box>

                
            </Grommet>
             
        );
    }
    
}

export default GameDash;