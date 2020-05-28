import React, {Component, Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';
import {Row} from "reactstrap";
import {Colxx, Separator} from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import IntlMessages from "../../helpers/IntlMessages";

class App extends Component {

  render() {

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Fragment>
            <Row>
              <Colxx xxs="12">
                <Breadcrumb heading="menu.blank-page" match={this.props.match} />
                <Separator className="mb-5" />
              </Colxx>
            </Row>
            <Row>
              <Colxx xxs="12" className="mb-4">
                <p><IntlMessages id="menu.blank-page"/></p>
              </Colxx>
            </Row>
          </Fragment>
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
    {}
  )(App)
);
