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
    'test_channel',
    'Testing Channel',
    firebase.notifications.Android.Importance.Max,
  ).setDescription('RN Push Notification Test Channel');

  // Create the channel
  firebase.notifications().android.createChannel(channel);
};

// when your app is closed and also closed from recent apps list
export const listen_in_background = async () => {
  // background listener
  const bg_listener = await firebase.notifications().getInitialNotification();
  console.log('bg_listener ---->: ', bg_listener);
  const {action, notification} = bg_listener;

  const {_title, _body} = notification;

  if (_body) {
    console.log('listen_in_background _body : --> ', _body);
    console.log('listen_in_background _title: -->', _title);
  }

  return bg_listener;
};

// if notification is being opened when your app is in foreground

export const listen_in_foreground = () => {
  // running listener started
  const fg_listener = firebase
    .notifications()
    .onNotificationOpened(fg_notification => {
      console.log('listen_in_foreground : ', fg_notification);
      if (fg_notification) {
        const {action, notification} = fg_notification;
      }
    });

  return fg_listener;
};

// it just shows popup when you are in app
export const open_notification_popup = () => {
  const onNotification = firebase.notifications().onNotification(notific => {
    let {_title, _body} = notific;

    const noti = new firebase.notifications.Notification()
      .setNotificationId('notificationId')
      .setTitle(_title)
      .setBody(_body)
      .setData({
        title: _title,
        body: _body,
      });

    noti.android
      .setChannelId('test_channel')
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
  } catch (error) {}
};
