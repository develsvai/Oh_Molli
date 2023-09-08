"use client"

import React from "react"
import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/integration/react'
import store, {persistor} from './store'
import { SessionProvider } from "next-auth/react"
import { SSRProvider } from '@react-aria/ssr';


export function ReduxProvider({children}) {
    
    return(
        <SSRProvider>
            <Provider store={store}> 
                <PersistGate loading={null} persistor={persistor}>
                        {children}
                </PersistGate>
            </Provider>
        </SSRProvider>
    );
}

