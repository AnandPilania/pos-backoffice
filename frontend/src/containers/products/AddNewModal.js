import React, {Component} from "react";
import {
    CustomInput,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Label
} from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import axios from "axios";
import {servicePath, tokenPrefix} from "../../constants/defaultValues";
import {NotificationManager} from "../../components/common/react-notifications";
import errorMessage from "../../constants/errorMessages";
import {connect} from "react-redux";

class AddNewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            status: "",
            loading: false,
            category: "0"
        };
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onStatusChange = e => {
        this.setState({
            status: e.target.value
        });
    }

    onSubmit = () => {
        const {name, status, loading, description, category} = this.state;

        if (!loading && name !== "" && category !== "0") {
            this.setState({loading: true});
            axios
                .post(servicePath + "/products/add", {
                    name,
                    description,
                    status,
                    category
                }, {
                    headers: {
                        'X-API-TOKEN': tokenPrefix + this.props.apiToken
                    }
                })
                .then(response => {
                    this.setState({
                        name: "",
                        status: "",
                        description: "",
                        category: "0",
                        loading: false
                    });
                    if (response.status === 200 && response.data['message'] === "") {
                        NotificationManager.success(
                            "Product Successfully Added",
                            "Success",
                            3000,
                            null,
                            null,
                            ''
                        );
                        this.props.history.push(this.props.match.url + '/edit/' + response.data['data']);
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
                        name: "",
                        status: "",
                        description: "",
                        category: "0",
                        loading: false
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
        const {modalOpen, toggleModal, categories} = this.props;
        return (
            <Modal
                isOpen={modalOpen}
                toggle={toggleModal}
                wrapClassName="modal-right"
                backdrop="static"
            >
                <ModalHeader toggle={toggleModal}>
                    <IntlMessages id="pages.add-new-modal-title"/>
                </ModalHeader>
                <ModalBody>
                    <Label>
                        <IntlMessages id="pages.product-name"/>
                    </Label>
                    <Input name="name" onChange={this.onChange}/>
                    <Label className="mt-4">
                        <IntlMessages id="pages.category"/>
                    </Label>
                    <Input type="select" name="category" onChange={this.onChange}>
                        <option value="0">Select category</option>
                        {
                            categories.map((category, index) =>
                                <option value={category.value} key={index}>{category.label}</option>
                            )
                        }
                    </Input>
                    <Label className="mt-4">
                        <IntlMessages id="pages.description"/>
                    </Label>
                    <Input type="textarea" name="description" id="exampleText" onChange={this.onChange}/>
                    <Label className="mt-4">
                        <IntlMessages id="pages.status"/>
                    </Label>
                    <CustomInput
                        type="radio"
                        id="exCustomRadio"
                        name="customRadio"
                        label="INACTIVE"
                        value="0"
                        onChange={this.onStatusChange}
                    />
                    <CustomInput
                        type="radio"
                        id="exCustomRadio2"
                        name="customRadio"
                        label="ACTIVE"
                        value="1"
                        onChange={this.onStatusChange}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" outline onClick={toggleModal}>
                        <IntlMessages id="pages.cancel"/>
                    </Button>
                    <Button
                        onClick={this.onSubmit}
                        color="primary"
                        className={`btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`}
                    >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label"><IntlMessages id="pages.submit" /></span>
                    </Button>{" "}
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = ({authUser}) => {
    const {token: apiToken} = authUser;
    return {apiToken};
};

export default connect(
    mapStateToProps,
    {}
)(AddNewModal);