/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './app/App';
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
