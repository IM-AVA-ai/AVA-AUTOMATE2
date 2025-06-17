type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiServiceConfig {
    method?: HttpMethod;
    headers?: Record<string, string>;
    data?: unknown;
}

/**
 * A reusable API service for making fetch requests to Next.js API routes
 * @param endpoint - The API endpoint (e.g., 'salesforce/createLeads')
 * @param config - Configuration object
 * @returns Promise with typed response
 */
export const apiService = async <T = unknown>(
    endpoint: string,
    config: ApiServiceConfig = { method: 'GET' }
): Promise<T> => {
    try {
        const { method = 'GET', headers = {}, data } = config;
        const requestConfig: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        if (data) {
            if (
                headers['Content-Type'] === 'application/x-www-form-urlencoded'
            ) {
                requestConfig.body = data.toString();
            } else {
                requestConfig.body = JSON.stringify(data);
            }
        }
        const response = await fetch(`${endpoint}`, requestConfig);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData: T = await response.json();
        return responseData
    } catch (error) {
        console.error('API Service Error:', error);
        throw error;
    }
};