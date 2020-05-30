import React, {Component, useState} from "react";
import {
    Card,
    CustomInput,
    Badge,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import {NavLink} from "react-router-dom";
import classnames from "classnames";
import {ContextMenuTrigger} from "react-contextmenu";
import {Colxx} from "../../components/common/CustomBootstrap";
import {productImagePath} from "../../constants/defaultValues";

class ThumbListView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            actionButtonOpen: false,
            active: this.props.product.show_flag
        };
    }

    handleToggle = (e) => {
        e.stopPropagation();
        this.setState({
            actionButtonOpen: !this.state.actionButtonOpen
        });
    }
    handleState = () => {
        this.setState({
            active: 1 - this.state.active
        });
    }

    render() {
        const {product, isSelect, collect, onCheckItem} = this.props;
        const {actionButtonOpen, active} = this.state;
        return (
            <Colxx xxs="12" key={product.id} className="mb-3">
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
                                    {product.category.name}
                                </p>
                                <p className="mb-1 text-muted text-small w-15 w-sm-100">
                                    {product.currency !== null ? (product.price + ' ' + product.currency.name) : ''}
                                </p>
                                <div className="w-15 w-sm-100">
                                    <Badge color={active === 1 ? 'primary' : 'secondary'} pill>
                                        {active === 1 ? 'ACTIVE' : 'INACTIVE'}
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
                                            {active === 1 ? 'Inactivate' : 'Activate'}
                                        </DropdownItem>
                                        <DropdownItem>Delete</DropdownItem>
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
export default React.memo(ThumbListView);
