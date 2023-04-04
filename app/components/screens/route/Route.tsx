import { View, TextInput, StyleSheet, TouchableHighlight, Text, AccessibilityInfo } from 'react-native'
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MapView, { Callout, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import firestore from '@react-native-firebase/firestore'
import axios from 'axios'

import Entypo from 'react-native-vector-icons/Entypo'

//Contexts that are used as a global parameters
import { useUploadPath } from './useUploadPath';
import { useProfile } from '../profile/useProfile';
import { usePath } from '../../../hooks/usePath';
import { useElevation } from '../../../hooks/useElevation';
import { useStates } from '../../../hooks/useStates';
import { useCharger } from '../../../hooks/useCharger';
import Button from '../../ui/Button';
import { useRouteInfo } from '../../../hooks/useRouteInfo';
import BottomSheet from "@gorhom/bottom-sheet"

interface Marker {
  latitude: number
  longitude: number
}


//Important link on Firestore usage for React Native
//https://rnfirebase.io/firestore/usage



const Route:FC = () => {
  const [chargerPressed,setChargerPressed] = useState<boolean>(false)
  const [showMarker,setShowMarker] = useState<boolean>(false)
  const [markerBRef,setMarkerBRef] = useState<any>('');
  const {profile} = useProfile()
  const {path,setPath} = usePath();
  const {elevation,setElevation} = useElevation();
  const {markerA,markerB,currentLocation,setMarkerA,
  setMarkerB,setCurrentLocation} = useStates();
  const {chargers,setChargers} = useCharger();
  const {distance,duration,finalSoC,setDistance,setDuration,setFinalSoC} = useRouteInfo();
  const {isLoading, isSuccess,uploadPath} = useUploadPath()
  
  //it has 3 states:
  //default, infoState: after marker or place pressed, routeState: after pressing directions, show the route
  const [pageState,setPageState] = useState<string>('default')
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables for points of snap
  const snapPoints = useMemo(() => ['15%', '25%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // Close or Open Bottom Sheet long and short (25% and 10%)
  const handleClose = () => bottomSheetRef.current!==null && bottomSheetRef.current.close()
  const handleOpenLong = () => bottomSheetRef.current!==null && bottomSheetRef.current.snapToIndex(1)
  const handleOpenShort = () => bottomSheetRef.current!==null && bottomSheetRef.current.snapToIndex(0)


  const getElevation = async (args: any) => {
    // Coordinates of locations to String like: lat%2Clong%7Clat%2Clong%7C...
    //Elevation API works this way, max points is 512
    console.log('Coordinates length:')
    //console.log(args)
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
        console.log('User data: ', documentSnapshot.data()?.points[documentSnapshot.data()?.points.length-1].SoC);
        //setFinalSoC(documentSnapshot.data()?.points[documentSnapshot.data()?.points.length-1].SoC)
        documentSnapshot.data()?.points[documentSnapshot.data()?.points.length-1].SoC!==undefined && setFinalSoC(Number((documentSnapshot.data()?.points[documentSnapshot.data()?.points.length-1].SoC).toFixed(1)))
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
      if(markerBRef!==''&&markerBRef!==null){
        markerBRef.hideCallout()
        markerBRef.showCallout()
      }
      console.log('call effect Route')
      //console.log(profile._id)

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [markerBRef,distance,profile]);


  return (
    <View style={styles.container}>
      <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       //region={state.region}
       style={styles.map}
       initialRegion={{
        latitude:currentLocation.latitude,
        longitude:currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
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

          // let chrgMatch = chargers.map((item:any)=>{
          //   let matching = parseFloat(item.data.location.lat)===e.nativeEvent.coordinate.latitude && parseFloat(item.data.location.lng)===e.nativeEvent.coordinate.longitude;
          //   return matching;
          // })
          // console.log('Old Match',chrgMatch)

          // See if we pressed on Charger or the empty space around.
          let matchCharger = chargers.some((item:any)=>{
            return parseFloat(item.data.location.lat)===e.nativeEvent.coordinate.latitude && parseFloat(item.data.location.lng)===e.nativeEvent.coordinate.longitude;
          })

          if(!matchCharger){
            if(showMarker){
              setShowMarker(false)
              setPageState('default')
              handleClose()

            }else{
              setShowMarker(true)
              setPageState('infoState')
              handleOpenLong()
            }
            if(chargerPressed){
              setChargerPressed(false)
              setShowMarker(false)
              setPageState('default')
              handleClose()

            }
          }
          console.log('OnPress')
          
    }}
    onPoiClick={
      (e) => {
        setMarkerB({ latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude})
          //console.log(e.nativeEvent)
          setShowMarker(true)
          setChargerPressed(false)
          setPageState('infoState')
          handleOpenLong()
      }
    }
     >
      { markerB!=='' && pageState==='routeState' &&
      <MapViewDirections
          origin={markerA}
          destination={markerB}
          apikey={'AIzaSyAbua8JdM1P1R-TurgVAbzviUvyUQXEO64'} // insert your API Key here
          strokeWidth={0.1}
          strokeColor="#F0F0F0"
          mode = "WALKING"
          precision='low' //high, precision of the drawn polyline
          onReady={(args) =>{ getElevation(args); setPath(args.coordinates);
            setDistance(Number((args.distance*0.621371).toFixed(1))) // km to mile
            setDuration(Number((args.duration).toFixed(1)))
            setFinalSoC(47)
            if(markerBRef!==''&&markerBRef!==null){
              markerBRef.showCallout()
            }
          
          }}
        />
      }
      {path!=='' && pageState==='routeState' && 
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
          strokeWidth={5}
        />
      }
      {markerB!=='' && showMarker && !chargerPressed &&
      <Marker
        //title={`${distance} mi., ${duration} min.`}
        //description={duration+`${finalSoC}% battery remains`}
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
        ref={setMarkerBRef}
      >
        {/* <Callout tooltip={true}>

          <View style={styles.infoWindow}>       
          <Text style={styles.infoText}>{distance} mi, {duration}min away</Text>
          <Text style={styles.infoText}>{finalSoC}% battery remains</Text>
          </View>

          </Callout> */}

      </Marker>
      }
      {/*Info window: https://github.com/react-native-maps/react-native-maps/issues/3267*/}
      {chargers!=='' && 
      chargers.map((item:any) =>(
        <Marker 
          title={item.data.name}
          description={''}
          key={item.key}
          coordinate={{
            latitude:parseFloat(item.data.location.lat),
            longitude:parseFloat(item.data.location.lng)
          }}
          pinColor={item.data.state==='1'?'#00FF00':'#FF0000'}
          onPress={(e)=>{        
            setMarkerB({ latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude})
            setMarkerA(currentLocation)
            setShowMarker(false)
            setChargerPressed(true)
            setPageState('infoState')
            handleOpenLong()
            console.log('onPressCharger')
          }}
            
        >
        <Entypo name={'power-plug'} 
            color={item.data.state==='1'?'#00FF00':'#FF0000'}
            size={30}
        />
          
{/*           
           <Callout tooltip={true}>

            <View style={styles.infoWindow}>       
            <Text style={styles.infoText}>{distance} mi, {duration}min away</Text>
            <Text style={styles.infoText}>{finalSoC}% battery remains</Text>
            </View>
            
          </Callout> */}
        </Marker>
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
              setShowMarker(true)
              setChargerPressed(false)
              setPageState('infoState')
              handleOpenLong()
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
      { profile._id!==undefined && //This line will remove errors with snapPoints being undefined
                                  // At first render, all states are null or undefined until they initialize,  we should wait for states,
                                  // for example profile._id is one of the state that will initialize at first
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
        >
          { pageState==='infoState' &&
            <Button
            title={'Directions'}
            onPress={() => {
              if(pageState==='infoState'){
              setPageState('routeState')
              handleOpenShort()
              }else{
                setPageState('infoState')
              }
            } } 
            />  
          }
          <Text style={styles.text}>
          {pageState ==='routeState' && `${finalSoC}% battery remains \n ${distance} mi., ${duration} min.`}

          </Text>
        </BottomSheet>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  theme: {
    height: 100,
    width: 400,
  },
  infoWindow: {
    borderRadius: 10,
    margin: 2,
    color: '#000',
    borderColor: '#666',
    backgroundColor: '#FFF',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize:16,
    padding:5,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    margin: 3,
    paddingBottom:80,
    color: "#1F2937",
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