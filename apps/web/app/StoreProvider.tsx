"use client"
import { store } from "../store/store"
import React, { useState } from "react"
import { Provider } from "react-redux"




export default function StoreProvider({ children }: { children: React.ReactNode }) {

    return (

        <Provider store={store} >

            {children}
        </Provider>

    )
}  