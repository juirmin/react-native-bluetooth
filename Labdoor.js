import React, {
    useState,
    useEffect,
  } from 'react';
  import {
  View,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  } from 'react-native';
  import { stringToBytes } from "convert-string";
  import { LogBox } from 'react-native';
  
  LogBox.ignoreLogs(['Setting a timer']);
  LogBox.ignoreAllLogs()
  import BleManager from 'react-native-ble-manager';
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  
  async function connectAndPrepare(peripheral, service, characteristic,data) {
    await BleManager.connect(peripheral);
    await BleManager.retrieveServices(peripheral);
    await BleManager.write(
      peripheral,
      service,
      characteristic,
      data
    )
      .then(() => {
        // Success code
        BleManager.disconnect(peripheral)
      .then(() => {
        // Success code
        console.log("Disconnected");
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
      })
      .catch((error) => {
        // Failure code
        // console.log(error);
      });
      
    
  }
  
  const App = ()=>{
    const mac = "84:CC:A8:60:3E:AA"
    const service = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
    const characteristic = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
    const data = stringToBytes("    ");
    
    data[0] = 0x6F
    data[1] = 0x70
    data[2] = 0x65
    data[3] = 0x6E
    useEffect(()=>{
      const stoperror = ()=>{
        return true
      }
      window.onerror = stoperror
      BleManager.start({showAlert: false});
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
            if (result) {
              console.log("Permission is OK");
            } else {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                } else {
                  console.log("User refuse");
                }
              });
            }
        });
      } 
      return(()=>{
        console.log('mount')
      })
    },[])
    return(
    <View>
      <Button title='OPEN' onPress={()=>connectAndPrepare(mac, service, characteristic,data)}/>
    </View>
      )
  }
  export default App