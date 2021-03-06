import React, {Component, Fragment} from 'react';
import {Row} from "reactstrap";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import IntlMessages from "../../../helpers/IntlMessages";

export default class Customers extends Component {
    render() {
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.customers" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" className="mb-4">
                        <p><IntlMessages id="menu.customers"/></p>
                    </Colxx>
                </Row>
            </Fragment>
        )
    }
}