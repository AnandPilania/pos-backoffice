import React, {Component, Suspense} from 'react';
import {connect} from 'react-redux';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import {IntlProvider} from 'react-intl';
import AppLocale from './lang';
import ColorSwitcher from './components/common/ColorSwitcher';
import NotificationContainer from './components/common/react-notifications/NotificationContainer';
import {isMultiColorActive, isDemo} from './constants/defaultValues';
import {getDirection} from './helpers/Utils';

const ViewMain = React.lazy(() =>
    import(/* webpackChunkName: "views" */ './views')
);
const ViewAuth = React.lazy(() =>
    import(/* webpackChunkName: "views-app" */ './views/auth')
);
const ViewOverview = React.lazy(() =>
    import(/* webpackChunkName: "views-app" */ './views/overview')
);
const ViewMyAccount = React.lazy(() =>
    import(/* webpackChunkName: "views-app" */ './views/my-account')
);
const ViewProducts = React.lazy(() =>
    import(/* webpackChunkName: "views-app" */ './views/products')
);
const ViewPeople = React.lazy(() =>
    import(/* webpackChunkName: "views-app" */ './views/people')
);
const ViewReports = React.lazy(() =>
    import(/* webpackChunkName: "views-app" */ './views/reports')
);
const ViewError = React.lazy(() =>
    import(/* webpackChunkName: "views-error" */ './views/error')
);

const AuthRoute = ({component: Component, authUser, ...rest}) => {
    return (
        <Route
            {...rest}
            render={props =>
                authUser || isDemo ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/auth/login',
                            state: {from: props.location}
                        }}
                    />
                )
            }
        />
    );
}

class App extends Component {
    constructor(props) {
        super(props);
        const direction = getDirection();
        if (direction.isRtl) {
            document.body.classList.add('rtl');
            document.body.classList.remove('ltr');
        } else {
            document.body.classList.add('ltr');
            document.body.classList.remove('rtl');
        }
    }

    render() {
        const {locale, loginUser} = this.props;
        const currentAppLocale = AppLocale[locale];

        return (
            <div className="h-100">
                <IntlProvider
                    locale={currentAppLocale.locale}
                    messages={currentAppLocale.messages}
                >
                    <React.Fragment>
                        <NotificationContainer/>
                        {isMultiColorActive && <ColorSwitcher/>}
                        <Suspense fallback={<div className="loading"/>}>
                            <Router>
                                <Switch>
                                    <Route
                                        path="/auth"
                                        render={props => <ViewAuth {...props} />}
                                    />
                                    <AuthRoute
                                        path="/overview"
                                        authUser={loginUser}
                                        component={ViewOverview}
                                    />
                                    <AuthRoute
                                        path="/my-account"
                                        authUser={loginUser}
                                        component={ViewMyAccount}
                                    />
                                    <AuthRoute
                                        path="/products"
                                        authUser={loginUser}
                                        component={ViewProducts}
                                    />
                                    <AuthRoute
                                        path="/reports"
                                        authUser={loginUser}
                                        component={ViewReports}
                                    />
                                    <AuthRoute
                                        path="/people"
                                        authUser={loginUser}
                                        component={ViewPeople}
                                    />
                                    <Route
                                        path="/error"
                                        exact
                                        render={props => <ViewError {...props} />}
                                    />
                                    <Route
                                        path="/"
                                        exact
                                        render={props => <ViewMain {...props} />}
                                    />
                                    <Redirect to="/error"/>
                                </Switch>
                            </Router>
                        </Suspense>
                    </React.Fragment>
                </IntlProvider>
            </div>
        );
    }
}

const mapStateToProps = ({authUser, settings}) => {
    const {token: loginUser} = authUser;
    const {locale} = settings;
    return {loginUser, locale};
};

export default connect(
    mapStateToProps,
    {}
)(App);
