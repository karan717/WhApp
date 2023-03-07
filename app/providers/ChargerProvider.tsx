import React, {createContext, FC, useMemo, useState} from 'react'


interface IContext {
    chargers: any | null
    setChargers: React.Dispatch<any>
}

interface Props {
    children: React.ReactNode;
}




export const ChargerContext = createContext<IContext>({} as IContext)

export const ChargerProvider: FC<Props> =  ({children})  => {
    const [chargers, setChargers] = useState<any>('')

    const value = useMemo(() =>({
        chargers, setChargers
    }),[chargers])

    return( <ChargerContext.Provider value = {value}>
        {children}
         </ChargerContext.Provider>
    )

}