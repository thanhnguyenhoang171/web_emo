import { IBackendRes, IType,  IAccount, IUser, IModelPaginate, IGetAccount, IProduct, IRating, IPermission, IRole, ISubscribers } from '@/types/backend';
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password })
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileUpload', file);
    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_type": folderType
        },
    });
}

export const callUploadSingleFileFeedback = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileUpload', file);
    return axios<IBackendRes<{ fileName: string, detectedEmotion: { class: string; confidenceScore: number }[] }>>({
        method: 'post',
        url: '/api/v1/files/upload-feedback',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_type": folderType
        },
    });
}



/**
 * 
Module Type
 */

export const callCreateType = (name: string, description: string, logo: string) => {
    return axios.post<IBackendRes<IType>>('/api/v1/types', { name, description, logo })
}

export const callUpdateType = (id: string, name: string,  description: string, logo: string) => {
    return axios.patch<IBackendRes<IType>>(`/api/v1/types/${id}`, { name, description, logo })
}

export const callDeleteType = (id: string) => {
    return axios.delete<IBackendRes<IType>>(`/api/v1/types/${id}`);
}


export const callFetchType = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IType>>>(`/api/v1/types?${query}`);
}

export const callFetchTypeById = (id: string) => {
    return axios.get<IBackendRes<IType>>(`/api/v1/types/${id}`);
}


/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', { ...user })
}

export const callUpdateUser = (user: IUser, id: string) => {
    return axios.patch<IBackendRes<IUser>>(`/api/v1/users/${id}`, { ...user })
}

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}

/**
 * 
Module Product
 */
export const callCreateProduct = (product: IProduct) => {
    return axios.post<IBackendRes<IProduct>>('/api/v1/products', { ...product })
}

export const callUpdateProduct = (id: string, name: string, description: string, type: Object, image: string, isActive: boolean) => {
    return axios.patch<IBackendRes<IProduct>>(`/api/v1/products/${id}`, { name, description, type, image,isActive })
}

export const callDeleteProduct = (id: string) => {
    return axios.delete<IBackendRes<IProduct>>(`/api/v1/products/${id}`);
}

export const callFetchProduct = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IProduct>>>(`/api/v1/products?${query}`);
}

export const callFetchProductById = (id: string) => {
    return axios.get<IBackendRes<IProduct>>(`/api/v1/products/${id}`);
}

/**
 * 
Module Rating
 */
export const callCreateRating = (url: string, typeId: any, productId: any, comment: string, detectedEmotion: { class: string; confidenceScore: number }[]) => {
    return axios.post<IBackendRes<IRating>>('/api/v1/ratings', { url, typeId, productId, comment, detectedEmotion })
}

export const callUpdateRatingStatus = (id: any, status: string) => {
    return axios.patch<IBackendRes<IRating>>(`/api/v1/ratings/${id}`, { status })
}

export const callDeleteRating = (id: string) => {
    return axios.delete<IBackendRes<IRating>>(`/api/v1/ratings/${id}`);
}

export const callFetchRating = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRating>>>(`/api/v1/ratings?${query}`);
}
export const callFetchTotalPositiveRatings = () => {
    return axios.get(`/api/v1/ratings/positive-ratings`);
}

export const callFetchTotalNegativeRatings = () => {
    return axios.get(`/api/v1/ratings/negative-ratings`);
}
export const callFetchRatingById = (id: string) => {
    return axios.get<IBackendRes<IRating>>(`/api/v1/ratings/${id}`);
}

export const callFetchRatingByUser = () => {
    return axios.post<IBackendRes<IRating[]>>(`/api/v1/ratings/by-user`);
}

export const callFetchTotalRatings = () => {
    return axios.post(`/api/v1/ratings/total-items`);
};



/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.patch<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`, { ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.patch<IBackendRes<IRole>>(`/api/v1/roles/${id}`, { ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

/**
 * 
Module Subscribers
 */
export const callCreateSubscriber = (subs: ISubscribers) => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers', { ...subs })
}

export const callGetSubscriberSkills = () => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers/skills')
}

export const callUpdateSubscriber = (subs: ISubscribers) => {
    return axios.patch<IBackendRes<ISubscribers>>(`/api/v1/subscribers`, { ...subs })
}

export const callDeleteSubscriber = (id: string) => {
    return axios.delete<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

export const callFetchSubscriber = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISubscribers>>>(`/api/v1/subscribers?${query}`);
}

export const callFetchSubscriberById = (id: string) => {
    return axios.get<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

