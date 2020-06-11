import React, {Component} from "react";
import {
    Card,
    CustomInput,
    Badge,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, ModalHeader, ModalBody, ModalFooter, Button, Modal
} from "reactstrap";
import {NavLink} from "react-router-dom";
import classnames from "classnames";
import {ContextMenuTrigger} from "react-contextmenu";
import {Colxx} from "../../components/common/CustomBootstrap";
import {productImagePath} from "../../constants/defaultValues";
import {connect} from "react-redux";
import {toggleProductState} from "../../redux/products/actions";
import {injectIntl} from "react-intl";

class ThumbListView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            actionButtonOpen: false,
            confirmModalOpen: false
        };
    }

    handleToggle = (e) => {
        e.stopPropagation();
        this.setState({
            actionButtonOpen: !this.state.actionButtonOpen
        });
    }
    handleState = () => {
        this.props.toggleProductState(this.props.product.id);
    }
    toggleDeleteConfirmModal = () => {
        this.setState({
            confirmModalOpen: !this.state.confirmModalOpen
        })
    }

    render() {
        const {product, isSelect, collect, onCheckItem, toggleItems, onDelete, intl} = this.props;
        const {actionButtonOpen, confirmModalOpen} = this.state;
        return (
            <Colxx xxs="12" key={product.id} className="mb-3">
                <Modal isOpen={confirmModalOpen} toggle={this.toggleDeleteConfirmModal}>
                    <ModalHeader>Delete Product</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete selected product?
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => onDelete(product.id)} size="lg" color="primary">Yes</Button>
                        <Button onClick={this.toggleDeleteConfirmModal} outline size="lg" color="secondary">Cancel</Button>
                    </ModalFooter>
                </Modal>
                <ContextMenuTrigger id="menu_id" data={product.id} collect={collect}>
                    <Card
                        onClick={event => onCheckItem(event, product.id)}
                        className={classnames("d-flex flex-row", {
                            active: isSelect
                        })}
                    >
                        <NavLink to={`products/edit/${product.id}`} className="d-flex">
                            <img
                                alt={product.name}
                                src={productImagePath + "/thumbnail/" + product.picture}
                                className="list-thumbnail responsive border-0 card-img-left"
                            />
                        </NavLink>
                        <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                            <div
                                className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                                <NavLink to={`products/edit/${product.id}`} className="w-40 w-sm-100">
                                    <p className="list-item-heading mb-1 truncate">
                                        {product.name}
                                    </p>
                                </NavLink>
                                <p className="mb-1 text-muted text-small w-15 w-sm-100">
                                    {product.category !== null ? product.category.name : ''}
                                </p>
                                <p className="mb-1 text-muted text-small w-15 w-sm-100">
                                    {product.currency !== null ? (product.price + ' ' + product.currency.name) : ''}
                                </p>
                                <div className="w-15 w-sm-100">
                                    <Badge color={
                                        toggleItems.indexOf(product.id) !== -1 ? 'info' : (product.show_flag === 1 ? 'primary' : 'danger')}
                                           pill>
                                        {toggleItems.indexOf(product.id) !== -1 ?
                                            <div className="show-spinner badge-multiple-state badge">
                                                <span className="spinner d-inline-block">
                                                  <span className="bounce1"/>
                                                  <span className="bounce2"/>
                                                  <span className="bounce3"/>
                                                </span>
                                            </div> : (product.show_flag === 1 ?
                                                intl.messages['pages.active-c'] :
                                                intl.messages['pages.inactive-c'])}
                                    </Badge>
                                </div>
                            </div>
                            <div className="pl-1 align-self-center pr-4">
                                <ButtonDropdown
                                    isOpen={actionButtonOpen}
                                    toggle={e => this.handleToggle(e)}
                                >
                                    <DropdownToggle caret size="sm" outline color="primary">
                                        Action
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <NavLink to={`products/edit/${product.id}`}>
                                            <DropdownItem>Edit</DropdownItem>
                                        </NavLink>
                                        <DropdownItem onClick={this.handleState}>
                                            {product.show_flag === 1 ?
                                                intl.messages['pages.inactivate']:
                                                intl.messages['pages.activate']}
                                        </DropdownItem>
                                        <DropdownItem onClick={this.toggleDeleteConfirmModal}>
                                            Delete
                                        </DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                            <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                                <CustomInput
                                    className="item-check mb-0"
                                    type="checkbox"
                                    id={`check_${product.id}`}
                                    checked={isSelect}
                                    onChange={() => {
                                    }}
                                    label=""
                                />
                            </div>
                        </div>
                    </Card>
                </ContextMenuTrigger>
            </Colxx>
        );
    }

}

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
const mapStateToProps = ({products}) => {
    const {toggleItems} = products;
    return {toggleItems};
};
export default injectIntl(
    connect(
        mapStateToProps,
        {
            toggleProductState
        }
    )(ThumbListView)
);
