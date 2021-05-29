import axios, { AxiosResponse } from 'axios';
import { Cat, CatBreed } from '../models';

const base = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
    headers: {
        'x-api-key': process.env.REACT_APP_CATS_API_KEY || ''
    }
});

base.interceptors.request.use(config => {
    if (!config.headers['x-api-key']) {
        console.warn('api key is not provided on the request header');
    }
    return config;
});

base.interceptors.response.use(res => res, err => {
    // allow me to handle errors manually
    return err.response ? err.response : err;
});


const fetchCatBreeds = async () => {
    const res = await base.get('/breeds', {});
    const { error, data } = processResponse<CatBreed[]>(res);
    if (error && error !== '') {
        throw error;
    }

    if (!data) {
        return [];
    }

    return data;
};

const fetchCats = async (breedId: string, page: number, limit: number) => {
    const res = await base.get('/images/search', {
        params: {
            page,
            limit,
            breed_id: breedId
        }
    });

    // extract needed fields only from the response
    interface CatItem {
        id: string;
        url: string;
        breeds: {
            name: string;
            origin: string;
            temperament: string;
            description: string;
        }[];
    }

    const { error, data } = processResponse<CatItem[]>(res);
    if (error && error !== '') {
        throw error;
    }

    if (!data) {
        return [];
    }

    return data.map(catItem => {
        const catBreedItem = catItem.breeds[0];
        return {
            id: catItem.id,
            image: catItem.url,
            breedName: catBreedItem.name,
            origin: catBreedItem.origin,
            temperament: catBreedItem.temperament,
            description: catBreedItem.description
        } as Cat;
    });
};

const processResponse = <TData = any>(res: AxiosResponse) => {
    const { status, data } = res;
    let r: {
        error: string | null,
        data: TData | null
    } = {
        error: null,
        data: null
    };
    
    // check if status is 2XX
    if (+`${status}`.charAt(0) === 2) {
        if (!data) {
            r.error = 'empty or invalid data received';
        } else {
            r.data = data as TData;
        }
    } else {
        r.error = 'an error is encountered';
    }

    return r;
};

export {
    fetchCatBreeds,
    fetchCats
}