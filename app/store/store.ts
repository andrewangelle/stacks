import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import {createLogger} from 'redux-logger';
import { resourcesMiddleware } from "~/store";
import { ResourcesApiState, resourcesReducer } from "./resourcesApi";

export const rootReducer = combineReducers({
  resources: resourcesReducer
});

const preloadedState = {
  resources: ({} as unknown) as ResourcesApiState
};

export const createStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => ([
      ...getDefaultMiddleware({
        thunk: true,
        immutableCheck: false,
        serializableCheck: false
      }),
      createLogger({
        collapsed: true
      }),
      resourcesMiddleware
    ]).filter(Boolean),
    preloadedState
  });

  setupListeners(store.dispatch);

  return store
}