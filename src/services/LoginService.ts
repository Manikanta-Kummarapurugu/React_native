import AppSettings from "./Constants";
import axios from "axios";

export const LoginService = {
    async getData(apiname: string, data: any) {
        try {
            const baseUrl = await AppSettings.BASE_URL();
            const response = await fetch(`${baseUrl}${apiname}`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error(`Error fetching data from ${apiname}`, error);
            throw error;
        }
    },

    async getDatas(apiname: string, data: any): Promise<any> {
        try {
            const baseUrl = await AppSettings.BASE_URL();
            const response = await axios.post(`${baseUrl}${apiname}`, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching data from ${apiname}`, error);
            throw error;
        }
    },

    async uploadimage(apiname: string, formdata: FormData): Promise<any> {
        try {
            const baseUrl = await AppSettings.BASE_URL();
            const response = await axios.post(`${baseUrl}${apiname}`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error uploading  to ${apiname}`, error);
            throw error;
        }
    },
    async uploadimages(apiname: string, formdata: FormData, timeout: number = 10000): Promise<any> {
        try {
            const baseUrl = await AppSettings.BASE_URL();
            const response = await axios.post(`${baseUrl}${apiname}`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: timeout, // Set the timeout in milliseconds
            });
            return response.data;
        } catch (error) {
            console.error(`Error uploading to ${apiname}`, error);
            throw error;
        }
    }
    
};
