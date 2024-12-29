import { Alert, PermissionsAndroid, Platform, Text, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { check, PERMISSIONS, request, requestMultiple, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee from '@notifee/react-native';

const permissions = () => {
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
    const [storagepermissions,setStoragePermission] = useState<boolean | null>(null);
    const [currentLat, setLat] = useState('')
  const [currentLong, setLong] = useState('')
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

    useEffect(() => {
        requestLocationPermission();
        requestStoragePermission();
        requestcallPermission();
      }, []);

      const requestLocationPermission = async () => {
        try {
          let permission;
          if (Platform.OS === 'ios') {
            permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          } else {
            permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
          }
          console.log("permission", permission);
    
          if (permission === RESULTS.GRANTED) {
            console.log('Location permission granted');
            setLocationPermission(true);
            // Get the location values
            getLocation();
          } else {
            console.log('Location permission denied');
            setLocationPermission(false);
          }
        } catch (err) {
          console.warn(err);
          setLocationPermission(false);
        }
        requestcallPermission()
      };

      const getLocation = () => {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            showposition(position)
          },
          (error) => {
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
      };
      const showposition = async (position: any) => {
        try {
          console.log("showposition: is called");
          const currentLat = position.coords.latitude;
          const currentLong = position.coords.longitude;
          // Store latitude and longitude in AsyncStorage
          await AsyncStorage.setItem('latitude', currentLat.toString());
          await AsyncStorage.setItem('longitude', currentLong.toString());
          if (currentLong) {
            // Fetch geocode data
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLat},${currentLong}&key=AIzaSyBUK8sY83sV1sp2T3GEyOPUln-lOlgUx94`);
            const responseJson = await response.json();
            console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
            if (responseJson.results.length > 0) {
              const result = responseJson.results[0];
              const address = result.formatted_address || '';
              const addressComponents = result.address_components;
              let city = '';
              let state = '';
              let district = '';
              let country = '';
              let countryCode = '';
              let postalCode = '';
              let knownName = '';
              let stateCode = '';
      
              addressComponents.forEach((component: any) => {
                const types = component.types;
                if (types.includes('sublocality_level_1')) {
                  city = component.long_name;
                }
                if (city == '') {
                  if (types.includes('locality')) {
                    city = component.long_name;
                  }
                }
                if (types.includes('administrative_area_level_1')) {
                  state = component.long_name;
                  stateCode = component.short_name;
                }
                if (types.includes('administrative_area_level_2')) {
                  district = component.long_name;
                }
                if (types.includes('country')) {
                  country = component.long_name;
                  countryCode = component.short_name;
                }
                if (types.includes('postal_code')) {
                  postalCode = component.long_name;
                }
                if (types.includes('point_of_interest')) {
                  knownName = component.long_name;
                }
              });
              for (const result of responseJson.results) {
                const addressComponents = result.address_components;
                // Log address components to inspect
                console.log('Address Components:', addressComponents);
        
                addressComponents.forEach((component:any) => {
                    const types = component.types;
                    if (types.includes('postal_code')) {
                      postalCode = component.long_name;
                  }
              });
              // If we found a postal code, break out of the loop
              if (postalCode) {
                  break;
              }
            }
              
              console.log('postalCode',postalCode)
    
              // Store address components in AsyncStorage
              await AsyncStorage.setItem('countryname', country);
              await AsyncStorage.setItem('countrycode', countryCode);
              await AsyncStorage.setItem('statename', state);
              await AsyncStorage.setItem('city', city);
              await AsyncStorage.setItem('zipcode', postalCode);
              console.log('postalCode',postalCode)
              await AsyncStorage.setItem('address', address);
              await AsyncStorage.setItem('districtname', district);
            }
          }
      
          // Update state after geocode fetch
          setLong(currentLong);
          setLat(currentLat);
      
        } catch (error) {
          console.error('Error in showposition:', error);
        }
      };
        //Request storage permissions
  async function requestcallPermission() {
    if (Platform.OS === 'android') {
      try {
        const result = await requestMultiple([
          PERMISSIONS.ANDROID.RECORD_AUDIO,
          PERMISSIONS.ANDROID.CALL_PHONE,
          PERMISSIONS.ANDROID.READ_PHONE_STATE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]);
        console.log('result',result);
      } catch (err) {
        console.warn(err);
      }
    };
    getLocation();
    requestCameraPermission();
  };
  //camera permissions
  async function requestCameraPermission() {
    try {
      let permission;
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.CAMERA;
      } else {
        permission = PERMISSIONS.ANDROID.CAMERA;
      }
      // Check current permission status
      const status = await check(permission);
      if (status === RESULTS.GRANTED) {
        console.log('You already have camera permission');
        setCameraPermission(true);
      } else {
        // Request permission
        const result = await request(permission, {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
        //   buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });

        if (result === RESULTS.GRANTED) {
          console.log('You can use the camera');
          setCameraPermission(true);
        } else {
          console.log('Camera permission denied');
          setCameraPermission(false);
        }
      }
    } catch (err) {
      console.warn(err);
      setCameraPermission(false);
    }
    requestNotificationPermission()

  }
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      // For Android (API 33 and above)
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "Notification Permission",
          message: "This app needs access to send notifications.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission granted");
      } else {
        console.log("Notification permission denied");
      }
    } else if (Platform.OS === 'ios') {
      // For iOS
      const authStatus = await notifee.requestPermission(); 
    }
    requestMicrophonePermission()
  }
  async function requestMicrophonePermission() {
    if (Platform.OS === 'ios') {
      try {
        // Request permission for the iOS microphone
        const result = await request(PERMISSIONS.IOS.MICROPHONE);
        
        // Check if permission is granted, denied, or blocked
        if (result === RESULTS.GRANTED) {
          console.log('Microphone permission granted on iOS');
          // Proceed with functionality like starting the audio recording
        } else if (result === RESULTS.DENIED) {
          console.log('Microphone permission denied on iOS');
          Alert.alert('Permission Denied', 'You need to grant microphone access to record audio.');
        } else if (result === RESULTS.BLOCKED) {
          console.log('Microphone permission blocked on iOS');
         // Alert.alert(
          //   'Permission Blocked',
          //   'Please enable microphone permission in settings.',
          //   [
          //     {
          //       text: 'Go to Settings',
          //       onPress: () => Linking.openSettings(),
          //     },
          //     { text: 'Cancel' },
          //   ]
          // );
        }
      } catch (err) {
        console.warn('Error requesting microphone permission on iOS:', err);
      }
    }
  }
  async function requestStoragePermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to save files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
          setStoragePermission(true)
        } else {
          console.log('Storage permission denied');
          setStoragePermission(false)
        }
      } catch (err) {
        console.warn(err);
        setStoragePermission(false)

      }
    } else if (Platform.OS === 'ios') {
      // For iOS, you typically don't need to request permissions at runtime for file access.
      // However, check the `react-native-permissions` documentation for iOS-specific permissions if needed.
    }
    requestcallPermission();
  }
    return (
      <View>
        <Text>permissions</Text>
      </View>
    )
}

export default permissions