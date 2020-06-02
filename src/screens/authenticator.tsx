import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationProp} from '@react-navigation/native';
import Database from '../database/database';
const db = new Database();

interface Props {
  navigation: NavigationProp<any, any>;
}

interface State {}

export default class Authenticator extends React.Component<Props, State> {
  state: State = {};
  async componentDidMount() {
    const value = await AsyncStorage.getItem('@isUserLogin');
    await db.initDB();
    if (value !== 'true') {
      this.props.navigation.navigate('Login');
    } else {
      this.props.navigation.navigate('Home');
    }
  }
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
}
