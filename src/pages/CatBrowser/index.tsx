import React, { ChangeEvent, Component, Fragment } from 'react';
import Context, { CatContext } from '../../context';
import { Row, Col, Form, Button, Card, Alert  } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Props {}

class CatBrowser extends Component<Props> {
    static contextType = Context;

    constructor(props: Props) {
        super(props);
        this.onBreedChange = this.onBreedChange.bind(this);
        this.onLoadMoreClick = this.onLoadMoreClick.bind(this);
    }

    componentDidMount() {
        const context = this.context as CatContext;
        const { catBreedIds } = context.data;
        if (catBreedIds.length === 0) {
            const { fetchCatBreeds } = context.action;
            fetchCatBreeds();
        }
    }

    render() {
        const context = this.context as CatContext;
        const {
            catBreedsById,
            catBreedIds,
            selectedCatBreedId,
            isCatBreedFetching,
            catBreedError,
            catsById,
            catIds,
            isCatFetching,
            canFetchMoreCats,
            catError
        } = context.data;

        return (
            <Fragment>
                <h1>Cat Browser</h1>
                <Row>
                    <Col xs={ 12 } lg={ 2 }>
                        <Form className="mb-3">
                            <Form.Group>
                                <Form.Label>Breed</Form.Label>
                                <Form.Control
                                    as="select"
                                    disabled={ isCatBreedFetching || isCatFetching }
                                    value={ selectedCatBreedId || '__default' }
                                    onChange={ this.onBreedChange }>
                                    <option key="__default-0" value="__default" disabled>Select Breed</option>
                                    { catBreedIds.map((id: string, i: number) => {
                                        const catBreed = catBreedsById[id];
                                        return (
                                            <option key={ `${id}-${i+1}` } value={ id }>{ catBreed.name }</option>
                                        );
                                    })}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={ 12 } lg={ 10 }>
                        {(() => {
                            const messageTemplate = (variant: string, message: string) => (
                                <Alert variant={ variant }>
                                    <h5 className="text-center">{ message }</h5>
                                </Alert>
                            );

                            if (catBreedError !== '') {
                                return messageTemplate('danger', catBreedError);
                            }

                            if (catError !== '') {
                                return messageTemplate('danger', catError);
                            }

                            if (isCatBreedFetching) {
                                return messageTemplate('info', 'Loading Cat Breeds...');
                            }

                            // show only when fetching the first set of cats, not on 'Load More'
                            if (isCatFetching && catIds.length === 0) {
                                return messageTemplate('info', 'Loading Cats...');
                            }

                            if (selectedCatBreedId === '') {
                                return messageTemplate('light', 'Select a cat breed');
                            }

                            if (catIds.length === 0) {
                                return messageTemplate('warning', 'No cats to show. Please select a new breed.');
                            }

                            return (
                                <div>
                                    <Row>
                                        { catIds.map((id: string, i: number) => {
                                            const cat = catsById[id];
                                            return (
                                                <Col key={ `${id}-${i}` } xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 }>
                                                    <Card className="mb-2">
                                                        <Card.Img src={ cat.image } alt={ cat.breedName } variant="top" />
                                                        <Card.Footer className="text-center">
                                                            <Card.Link
                                                                as={ Link } to="/details"
                                                                className="text-decoration-none"
                                                                onClick={ () => { this.onCatClick(id) } }>View Details</Card.Link>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                    { canFetchMoreCats && (
                                        <div className="text-center mx-5 p-5">
                                            <Button
                                                type="button"
                                                variant="success"
                                                disabled={ isCatFetching }
                                                style={{ minWidth: '200px' }}
                                                onClick={ this.onLoadMoreClick }>
                                                <h5>{ isCatFetching ? 'Loading Cats...' : 'Load More'}</h5>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </Col>
                </Row>
            </Fragment>
        );
    }

    onBreedChange(e: ChangeEvent<HTMLSelectElement>) {
        const catBreedId = e.currentTarget.value;
        const context = this.context as CatContext;
        const { selectCatBreed, fetchCatsInit } = context.action;
        selectCatBreed(catBreedId);
        // ensure that 'fetchCatsInit' executed after 'selectCatBreed' is finished
        setTimeout(() => { fetchCatsInit(); }, 0);
    }

    onLoadMoreClick() {
        const context = this.context as CatContext;
        const { canFetchMoreCats } = context.data;
        if (canFetchMoreCats) {
            const { fetchMoreCats } = context.action;
            fetchMoreCats();
        }
    }

    onCatClick(catId: string) {
        const context = this.context as CatContext;
        const { selectCat } = context.action;
        selectCat(catId);
    }
}

export default CatBrowser;