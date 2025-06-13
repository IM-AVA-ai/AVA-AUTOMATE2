// This file contains the handler for the create contacts route.

import { IFetchHubSpotContactsQueryParamsType, IFetchHubSpotQueryParamsType, IFetchLeadsQueryParamsType, IFetchSalesForceContactsQueryParamsType } from "@/types/apiRequest";

/**
 * Takes an object and returns a query string representing the object.
 * The query string does not include any keys which have a value of undefined, null, or an empty string.
 * The query string is URI encoded.
 * If the object results in an empty query string, an empty string is returned.
 * @param obj The object to create a query string from
 * @returns The query string
 */
export const makeQueryParams = (
    obj: IFetchLeadsQueryParamsType | IFetchHubSpotContactsQueryParamsType | IFetchSalesForceContactsQueryParamsType
): string => {
    const queryString = Object.entries(obj)
        .filter(
            ([, value]) => value !== undefined && value !== null && value !== ""
        )
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join("&");

    return queryString ? `&${queryString}` : "";
};

/**
 * Takes an object and returns a query string representing the object.
 * The query string does not include any keys which have a value of undefined, null, or an empty string.
 * The query string is URI encoded.
 * If the object results in an empty query string, an empty string is returned.
 * @param obj The object to create a query string from
 * @returns The query string
 */
export const makeHubSpotQueryParams = (
    obj: IFetchHubSpotQueryParamsType
): string => {
    const queryString = Object.entries(obj)
        .filter(
            ([, value]) => value !== undefined && value !== null && value !== ""
        )
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join("&");

    return queryString ? `?${queryString}` : "";
};