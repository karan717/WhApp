import React, { useContext } from 'react'
import { RouteInfoContext } from '../providers/RouteInfoProvider'

export const useRouteInfo = () => useContext(RouteInfoContext)