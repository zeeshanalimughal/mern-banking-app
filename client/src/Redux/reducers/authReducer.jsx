import { LOGIN_USER, REMOVE_USER } from '../types'

const reducer = (state = {}, action) => {
    switch (action.type) {
        case LOGIN_USER: {
            return { ...state, user: action.user }
        }
        case REMOVE_USER: {
            return state = {}
        }
        default: {
            return state
        }
    }
}
export default reducer