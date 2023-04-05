import { View, TextInput, StyleSheet, TouchableHighlight, Text, AccessibilityInfo, Pressable, TouchableOpacity } from 'react-native'
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

import WorkingItems from './WorkingItems';

interface Marker {
  latitude: number
  longitude: number
}


//Important link on Firestore usage for React Native
//https://rnfirebase.io/firestore/usage



const Route:FC = () => {
  //General Hooks
  const [chargerPressed,setChargerPressed] = useState<boolean>(false);
  const [showMarker,setShowMarker] = useState<boolean>(false);
  const [markerBRef,setMarkerBRef] = useState<any>('');
  const [chargerDetails, setChargerDetails] = useState<any>();
  const [placeDetails, setPlaceDetails] = useState<any>();
  const [detailState, setDetailState] = useState<string>('Hide'); //Dropped Pin, Place, Charger
  const [showPolyline, setShowPolyline] = useState<boolean>(false);
  const googlePlaceAutoCompleteRef = useRef<any>(null)
  //Custom hooks
  const {profile} = useProfile()
  const {path,setPath} = usePath();
  const {elevation,setElevation} = useElevation();
  const {markerA,markerB,currentLocation,setMarkerA,
  setMarkerB,setCurrentLocation} = useStates();
  const {chargers,setChargers} = useCharger();
  const {distance,duration,finalSoC,setDistance,setDuration,setFinalSoC} = useRouteInfo();
  const {isLoading, isSuccess,uploadPath} = useUploadPath()
  
  //This Route page has 3 states:
  //default, infoState: after marker or place pressed, routeState: after pressing directions, show the route
  const [pageState,setPageState] = useState<string>('default')
  
  //BottomSheet hooks and functions
  // ref for Bottom Sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  // variables for points of snap of Bottom Sheet
  const snapPoints = useMemo(() => ['15%', '25%','60%'], []);

  // callbacks for Bottom Sheet
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // Close or Open Bottom Sheet long and short (25% and 10%)
  const handleClose = () => bottomSheetRef.current!==null && bottomSheetRef.current.close()
  const handleOpenLong = () => bottomSheetRef.current!==null && bottomSheetRef.current.snapToIndex(1)
  const handleOpenShort = () => bottomSheetRef.current!==null && bottomSheetRef.current.snapToIndex(0)

  //Get details about the chosen charger from the Database
  const getChargerDetails = async (chargerID: string) => {
    firestore()
    .collection('chargers_details')
    .doc(chargerID)
    .get()
    .then(documentSnapshot => {
      console.log('Details exists: ', documentSnapshot.exists);

      if (documentSnapshot.exists) {
        console.log('Charger details: ', documentSnapshot.data());
        setDetailState('Charger')
        setChargerDetails(documentSnapshot.data())
      }
    });

  }
  const getPlaceDetails = async (placeID: string) => {
    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=name%2Cformatted_address%2Copening_hours%2Cformatted_phone_number&key=AIzaSyAbua8JdM1P1R-TurgVAbzviUvyUQXEO64`,
      headers: { }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      setDetailState('Place')
      setPlaceDetails(response.data.result)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

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
              setDetailState('Hide')

            }else{
              setShowMarker(true)
              setPageState('infoState')
              handleOpenLong()
              setDetailState('Dropped Pin')
            }
            if(chargerPressed){
              setChargerPressed(false)
              setShowMarker(false)
              setPageState('default')
              handleClose()
              setDetailState('Hide')

            }
          }
          setShowPolyline(false)
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
          getPlaceDetails(e.nativeEvent.placeId)
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
            setShowPolyline(true)
          
          }}
        />
      }
      {path!=='' && pageState==='routeState' && showPolyline &&
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
          title={''}
          description={'Charger'}
          key={item.key}
          coordinate={{
            latitude:parseFloat(item.data.location.lat),
            longitude:parseFloat(item.data.location.lng)
          }}
          pinColor={item.data.state==='1'?'#299617':'#FF0000'}
          onPress={(e)=>{        
            setMarkerB({ latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude})
            setMarkerA(currentLocation)
            setShowMarker(false)
            setChargerPressed(true)
            setPageState('infoState')
            handleOpenLong()
            console.log('onPressCharger')
            getChargerDetails(item.data._id)
          }}
            
        >
        <Entypo name={'battery'} 
            color={item.data.state==='1'?'#1260CC':'#FF0000'}
            size={40}
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
          textInputProps={{
            placeholderTextColor: '#777777',
            returnKeyType: "search",
            clearButtonMode: 'never'
          }}

          styles={{
            textInput: {
              height: 45,
              color: '#222222',
              fontSize: 17,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}

          ref={googlePlaceAutoCompleteRef}
          placeholder='Search'
          fetchDetails={true} //To get the details
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            //console.log(data, details); To see Logs on the terminal
            
            onRegionChange({latitude: details?.geometry.location.lat,
              longitude: details?.geometry.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,})

              if(details!=undefined){
              setMarkerB({latitude:details.geometry.location.lat,longitude:details.geometry.location.lng})
              console.log(details)
              setDetailState('Place')
              setPlaceDetails(details)
              }
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
          renderRightButton={()=><TouchableOpacity 
          onPress={()=>googlePlaceAutoCompleteRef.current!==null && googlePlaceAutoCompleteRef.current.clear()}
          style={styles.containerClearButton}>
            <Entypo name={'erase'} 
            color={'#777777'}
            size={25}
            />
          </TouchableOpacity>}
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
                                  //Address and cost
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
        >
          { pageState==='infoState' &&
            <View style={styles.detailsContainer}>
              {detailState==='Dropped Pin' &&
              <>
                <Text style={styles.nameText}>
                  {'Dropped Pin'}
                </Text>
                <Text style={styles.statusText}>
                  {markerB.latitude+","+markerB.longitude}
                </Text>
              </>
              }
              {detailState==='Charger' && chargerDetails!==undefined && 
              <>
                <Text style={styles.nameText}>
                  {chargerDetails.name!==undefined?chargerDetails.name:'No Charger Name'}
                </Text>

                {chargerDetails.opening_hours!==undefined &&
                <View className='flex-row'>
                  <Text style={{color: `${chargerDetails.opening_hours.open_now?'#299617':'#FF0000'}`, fontSize:16}}>
                  {chargerDetails.opening_hours.open_now?'Open':'Closed'}
                  </Text>
                </View>
                }

                <View className='flex-row'>
                  <Text style={styles.statusText}>
                    {'Charger: '}
                  </Text>
                  <Entypo name={'battery'} 
                      color={chargerDetails.state==='1'?'#299617':'#FF0000'}
                      size={16}
                  />
                  
                  <Text style={{color: `${chargerDetails.state==='1'?'#299617':'#FF0000'}`, fontSize:16}}>
                  {chargerDetails.state!==undefined && chargerDetails.state==='1'?' Available':' Busy'}
                  </Text>
                </View>
              </>
              }

              {detailState==='Place' && placeDetails!==undefined && 
              <>
                <Text style={styles.nameText}>
                  {placeDetails.name!==undefined?placeDetails.name:'No Place Name'}
                </Text>
                {placeDetails.opening_hours!==undefined &&
                <View className='flex-row'>
                  <Text style={{color: `${placeDetails.opening_hours.open_now?'#299617':'#FF0000'}`}}>
                  {placeDetails.opening_hours.open_now?'Open':'Closed'}
                  </Text>
                </View>
                }
              </>
              }
              
              <View style={styles.buttonContainer}>
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
              </View>
              {detailState==='Charger' && chargerDetails!==undefined && chargerDetails.opening_hours!==undefined && 
              <>
                <Text style={styles.workingHoursText}>
                  {'Address:'+' '+chargerDetails.formatted_address}
                </Text>
              </>
              }

              {detailState==='Charger' && chargerDetails!==undefined && chargerDetails.opening_hours!==undefined && 
              <>
                <Text style={styles.workingHoursText}>
                  {'Working Hours:'}
                </Text>
                <View style={styles.workingHourContainer}>
                    {chargerDetails.opening_hours.weekday_text.map((days:any)=>{
                      const inpArray = days.split("y");
                      return <WorkingItems key={inpArray[0]+'y'} input={inpArray}/>
                    })}
                </View>
              </>
              }

            {detailState==='Place' && placeDetails!==undefined && placeDetails.opening_hours!==undefined && 
              <>
              <Text style={styles.workingHoursText}>
                {'Address:'+' '+placeDetails.formatted_address}
              </Text>
              </>
              }

              {detailState==='Place' && placeDetails!==undefined && placeDetails.opening_hours!==undefined && 
              <>
                <Text style={styles.workingHoursText}>
                  {'Working Hours:'}
                </Text>
                <View style={styles.workingHourContainer}>
                    {placeDetails.opening_hours.weekday_text.map((days:any)=>{
                      const inpArray = days.split("y");
                      return <WorkingItems key={inpArray[0]+'y'} input={inpArray}/>
                    })}
                </View>
              </>
              }

            </View>
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
  },
  detailsContainer: {
    paddingHorizontal:15,
  },
  buttonContainer: {
    paddingHorizontal:70,
  },
  nameText: {
    fontSize: 22,
    fontWeight:"400",
  },
  workingHoursText: {
    fontSize: 17,
    fontWeight:"400",
    marginBottom:10,
  },
  workingHourContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' 
  },
  workingHourItem1:{
    width: '50%',
    paddingLeft:30,
  },
  workingHourItem2:{
    width: '50%',
  },
  statusText:{
    fontSize: 16,
  },
  containerClearButton:{
    ...StyleSheet.absoluteFillObject,
    alignItems:'flex-end',
    marginTop:10,
    marginRight:8,
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