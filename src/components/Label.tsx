import React from 'react';
import {View, Text} from 'react-native';

interface Props {
  title: string;
}

interface State {}

export default class Label extends React.Component<Props, State> {
  render() {
    return (
      <View style={{flex: 1, marginBottom: 10}}>
        <Text style={{fontSize: 15, fontWeight: '700'}}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}
