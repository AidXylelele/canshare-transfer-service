import { AxiosError, AxiosResponse } from "axios";

export type ResponseCallback<T> = (response: AxiosResponse) => T;

export type ErrorCallback<T> = (error: AxiosError) => T;
