import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const resourcesApi = createApi({
  baseQuery: fetchBaseQuery({baseUrl: '/resources'}),
  reducerPath: 'resources',
  endpoints: () => ({})
});

export const {
  reducer: resourcesReducer,
  middleware: resourcesMiddleware,
  util: {
    updateQueryData: updateResourcesCache
  }
} = resourcesApi;


export type ResourcesApiState = ReturnType<typeof resourcesApi.reducer>