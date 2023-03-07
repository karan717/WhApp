import { View, TextInput, StyleSheet, TouchableHighlight, Text } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import firestore from '@react-native-firebase/firestore'
import axios from 'axios'

//Contexts that are used as a global parameters
import { useUploadPath } from './useUploadPath';
import { useProfile } from '../profile/useProfile';
import { usePath } from '../../../hooks/usePath';
import { useElevation } from '../../../hooks/useElevation';
import { useStates } from '../../../hooks/useStates';
import { useCharger } from '../../../hooks/useCharger';
import Button from '../../ui/Button';

interface Marker {
  latitude: number
  longitude: number
}


//Important link on Firestore usage for React Native
//https://rnfirebase.io/firestore/usage



const Route:FC = () => {
  const {profile} = useProfile()
  const {path,setPath} = usePath();
  const {elevation,setElevation} = useElevation();
  const {markerA,markerB,currentLocation,setMarkerA,
  setMarkerB,setCurrentLocation} = useStates();
  const {chargers,setChargers} = useCharger();

  const {isLoading, isSuccess,uploadPath} = useUploadPath()

  const getElevation = async (args: any) => {
    // Coordinates of locations to String like: lat%2Clong%7Clat%2Clong%7C...
    //Elevation API works this way, max points is 512
    console.log('Coordinates length:')
    console.log(Object.keys(args.coordinates).length)
    let pathString = Array.prototype.map.call(args.coordinates, s=> s.latitude+"%2C"+s.longitude).join("%7C");
    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/elevation/json?locations=${pathString}&key=AIzaSyAbua8JdM1P1R-TurgVAbzviUvyUQXEO64`,
      headers: { }
    };
    
    axios(config)
    .then(function (response:any) {
      //console.log(JSON.stringify(response.data.results));
      setElevation(response.data.results)
      uploadPath(response.data.results,profile.docId)
      //console.log('Path:',path)
      //console.log('Elevation:',elevation)
    })
    .catch(function (error:any) {
      console.log(error);
    });
  }

  

  const getInitialState = () => {
    return {
      region: {
        latitude: 35.7741349,
        longitude: -78.6776105,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }
  const [state, setState] = useState<any>({getInitialState})
  const [currentMarker,setCurrentMarker] = useState<Marker>({
    latitude:35.7741349,
    longitude:-78.6776105
  })

  //Find a function to get current location coordinates
  // const [currentLocation, setCurrentLocation] = useState<Marker>({
  //   latitude:35.7741349,
  //   longitude:-78.6776105 
  // })
  
  const onRegionChange = (region:any) => {
    setState({ region });
  }

  //To see changes in the document when it is updated in Firebase
  useEffect(() => {
    const fetchChargers = async () => {
      var arr:any = [];
      await firestore().collection('chargers').get()
      .then(querySnapshot => {
        //console.log('Total users: ', querySnapshot.size);
    
        querySnapshot.forEach(documentSnapshot => {
          //console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
          arr.push({data:documentSnapshot.data(),key:documentSnapshot.id})
        });
      });
      setChargers(arr)
    }
    const subscriber = firestore()
      .collection('predictedSoC')
      .doc(profile._id)
      .onSnapshot(documentSnapshot => {
        console.log('User data: ', documentSnapshot.data());
      });
      setCurrentLocation({
        latitude:35.7741349,
        longitude:-78.6776105 
      })
      //console.log('Chargers are',chargers)
      fetchChargers()
      //chargers.forEach((element:any)=>console.log(element.location))
      
      if(chargers===''){
        fetchChargers().catch(console.error);
        //console.log(chargers)
      }
      //console.log(profile._id)

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);


  return (
    <View style={styles.container}>
      <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       region={state.region}
       style={styles.map}
       initialRegion={getInitialState().region}
       showsUserLocation={true}
       followsUserLocation={true}
       onUserLocationChange={(args)=>{
      if((typeof args.nativeEvent.coordinate?.latitude) === 'number'){
        setCurrentLocation({
          latitude:args.nativeEvent.coordinate?.latitude,
          longitude:args.nativeEvent.coordinate?.longitude
        })
      }
      }}
       onPress={(e) => {
        setMarkerB({ latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude})
        setMarkerA(currentLocation)
        console.log('MarkerA',markerA)
      
        //console.log(e.nativeEvent.coordinate)
    }}
     >
      { markerB!=='' &&
      <MapViewDirections
          origin={markerA}
          destination={markerB}
          apikey={'AIzaSyAbua8JdM1P1R-TurgVAbzviUvyUQXEO64'} // insert your API Key here
          strokeWidth={0.1}
          strokeColor="#F0F0F0"
          mode = "WALKING"
          precision='low' //high, precision of the drawn polyline
          onReady={(args) =>{ getElevation(args); setPath(args.coordinates);}}
        />
      }
      {path!==''&&
        	<Polyline
          coordinates={path}
          strokeColor="#111111" // fallback for when `strokeColors` is not supported by the map-provider
          // strokeColors={[
          //   '#7F0000',
          //   '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
          //   '#B24112',
          //   '#E5845C',
          //   '#238C23',
          //   '#7F0000',
          //   '#7F0000'
          // ]}
          strokeWidth={6}
        />
      }
      {markerB!=='' &&
      <Marker
        // draggable
        coordinate={markerB}
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
      }

      {chargers!=='' && 
      chargers.map((item:any) =>(
        <Marker 
          coordinate={{
            latitude:item.data.location.lat,
            longitude:item.data.location.lng
          }}
          pinColor={item.data.state==='1'?'#00FF00':'#FF0000'}
          onPress={()=>console.log('Pressed Station')}
        />
      ))}


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
              setMarkerB({latitude:details.geometry.location.lat,longitude:details.geometry.location.lng})
          }}
          query={{
            key: 'AIzaSyAbua8JdM1P1R-TurgVAbzviUvyUQXEO64',
            language: 'en',
            components: 'country:us',
          }}
        />
        
      </View>
      {/* <Button
        title={'Change Current Loc'}
        onPress={() => {
          setCurrentLocation({
            latitude:34.7741349,
            longitude:-78.6776105 
          })
          console.log(currentLocation)
          console.log(markerA)
        } } 
      />        */}
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