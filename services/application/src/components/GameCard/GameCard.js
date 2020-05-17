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

        const width = (this.props.data.width * 0.134);
        const height = 1.3576 * width;
        
        const fasColours = ["#e1dbd0","#db5a3e"];
        const libColours = ["#bfe0e0","#378895"];
        const special = !this.props.data.special ? 0 : 1;

        const backColour = this.props.data.fascist ? fasColours[special]: libColours[special]; 
        const borderColour = this.props.data.fascist ? fasColours[1]: libColours[1];
        
        const policyImage = this.props.data.fascist ? PolicyFascist : PolicyLiberal;

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
                            className={"tile-effect-"  + (this.props.data.fascist ? "fas" : "lib")}
                            style={{"borderRadius": "10px", "border": "2px solid #4744429a"}}
                        />
                    }
                </Box>
            </Grommet>
             
        );
    }
    
}

export default GameCard;