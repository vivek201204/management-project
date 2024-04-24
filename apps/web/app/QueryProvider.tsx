"use client"
import {QueryClient , QueryClientProvider} from "@tanstack/react-query"
import React , {useState} from "react";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"

export default function QueryProvider ({children} : {children  : React.ReactNode}){
    const [queryClient] = useState(()=> new QueryClient({
        defaultOptions :{
            queries :{
                staleTime : Infinity
            }
        }
    }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            
        </QueryClientProvider>
    )
}