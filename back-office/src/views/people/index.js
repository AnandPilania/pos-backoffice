import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Users = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './users')
);
const Customers = React.lazy(() =>
  import(/* webpackChunkName: "viwes-second-menu" */ './customers')
);

class App extends Component {

  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
              <Route
                path={`${match.url}/users`}
                render={props => <Users {...props} />}
              />
              <Route
                path={`${match.url}/customers`}
                render={props => <Customers {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
    }
  )(App)
);
