import {AsyncStorage, Platform} from 'react-native';
import {firebase} from './firebase';
import {getUniqueId} from 'react-native-device-info';

export const check_permission = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
    // user has permissions
  } else {
    await firebase.messaging().requestPermission();
    // user doesn't have permission
  }
};

export const create_notification_channel = () => {
  const channel = new firebase.notifications.Android.Channel(
    'msg_channel',
    'Msg Channel',
    firebase.notifications.Android.Importance.Max,
  ).setDescription('My apps test channel');

  // Create the channel
  firebase.notifications().android.createChannel(channel);
};

export const listen_in_background = async () => {
  // background listener
  const bg_listener = await firebase.notifications().getInitialNotification();
  console.log('bg_listener: ', bg_listener);
  if (bg_listener) {
    const {action, notification} = bg_listener;
  }
  return bg_listener;
};

export const listen_in_foreground = async () => {
  // running listener started
  const fg_listener = await firebase
    .notifications()
    .onNotificationOpened(fg_notification => {
      console.log('fg_notification: ', fg_notification);

      if (fg_notification) {
        const {action, notification} = fg_notification;
      }
    });

  console.log('fg_listener: ', fg_listener);
  return fg_listener;
};

export const open_notification_popup = async () => {
  const onNotification = await firebase
    .notifications()
    .onNotification(notific => {
      console.log('notific: ', notific);
      let {_title, _body} = notific;

      const noti = new firebase.notifications.Notification()
        .setNotificationId('notificationId')
        .setTitle(_title)
        .setBody(_body)
        .setData({
          // key1: 'value1',
          // key2: 'value2',
          title: _title,
          body: _body,
        });

      noti.android
        .setChannelId('msg_channel')
        .android.setColor('#059EDC')
        .android.setAutoCancel(true)
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .setSound('default');
      firebase.notifications().displayNotification(noti);
    });

  return onNotification;
};

export const get_device_uid = () => {
  let uniqueId = getUniqueId();
  _saveStorageItem('DEVICE_UID', uniqueId);
  return uniqueId;
};

export const get_fcm_token = () => {
  firebase
    .messaging()
    .getToken()
    .then(token => {
      _onChangeToken(token);
    });

  firebase.messaging().onTokenRefresh(token => {
    _onChangeToken(token);
  });
};

export const _onChangeToken = token => {
  console.log('token: ', token);
  var data = {
    device_token: token,
    device_type: Platform.OS,
  };

  _saveStorageItem('FCM_TOKEN', data.device_token);
};

export const _saveStorageItem = async (key, val) => {
  try {
    // await AsyncStorage.setItem('DEVICE_STORAGE_KEY', value);
    await AsyncStorage.setItem(key, val);
  } catch (error) {
    console.log('error: ', error);
  }
};
