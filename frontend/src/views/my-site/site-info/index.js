import React, {Component, Fragment} from 'react';
import {Row, Card, CardBody, FormGroup, Label, Input} from "reactstrap";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import {connect} from "react-redux";

class SiteInfo extends Component {

    render() {
        const {
            firstName,
            lastName,
            email,
            startDate,
            expireDate,
            price,
            company,
            street,
            city,
            state,
            zipCode,
            phone
        } = this.props.user;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.profile" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" className="mb-4">
                        <Card>
                            <CardBody>
                                <Row>
                                    <Colxx sm="12" md="6">
                                        <FormGroup>
                                            <Label for="firstName">First Name</Label>
                                            <Input type="text" id="firstName" value={firstName ?? ''} readOnly={true}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="lastName">Last Name</Label>
                                            <Input type="text" id="lastName" value={lastName ?? ''} readOnly={true}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="lastName">Email</Label>
                                            <Input type="text" id="email" value={email ?? ''} readOnly={true}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="phone">Phone Number</Label>
                                            <Input type="text" id="phone" value={phone ?? ''} readOnly={true}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="company">Company</Label>
                                            <Input type="text" id="company" value={company ?? ''} readOnly={true}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="zipCode">ZIP Code</Label>
                                            <Input type="text" id="zipCode" value={zipCode ?? ''} readOnly={true}/>
                                        </FormGroup>
                                    </Colxx>

                                    <Colxx sm="12" md="6">
                                        <FormGroup>
                                            <Label for="street">Street</Label>
                                            <Input type="text" id="street" value={street ?? ''} readOnly={true}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="city">City</Label>
                                            <Input type="text" id="city" value={city ?? ''} readOnly={true}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="state">State</Label>
                                            <Input type="text" id="state" value={state ?? ''} readOnly={true}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="startDate">Start Date</Label>
                                            <Input type="text" id="startDate" value={startDate ?? ''} readOnly={true}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="expireDate">Expire Date</Label>
                                            <Input type="text" id="expireDate" value={expireDate ?? ''} readOnly={true}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="price">Price</Label>
                                            <Input type="text" id="price" value={price ?? ''} readOnly={true}/>
                                        </FormGroup>
                                    </Colxx>
                                </Row>
                            </CardBody>
                        </Card>
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
)(SiteInfo);
