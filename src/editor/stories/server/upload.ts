export interface IUploadResponse {
    uptoken: string;
}

interface IUploadProcessInfo {
    loaded: number;
    percent: number;
    size: number;
}

export interface IUploadProcessNext {
    total: IUploadProcessInfo;
    [propName: string]: any;
}

export interface IUploadProcessComplete {
    hash: string;
    key: string;
}

export interface IUploadProcessError {
    [propName: string]: any;
}

function getUploadToken(): Promise<IUploadResponse> {
    return fetch('/__render/upload').then(res => res.json());
}

export { getUploadToken };
