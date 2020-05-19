import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';

import "./GameBoard.css";

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
import { deepMerge } from 'grommet/utils';
import ReactTooltip from "react-tooltip";


import {
    BoardLiberal,
    BoardFascist,
    CardLibWin,
    CardFasWin,
    CardFasR1P9,
    CardFasR2P7,
    CardFasR2P9,
    CardFasR3P5,
    CardFasR3P7,
    CardFasR3P9,
    CardFasR4,
    CardFasR5,
    CardFas,
    CardLib
} from 'GameAssets';

import {GameCard} from 'Components';

const customFocus = deepMerge(grommet, {
    global: {
      colors: {
        focus: "none"
      }
    }
});

const FASCIST_CARDS = {
    R1P9: {icon: CardFasR1P9, ability: "INVESTIGATE LOYALTY"},
    R2P7: {icon: CardFasR2P7, ability: "INVESTIGATE LOYALTY"},
    R2P9: {icon: CardFasR2P9, ability: "INVESTIGATE LOYALTY"},
    R3P5: {icon: CardFasR3P5, ability: "POLICY PEEK"},
    R3P7: {icon: CardFasR3P7, ability: "SPECIAL ELECTION"},
    R3P9: {icon: CardFasR3P9, ability: "SPECIAL ELECTION"},
    R4: {icon: CardFasR4, ability: "EXECUTION"},
    R5: {icon: CardFasR5, ability: "EXECUTION"},
    R: {icon: CardFas, ability: "NO SPECIAL POWER"},
}

class GameBoard extends Component {
    

    constructor(props) {
        super(props)
        this.state = {
            msg: '',
            gameCards: [],
            width:0
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
            var w = document.getElementById('gameboards').clientWidth;
            this.setState(this.props.data);
            this.setState({width: w});

            var cards = [];
            var msg = '';

            if (this.props.data.fascist) {
                console.log(this.props.data);
                msg = this.props.data.playerNum >= 9 ? "9 OR 10 PLAYERS: PLAYING WITH 3 FASCISTS AND HITLER, HITLER DOESN'T KNOW WHO THE FASCISTS ARE." : 
                this.props.data.playerNum >= 7 ? "7 OR 8 PLAYERS: PLAYING WITH 2 FASCISTS AND HITLER, HITLER DOESN'T KNOW WHO THE FASCISTS ARE." : "5 OR 6 PLAYERS: PLAYING WITH 1 FASCISTS AND HITLER, HITLER KNOWS WHO THE FASCIST IS."; 

                var icon1 = this.props.data.playerNum >= 9 ? FASCIST_CARDS.R1P9.icon : FASCIST_CARDS.R.icon;
                var icon2 = this.props.data.playerNum >= 9 ? FASCIST_CARDS.R2P9.icon : 
                            this.props.data.playerNum >= 7 ? FASCIST_CARDS.R2P7.icon : FASCIST_CARDS.R.icon;
                var icon3 = this.props.data.playerNum >= 9 ? FASCIST_CARDS.R3P9.icon : 
                            this.props.data.playerNum >= 7 ? FASCIST_CARDS.R3P7.icon  : FASCIST_CARDS.R3P5.icon ;
                var icon4 = FASCIST_CARDS.R4.icon ;
                var icon5 = FASCIST_CARDS.R5.icon ;
                var icon6 = CardFasWin;

                var ability1 = this.props.data.playerNum >= 9 ? FASCIST_CARDS.R1P9.ability : FASCIST_CARDS.R.ability;
                var ability2 = this.props.data.playerNum >= 9 ? FASCIST_CARDS.R2P9.ability : 
                            this.props.data.playerNum >= 7 ? FASCIST_CARDS.R2P7.ability : FASCIST_CARDS.R.ability;
                var ability3 = this.props.data.playerNum >= 9 ? FASCIST_CARDS.R3P9.ability : 
                            this.props.data.playerNum >= 7 ? FASCIST_CARDS.R3P7.ability  : FASCIST_CARDS.R3P5.ability ;
                var ability4 = FASCIST_CARDS.R4.ability ;
                var ability5 = FASCIST_CARDS.R5.ability ;
                var ability6 = "FASCISTS WIN";

                cards = [
                    {
                        id:"fas",
                        fascist:true,
                        ability:ability1,
                        factor:1,
                        width:w,
                        special:false,
                        icon:icon1,
                        msg:[]
                    },
                    {
                        id:"fas",
                        fascist:true,
                        ability:ability2,
                        factor:2,
                        width:w,
                        special:false,
                        icon:icon2,
                        msg:[]
                    },
                    {
                        id:"fas",
                        fascist:true,
                        ability:ability3,
                        factor:3,
                        width:w,
                        special:false,
                        icon:icon3,
                        msg:[]
                    },
                    {
                        id:"fas",
                        fascist:true,
                        ability:ability4,
                        factor:4,
                        width:w,
                        special:true,
                        icon:icon4,
                        msg:[]
                    },
                    {
                        id:"fas",
                        fascist:true,
                        ability:ability5,
                        factor:5,
                        width:w,
                        special:true,
                        icon:icon5,
                        msg:[]
                    },
                    {
                        id:"fas",
                        fascist:true,
                        ability:ability6,
                        factor:6,
                        width:w,
                        special:true,
                        icon:icon6,
                        msg:[]
                    }
                ];
            }
            else {
                msg="5 - 10 PLAYERS: NO SPECIAL ROLES."
                cards = [
                    {
                        id:"lib",
                        fascist:false,
                        ability:null,
                        factor:1,
                        width:w,
                        special:false,
                        icon:CardLib,
                        msg:[]
                    },
                    {
                        id:"lib",
                        fascist:false,
                        ability:null,
                        factor:2,
                        width:w,
                        special:false,
                        icon:CardLib,
                        msg:[]
                    },
                    {
                        id:"lib",
                        fascist:false,
                        ability:null,
                        factor:3,
                        width:w,
                        special:false,
                        icon:CardLib,
                        msg:[]
                    },
                    {
                        id:"lib",
                        fascist:false,
                        ability:null,
                        factor:4,
                        width:w,
                        special:false,
                        icon:CardLib,
                        msg:[]
                    },
                    {
                        id:"lib",
                        fascist:false,
                        ability:"LIBERALS WIN",
                        factor:5,
                        width:w,
                        special:true,
                        icon:CardLibWin,
                        msg:["LIBERALS WIN THE GAME"]
                    }
                ];
            }
            this.setState({gameCards:cards, msg:msg});
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

        const width = this.state.width*0.97;
        const height = width * 0.3135;

        const widthText = (1279 / 2000) * 100;
        const heightText = (67 / 624) * 100;

        return (
            <Grommet theme={customFocus}>
                <Box 
                    width={width+"px"} 
                    height={height + "px"} 
                    style={{
                        backgroundImage: `url(${this.props.data.fascist ? BoardFascist : BoardLiberal})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                    direction="column"
                    align="center"
                    justify="end"
                    pad={{"bottom": "40px"}}
                    gap="medium"
                    className="lightDropShadow"
                >
                    <Box
                        width="100%"
                        direction="row"
                        align="end"
                        justify="center"
                        gap="xsmall"                    
                    >
                        {this.state.gameCards.map((item, i) => (
                            
                            <GameCard id={"card" + item.id + i} data={item} />
                        ))}
                    </Box>
                    <Text width={widthText + "px"} height={heightText + "px"} size="11px" color={this.props.data.fascist ? orange : blue} > {this.state.msg}</Text>

                </Box>
            </Grommet>
             
        );
    }
    
}

export default GameBoard;