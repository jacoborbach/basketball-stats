import { createStore, combineReducers } from "redux";
import playerReducer from './playerReducer'

const rootReducer = combineReducers({
    playerReducer
})

export default createStore(rootReducer);
