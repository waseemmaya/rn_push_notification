import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  get_fcm_token,
  get_device_uid,
  check_permission,
  listen_in_background,
  listen_in_foreground,
  create_notification_channel,
  open_notification_popup,
} from './services/get_fcm_token';

export default class App extends Component {
  render() {
    return (
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>React Native Push Notifications</Text>
      </View>
    );
  }
  async componentDidMount() {
    try {
      create_notification_channel();
      await check_permission();
      await get_fcm_token();
      await get_device_uid();
      this.bg_listener = listen_in_background();
      this.fg_listener = listen_in_foreground();
      this.popup_notification = open_notification_popup();
    } catch (error) {
      console.log('error: ', error);
    }
  }

  componentWillUnmount() {
    this.fg_listener();
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
  },
  sectionTitle: {
    marginTop: 20,
    paddingHorizontal: 8,
    fontSize: 24,
    fontWeight: '600',
  },
});
