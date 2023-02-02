import { View, TextInput, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const Route:FC = () => {
  return (
    <View style={styles.container}>
      <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       region={{
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
     >
     </MapView>
     <View style={{ position: 'absolute', top: '5%', width: '95%' }}>
        <TextInput
          style={{
            borderRadius: 10,
            margin: 10,
            color: '#000',
            borderColor: '#666',
            backgroundColor: '#FFF',
            borderWidth: 1,
            height: 45,
            paddingHorizontal: 10,
            fontSize: 18,
          }}
          placeholder={'Search'}
          placeholderTextColor={'#666'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 800,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  theme: {
    height: 100,
    width: 400,
  }
 });

export default Route