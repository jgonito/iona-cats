import React, { Component } from 'react';
import * as service from '../services';
import Context, { CatContextData, CatContextAction } from './context';

class ContextProvider extends Component {
    state: CatContextData = {
        catBreedsById: {},
        catBreedIds: [],
        selectedCatBreedId: '',
        isCatBreedFetching: false,
        catBreedError: '',
        catsById: {},
        catIds: [],
        selectedCatId: '',
        isCatFetching: false,
        catError: '',
        currentCatPage: 0,
        canFetchMoreCats: false
    };

    private fetchCatBreeds: CatContextAction['fetchCatBreeds'] = async () => {
        const { isCatBreedFetching } = this.state;
        if (isCatBreedFetching) {
            return;
        }

        this.setState({
            isCatBreedFetching: true,

            // data that needs reset
            catBreedError: ''
        });

        try {
            const catBreeds = await service.fetchCatBreeds();
            let catBreedsById: CatContextData['catBreedsById'] = {};
            let catBreedIds: CatContextData['catBreedIds'] = [];

            catBreeds.forEach(catBreed => {
                const catBreedId = catBreed.id;
                catBreedsById[catBreedId] = catBreed;
                catBreedIds.push(catBreedId);
            })

            this.setState({
                catBreedsById,
                catBreedIds,
                selectedCatBreedId: ''
            });
        } catch (error) {
            console.error(error)
            this.setState({ catBreedError: process.env.REACT_APP_ERROR_MSG });
        } finally {
            this.setState({ isCatBreedFetching: false });
        }
    };

    private selectCatBreed: CatContextAction['selectCatBreed'] = (catBreedId: string) => {
        this.setState({ selectedCatBreedId: catBreedId });
    };

    private fetchCatsInit: CatContextAction['fetchCatsInit'] = async () => {
        const { isCatFetching } = this.state;
        if (isCatFetching) {
            return;
        }

        this.setState({
            isCatFetching: true,

            // data that needs reset
            catsById: {},
            catIds: [],
            selectedCatId: '',
            canFetchMoreCats: false,
            catError: ''
        });

        try {
            const { catsById, catIds, endOfRecord } = await this.fetchCatsAndProcess(1);

            this.setState({
                catsById,
                catIds,
                selectedCatId: '',
                currentCatPage: 1,
                canFetchMoreCats: !endOfRecord
            });
        } catch (error) {
            console.error(error)
            this.setState({ catError: process.env.REACT_APP_ERROR_MSG });
        } finally {
            this.setState({ isCatFetching: false });
        }
    };

    private fetchMoreCats: CatContextAction['fetchMoreCats'] = async () => {
        const { isCatFetching, canFetchMoreCats } = this.state;
        if (isCatFetching || !canFetchMoreCats) {
            return;
        }

        this.setState({
            isCatFetching: true,

            // data that needs reset
            catError: ''
        });

        try {
            const {  currentCatPage } = this.state;
            const nextCatPage = currentCatPage + 1;
            const { catsById, catIds, endOfRecord } = await this.fetchCatsAndProcess(nextCatPage);

            this.setState({
                catsById: {
                    ...this.state.catsById,
                    ...catsById
                },
                catIds: [
                    ...this.state.catIds,
                    ...catIds
                ],
                currentCatPage: nextCatPage,
                canFetchMoreCats: !endOfRecord
            });
        } catch (error) {
            console.error(error)
            this.setState({ catError: process.env.REACT_APP_ERROR_MSG });
        } finally {
            this.setState({ isCatFetching: false });
        }
    };

    private selectCat: CatContextAction['selectCat'] = (catId: string) => {
        this.setState({ selectedCatId: catId });
    };

    private deselectCat: CatContextAction['deselectCat'] = () => {
        this.setState({ selectedCatId: '' });
    };

    private fetchCatsAndProcess = async (page: number) => {
        const { selectedCatBreedId } = this.state;
        const catFetchLimit = process.env.REACT_APP_CAT_FETCH_LIMIT
                            ? (+process.env.REACT_APP_CAT_FETCH_LIMIT || 10)
                            : 10;

        /**
         * Always add 1 to 'catFetchLimit' before fetching, and when 
         * the fetched record's count exceeded the declared limit, it
         * means that the end of the record haven't reached yet and
         * 'Load More' is still allowable.
         */
        const cats = await service.fetchCats(selectedCatBreedId, page, catFetchLimit + 1);
        const endOfRecord = cats.length <= catFetchLimit;
        if (!endOfRecord) {
            // make sure to remove the excess record
            cats.pop();
        }

        let catsById: CatContextData['catsById'] = {};
        let catIds: CatContextData['catIds'] = [];
        cats.forEach(cat => {
            const catId = cat.id;
            catsById[catId] = cat;
            catIds.push(catId);
        });

        return {
            catsById,
            catIds,
            endOfRecord
        }
    }

    render() {
        const {
            state,
            fetchCatBreeds,
            selectCatBreed,
            fetchCatsInit,
            fetchMoreCats,
            selectCat,
            deselectCat
        } = this;

        return (
            <Context.Provider value={{
                data: { ...state },
                action: {
                    fetchCatBreeds,
                    selectCatBreed,
                    fetchCatsInit,
                    fetchMoreCats,
                    selectCat,
                    deselectCat
                }
            }}>
                { this.props.children }
            </Context.Provider>
        )
    }
}

export default ContextProvider;