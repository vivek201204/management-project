'use client';
import {persistStore , persistReducer, } from "redux-persist"
import { combineReducers, configureStore ,  } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import orgSlice from "./org/orgSlice";
import StorySlice from "./story/StorySlice";
import taskSlice from "./task/taskSlice";
import friendSlice from "./friends/friendSlice";
import querySlice from "./query/querySlice";


const createNoopStorage = () => {
  return {
    getItem(_key : any) {
      return Promise.resolve(null);
    },
    setItem(_key : any, value : any) {
      return Promise.resolve(value);
    },
    removeItem(_key : any) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window === "undefined" ? createNoopStorage() : createWebStorage("local");

export default storage;



 const persistconfig = {
    key : "user" ,
    storage ,
    version : 1

 } 
 const rootReducer = combineReducers({
  auth : persistReducer(persistconfig , authReducer) ,
  org : orgSlice ,
  story : StorySlice ,
  task : taskSlice ,
  friend : friendSlice ,
  query : querySlice
})




 export const store = configureStore({
    reducer:rootReducer ,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
      }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;