import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../styles/colors';

interface Props {
  title: string;
  onPressed?: Function;
}

interface State {}

export default class ThemeButton extends React.Component<Props, State> {
  static defaultProps = {
    onPressed: () => {},
  };
  render() {
    return (
      <View style={{marginBottom: 10}}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => {
            if (this.props.onPressed) {
              this.props.onPressed();
            }
          }}>
          <Text style={styles.buttonText}>{this.props.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: Colors.THEME_PRIMARY,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.WHITE,
    fontWeight: '700',
    fontSize: 18,
  },
});
