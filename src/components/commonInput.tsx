import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Colors from '../styles/colors';
import Label from './Label';

interface Props {
  title: string;
  value: string;
  isValid: boolean;
  secureEntry: true | false;
  onChnagedText: Function;
}

interface State {}

export default class CommonInput extends React.Component<Props, State> {
  static defaultProps = {
    secureEntry: false,
    isValid: true,
    inputType: '',
  };
  render() {
    return (
      <View style={{flex: 1, marginBottom: 10}}>
        <Label title={this.props.title} />
        <View style={{}}>
          <TextInput
            style={[
              styles.inputStyle,
              !this.props.isValid ? styles.isInvalidInput : null,
            ]}
            secureTextEntry={this.props.secureEntry}
            onChangeText={(text) => {
              this.props.onChnagedText(text);
            }}
            value={this.props.value}
          />
        </View>
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
  isValidInput: {
    borderColor: 'green',
  },
  isInvalidInput: {
    borderColor: 'red',
  },
});
