import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Share, Alert, ScrollView } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import { Linking } from 'react-native';
import { openSettings } from 'react-native-permissions';
// const camimg = require('../assets/images/cog.png');
// const caplogimg = require('../assets/images/ksapplogo.png');
// const abtus = require('../assets/images/list.png');
// const atour = require('../assets/images/apps.png');
// const share = require('../assets/images/share.png');
// const contact = require('../assets/images/emerg_icon.png');
// const sprt = require('../assets/images/instruction.png');
// const logs = require('../assets/images/logout.png');
// const loimg = require('../assets/images/krimescene2.png');

//npm i react-native-permissions

const LeftMenu: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  // const LeftMenu: React.FC<DrawerContentComponentProps> = ({ navigation }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('uid');  
      setIsLoggedIn(false);    
      navigation.navigate('login')
     
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };
  const opensett = async () => {
    if (Platform.OS === 'ios') {
      openSettings().catch(() => console.warn('cannot open settings'));
    } else {
      Linking.openSettings();
    }
  }

  const onShare = async () => {
    try {
      const message = Platform.select({
        ios: 'Please install this app and stay safe. AppLink: ', // Replace with your iOS App ID
        android: 'Please install this app and stay safe. AppLink: ',
        default: 'Please install this app and stay safe.', // Fallback message
      });

      const url = Platform.select({
        ios: '', // Replace with your iOS App ID
        android: '',
        default: '',
      });

      const result = await Share.share({
        title: 'App link',
        message: message,
        url: url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.error(error.message);
      // Optionally show an alert
      // Alert.alert(error.message);
    }
  };

  return (
    <>
      <ScrollView>
        <View style={{ backgroundColor: 'aqua', flexDirection: 'row' }}>
          {/* <Image source={caplogimg} style={{ width: 50, height: 50, marginLeft: 5 }} /> */}
          {/* <Image source={loimg} style={{ width:230, height: 30, marginLeft: 5, marginTop: 10 }} /> */}
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('texts')}>
            <Text style={styles.menuItemText}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('buttons')}>
            <Text style={styles.menuItemText}>Buttons</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('dropdowns')}>
            <Text style={styles.menuItemText}>Dropdowns</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('camerascreen')}>
            <Text style={styles.menuItemText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('permissionspage')}>
            <Text style={styles.menuItemText}>Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={onShare}>
            <Text style={styles.menuItemText}>Share App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={opensett}>
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 30,
    marginTop: 20,
    marginLeft: 30
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    // paddingVertical: 7,
    flexDirection: "row",
    marginTop: 5
  },
  menuItemText: {
    fontSize: 20,
    color: 'black',
    marginTop: 5
  },
  imgstyle: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginLeft: -20
  }
});

export default LeftMenu;
