import {
    LOAD_PRODUCT_SUCCESS,
    LOAD_PRODUCT_FAIL,
    TOGGLE_PRODUCT_STATE,
    TOGGLE_PRODUCT_STATE_SUCCESS,
    TOGGLE_PRODUCT_STATE_FAIL,
    CHANGE_PRODUCTS_STATE_SUCCESS,
    CHANGE_PRODUCTS_STATE_FAIL
} from "../actions";
import axios from "axios";
import {tokenPrefix, servicePath} from "../../constants/defaultValues";

export const getProduct = (pageInfo) => async (dispatch, getState) => {
    return axios
        .get(
            `${servicePath}/products/paging`, {
                params: {
                    pageSize: pageInfo.selectedPageSize,
                    currentPage: pageInfo.currentPage,
                    orderBy: pageInfo.selectedOrderOption.column,
                    search: pageInfo.search
                },
                headers: {
                    'X-API-TOKEN': tokenPrefix + getState().authUser.token
                }
            }
        )
        .then(res => res.data['data'])
        .then(data => {
            dispatch({
                type: LOAD_PRODUCT_SUCCESS,
                payload: data
            });
            return true;
        })
        .catch(error => {
            dispatch({
                type: LOAD_PRODUCT_FAIL,
            });
            return false;
        });
}

export const toggleProductState = (productId) => (dispatch, getState) => {
    dispatch({
        type: TOGGLE_PRODUCT_STATE,
        payload: [productId]
    });
    axios
        .post(servicePath + "/products/toggleActive", {
            productId
        }, {
            headers: {
                'X-API-TOKEN': tokenPrefix + getState().authUser.token
            }
        })
        .then(response => response['data'])
        .then(data => {
            if (data['message'] === "") {
                dispatch({
                    type: TOGGLE_PRODUCT_STATE_SUCCESS,
                    payload: productId
                });
            } else {
                dispatch({
                    type: TOGGLE_PRODUCT_STATE_FAIL
                });
            }

        })
        .catch(error => {
            dispatch({
                type: TOGGLE_PRODUCT_STATE_FAIL
            });
        });
}

export const changeProductsState = (productIds, state) => (dispatch, getState) => {
    dispatch({
        type: TOGGLE_PRODUCT_STATE,
        payload: productIds
    });
    axios
        .post(servicePath + "/products/changeState", {
            productIds: JSON.stringify(productIds),
            state
        }, {
            headers: {
                'X-API-TOKEN': tokenPrefix + getState().authUser.token
            }
        })
        .then(response => response['data'])
        .then(data => {
            if (data['message'] === "") {
                dispatch({
                    type: CHANGE_PRODUCTS_STATE_SUCCESS,
                    payload: {
                        productIds,
                        state
                    }
                });
            } else {
                dispatch({
                    type: CHANGE_PRODUCTS_STATE_FAIL
                });
            }

        })
        .catch(error => {
            dispatch({
                type: CHANGE_PRODUCTS_STATE_FAIL
            });
        });
}

export const deleteProducts = (productIds) => async (dispatch, getState) => {
    return axios
        .delete(
            `${servicePath}/products/delete`, {
                data: {
                    productIds: JSON.stringify(productIds)
                },
                headers: {
                    'X-API-TOKEN': tokenPrefix + getState().authUser.token
                }
            }
        )
        .then(res => {
            return res.data['data'];
        })
        .then(data => {
            return true;
        })
        .catch(error => {
            return false;
        });
}