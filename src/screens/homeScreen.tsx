import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Colors from '../styles/colors';
import Database from '../database/database';
import {NavigationProp} from '@react-navigation/native';
import ListItem from './listItem';
import ThemeButton from '../components/button';
import AsyncStorage from '@react-native-community/async-storage';
const db = new Database();

interface Props {
  navigation: NavigationProp<any, any>;
}

interface State {
  loading: boolean;
  productList: string[];
  refreshing: boolean;
}

export default class ProductList extends React.Component<Props, State> {
  state: State = {
    loading: false,
    productList: [],
    refreshing: false,
  };
  async componentDidMount() {
    this._getProductList();
  }
  _getProductList = async () => {
    const data = await db.getDataList('SELECT * FROM ProductList', []);
    this.setState({
      productList: data,
      loading: false,
      refreshing: false,
    });
  };

  render() {
    const {loading, productList} = this.state;

    if (loading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.PAGE_BACKGROUND,
          padding: 10,
        }}>
        <View style={{flex: 1}}>
          <FlatList
            data={productList}
            renderItem={({item}) => (
              <ListItem data={item} navigation={this.props.navigation} />
            )}
            keyExtractor={(item: any, index) => index.toString()}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text>There are not details to display</Text>
                </View>
              );
            }}
            onRefresh={() => {
              this.setState({
                refreshing: true,
              });
              this._getProductList();
            }}
            refreshing={this.state.refreshing}
          />
        </View>
        <View>
          <ThemeButton
            title={'Logout'}
            onPressed={async () => {
              await AsyncStorage.removeItem('@isUserLogin');
              this.props.navigation.navigate('Login');
            }}
          />
        </View>
      </View>
    );
  }
}
