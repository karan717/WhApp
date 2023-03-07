import React, { useContext } from 'react'
import { ElevationContext } from '../providers/ElevationProvider'

export const useElevation = () => useContext(ElevationContext)