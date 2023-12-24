import React, {
  useState,
  useEffect,
} from 'react';
import {
SafeAreaView,
StyleSheet,
ScrollView,
View,
Text,
StatusBar,
NativeModules,
NativeEventEmitter,
Button,
Platform,
PermissionsAndroid,
FlatList,
TouchableHighlight,
} from 'react-native';
import { stringToBytes } from "convert-string";
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreAllLogs()
import BleManager from 'react-native-ble-manager';
import Icon from 'react-native-vector-icons/FontAwesome';
const myIcon = <Icon name="rocket" size={30} color="#900" />;
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

async function connectAndPrepare(peripheral, service, characteristic,data) {
  await BleManager.connect(peripheral);
  await BleManager.retrieveServices(peripheral);
  await BleManager.startNotification(peripheral, service, characteristic);
  await BleManager.write(
    peripheral,
    service,
    characteristic,
    data
  )
    .then(() => {
      // Success code
      console.log("Writed: " + data);
    })
    .catch((error) => {
      // Failure code
      // console.log(error);
    });
    
  
}

const App = ()=>{
  const mac = "C0:26:DA:17:1F:69"
  const T_M = "C0:26:DA:0C:0E:E2"
  const service = "00001523-1212-efde-1523-785feabcd123"
  const characteristic = "00001524-1212-efde-1523-785feabcd123"
  const data = stringToBytes("        ");
  
  data[0] = 0x51
  data[1] = 0x26
  data[2] = 0x00
  data[3] = 0x00
  data[4] = 0x00
  data[5] = 0x00
  data[6] = 0xA3
  // data[7] = 0x3D
  data[7] = (data[0]+data[1]+data[2]+data[3]+data[4]+data[5]+data[6]) % 256
  console.log(data[7])
  useEffect(()=>{
    const stoperror = ()=>{
      return true
    }
    window.onerror = stoperror
    BleManager.start({showAlert: false});
    const interval = setInterval(() => {
      
      try{
        connectAndPrepare(T_M, service, characteristic,data)
      }catch(e){
        // console.log(e)
        
      }
      
    }, 5000*10000);
    bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      ({ value, peripheral, characteristic, service }) => {
        console.log(value);
        console.log((360-(104-value[2]))/10)
      }
    );
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
      clearInterval(interval)
    })
  },[])
  return(
  <View>
    <Icon name="rocket" size={30} color="#900" />
    <Button title='test' onPress={()=>connectAndPrepare(T_M, service, characteristic,data)}/>
  </View>
    )
}
export default App