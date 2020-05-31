import React, {Component, Fragment} from "react";
import {Row, Card, CardBody, Label, Input, FormGroup, Button} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from "axios";
import {servicePath, tokenPrefix} from "../../../constants/defaultValues";
import {NotificationManager} from "../../../components/common/react-notifications";
import errorMessage from "../../../constants/errorMessages";
import {connect} from "react-redux";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import Select from "react-select";
import {injectIntl} from "react-intl";

class CategoryEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            uploading: false
        };
    }

    componentDidMount() {
        this.setState({loading: true});
        axios
            .get(servicePath + "/categories/get", {
                params: {
                    categoryId: this.props.match.params.categoryId,
                },
                headers: {
                    'X-API-TOKEN': tokenPrefix + this.props.apiToken
                }
            })
            .then(response => response['data'])
            .then(data => {
                if (data['message'] === "") {
                    this.setState({
                        loading: false,
                        name: data['data']['category']['name'],
                        state: data['data']['category']['show_flag'] === 1 ?
                            {'label': this.props.intl.messages['pages.active'], 'value': 1} :
                            {'label': this.props.intl.messages['pages.inactive'], 'value': 0}
                    });
                } else {
                    this.props.history.push('/products/categories');
                }
            })
            .catch(error => {
                this.props.history.push('/products/categories');
            });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleStateChange = state => {
        this.setState({state});
    }

    onSubmit = () => {
        const {loading, uploading, name, state} = this.state;

        if (!loading && !uploading) {

            const data = new FormData();
            data.append('id', this.props.match.params.categoryId);
            data.append('name', name);
            data.append('state', state.value);

            this.setState({uploading: true});

            axios
                .post(servicePath + "/categories/update", data, {
                    headers: {
                        'X-API-TOKEN': tokenPrefix + this.props.apiToken
                    }
                })
                .then(response => {
                    this.setState({
                        uploading: false
                    });
                    if (response.status === 200 && response.data['message'] === "") {
                        NotificationManager.success(
                            "Category Successfully Updated",
                            "Success",
                            3000,
                            null,
                            null,
                            ''
                        );
                    } else {
                        const errorCode = response.data['message'];
                        NotificationManager.warning(
                            errorMessage[errorCode],
                            "Error",
                            3000,
                            null,
                            null,
                            ''
                        );
                    }

                })
                .catch(error => {
                    this.setState({
                        uploading: false
                    });
                    NotificationManager.warning(
                        error,
                        "Error",
                        3000,
                        null,
                        null,
                        ''
                    );
                });
        }
    }

    render() {
        const {
            loading,
            uploading,
            name,
            state,
        } = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.category-edit" match={this.props.match}/>
                        <Separator className="mb-5"/>
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" className="mb-4">
                        {
                            loading ? <div className="loading"/> :

                                <Card className="mb-4">
                                    <CardBody>
                                        <Row>
                                            <Colxx xxs="12" xl="6" className="col-left">
                                                <FormGroup>
                                                    <Label for="name">Category Name</Label>
                                                    <Input type="text" id="name" name="name" value={name}
                                                           onChange={this.onChange}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="state">State</Label>
                                                    <Select
                                                        id="state"
                                                        components={{Input: CustomSelectInput}}
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                        onChange={this.handleStateChange}
                                                        value={state}
                                                        options={[
                                                            {
                                                                'label': this.props.intl.messages['pages.active'],
                                                                'value': 1
                                                            },
                                                            {
                                                                'label': this.props.intl.messages['pages.inactive'],
                                                                'value': 0
                                                            }
                                                        ]}
                                                    />
                                                </FormGroup>
                                            </Colxx>
                                        </Row>
                                        <Button
                                            color="secondary"
                                            size="lg"
                                            outline
                                            className="mr-3"
                                            onClick={() => this.props.history.push('/products/categories')}
                                        >
                                            <IntlMessages id="pages.back"/>
                                        </Button>
                                        <Button
                                            onClick={this.onSubmit}
                                            color="primary"
                                            className={`btn-shadow btn-multiple-state ${uploading ? "show-spinner" : ""}`}
                                            size="lg"
                                        >
                                        <span className="spinner d-inline-block">
                                          <span className="bounce1"/>
                                          <span className="bounce2"/>
                                          <span className="bounce3"/>
                                        </span>
                                            <span className="label"><IntlMessages id="pages.save"/></span>
                                        </Button>
                                    </CardBody>
                                </Card>
                        }
                    </Colxx>
                </Row>
            </Fragment>
        )
    }
}

const mapStateToProps = ({authUser}) => {
    const {token: apiToken} = authUser;
    return {apiToken};
};

export default injectIntl(
    connect(
        mapStateToProps,
        {}
    )(CategoryEdit)
);