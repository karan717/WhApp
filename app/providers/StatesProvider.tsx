//States of the Marker A, Marker B and Current Location
import React, {createContext, FC, useMemo, useState} from 'react'


interface IContext {
    markerA: any
    setMarkerA: React.Dispatch<any>
    markerB: any
    setMarkerB: React.Dispatch<any>
    currentLocation: any
    setCurrentLocation: React.Dispatch<any>
}

interface Props {
    children: React.ReactNode;
}




export const StatesContext = createContext<IContext>({} as IContext)

export const StatesProvider: FC<Props> =  ({children})  => {
    const[markerA,setMarkerA] = useState<any>('')
    const[markerB,setMarkerB] = useState<any>('')
    const[currentLocation,setCurrentLocation] = useState<any>('')

    const value = useMemo(() =>({
        markerA,markerB,currentLocation,setMarkerA,setMarkerB,setCurrentLocation
    }),[markerA,markerB,currentLocation])

    return( <StatesContext.Provider value = {value}>
        {children}
         </StatesContext.Provider>
    )

}