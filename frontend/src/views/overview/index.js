import React, {Component, Fragment} from 'react';
import {Row} from "reactstrap";
import {Colxx, Separator} from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import {connect} from "react-redux";
import AppLayout from "../../layout/AppLayout";

class Overview extends Component {
    render() {
        return (
            <AppLayout>
                <div className="dashboard-wrapper">
                    <Fragment>
                        <Row>
                            <Colxx xxs="12">
                                <Breadcrumb heading="menu.overview" match={this.props.match} />
                                <Separator className="mb-5" />
                            </Colxx>
                        </Row>
                        <Row>
                            <Colxx xxs="12" className="mb-4">
                                <h3>Welcome {`${this.props.user.firstName} ${this.props.user.lastName}`}</h3>
                            </Colxx>
                        </Row>
                    </Fragment>
                </div>
            </AppLayout>
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
)(Overview);
