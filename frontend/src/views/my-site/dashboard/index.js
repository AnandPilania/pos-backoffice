import React, {Component, Fragment} from 'react';
import {Row} from "reactstrap";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import IntlMessages from "../../../helpers/IntlMessages";
import {connect} from "react-redux";

class Dashboard extends Component {
    render() {
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.dashboard" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" className="mb-4">
                        <h3>Welcome {`${this.props.user.firstName} ${this.props.user.lastName}`}</h3>
                    </Colxx>
                </Row>
            </Fragment>
        )
    }
}

const mapStateToProps = ({ authUser }) => {
    const { user } = authUser;
    return { user };
};

export default connect(
    mapStateToProps,
    {}
)(Dashboard);
