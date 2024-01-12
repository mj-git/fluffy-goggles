import { apiSlice } from "../../api/apiSlice";

export const referenceDataSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReferenceDataColumns: builder.query({
            query: () => ({
                url: "/reference_data_columns",
            }),
            transformResponse: (response) => response.columns,
        }),
        getReferenceData: builder.query({
            query: () => ({
                url: "/reference_data?_start=0&_end=30",
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: "ReferenceData",
                              id,
                          })),
                          "ReferenceData",
                      ]
                    : ["ReferenceData"],
        }),
        updateReferenceData: builder.mutation({
            query: (payload) => ({
                url: `/reference_data/${payload.id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["ReferenceData"],
        }),
        getMatchKeys: builder.query({
            query: () => "/match_keys",
        }),
        getMatchKeyCombinations: builder.query({
            query: () => "/match_key_combinations",
        }),
    }),
});

export const {
    useGetReferenceDataColumnsQuery,
    useGetReferenceDataQuery,
    useUpdateReferenceDataMutation,
    useGetMatchKeysQuery,
    useLazyGetMatchKeyCombinationsQuery,
} = referenceDataSlice;
