import { View, TextInput, StyleSheet } from 'react-native'
import React, { FC, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';



interface Marker {
  latitude: number
  longitude: number
}



const Route:FC = () => {

  

  const getInitialState = () => {
    return {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }
  const [state, setState] = useState<any>({getInitialState})
  const [currentMarker,setCurrentMarker] = useState<Marker>({
    latitude:37.78825,
    longitude:-122.4324
  })

  const [currentLocation, setCurrentLocation] = useState<Marker>({
    latitude:37.785671507680085,
    longitude:-122.40639332681894 //Find a function to get current location coordinates
  })
  
  const onRegionChange = (region:any) => {
    setState({ region });
  }


  return (
    <View style={styles.container}>
      <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       region={state.region}
       style={styles.map}
       initialRegion={getInitialState().region}
       showsUserLocation={true}
       followsUserLocation={true}
       onPress={(e) => {
        setCurrentMarker({ latitude: e.nativeEvent.coordinate.latitude,
                          longitude: e.nativeEvent.coordinate.longitude})

        //console.log(e.nativeEvent.coordinate)
    }}
     >
      <MapViewDirections
          origin={currentLocation}
          destination={currentMarker}
          apikey={'AIzaSyAbua8JdM1P1R-TurgVAbzviUvyUQXEO64'} // insert your API Key here
          strokeWidth={4}
          strokeColor="#111111"
        />
      <Marker
        // draggable
        coordinate={currentMarker}
        // onDragEnd={(e) => {
        //   setCurrentMarker({ latitude: e.nativeEvent.coordinate.latitude,
        //                     longitude: e.nativeEvent.coordinate.longitude})
        //   console.log(e.nativeEvent.coordinate)
        // }}
        //key={index}
        //coordinate={currentMarker}
        //title={marker.title}
        //description={marker.description}
      />
     </MapView>
     <View style={{ position: 'absolute', top: '7%', width: '95%' }}>

        <GooglePlacesAutocomplete
          placeholder='Search'
          fetchDetails={true} //To get the details
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            //console.log(data, details); To see Logs on the terminal
            
            onRegionChange({latitude: details?.geometry.location.lat,
              longitude: details?.geometry.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,})
              if(details!=undefined)
              setCurrentMarker({latitude:details.geometry.location.lat,longitude:details.geometry.location.lng})
          }}
          query={{
            key: 'AIzaSyAbua8JdM1P1R-TurgVAbzviUvyUQXEO64',
            language: 'en',
            components: 'country:us',
          }}
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

//The very first search bar
{/* <TextInput
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
/> */}