import {
    LOAD_PRODUCT_SUCCESS,
    LOAD_PRODUCT_FAIL,
    TOGGLE_PRODUCT_STATE,
    TOGGLE_PRODUCT_STATE_SUCCESS,
    TOGGLE_PRODUCT_STATE_FAIL,
    CHANGE_PRODUCTS_STATE_SUCCESS,
    CHANGE_PRODUCTS_STATE_FAIL
} from "../actions";

const INIT_STATE = {
    items: [],
    totalPage: 1,
    totalItem: 0,
    toggleItems: []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOAD_PRODUCT_SUCCESS:
            return {
                ...state,
                items: action.payload.data,
                totalItem: action.payload.totalItem,
                totalPage: action.payload.totalPage
            };
        case LOAD_PRODUCT_FAIL:
            return {
                ...state,
                items: [],
                totalItem: 0,
                totalPage: 1
            };
        case TOGGLE_PRODUCT_STATE:
            return {
                ...state,
                toggleItems: action.payload,
            };
        case TOGGLE_PRODUCT_STATE_SUCCESS:
            return {
                ...state,
                items: toggleProductState(state.items, action.payload),
                toggleItems: []
            };
        case CHANGE_PRODUCTS_STATE_SUCCESS:
            return {
                ...state,
                items: updateProductState(state.items, action.payload.productIds, action.payload.state),
                toggleItems: []
            }
        case TOGGLE_PRODUCT_STATE_FAIL:
        case CHANGE_PRODUCTS_STATE_FAIL:
            return {
                ...state,
                toggleItems: []
            }
        default:
            return {...state};
    }
}

const toggleProductState = (products, productId) => {
    return products.map(product => {
        if (product['id'] !== productId) return product;
        return {
            ...product,
            show_flag: 1 - product.show_flag
        }
    });
}

const updateProductState = (products, productIds, state) => {
    return products.map(product => {
        if (productIds.indexOf(product['id']) < 0) return product;
        return {
            ...product,
            show_flag: state
        }
    });
}