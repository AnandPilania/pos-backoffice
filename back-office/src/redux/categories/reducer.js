import {
    LOAD_CATEGORY_SUCCESS,
    LOAD_CATEGORY_FAIL,
    TOGGLE_CATEGORY_STATE,
    TOGGLE_CATEGORY_STATE_SUCCESS,
    TOGGLE_CATEGORY_STATE_FAIL,
    CHANGE_CATEGORIES_STATE_SUCCESS,
    CHANGE_CATEGORIES_STATE_FAIL
} from "../actions";

const INIT_STATE = {
    items: [],
    totalPage: 1,
    totalItem: 0,
    toggleItems: []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOAD_CATEGORY_SUCCESS:
            return {
                ...state,
                items: action.payload.data,
                totalItem: action.payload.totalItem,
                totalPage: action.payload.totalPage
            };
        case LOAD_CATEGORY_FAIL:
            return {
                ...state,
                items: [],
                totalItem: 0,
                totalPage: 1
            };
        case TOGGLE_CATEGORY_STATE:
            return {
                ...state,
                toggleItems: action.payload,
            };
        case TOGGLE_CATEGORY_STATE_SUCCESS:
            return {
                ...state,
                items: toggleCategoryState(state.items, action.payload),
                toggleItems: []
            };
        case CHANGE_CATEGORIES_STATE_SUCCESS:
            return {
                ...state,
                items: updateCategoriesState(state.items, action.payload.categoryIds, action.payload.state),
                toggleItems: []
            }
        case TOGGLE_CATEGORY_STATE_FAIL:
        case CHANGE_CATEGORIES_STATE_FAIL:
            return {
                ...state,
                toggleItems: []
            }
        default:
            return {...state};
    }
}

const toggleCategoryState = (categories, categoryId) => {
    return categories.map(category => {
        if (category['id'] !== categoryId) return category;
        return {
            ...category,
            show_flag: 1 - category.show_flag
        }
    });
}

const updateCategoriesState = (categories, categoryIds, state) => {
    return categories.map(category => {
        if (categoryIds.indexOf(category['id']) < 0) return category;
        return {
            ...category,
            show_flag: state
        }
    });
}