import React from 'react';
import {StyleSheet, View, TextInput, ScrollView, Alert} from 'react-native';
import Label from '../components/Label';
import Colors from '../styles/colors';
import ThemeButton from '../components/button';
import CommonInput from '../components/commonInput';
import {NavigationProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Database from '../database/database';
const db = new Database();

interface Props {
  navigation: NavigationProp<any, any>;
}

interface State {
  email: string;
  password: string;
  isValidEmail: boolean;
  isPasswordValid: boolean;
}

export default class Login extends React.Component<Props, State> {
  state: State = {
    email: '',
    password: '',
    isValidEmail: true,
    isPasswordValid: true,
  };
  _emailChanged = (text: string) => {
    let isValidEmail = true;
    if (!this._validateEmail(text) && text.length > 0) {
      isValidEmail = false;
    } else if (this._validateEmail(text)) {
      isValidEmail = true;
    }
    this.setState({
      isValidEmail,
      email: text,
    });
  };
  _validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  _changedPass = (text: string) => {
    this.setState({
      password: text,
    });
  };
  _login = async () => {
    const {email, password, isValidEmail} = this.state;
    if (!isValidEmail) {
      return false;
    } else if (email.length === 0 || password.length === 0) {
      Alert.alert(
        'Alert',
        'All the fields are required fields',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      this.setState({
        isValidEmail: email.length == 0 ? false : true,
        isPasswordValid: password.length == 0 ? false : true,
      });
    } else {
      this.setState({
        isValidEmail: true,
        isPasswordValid: true,
      });
      const isValidUser = await db.checkData(
        'SELECT * FROM userDetails WHERE email=? AND password=?',
        [email, password],
      );
      if (isValidUser) {
        await AsyncStorage.setItem('@isUserLogin', 'true');
        this.props.navigation.navigate('Home');
      } else {
        Alert.alert(
          'Alert',
          'The credentails you have entered does not exists OR you have entered invalid details.\nPlease check or register you user',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      }
    }
  };
  _register = () => {
    this.props.navigation.navigate('Register');
    this.setState({
      email: '',
      password: '',
      isValidEmail: true,
      isPasswordValid: true,
    });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: Colors.WHITE,
        }}>
        <ScrollView
          style={{flex: 1, padding: 10}}
          keyboardShouldPersistTaps={'handled'}>
          <View style={styles.conatentWrapper}>
            <View style={styles.itemWrapper}>
              <Label title={'Email'} />
              <View style={{}}>
                <TextInput
                  value={this.state.email}
                  onChangeText={(text) => {
                    this._emailChanged(text);
                  }}
                  style={[
                    styles.inputStyle,
                    this.state.email.length > 0
                      ? this.state.isValidEmail
                        ? styles.isValidInput
                        : styles.isInvalidInput
                      : null,
                  ]}
                  autoCapitalize={'none'}
                />
              </View>
            </View>
            <View style={styles.itemWrapper}>
              <CommonInput
                title={'Password'}
                secureEntry={true}
                value={this.state.password}
                onChnagedText={(text: string) => {
                  this._changedPass(text);
                }}
                isValid={this.state.isPasswordValid}
              />
            </View>
            <View style={[styles.itemWrapper, {alignItems: 'center'}]}>
              <ThemeButton
                title={'Login'}
                onPressed={() => {
                  this._login();
                }}
              />
            </View>
            <View style={[styles.itemWrapper, {alignItems: 'center'}]}>
              <ThemeButton
                title={'Register'}
                onPressed={() => {
                  this._register();
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    borderColor: Colors.BLACK,
    borderRadius: 5,
  },
  conatentWrapper: {},
  itemWrapper: {
    marginBottom: 20,
  },
  isValidInput: {
    borderColor: 'green',
  },
  isInvalidInput: {
    borderColor: 'red',
  },
  button: {
    padding: 10,
    backgroundColor: Colors.THEME_PRIMARY,
    borderRadius: 5,
  },
});
