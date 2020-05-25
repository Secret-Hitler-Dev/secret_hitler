import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "./Register.css";

import {
    Box,
    Button,
    CheckBox,
    Grommet,
    Form,
    FormField,
    MaskedInput,
    RadioButtonGroup,
    RangeInput,
    Select,
    TextArea,
    TextInput,
    Text,
    Layer
  } from "grommet";
  import { grommet } from "grommet/themes";
  import { MailOption, Hide, View, Add, FormClose, StatusGood, Tag, Alert  } from 'grommet-icons';

class Register extends Component {

    constructor(props) {
        super(props)
        this.state = {
            playerTag:null,
            password:null,
            password2:null,
            email:null,
            reveal: false,
            message: null,
            invalid: false,
            working:false,
            error:''
        };
    }

    handleInputChange = (value) => {

        if (Object.keys(value).length ==  0) {
            this.setState({
                playerTag:null,
                password:null,
                password2:null,
                email:null,
                reveal: false,
                message: null,
                working:false,
                error:''
            });
        }
        else {
            for ( var property in value ) {
                this.setState({[property]: value[property]});
            }
        }
        this.setState({
            error:''
        });
    }

    setReveal = (val) => {
        this.setState({reveal: val});
    }

    setInvalid = (val) => {
        console.log(val);
        this.setState({invalid: val});
    }

    setWorking = (working) => {
        this.setState({working:working});
    }

    submit = () => {
        console.log(this.state);
        this.setState({
            error:''
        });

        if (this.state.password != this.state.password2) {
            this.setState({message: "Password does not match."});
        }
        else {
            this.setState({message: null});
            var ncount = 0;
            for (var prop in this.state) {
                if (this.state[prop] == null) {
                    ncount++;
                }
            }
            
            if (ncount > 1) {
                this.setInvalid(true);
            }
            else {
                this.setWorking(true);
                fetch('/api/signup', {
                    method: 'POST',
                    body: JSON.stringify(this.state),
                    headers: {
                        'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => {
                    this.setWorking(false);
                    return res.json();
                })
                .then(data => {
                    if ('error' in data) {
                        this.setState({error: data.msg});
                    }
                    else {
                        data.playerNickName = data.playerTag;
                        this.props.data.login(data);
                        this.props.history.push('/');
                    }
                }) 
                .catch(err => {
                    console.error(err);
                });
            }
        }
    }

    componentDidMount() {
        fetch('/api/checkToken', {
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(res.status);
            if (res.status === 200) {
                this.props.history.push('/');
            } 
        }) 
        .catch(err => {
            console.error(err);
        });
    }

    render() {
        var value = this.state;
        const emailMask = [
            {
                regexp: /^[\w\-_.]+$/,
                placeholder: 'example',
            },
            { fixed: '@' },
            {
                regexp: /^[\w]+$/,
                placeholder: 'my',
            },
            { fixed: '.' },
            {
                regexp: /^[\w]+$/,
                placeholder: 'com',
            },
        ];
        const onOpen = () => this.setInvalid(true);

        const onClose = () => this.setInvalid(undefined);

        const grey = "#474442";
        const offWhite = "#fde0bc";
        const orange = "#f2664a";

        return (
            <Grommet theme="grommet">
                <Box  
                    width="100vw" 
                    min-height="100vh" 
                    direction="row" 
                    align="center" 
                    justify="center" 
                    margin={{"top":"100px", "bottom":"100px"}}
                >
                    {this.state.working && 
                        <Layer animation="fadeIn" modal={true}>
                            <Box background={orange} align="center" justify="center" pad="none" >
                                <Box background={orange} align="center" justify="center" pad="large" round="small">
                                    <Text size="xxlarge" color={offWhite}>REGISTERING!</Text>
                                </Box>
                            </Box>
                        </Layer>
                    }
                    <Box 
                        direction="column"
                        pad="none"
                        width="70%"
                        min-height="70%"
                        background={offWhite}
                        overflow="auto"
                        round="xsmall"
                    >
                        <Box width="100%" background={grey} pad="large"> 
                            <Text color={offWhite} size="xxlarge">Registration</Text>
                        </Box>
                        {this.state.error != '' && 
                        <Box width="100%" background={orange} pad="small" direction="row" align="center"> 
                            <Alert color={offWhite} />
                            <Text margin="small" color={offWhite} size="medium">{this.state.error}</Text>
                        </Box>}
                        <Box pad="large">
                            <Form
                                value={value}
                                onChange={nextValue => this.handleInputChange(nextValue)}
                                onReset={() => this.handleInputChange({})}
                                onSubmit={({ value }) => {this.submit()}}
                            >
                                <FormField name="email" label="Email">
                                    <MaskedInput
                                        icon={<MailOption />}
                                        mask={emailMask}
                                        name="email"
                                    />
                                </FormField>
                                <FormField name="password" label="Password">
                                    <Box
                                        direction="row"
                                        align="center"
                                        round="small"
                                    >
                                        <TextInput
                                            plain
                                            type={this.state.reveal ? "text" : "password"}
                                            name="password"
                                        />
                                        <Button
                                            icon={this.state.reveal ? <View size="medium" /> : <Hide size="medium" />}
                                            onClick={() => this.setReveal(!this.state.reveal)}
                                        />
                                    </Box>
                                </FormField>
                                <FormField name="password2" label="Confirm Password">
                                    <Box
                                        direction="row"
                                        align="center"
                                        round="small"
                                    >
                                        <TextInput
                                            plain
                                            type={this.state.reveal ? "text" : "password"}
                                            name="password2"
                                        />
                                        <Button
                                            icon={this.state.reveal ? <View size="medium" /> : <Hide size="medium" />}
                                            onClick={() => this.setReveal(!this.state.reveal)}
                                        />
                                    </Box>
                                </FormField>
                                {this.state.message && (
                                    <Box pad={{ horizontal: "small" }}>
                                        <Text color="status-error">{this.state.message}</Text>
                                    </Box>
                                )}

                                <FormField name="playerTag" label="Player Tag">
                                    <TextInput icon={<Tag />} placeholder='bobby21' name="playerTag" />
                                </FormField>

                                {this.state.invalid && (
                                    <Layer
                                        position="bottom"
                                        modal={false}
                                        margin={{ vertical: "medium", horizontal: "small" }}
                                        onEsc={onClose}
                                        responsive={false}
                                        plain
                                    >
                                        <Box
                                        align="center"
                                        direction="row"
                                        gap="small"
                                        justify="between"
                                        round="medium"
                                        elevation="medium"
                                        pad={{ vertical: "xsmall", horizontal: "small" }}
                                        background="status-critical"
                                        >
                                        <Box align="center" direction="row" gap="xsmall">
                                            <StatusGood />
                                            <Text size="small">Fill out all fields!</Text>
                                        </Box>
                                        <Button icon={<FormClose />} onClick={onClose} plain />
                                        </Box>
                                    </Layer>
                                )}
                                <Box direction="row" gap="medium" margin={{"top":"40px"}}>
                                    <Button type="submit" primary label="Register" color={orange}/>
                                    <Button label="Cancel" color={orange} onClick={() => this.props.history.push("/")}/>
                                </Box>
                            </Form>
                        </Box>
                    </Box>
                </Box>
            </Grommet>
        );
      }
    
}

export default withRouter(Register);