// This file contains the code for the leads table component.


// Third party imports
import { AlertCircle, Loader2, Search } from "lucide-react";

// Custom components
import { Input } from "./input";
import { PaginationControls } from "./leadsPagination";
import { IFetchHubSpotContactsQueryParamsType, IFetchLeadsQueryParamsType, IFetchSalesForceContactsQueryParamsType } from "@/types/apiRequest";

interface DataTableProps {
  viewType: string;
  data: any[];
  columns: any[];
  isLoading: boolean;
  isIntegrated: boolean;
  crmPlatform: string;
  queryParams: IFetchLeadsQueryParamsType | IFetchHubSpotContactsQueryParamsType | IFetchSalesForceContactsQueryParamsType;
  totalCount: number;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPaginationChange: (newOffset: number) => void;
  emptyStateMessage: string;
}

export const DataTable = ({
    viewType,
    data,
    columns,
    isLoading,
    isIntegrated,
    crmPlatform,
    queryParams,
    totalCount,
    onSearchChange,
    onPaginationChange,
    emptyStateMessage,
}: DataTableProps) => {

  const handlePagination = (newOffset : number) => {
    onPaginationChange(newOffset >= 0 ? newOffset : 0);
  };

  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative min-h-[200px]">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : !isIntegrated ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Please connect {crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} to view {viewType}
          </p>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Manage {crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} {viewType}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and manage your {crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} {viewType}
            </p>
            <div className="relative mt-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <Input
                type="search"
                placeholder={`Search ${viewType} by name or phone...`}
                className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={crmPlatform === 'salesforce' ? 
                  viewType === 'leads' ? (queryParams as IFetchLeadsQueryParamsType).search : (queryParams as IFetchSalesForceContactsQueryParamsType).contactsSearch || '' : 
                  (queryParams as IFetchHubSpotContactsQueryParamsType).contactSearch || ''}
                onChange={onSearchChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {data && data.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                {emptyStateMessage || `No ${viewType} found in your ${crmPlatform === 'salesforce' ? 'Salesforce' : 'Hubspot'} account`}
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          {column.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((item) => (
                      <tr key={item.Id}>
                        {columns.map((column) => (
                          <td
                            key={`${item.Id}-${column.key}`}
                            className={`px-4 py-3 ${column.className || ''}`}
                          >
                            {column.render ? column.render(item) : item[column.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <PaginationControls
                  offset={viewType === 'leads' ? (queryParams as IFetchLeadsQueryParamsType).offset || 0 : (queryParams as IFetchSalesForceContactsQueryParamsType).contactsOffset || 0}
                  limit={viewType === 'leads' ? (queryParams as IFetchLeadsQueryParamsType).limit || 10 :  (queryParams as IFetchSalesForceContactsQueryParamsType).contactsLimit || 10}
                  totalCount={totalCount}
                  dataLength={data.length}
                  onPaginationChange={handlePagination}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
  };
  

