import React, { useContext } from 'react'
import { BLEContext } from '../providers/BLEProvider'

export const useBLE = () => useContext(BLEContext)