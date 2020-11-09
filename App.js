import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Search from './Pages/search'
import Movie from './Pages/movie'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";


// style={styles.container}
export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
                <Route exact path="/" component={Search}/>
                <Route path="/Movie/:id" component={Movie}/>
        </Switch>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
