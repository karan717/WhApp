import React, { useContext } from 'react'
import { ChargerContext } from '../providers/ChargerProvider'

export const useCharger = () => useContext(ChargerContext)