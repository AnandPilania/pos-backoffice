import React, {Suspense} from 'react';
import {
    Redirect,
    Route,
    Switch
} from 'react-router-dom';

const ProductList = React.lazy(() =>
    import(/* webpackChunkName: "start" */ './list')
);

const ProductEdit = React.lazy(() =>
    import(/* webpackChunkName: "start" */ './edit')
);

const Products = ({match}) => (
    <Suspense fallback={<div className="loading"/>}>
        <Switch>
            {/*<Redirect exact from={`${match.url}/`} to={`${match.url}/start`} />*/}
            <Route
                path={`${match.url}/`}
                exact
                render={props => <ProductList {...props} />}
            />
            <Route
                path={`${match.url}/edit/:productId`}
                render={props => {
                    return <ProductEdit {...props} />
                }}
            />
            <Redirect to="/error"/>
        </Switch>
    </Suspense>
);
export default Products;
