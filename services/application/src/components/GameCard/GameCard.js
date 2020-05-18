import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';

import "./GameCard.css";

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

class GameCard extends Component {
    

    constructor(props) {
        super(props)
        this.state = {
            msg: '',
            reveal: 0,
            policy:true,
            id: Date.now(),
            width: 0,
            fascist:false,
            ability:null,
            factor:0,
            special:false, 
            icon:null, 
            msg:[]
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
        if (this.state.reveal == 0) {
            this.setState({reveal: 1});
        }
        else {
            this.setState({reveal: 0});
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

        const width = (this.props.data.width * 0.12);
        const height = 1.3576 * width;
        
        const fasColours = ["#ffc5bb","#be240b"];
        const libColours = ["#bfe0e0","#3e89ae"];
        const special = !this.props.data.special ? 0 : 1;

        const backColour = this.props.data.fascist ? fasColours[special]: libColours[special]; 
        const borderColour = this.props.data.fascist ? fasColours[1]: libColours[1];
        const borderColourLight = this.props.data.fascist ? fasColours[0]: libColours[0];
        
        const policyImage = this.props.data.fascist ? PolicyFascist : PolicyLiberal;

        const ability = this.props.data.ability || "NO SPECIAL POWER";
        const tooltipId = "ability-" + (this.props.data.fascist ? "fas-": "lib-") + this.props.data.factor;
        console.log(tooltipId);

        return (
            <Grommet theme={customFocus} background="none">
                <Box
                    width={width + "px"}
                    height={height + "px"}
                    onClick={() => this.reveal()}
                    direction="column"
                    align="center"
                    justify="center"
                    background={backColour}
                    round={(width * 0.06) + "px"}
                    border={
                        {
                            "color": borderColour,
                            "size": "small",
                            "style": "dotted",
                            "side": "all"
                        }
                    }
                    style={{
                        backgroundImage: `url(${this.props.data.icon != null ? this.props.data.icon : ""})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                    
                >
                    {this.state.policy && 
                        <Image 
                            src={policyImage} 
                            width="80%"
                            margin={{"top":(-2.1 * this.state.reveal * width) + "px"}}
                            className={"policy game-card-no-shadow tile-effect-"  + (this.props.data.fascist ? "fas" : "lib")}
                            style={{"borderRadius": "10px", "border": "0px solid #4744429a"}}
                            data-tip data-for={tooltipId}
                        />
                    }
                    <ReactTooltip 
                        id={tooltipId} 
                        type='info' 
                        backgroundColor={borderColourLight}
                        textColor={borderColour}
                        overridePosition={ ({ left, top },currentEvent, currentTarget, node) => {
                            top = top - 10;
                            return { top, left }
                        }}
                        className='policy-tool-tip'
                        effect="solid"
                    >
                        {ability}
                    </ReactTooltip>
                </Box>
            </Grommet>
             
        );
    }
    
}

export default GameCard;