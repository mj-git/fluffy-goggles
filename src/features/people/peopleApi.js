import { apiSlice } from "../api/apiSlice";

export const peopleApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPeople: builder.query({
            query: () => "/people",
        }),
    }),
});

export const { useGetPeopleQuery } = peopleApi;
