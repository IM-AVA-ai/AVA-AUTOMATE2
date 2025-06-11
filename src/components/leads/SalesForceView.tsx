// This file contains the code for the salesforce view component.

import { AlertCircle, Loader2, Lock, Plus, Search, Send, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ISalesForceLeadsResponse } from "@/types/apiResponse";
import { IFetchLeadsQueryParamsType } from "@/types/apiRequest";

interface SalesforceViewProps {
    viewType: string;
    setViewType: (viewType: string) => void;
    leadsLoading: boolean;
    isSalesForceIntegrated: boolean;
    loading: boolean;
    selectedLeads: Set<string>;
    handleBulkAddToCampaign: () => void;
    handleBulkDelete: () => void;
    setIsAddLeadOpen: (isOpen: boolean) => void;
    leads: ISalesForceLeadsResponse[];
    contacts: ISalesForceLeadsResponse[];
    queryParams: IFetchLeadsQueryParamsType;
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    crmPlatform: string
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
    crmPlatform
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative min-h-[200px]">
                {leadsLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                </div>
                ) : !isSalesForceIntegrated ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Please connect {crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} to view leads
                    </p>
                </div>
                ) : (
                <>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Manage {crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} Leads
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        View and manage your {crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} leads
                    </p>
                    <div className="relative mt-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <Input
                        type="search"
                        placeholder="Search leads by name or phone..."
                        className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={queryParams.search}
                        onChange={handleSearch}
                        disabled={loading}
                        />
                    </div>
                    </div>

                    <div className="overflow-x-auto">
                    {leads && leads.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                        No leads found in your {crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} account
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Added</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {leads && leads.map((lead) => (
                            <tr key={lead.Id}>
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{lead.Name}</td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{lead.Phone}</td>
                                <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold`}>{lead.attributes.type}</span>
                                </td>
                                <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold`}>{lead.Status}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{lead.attributes.url}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    )}
                    </div>
                </>
                )}
            </div>
        )  : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative min-h-[200px]">
              {leadsLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                </div>
              ) : !isSalesForceIntegrated ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Please connect {crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} to view contacts
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Manage {crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} Contacts
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      View and manage your {crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} contacts
                    </p>
                    <div className="relative mt-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="search"
                        placeholder="Search contacts by name or phone..."
                        className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={queryParams.search}
                        onChange={handleSearch}
                        disabled={loading}
                      />
                    </div>
                  </div>
      
                  <div className="overflow-x-auto">
                    {contacts && contacts.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                        No contacts found in your {crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} account
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lead Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lead Source</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Added</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {contacts && contacts.map((contact) => (
                            <tr key={contact.Id}>
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{contact.Name}</td>
                              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{contact.Phone}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold`}>{contact.attributes.type}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold`}>{contact.LeadSource || "-"}</span>
                              </td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{contact.attributes.url}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
          </div>
        )}
      </>
    );
  };