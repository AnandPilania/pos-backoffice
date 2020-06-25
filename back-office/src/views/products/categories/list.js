import React, { Component, Fragment } from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import Pagination from "../../../containers/products/Pagination";
import {
    getCategoryList,
    changeCategoriesState,
    deleteCategories
} from "../../../redux/actions";
import ListPageHeading from "../../../containers/products/ListPageHeading";
import AddNewModal from "../../../containers/categories/AddNewModal";
import DataListView from "../../../containers/categories/CategoryListView";
import {connect} from "react-redux";

function collect(props) {
    return { data: props.data };
}

class CategoryListPages extends Component {
    constructor(props) {
        super(props);
        this.mouseTrap = require('mousetrap');
        this.state = {
            displayMode: "list",

            selectedPageSize: 8,
            orderOptions: [
                { column: "", label: "Default" },
                { column: "name", label: "Name" },
                { column: "status", label: "Status" }
            ],
            pageSizes: [8, 12, 24],

            selectedOrderOption: { column: "", label: "Default" },
            dropdownSplitOpen: false,
            modalOpen: false,
            currentPage: 1,
            totalItemCount: 0,
            totalPage: 1,
            search: "",
            selectedItems: [],
            lastChecked: null,
            isLoading: false,

            confirmModalOpen: false
        };
    }

    componentDidMount() {
        this.dataListRender();
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
            var items = this.state.items;
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

        this.props.getCategoryList({
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

    handleEditAction = () => {
        if (this.state.selectedItems.length === 1)
            this.props.history.push(this.props.match.url + '/edit/' + this.state.selectedItems[0]);
    }

    handleActivate = () => {
        if (this.state.selectedItems.length > 0)
            this.props.changeCategoriesState(this.state.selectedItems, 1);
    }

    handleInactivate = () => {
        if (this.state.selectedItems.length > 0)
            this.props.changeCategoriesState(this.state.selectedItems, 0);
    }

    handleDelete = () => {
        this.toggleDeleteConfirmModal();
    }

    handleDeleteSelectedCategory = (categoryId) => {
        this.setState({
            isLoading: false
        });
        this.props.deleteCategories([categoryId])
            .then(res => res ? this.dataListRender() : {});
    }

    deleteCategory = () => {
        this.toggleDeleteConfirmModal();
        this.setState({
            isLoading: false
        });
        this.props.deleteCategories(this.state.selectedItems)
            .then(res => res ? this.dataListRender() : {});
    }
    render() {
        const {
            currentPage,
            selectedPageSize,
            selectedOrderOption,
            selectedItems,
            orderOptions,
            pageSizes,
            modalOpen,
            confirmModalOpen
        } = this.state;
        const {
            items,
            totalItem: totalItemCount,
            totalPage,
            match } = this.props;
        const startIndex = (currentPage - 1) * selectedPageSize;
        const endIndex = currentPage * selectedPageSize;

        return (
            <Fragment>
                <div className="disable-text-selection">
                    <ListPageHeading
                        heading="menu.categories"
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
                        <ModalHeader toggle={this.toggleDeleteConfirmModal}>Delete Category</ModalHeader>
                        <ModalBody>
                            Are you sure you want to delete selected category(s)?
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={this.deleteCategory} size="lg" color="primary">Yes</Button>
                            <Button onClick={this.toggleDeleteConfirmModal} size="lg" outline color="secondary">Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    <AddNewModal
                        modalOpen={modalOpen}
                        dataListRender={this.dataListRender.bind(this)}
                        toggleModal={this.toggleModal}
                    />
                    {
                        !this.state.isLoading ? (
                            <div className="loading"/>
                        ) :
                        <Row>
                            {items.map(category => {

                                return (
                                    <DataListView
                                        key={category.id}
                                        product={category}
                                        isSelect={this.state.selectedItems.includes(category.id)}
                                        onCheckItem={this.onCheckItem}
                                        collect={collect}
                                        onDelete={this.handleDeleteSelectedCategory}
                                    />
                                );

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

const mapStateToProps = ({ categories }) => {
    const { items, totalItem, totalPage } = categories;
    return { items, totalItem, totalPage };
};

export default connect(
    mapStateToProps,
    {
        getCategoryList,
        changeCategoriesState,
        deleteCategories
    }
)(CategoryListPages);

