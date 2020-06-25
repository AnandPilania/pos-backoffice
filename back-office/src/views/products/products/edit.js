import React, {Component, Fragment} from "react";
import {Row, Card, CardBody, Label, Input, FormGroup, Button} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from "axios";
import {productImagePath, servicePath, tokenPrefix} from "../../../constants/defaultValues";
import {NotificationManager} from "../../../components/common/react-notifications";
import errorMessage from "../../../constants/errorMessages";
import {connect} from "react-redux";
import ImageUploader from "react-images-upload";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import Select from "react-select";
import {injectIntl} from "react-intl";

class ProductEdit extends Component {

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
            .get(servicePath + "/products/get", {
                params: {
                    productId: this.props.match.params.productId,
                },
                headers: {
                    'X-API-TOKEN': tokenPrefix + this.props.apiToken
                }
            })
            .then(response => response['data'])
            .then(data => {
                if (data['message'] === "") {
                    const category = data['data']['categoryList'].filter(item => item.value === data['data']['product'].category_id)
                    const currency = data['data']['currencyList'].filter(item => item.value === data['data']['product'].currency_id)
                    this.setState({
                        loading: false,
                        name: data['data']['product']['name'],
                        price: data['data']['product']['price'],
                        description: data['data']['product']['description'],
                        image: data['data']['product']['picture'],
                        categoryList: data['data']['categoryList'],
                        currencyList: data['data']['currencyList'],
                        state: data['data']['product']['show_flag'] === 1 ?
                            {'label': this.props.intl.messages['pages.active'], 'value': 1} :
                            {'label': this.props.intl.messages['pages.inactive'], 'value': 0},
                        category: category.length > 0 ? category[0] : {},
                        currency: currency.length > 0 ? currency[0] : {},
                    });
                } else {
                    this.props.history.push('/products/products');
                }
            })
            .catch(error => {
                this.props.history.push('/products/products');
            });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onDropImage = image => {
        this.setState({
            newImage: image
        });
    }

    handleCategoryChange = category => {
        this.setState({category});
    }

    handleStateChange = state => {
        this.setState({state});
    }

    handleCurrencyChange = currency => {
        this.setState({currency});
    }

    onSubmit = () => {
        const {loading, uploading, name, price, description, category, currency, state} = this.state;

        if (!loading && !uploading) {

            const data = new FormData();
            data.append('id', this.props.match.params.productId);
            data.append('name', name);
            data.append('description', description);
            data.append('category', category.value);
            data.append('price', price);
            data.append('state', state.value);
            data.append('currency', currency.value);

            if (this.state.newImage != null && this.state.newImage.length > 0) {
                data.append('image', this.state.newImage[0]);
            }

            this.setState({uploading: true});

            axios
                .post(servicePath + "/products/update", data, {
                    headers: {
                        'X-API-TOKEN': tokenPrefix + this.props.apiToken
                    }
                })
                .then(response => {
                    this.setState({
                        uploading: false,
                        newImage: []
                    });
                    if (response.status === 200 && response.data['message'] === "") {
                        if (response.data['data'].length > 0) {
                            this.setState({
                                image: response.data['data'][0]
                            });
                        }
                        NotificationManager.success(
                            "Product Successfully Updated",
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
            category,
            price,
            description,
            state,
            image,
            currency,
            categoryList,
            currencyList
        } = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.product-edit" match={this.props.match}/>
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
                                            <Colxx xxs="12" xl="8" className="col-left">
                                                <FormGroup>
                                                    <Label for="name">Product Name</Label>
                                                    <Input type="text" id="name" name="name" value={name}
                                                           onChange={this.onChange}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="category">Category</Label>
                                                    <Select
                                                        id="category"
                                                        components={{Input: CustomSelectInput}}
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                        onChange={this.handleCategoryChange}
                                                        value={category}
                                                        options={categoryList}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="price">Price</Label>
                                                    <Input type="text" id="price" value={price ?? ''} name="price"
                                                           onChange={this.onChange}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="currency">Currency</Label>
                                                    <Select
                                                        id="currency"
                                                        components={{Input: CustomSelectInput}}
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                        onChange={this.handleCurrencyChange}
                                                        value={currency}
                                                        options={currencyList}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="description">Description</Label>
                                                    <Input type="textarea" id="description" name="description"
                                                           value={description} onChange={this.onChange}/>
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
                                            <Colxx xxs="12" xl="4" className="col-right">
                                                {
                                                    image != null ?
                                                        <img src={`${productImagePath}/appview/${image}`}
                                                             className="card-img-top"
                                                             alt="Company Logo"/> : ""
                                                }

                                                <ImageUploader
                                                    withPreview={true}
                                                    key={image != null ? image : '1'}
                                                    onChange={this.onDropImage}
                                                    singleImage={true}
                                                    buttonText="Choose Image"
                                                />
                                            </Colxx>
                                        </Row>
                                        <Button
                                            color="secondary"
                                            size="lg"
                                            outline
                                            className="mr-3"
                                            onClick={() => this.props.history.push('/products/products')}
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
    )(ProductEdit));