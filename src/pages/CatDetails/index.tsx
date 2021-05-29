import React, { Component, Fragment } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import Context, { CatContext } from '../../context';

interface Props {}

class CatDetails extends Component<Props> {
    static contextType = Context;

    constructor(props: Props) {
        super(props);
        this.onBackClick = this.onBackClick.bind(this);
    }

    render() {
        const context = this.context as CatContext;
        const { selectedCatId, catsById } = context.data;
        const cat = catsById[selectedCatId] || null;

        if (!cat) {
            return <Redirect to="/" />
        }

        return (
            <Fragment>
                <div className="my-2 py-2">
                    <Button
                        as={ Link }
                        to="/browser"
                        variant="primary"
                        style={{ minWidth: '200px' }}
                        onClick={ this.onBackClick }>
                        <h5>Back</h5>
                    </Button>
                </div>
                <Card>
                    <Card.Img src={ cat.image } alt={ cat.breedName } />
                    <Card.Body>
                        <h3>{ cat.breedName }</h3>
                        <h4>Origin: { cat.origin }</h4>
                        <p><strong>{ cat.temperament }</strong></p>
                        <p>{ cat.description }</p>
                    </Card.Body>
                </Card>
            </Fragment>
        );
    }

    onBackClick(e: any) {
        const context = this.context as CatContext;
        const { deselectCat } = context.action;
        deselectCat();
    }
}

export default CatDetails;