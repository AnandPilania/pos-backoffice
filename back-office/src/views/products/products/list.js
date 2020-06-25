import React, {Component, Fragment} from "react";
import {Row, Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import axios from "axios";

import {servicePath, tokenPrefix} from "../../../constants/defaultValues";

import {
    getProduct,
    changeProductsState,
    deleteProducts
} from "../../../redux/actions";
import Pagination from "../../../containers/products/Pagination";
import ListPageHeading from "../../../containers/products/ListPageHeading";
import ThumbListView from "../../../containers/products/ThumbListView";
import AddNewModal from "../../../containers/products/AddNewModal";
import ImageListView from "../../../containers/products/ImageListView";
import DataListView from "../../../containers/products/DataListView";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";

function collect(props) {
    return {data: props.data};
}

class ProductListPages extends Component {
    constructor(props) {
        super(props);
        this.mouseTrap = require('mousetrap');
        this.state = {
            displayMode: "thumblist",

            selectedPageSize: 8,
            orderOptions: [
                {column: "", label: "Default"},
                {column: "name", label: "Product Name"},
                {column: "category", label: "Category"},
                {column: "status", label: "Status"}
            ],
            pageSizes: [8, 12, 24],

            categories: [],

            selectedOrderOption: {column: "", label: "Default"},
            dropdownSplitOpen: false,
            modalOpen: false,
            currentPage: 1,
            search: "",
            selectedItems: [],
            lastChecked: null,
            isLoading: false,

            confirmModalOpen: false
        };
    }

    componentDidMount() {

        this.dataListRender();
        this.getCategoryList();
        this.mouseTrap.bind(["ctrl+a", "command+a"], () =>
            this.handleChangeSelectAll(false)
        );
        this.mouseTrap.bind(["ctrl+d", "command+d"], () => {
            this.setState({
                selectedItems: []
            });
            return false;
        });
    }

    componentWillUnmount() {
        this.mouseTrap.unbind("ctrl+a");
        this.mouseTrap.unbind("command+a");
        this.mouseTrap.unbind("ctrl+d");
        this.mouseTrap.unbind("command+d");
    }

    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    };

    toggleDeleteConfirmModal = () => {
        this.setState({
            confirmModalOpen: !this.state.confirmModalOpen
        });
    };

    changeOrderBy = column => {
        this.setState(
            {
                selectedOrderOption: this.state.orderOptions.find(
                    x => x.column === column
                )
            },
            () => this.dataListRender()
        );
    };
    changePageSize = size => {
        this.setState(
            {
                selectedPageSize: size,
                currentPage: 1
            },
            () => this.dataListRender()
        );
    };
    changeDisplayMode = mode => {
        this.setState({
            displayMode: mode
        });
        return false;
    };
    onChangePage = page => {
        this.setState(
            {
                currentPage: page
            },
            () => this.dataListRender()
        );
    };

    onSearchKey = e => {
        if (e.key === "Enter") {
            this.setState(
                {
                    search: e.target.value.toLowerCase()
                },
                () => this.dataListRender()
            );
        }
    };

    onCheckItem = (event, id) => {
        if (
            event.target.tagName === "A" ||
            (event.target.parentElement && event.target.parentElement.tagName === "A")
        ) {
            return true;
        }
        if (this.state.lastChecked === null) {
            this.setState({
                lastChecked: id
            });
        }

        let selectedItems = this.state.selectedItems;
        if (selectedItems.includes(id)) {
            selectedItems = selectedItems.filter(x => x !== id);
        } else {
            selectedItems.push(id);
        }
        this.setState({
            selectedItems
        });

        if (event.shiftKey) {
            var items = this.props.items;
            var start = this.getIndex(id, items, "id");
            var end = this.getIndex(this.state.lastChecked, items, "id");
            items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
            selectedItems.push(
                ...items.map(item => {
                    return item.id;
                })
            );
            selectedItems = Array.from(new Set(selectedItems));
            this.setState({
                selectedItems
            });
        }
        document.activeElement.blur();
    };

    getIndex(value, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] === value) {
                return i;
            }
        }
        return -1;
    }

    handleChangeSelectAll = isToggle => {
        if (this.state.selectedItems.length >= this.props.items.length) {
            if (isToggle) {
                this.setState({
                    selectedItems: []
                });
            }
        } else {
            this.setState({
                selectedItems: this.props.items.map(x => x.id)
            });
        }
        document.activeElement.blur();
        return false;
    };


    dataListRender() {
        const {
            selectedPageSize,
            currentPage,
            selectedOrderOption,
            search
        } = this.state;

        this.setState({
            isLoading: false
        });

        this.props.getProduct({
            selectedPageSize,
            currentPage,
            selectedOrderOption,
            search
        }).then(res => {
            this.setState({
                selectedItems: [],
                isLoading: true
            });
        });

    }

    getCategoryList = () => {
        axios
            .get(
                `${servicePath}/categories/all`, {
                    headers: {
                        'X-API-TOKEN': tokenPrefix + this.props.apiToken
                    }
                }
            )
            .then(res => {
                return res.data['data'];
            })
            .then(data => {
                this.setState({
                    categories: data['category_list']
                });
            });
    }

    handleEditAction = () => {
        if (this.state.selectedItems.length === 1)
            this.props.history.push(this.props.match.url + '/edit/' + this.state.selectedItems[0]);
    }

    handleActivate = () => {
        if (this.state.selectedItems.length > 0)
            this.props.changeProductsState(this.state.selectedItems, 1);
    }

    handleInactivate = () => {
        if (this.state.selectedItems.length > 0)
            this.props.changeProductsState(this.state.selectedItems, 0);
    }

    handleDelete = () => {
        this.toggleDeleteConfirmModal();
    }

    handleDeleteSelectedProduct = (productId) => {
        this.setState({
            isLoading: false
        });
        this.props.deleteProducts([productId])
            .then(res => res ? this.dataListRender() : {});
    }

    deleteProduct = () => {
        this.toggleDeleteConfirmModal();
        this.setState({
            isLoading: false
        });
        this.props.deleteProducts(this.state.selectedItems)
            .then(res => res ? this.dataListRender() : {});
    }

    render() {
        const {
            currentPage,
            displayMode,
            selectedPageSize,
            selectedOrderOption,
            selectedItems,
            orderOptions,
            pageSizes,
            modalOpen,
            categories,
            confirmModalOpen
        } = this.state;
        const {
            items,
            totalItem: totalItemCount,
            totalPage,
            match
        } = this.props;
        const startIndex = (currentPage - 1) * selectedPageSize;
        const endIndex = currentPage * selectedPageSize;

        return (
            <Fragment>
                <div className="disable-text-selection">
                    <ListPageHeading
                        heading="menu.products"
                        displayModeEnable={1}
                        displayMode={displayMode}
                        changeDisplayMode={this.changeDisplayMode}
                        handleChangeSelectAll={this.handleChangeSelectAll}
                        changeOrderBy={this.changeOrderBy}
                        changePageSize={this.changePageSize}
                        selectedPageSize={selectedPageSize}
                        totalItemCount={totalItemCount}
                        selectedOrderOption={selectedOrderOption}
                        match={match}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        selectedItems={selectedItems}
                        itemsLength={items ? items.length : 0}
                        onSearchKey={this.onSearchKey}
                        orderOptions={orderOptions}
                        pageSizes={pageSizes}
                        toggleModal={this.toggleModal}
                        handleEditAction={this.handleEditAction}
                        handleActivate={this.handleActivate}
                        handleInactivate={this.handleInactivate}
                        handleDelete={this.handleDelete}
                    />
                    <Modal isOpen={confirmModalOpen} toggle={this.toggleDeleteConfirmModal}>
                        <ModalHeader toggle={this.toggleDeleteConfirmModal}>Delete Product</ModalHeader>
                        <ModalBody>
                            Are you sure you want to delete selected product(s)?
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={this.deleteProduct} size="lg" color="primary">Yes</Button>
                            <Button onClick={this.toggleDeleteConfirmModal} size="lg" outline color="secondary">Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    <AddNewModal
                        toggleModal={this.toggleModal}
                        modalOpen={modalOpen}
                        categories={categories}
                        history={this.props.history}
                        match={this.props.match}
                    />
                    {
                        !this.state.isLoading ? (
                                <div className="loading"/>
                            ) :
                            <Row>
                                {items.map(product => {
                                    if (this.state.displayMode === "imagelist") {
                                        return (
                                            <ImageListView
                                                key={product.id}
                                                product={product}
                                                isSelect={this.state.selectedItems.includes(product.id)}
                                                collect={collect}
                                                onCheckItem={this.onCheckItem}
                                            />
                                        );
                                    } else if (this.state.displayMode === "thumblist") {
                                        return (
                                            <ThumbListView
                                                key={product.id}
                                                product={product}
                                                isSelect={this.state.selectedItems.includes(product.id)}
                                                collect={collect}
                                                onCheckItem={this.onCheckItem}
                                                onDelete={this.handleDeleteSelectedProduct}
                                            />
                                        );
                                    } else {
                                        return (
                                            <DataListView
                                                key={product.id}
                                                product={product}
                                                isSelect={this.state.selectedItems.includes(product.id)}
                                                onCheckItem={this.onCheckItem}
                                                collect={collect}
                                                onDelete={this.handleDeleteSelectedProduct}
                                            />
                                        );
                                    }
                                })}{" "}
                                <Pagination
                                    currentPage={this.state.currentPage}
                                    totalPage={totalPage}
                                    onChangePage={i => this.onChangePage(i)}
                                />
                            </Row>
                    }
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = ({authUser, products}) => {
    const {token: apiToken} = authUser;
    const {items, totalItem, totalPage} = products;
    return {apiToken, items, totalItem, totalPage};
};

export default injectIntl(
    connect(
        mapStateToProps,
        {
            getProduct,
            changeProductsState,
            deleteProducts
        }
    )(ProductListPages)
);

