import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const SiteInformation = React.lazy(() =>
    import(/* webpackChunkName: "viwes-second-menu" */ './profile')
);
const MenuAppSettings = React.lazy(() =>
    import(/* webpackChunkName: "viwes-second-menu" */ './menu-app')
);

class App extends Component {

  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/profile`} />
              <Route
                path={`${match.url}/profile`}
                render={props => <SiteInformation {...props} />}
              />
              <Route
                  path={`${match.url}/menu-app-settings`}
                  render={props => <MenuAppSettings {...props} />}
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
