// This file contains the code for the salesforce view component.

import { AlertCircle, Loader2, Lock, Plus, Search, Send, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ISalesForceLeadsResponse } from "@/types/apiResponse";
import { IFetchHubSpotContactsQueryParamsType, IFetchLeadsQueryParamsType, IFetchSalesForceContactsQueryParamsType } from "@/types/apiRequest";
import { DataTable } from "../ui/leadsTable";

interface SalesforceViewProps {
    viewType: string;
    setViewType: (viewType: string) => void;
    leadsLoading: boolean;
    isSalesForceIntegrated: boolean;
    loading: boolean;
    setIsAddLeadOpen: (isOpen: boolean) => void;
    leads: ISalesForceLeadsResponse[];
    contacts: ISalesForceLeadsResponse[];
    queryParams: IFetchLeadsQueryParamsType;
    setQueryParams: (queryParams: IFetchLeadsQueryParamsType) => void;
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    crmPlatform: string;
    salesForceContactsQueryParams: IFetchSalesForceContactsQueryParamsType;
    setSalesForceContactsQueryParams: (queryParams: IFetchSalesForceContactsQueryParamsType) => void;
    leadsTotal: number;
    contactsTotal: number;
}


export const SalesforceView = ({ 
    viewType, 
    setViewType,
    leadsLoading,
    isSalesForceIntegrated,
    loading,
    setIsAddLeadOpen,
    leads,
    contacts,
    queryParams,
    handleSearch,
    crmPlatform,
    setQueryParams,
    salesForceContactsQueryParams,
    setSalesForceContactsQueryParams,
    leadsTotal,
    contactsTotal
  }: SalesforceViewProps) => {
    return (
      <>
        {/* View Type Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setViewType('leads')}
              className={`px-4 py-2 rounded-l-md font-medium ${
                viewType === 'leads'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
              }`}
            >
              Leads
            </Button>
            <Button
              onClick={() => setViewType('contacts')}
              className={`px-4 py-2 rounded-r-md font-medium ${
                viewType === 'contacts'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
              }`}
            >
              Contacts
            </Button>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={() => setIsAddLeadOpen(true)}
              disabled={leadsLoading || !isSalesForceIntegrated || loading}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {leadsLoading ? (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add {viewType === 'contacts' ? 'Contact' : 'Lead'}
                </>
              ) : !isSalesForceIntegrated ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Connect Salesforce to Add {viewType === 'contacts' ? 'Contact' : 'Lead'}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add {viewType === 'contacts' ? 'Contact' : 'Lead'}
                </>
              )}
            </Button>
          </div>
        </div>
  
        {viewType === "leads" ? (
          <DataTable
          viewType="leads"
          data={leads}
          columns={[
            {
              key: 'Name',
              header: 'Name',
            },
            {
              key: 'Phone',
              header: 'Phone',
            },
            {
              key: 'attributes.type',
              header: 'Type',
              render: (item : ISalesForceLeadsResponse) => (
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold`}>
                  {item.attributes.type}
                </span>
              ),
            },
            {
              key: 'Status',
              header: 'Status',
              render: (item: ISalesForceLeadsResponse) => (
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold`}>
                  {item.Status}
                </span>
              ),
            },
            {
              key: 'attributes.url',
              header: 'Added',
            },
          ]}
          isLoading={leadsLoading}
          isIntegrated={isSalesForceIntegrated}
          crmPlatform={crmPlatform}
          queryParams={queryParams}
          totalCount={leadsTotal}
          onPaginationChange={(newOffset: number) => 
            setQueryParams({
              ...queryParams, 
              offset: newOffset,
            })
          }
          onSearchChange={handleSearch}
          emptyStateMessage="No leads found in your account"
          />
        )  : (
          <DataTable
          viewType="contacts"
          data={contacts}
          columns={[
            {
              key: 'Name',
              header: 'Name',
            },
            {
              key: 'Phone',
              header: 'Phone',
            },
            {
              key: 'attributes.url',
              header: 'Added',
            },
          ]}
          isLoading={leadsLoading}
          isIntegrated={isSalesForceIntegrated}
          crmPlatform={crmPlatform}
          queryParams={salesForceContactsQueryParams}
          totalCount={contactsTotal}
          onPaginationChange={(newOffset: number) =>
              setSalesForceContactsQueryParams({
                ...salesForceContactsQueryParams,
                contactsOffset: newOffset,
              })
            }
          onSearchChange={handleSearch}
          emptyStateMessage="No contacts found in your account"
          />
        )}
      </>
    );
  };