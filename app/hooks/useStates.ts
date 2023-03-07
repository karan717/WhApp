import React, { useContext } from 'react'
import { StatesContext } from '../providers/StatesProvider'

export const useStates = () => useContext(StatesContext)