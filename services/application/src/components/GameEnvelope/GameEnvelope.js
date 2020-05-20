import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';

import "./GameEnvelope.css";

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

import { FaUserSecret } from "react-icons/fa";
import { AiFillIdcard } from "react-icons/ai";

import { deepMerge } from 'grommet/utils';
import ReactTooltip from "react-tooltip";


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
    RoleLiberal
} from 'GameAssets';

const customFocus = deepMerge(grommet, {
    global: {
      colors: {
        focus: "none"
      }
    }
});

class GameEnvelope extends Component {
    

    constructor(props) {
        super(props)
        this.state = {
            msg: '',
            reveal: 0,
            envWidth: 80,
            role:null,
            member: null,
            fascist: false,
            id: Date.now()
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

    
    reveal = (event) => {
        if (this.state.reveal != 0) {
            this.setState({reveal: 0});
        }
        else {
            this.setState({reveal: 1});
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.setState(this.props.data);
        }
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

        const envWidth = this.state.envWidth * 0.98;
        const M = {w: 1174, h:1660}
        const R = {w: 738, h:1080}
        const E = {w: 637, h:1080}

        const offsetR = ((envWidth / R.w) * R.h) - (this.state.reveal * ((envWidth / R.w) * R.h) * 0.5);
        const offsetM = ((envWidth / M.w) * M.h) - (this.state.reveal * ((envWidth / M.w) * M.h) * 0.7);
        const offsetE = ((envWidth / E.w) * E.h) - (this.state.reveal * ((envWidth / E.w) * E.h) * 0.9);

        const role = this.props.data.fascist ? this.props.data.hitler ? RoleHitler : RoleFascist : RoleLiberal;
        const member = this.props.data.fascist ? MemberFascist : MemberLiberal;
        const memberColour = this.props.data.fascist ? orange : blue;
        const roleText = !this.props.data.fascist ? " LIBERAL" : this.props.data.hitler ? " HITELER" : " FASCIST";
        const memberText = !this.props.data.fascist ? " LIBERAL" : " FASCIST";

        return (
            <Grommet theme={customFocus} background="none">
                <Box
                    width={(envWidth * 1.3) + "px"}
                    onClick={() => this.reveal()}
                    direction="column"
                    align="start"
                    justify="center"
                >
                    <Box 
                        width={(envWidth * R.w) + "px"} 
                        height={offsetR + "px"}
                        pad="0px"
                        round="0px"
                        direction="row"
                        align="center"
                        justify="start"
                        className="game-card game-card-1"
                        data-tip data-for={'role' + this.state.id}
                    >
                        <Image src={role} width="100%"/>
                        <ReactTooltip 
                            id={'role' + this.state.id} 
                            type='info' 
                            backgroundColor={memberColour}
                            overridePosition={ ({ left, top },currentEvent, currentTarget, node) => {
                                top = top - 10;
                                return { top, left }
                            }}
                            effect="solid"
                            className="center-row tooltop-round policy-tool-tip"
                        >
                            <FaUserSecret color={offWhite}/> <span>{roleText}</span>
                        </ReactTooltip>
                    </Box>
                    <Box 
                        width={(envWidth * M.w) + "px"} 
                        height={offsetR + "px"}
                        direction="row"
                        align="center"
                        justify="start"
                        className="game-card game-card-2"
                        margin={{"top":(-1 * offsetM) + "px"}}
                        data-tip data-for={'member' + this.state.id}
                    >
                        <Image src={member} width="100%" />
                        <ReactTooltip
                            id={'member' + this.state.id} 
                            type='info' 
                            backgroundColor={memberColour}
                            overridePosition={ ({ left, top },currentEvent, currentTarget, node) => {
                                top = top - 10;
                                return { top, left }
                            }}
                            effect="solid"
                            className="center-row tooltop-round policy-tool-tip"
                        >
                            <AiFillIdcard color={offWhite} /> <span>{memberText}</span>
                        </ReactTooltip>
                    </Box>
                    <Box 
                        width={((this.state.envWidth * E.w) + (this.state.envWidth)) + "px"} 
                        height={offsetR + "px"}
                        direction="row"
                        align="center"
                        justify="center"
                        margin={{"top":(-1 * offsetE) + "px"}}
                    >
                        <Image src={Envelope} className="game-card-glow" width="100%" />
                    </Box>
                </Box>
            </Grommet>
             
        );
    }
    
}

export default GameEnvelope;