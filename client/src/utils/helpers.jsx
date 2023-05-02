import { message, notification } from 'antd'

const successMessage = (desc = 'Successfully Complete!') => {
    return message.success(desc ,[0.8])
}

const infoMessage = (desc = 'Successfully Complete!') => {
    return message.info(desc ,[0.8])
}

const errorMessage = (desc = 'Oops Something Went Wrong!') => {
    return message.error(desc ,[0.8])
}
const warningMessage = (desc = 'Warning!') => {
    return message.warning(desc ,[0.8])
}

const validateEmail = (e) => {
    return String(e).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

export {
    successMessage,
    infoMessage,
    errorMessage,
    warningMessage,
    validateEmail
}