import React, { useContext } from 'react'
import { SoCContext } from '../providers/SoCProvider'


export const useSoC = () => useContext(SoCContext)