import React, {createContext, FC, useMemo, useState} from 'react'


interface IContext {
    PredictedSoC: any | null
    setPredictedSoC: React.Dispatch<any>
}

interface Props {
    children: React.ReactNode;
}

//provides SoC over the path


export const SoCContext = createContext<IContext>({} as IContext)

export const SoCProvider: FC<Props> =  ({children})  => {
    const [PredictedSoC, setPredictedSoC] = useState<any>('')

    const value = useMemo(() =>({
        PredictedSoC, setPredictedSoC
    }),[PredictedSoC])

    return( <SoCContext.Provider value = {value}>
        {children}
         </SoCContext.Provider>
    )

}