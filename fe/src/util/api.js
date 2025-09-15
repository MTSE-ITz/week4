import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    }

    return axios.post(URL_API, data)
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        email, password
    }

    return axios.post(URL_API, data)
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API)
}

const getProductApi = (page = 1, size = 10) => {
    const URL_API = `/v1/api/product/list?page=${page}&size=${size}`;
    return axios.get(URL_API);
};

const searchProductApi = ({ q = "", category = "", minPrice, maxPrice, page = 1, limit = 6 }) => {
    const params = { q, category, minPrice, maxPrice, page, size: limit };
    return axios.get("/v1/api/product/search", { params });
};

const listFavouriteApi = (userID, page = 1, size = 10) => {
    console.log("api userId: ", userID);
    
    const URL_API = `/v1/api/favorite/list/${userID}?page=${page}&size=${size}`;
    return axios.get(URL_API);
};

export {
    createUserApi, loginApi, getUserApi, getProductApi, searchProductApi, listFavouriteApi
}
