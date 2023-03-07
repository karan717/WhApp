import React, { useContext } from 'react'
import { PathContext } from '../providers/PathProvider'

export const usePath = () => useContext(PathContext)