import { LOGIN_USER, REMOVE_USER } from '../types'

const loginUser = (user) => {
    return {
        type: LOGIN_USER,
        user
    }
}

const removeUser = () => {
    return {
        type: REMOVE_USER
    }
}


export {
    loginUser,
    removeUser
}