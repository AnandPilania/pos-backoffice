import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import axios from "axios";

import { servicePath, tokenPrefix } from "../../../constants/defaultValues";

import Pagination from "../../../containers/products/Pagination";
import ContextMenuContainer from "../../../containers/products/ContextMenuContainer";
import ListPageHeading from "../../../containers/products/ListPageHeading";
import AddNewModal from "../../../containers/categories/AddNewModal";
import DataListView from "../../../containers/categories/CategoryListView";
import {connect} from "react-redux";

function collect(props) {
    return { data: props.data };
}
const apiUrl = servicePath + "/categories/paging";

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

            categories: [
                { label: "Cakes", value: "Cakes", key: 0 },
                { label: "Cupcakes", value: "Cupcakes", key: 1 },
                { label: "Desserts", value: "Desserts", key: 2 }
            ],

            selectedOrderOption: { column: "", label: "Default" },
            dropdownSplitOpen: false,
            modalOpen: false,
            currentPage: 1,
            totalItemCount: 0,
            totalPage: 1,
            search: "",
            selectedItems: [],
            lastChecked: null,
            isLoading: false
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
        if (this.state.selectedItems.length >= this.state.items.length) {
            if (isToggle) {
                this.setState({
                    selectedItems: []
                });
            }
        } else {
            this.setState({
                selectedItems: this.state.items.map(x => x.id)
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

        axios
            .get(
                `${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${
                    selectedOrderOption.column
                }&search=${search}`, {
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
                    totalPage: data.totalPage,
                    items: data.data,
                    selectedItems: [],
                    totalItemCount: data.totalItem,
                    isLoading: true
                });
            });
    }

    onContextMenuClick = (e, data, target) => {
        console.log(
            "onContextMenuClick - selected items",
            this.state.selectedItems
        );
        console.log("onContextMenuClick - action : ", data.action);
    };

    onContextMenu = (e, data) => {
        const clickedProductId = data.data;
        if (!this.state.selectedItems.includes(clickedProductId)) {
            this.setState({
                selectedItems: [clickedProductId]
            });
        }

        return true;
    };

    render() {
        const {
            currentPage,
            items,
            selectedPageSize,
            totalItemCount,
            selectedOrderOption,
            selectedItems,
            orderOptions,
            pageSizes,
            modalOpen,
            categories
        } = this.state;
        const { match } = this.props;
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
                        selectedItemsLength={selectedItems ? selectedItems.length : 0}
                        itemsLength={items ? items.length : 0}
                        onSearchKey={this.onSearchKey}
                        orderOptions={orderOptions}
                        pageSizes={pageSizes}
                        toggleModal={this.toggleModal}
                    />
                    <AddNewModal
                        modalOpen={modalOpen}
                        dataListRender={this.dataListRender.bind(this)}
                        toggleModal={this.toggleModal}
                        categories={categories}
                    />
                    {
                        !this.state.isLoading ? (
                            <div className="loading"/>
                        ) :
                        <Row>
                            {items.map(product => {

                                return (
                                    <DataListView
                                        key={product.id}
                                        product={product}
                                        isSelect={this.state.selectedItems.includes(product.id)}
                                        onCheckItem={this.onCheckItem}
                                        collect={collect}
                                    />
                                );

                            })}{" "}
                            <Pagination
                                currentPage={this.state.currentPage}
                                totalPage={this.state.totalPage}
                                onChangePage={i => this.onChangePage(i)}
                            />
                            <ContextMenuContainer
                                onContextMenuClick={this.onContextMenuClick}
                                onContextMenu={this.onContextMenu}
                                selectedItemsLength={selectedItems ? selectedItems.length : 0}
                            />
                        </Row>
                    }
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ authUser }) => {
    const { token: apiToken } = authUser;
    return { apiToken };
};

export default connect(
    mapStateToProps,
    {}
)(CategoryListPages);

