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
import errorMessage from "../../constants/errorMessages";
import {connect} from "react-redux";
import {NotificationManager} from "../../components/common/react-notifications";

class AddNewModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            status: "",
            loading: false
        };
    }

    onChange = e => {
        this.setState({
            name: e.target.value
        });
    }

    onStatusChange = e => {
        this.setState({
            status: e.target.value
        });
    }

    onSubmit = () => {
        const {name, status, loading} = this.state;
        if (!loading && name !== "") {
            this.setState({loading: true});
            axios
                .post(servicePath + "/categories/add", {
                    "category-name": name,
                    "status": status
                }, {
                    headers: {
                        'X-API-TOKEN': tokenPrefix + this.props.apiToken
                    }
                })
                .then(response => {
                    this.setState({
                        name: "",
                        status: "",
                        loading: false
                    });
                    if (response.status === 200 && response.data['message'] === "") {
                        NotificationManager.success(
                            "Successfully Added Category",
                            "Success",
                            3000,
                            null,
                            null,
                            ''
                        );
                        this.props.toggleModal();
                        this.props.dataListRender();
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

        return (
            <Modal
                isOpen={this.props.modalOpen}
                toggle={this.props.toggleModal}
                wrapClassName="modal-right"
                backdrop="static"
            >
                <ModalHeader toggle={this.props.toggleModal}>
                    <IntlMessages id="pages.add-new-modal-title"/>
                </ModalHeader>
                <ModalBody>
                    <Label>
                        <IntlMessages id="pages.category-name"/>
                    </Label>
                    <Input onChange={this.onChange}/>

                    <Label className="mt-4">
                        <IntlMessages id="pages.status"/>
                    </Label>
                    <CustomInput
                        type="radio"
                        id="exCustomRadio"
                        name="customRadio"
                        label="ON HOLD"
                        value="0"
                        onChange={this.onStatusChange}
                    />
                    <CustomInput
                        type="radio"
                        id="exCustomRadio2"
                        name="customRadio"
                        label="PROCESSED"
                        value="1"
                        onChange={this.onStatusChange}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" outline onClick={this.props.toggleModal}>
                        <IntlMessages id="pages.cancel"/>
                    </Button>
                    <Button
                        color="primary"
                        className={`btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`}
                        onClick={this.onSubmit}
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

