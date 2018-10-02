import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: {
      main: '#516E80'
    },
    secondary: {
      main: '#516E80'
    },
    text: {
      primary: '#FFF',
      secondary: '#FFF'
    }
  },
  overrides: {
    MuiExpansionPanel: {
      root: {
        boxShadow: 'none',
        border: '1px solid #FFF',
        margin: '5px 0',
        borderRadius: '3px',
        overflow: 'hidden',

        '&:first-child': {
          borderTopLeftRadius: '3px',
          borderTopRightRadius: '3px'
        },

        '&:last-child': {
          borderBottomLeftRadius: '3px',
          borderBottomRightRadius: '3px'
        }
      }
    },
    MuiExpansionPanelSummary: {
      root: {
        backgroundColor: '#516E80'
      }
    },
    MuiExpansionPanelDetails: {
      root: {
        backgroundColor: '#516E80'
      }
    }
  }
});
