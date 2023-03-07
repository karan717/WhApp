import React, {createContext, FC, useMemo, useState} from 'react'


interface IContext {
    elevation: any | null
    setElevation: React.Dispatch<any>
}

interface Props {
    children: React.ReactNode;
}




export const ElevationContext = createContext<IContext>({} as IContext)

export const ElevationProvider: FC<Props> =  ({children})  => {
    const [elevation, setElevation] = useState<any>('')

    const value = useMemo(() =>({
        elevation, setElevation
    }),[elevation])

    return( <ElevationContext.Provider value = {value}>
        {children}
         </ElevationContext.Provider>
    )

}