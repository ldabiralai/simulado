import React, { Component } from 'react';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider } from '@material-ui/core/styles';
import ResponseMethod from '../ResponseMethod';
import MuiTheme from './MuiTheme';

import './styles.css';

export default class SimuladoUI extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      responses: {}
    };
  }

  componentDidMount() {
    axios.get('/simulado/responses').then(response => {
      this.setState(() => ({
        loading: false,
        responses: response.data
      }));
    });
  }

  getContent() {
    if (this.state.loading) {
      return (
        <div className="Loading">
          <CircularProgress size={100} />
        </div>
      );
    }

    const responsesByMethod = Object.keys(this.state.responses).map(responseMethod => ({
      method: responseMethod,
      responses: this.state.responses[responseMethod]
    }));

    if (responsesByMethod.length === 0) {
      return <Typography>No responses have been set...</Typography>;
    }

    return responsesByMethod.map(responseMethod => (
      <ResponseMethod
        key={responseMethod.method}
        name={responseMethod.method}
        responses={responseMethod.responses}
      />
    ));
  }

  render() {
    return (
      <MuiThemeProvider theme={MuiTheme}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="textSecondary">
              Simulado UI
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="Content">{this.getContent()}</div>
      </MuiThemeProvider>
    );
  }
}
