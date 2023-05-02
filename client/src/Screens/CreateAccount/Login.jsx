import Password from 'antd/lib/input/Password'
import React, { useState } from 'react'
import { Inputs, Button } from '../../Components'
import { collection, getDocs, addDoc, updateDoc, doc, } from 'firebase/firestore'
import { db } from '../../firebase'
import _ from 'lodash'
import { errorMessage, successMessage, validateEmail } from '../../utils/helpers'
import { HOME } from '../../Config/paths'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../Redux/actions/authActions'
import {ExclamationCircleOutlined} from '@ant-design/icons'

const Login = (props) => {
    const { getAllUsers, allUser, history, user } = props
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [successCard, setSuccessCard] = useState(false)
    const dispatch = useDispatch()

    const login = async () => {

        if (!password || !email) {
            setError('Please Provide All Fields.')
            return true
        }
        if (!validateEmail(email)) {
            setError('Invalid Format Of Email')
            return true
        }
        if (password?.length < 8) {
            setError('Your Password Must Be At Least 8 Character')
            return true
        }
        setLoading(true)
        let obj = {
            email: email,
            password: password,
        }
        let alreadyExistEmail = _.find(allUser, {
            email: obj?.email,
            password: obj?.password,
        })
        if (!alreadyExistEmail?.email) {
            setLoading(false)
            errorMessage('Incorrect Email or password')
            return true
        } else {
            setLoading(false)
            setSuccessCard(true)
            successMessage('Successfully Login')
            // sessionStorage.setItem('user', JSON.stringify(alreadyExistEmail))
            // history.push(HOME)
            dispatch(loginUser(alreadyExistEmail))
        }
    }
    // setTimeout(() => {
    //     setError(null)
    // }, 8000)
    return (
        <>
            <div className="container-big">
                {
                    !user?.email && !user?.password && !user?.name
                        ? <div className="container-left" id='container-right01'  >
                            <div className="card  create_Account_card  "   >
                                <div className="card-body  ">
                                    <h5 className="card-title">Login</h5>
                                    <div className="text_section">
                                        <div className="inputs_div">
                                            <div className="inputs_inner">
                                                {error ? <div className='error_div'><ExclamationCircleOutlined className='error_icon'/><span className='error'> {error && error}</span></div> : null}
                                            </div>
                                            <div className="inputs_inner">
                                                <span>Email</span>
                                                <Inputs setError={setError} setState={setEmail} type='email' placeHolder={'Email@gmail.com'} />
                                            </div>
                                            <div className="inputs_inner">
                                                <span>Password</span>
                                                <Inputs setError={setError} setState={setPassword} type='Password' placeHolder={'Enter Password'} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button loading={loading} onClick={login} Name='Login' />
                                </div>
                            </div>
                        </div>
                        :
                        <div class="card success_card">
                            <div class="card-body">
                                <h5 class="card-title card_title">Login</h5>
                                <div className='login_card'>
                                    <h5 class="card-subtitle mb-2 text-black login_text">Login Successfully {user?.name || 'Guest'}</h5>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </>
    )
}

export default Login