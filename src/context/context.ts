import { createContext } from 'react';
import { CatBreed, Cat } from '../models';

/**
 * Entities (cat breed & cat) is stored in an object indexed by id
 * instead of array to prevent looping when finding specific entity.
 * Entity ids are stored separately on an array as basis of ordering.
 */
interface CatContextData {
    catBreedsById: { [key: string]: CatBreed };
    catBreedIds: string[];
    selectedCatBreedId: string;
    isCatBreedFetching: boolean;
    catBreedError: string;
    catsById: { [key: string]: Cat };
    catIds: string[];
    selectedCatId: string;
    isCatFetching: boolean;
    catError: string;
    currentCatPage: number;
    canFetchMoreCats: boolean;
}

/**
 * Actions will be exposed to components and should be used to
 * perform actions that affects the context. This is to ensure
 * that component will not directly mutating the context data.
 */
interface CatContextAction {
    fetchCatBreeds: () => void;
    selectCatBreed: (catBreedId: string) => void;
    fetchCatsInit: () => void;
    fetchMoreCats: () => void;
    selectCat: (catId: string) => void;
    deselectCat: () => void;
}

interface CatContext {
    data: CatContextData;
    action: CatContextAction;
}

export default createContext({} as CatContext);
export type {
    CatContextData,
    CatContextAction,
    CatContext
};