import React from 'react';
import {View, StyleSheet, ScrollView, TextInput, Alert} from 'react-native';
import Colors from '../styles/colors';
import {NavigationProp} from '@react-navigation/native';
import CommonInput from '../components/commonInput';
import Label from '../components/Label';
import ThemeButton from '../components/button';
import data from '../static/productList';
import Database from '../database/database';
const db = new Database();

interface Props {
  navigation: NavigationProp<any, any>;
  data?: any;
}

interface State {
  name: string;
  isValidName: boolean;
  email: string;
  isValidEmail: boolean;
  password: string;
  isValidPass: boolean;
}

export default class Register extends React.Component<Props, State> {
  static defaultProps = {};
  constructor(props: any) {
    super(props);
    this.state = {
      name: '',
      isValidName: true,
      email: '',
      isValidEmail: true,
      password: '',
      isValidPass: true,
    };
  }
  _onChangedText = (data: string, type: string) => {
    if (type == 'name') {
      this.setState({name: data});
    } else if (type == 'password') {
      this.setState({password: data});
    }
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
  _register = async () => {
    const {name, email, password} = this.state;
    if (name === '' || email === '' || password === '') {
      Alert.alert(
        'Alert',
        'All the fields are required fields',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      this.setState({
        isValidEmail: false,
        isValidName: false,
        isValidPass: false,
      });
    } else {
      const checkUser = await db.checkData(
        'SELECT * FROM userDetails WHERE email=?',
        [email],
      );
      if (checkUser) {
        Alert.alert(
          'Alert',
          'The user already exists with entered Email address',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      } else {
        await db.insertSingleRecord(
          'INSERT INTO userDetails VALUES (?,?,?)',
          [name, email, password],
          true,
        );
        const checkData = await db.checkData(
          'SELECT * FROM ProductList',
          [],
          true,
        );
        if (!checkData) {
          this._bulkDataInserter();
        }
        this.setState({
          name: '',
          isValidName: true,
          email: '',
          isValidEmail: true,
          password: '',
          isValidPass: true,
        });
      }
    }
  };
  _bulkDataInserter = async () => {
    let arrMain: any = [];
    data.forEach((v) => {
      arrMain.push([
        'INSERT INTO ProductList VALUES (?,?,?)',
        [v.title, v.quantity, v.description],
      ]);
    });
    await db.insertBulk(arrMain);
  };
  render() {
    const {
      name,
      isValidName,
      email,
      isValidEmail,
      isValidPass,
      password,
    } = this.state;
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1, padding: 15}}>
          <CommonInput
            title="Name"
            value={name}
            onChnagedText={(data: string) => {
              this._onChangedText(data, 'name');
            }}
            isValid={isValidName}
          />
          <View style={styles.itemWrapper}>
            <Label title={'Email'} />
            <View style={{}}>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  this._emailChanged(text);
                }}
                style={[
                  styles.inputStyle,
                  email.length > 0
                    ? isValidEmail
                      ? styles.isValidInput
                      : styles.isInvalidInput
                    : null,
                ]}
                autoCapitalize={'none'}
              />
            </View>
          </View>
          <CommonInput
            title="Password"
            value={password}
            onChnagedText={(data: string) => {
              this._onChangedText(data, 'password');
            }}
            isValid={isValidPass}
            secureEntry={true}
          />
          <View style={[styles.itemWrapper, {alignItems: 'center'}]}>
            <ThemeButton
              title={'Register'}
              onPressed={() => {
                this._register();
              }}
            />
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
