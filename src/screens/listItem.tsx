import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationProp} from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any, any>;
  data: any;
}

interface State {}

export default class ListItem extends React.Component<Props, State> {
  static defaultProps = {};
  render() {
    const {
      data: {title, discription, quantity},
    } = this.props;
    return (
      <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
        <View style={styles.detailsWrapper}>
          <View style={styles.listRow}>
            <View style={styles.nameWrapper}>
              <Text style={styles.name}>{title}</Text>
            </View>
            <View>
              <Text>{quantity}</Text>
            </View>
          </View>
          <View style={styles.listRow}>
            <View style={styles.nameWrapper}>
              <Text style={styles.email}>{discription}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 45,
    padding: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  detailsWrapper: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  listRow: {
    flexDirection: 'row',
  },
  nameWrapper: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  email: {
    fontWeight: '700',
  },
});
