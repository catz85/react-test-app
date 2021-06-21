import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
} from "react-router-dom";
import Weather from './components/weather';
import { Stations, StationsEdit, StationsAdd } from './components/stations'
import { createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));
const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
})
export default function App() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Router>
        <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <nav>
              <NavLink variant="button" color="textPrimary" to="/stations" className={classes.link}>
                Stations
              </NavLink>
              <NavLink variant="button" color="textPrimary" to="/weather" className={classes.link}>
                Weather
              </NavLink>
            </nav>
          </Toolbar>
        </AppBar>
        <Container theme={theme} maxWidth="xl" component="main">
          <Grid container layout={"row"} spacing={0}>
            <Switch>
              <Route exact path="/weather/:lat?/:lon?/:forecast?">
                <Weather />
              </Route>
              <Route exact path="/stations">
                <Stations />
              </Route>
              <Route exact path="/stations/add">
                <StationsAdd />
              </Route>
              <Route exact path="/stations/:id?/:edit?">
                <StationsEdit />
              </Route>
              
              
              <Redirect from='*' to='/weather' />
            </Switch>
          </Grid>
        </Container>
        {/* Footer */}
        <Container maxWidth="xl" component="footer" className={classes.footer}>
          <Grid container spacing={4} justify="space-evenly">
          </Grid>
          <Box mt={5}>
          </Box>
        </Container>
        {/* End footer */}
      </Router>
    </React.Fragment>
  );
}