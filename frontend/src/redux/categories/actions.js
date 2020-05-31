import {
    LOAD_CATEGORY_SUCCESS,
    LOAD_CATEGORY_FAIL,
    TOGGLE_CATEGORY_STATE,
    TOGGLE_CATEGORY_STATE_SUCCESS,
    TOGGLE_CATEGORY_STATE_FAIL,
    CHANGE_CATEGORIES_STATE_SUCCESS,
    CHANGE_CATEGORIES_STATE_FAIL
} from "../actions";
import axios from "axios";
import {tokenPrefix, servicePath} from "../../constants/defaultValues";

export const getCategoryList = (pageInfo) => async (dispatch, getState) => {
    return axios
        .get(
            `${servicePath}/categories/paging`, {
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
                type: LOAD_CATEGORY_SUCCESS,
                payload: data
            });
            return true;
        })
        .catch(error => {
            dispatch({
                type: LOAD_CATEGORY_FAIL,
            });
            return false;
        });
}

export const toggleCategoryState = (categoryId) => (dispatch, getState) => {
    dispatch({
        type: TOGGLE_CATEGORY_STATE,
        payload: [categoryId]
    });
    axios
        .post(servicePath + "/categories/toggleActive", {
            categoryId
        }, {
            headers: {
                'X-API-TOKEN': tokenPrefix + getState().authUser.token
            }
        })
        .then(response => response['data'])
        .then(data => {
            if (data['message'] === "") {
                dispatch({
                    type: TOGGLE_CATEGORY_STATE_SUCCESS,
                    payload: categoryId
                });
            } else {
                dispatch({
                    type: TOGGLE_CATEGORY_STATE_FAIL
                });
            }

        })
        .catch(error => {
            dispatch({
                type: TOGGLE_CATEGORY_STATE_FAIL
            });
        });
}

export const changeCategoriesState = (categoryIds, state) => (dispatch, getState) => {
    dispatch({
        type: TOGGLE_CATEGORY_STATE,
        payload: categoryIds
    });
    axios
        .post(servicePath + "/categories/changeState", {
            categoryIds: JSON.stringify(categoryIds),
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
                    type: CHANGE_CATEGORIES_STATE_SUCCESS,
                    payload: {
                        categoryIds,
                        state
                    }
                });
            } else {
                dispatch({
                    type: CHANGE_CATEGORIES_STATE_FAIL
                });
            }

        })
        .catch(error => {
            dispatch({
                type: CHANGE_CATEGORIES_STATE_FAIL
            });
        });
}

export const deleteCategories = (categoryIds) => async (dispatch, getState) => {
    return axios
        .delete(
            `${servicePath}/categories/delete`, {
                data: {
                    categoryIds: JSON.stringify(categoryIds)
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