import React, { Component } from 'react';
import '../style/App.css';
import { Box, Heading, Grommet } from 'grommet';

class App extends Component {
  render() {
    return (
      <Grommet>
           <Heading level={1}> SECRET HITLER !!!!!!!!!!! Testing content</Heading>
           <Box border={{ color: 'brand', size: 'large' }} pad='xlarge' >Grommet Box</Box>
      </Grommet>
    );
  }
}

export default App;
