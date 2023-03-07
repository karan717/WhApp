import React, {createContext, FC, useMemo, useState} from 'react'


interface IContext {
    path: any | null
    setPath: React.Dispatch<any>
}

interface Props {
    children: React.ReactNode;
}




export const PathContext = createContext<IContext>({} as IContext)

export const PathProvider: FC<Props> =  ({children})  => {
    const [path, setPath] = useState<any>('')

    const value = useMemo(() =>({
        path, setPath
    }),[path])

    return( <PathContext.Provider value = {value}>
        {children}
         </PathContext.Provider>
    )

}