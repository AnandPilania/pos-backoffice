import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const CategoryList = React.lazy(() =>
    import(/* webpackChunkName: "start" */ './list')
);

const CategoryEdit = React.lazy(() =>
    import(/* webpackChunkName: "start" */ './edit')
);


const Products = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            {/*<Redirect exact from={`${match.url}/`} to={`${match.url}/start`} />*/}
            <Route
                path={`${match.url}/`}
                exact
                render={props => <CategoryList {...props} />}
            />
            <Route
                path={`${match.url}/edit/:categoryId`}
                render={props => {
                    return <CategoryEdit {...props} />
                }}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Products;
