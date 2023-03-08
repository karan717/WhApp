import React, {createContext, FC, useMemo, useState} from 'react'


interface IContext {
    distance: any | null
    duration: any | null
    finalSoC: any | null
    setDistance:React.Dispatch<any>
    setDuration:React.Dispatch<any>
    setFinalSoC:React.Dispatch<any>
}

interface Props {
    children: React.ReactNode;
}




export const RouteInfoContext = createContext<IContext>({} as IContext)

export const RouteInfoProvider: FC<Props> =  ({children})  => {
    const [distance,setDistance] = useState<any>('')
    const [duration,setDuration] = useState<any>('')
    const [finalSoC,setFinalSoC] = useState<any>('')
    const value = useMemo(() =>({
        distance,duration,finalSoC,setDistance,setDuration,setFinalSoC
    }),[distance,duration,finalSoC])

    return( <RouteInfoContext.Provider value = {value}>
        {children}
         </RouteInfoContext.Provider>
    )

}