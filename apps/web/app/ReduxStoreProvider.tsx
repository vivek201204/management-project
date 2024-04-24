"use client"
import React from 'react'
import {Provider} from "react-redux"
import { reduxStore } from '../store/ReduxStore/reduxStore'

function ReduxStoreProvider({children} : {children : React.ReactNode}) {
  return (
    <Provider store={reduxStore}> {children}</Provider>
    
  )
}

export default ReduxStoreProvider