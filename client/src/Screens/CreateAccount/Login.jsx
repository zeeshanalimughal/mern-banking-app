import Password from 'antd/lib/input/Password'
import React, { useState, useContext } from 'react'
import { Inputs, Button } from '../../Components'
import { collection, getDocs, addDoc, updateDoc, doc, } from 'firebase/firestore'
import { db } from '../../firebase'
import _ from 'lodash'
import { errorMessage, successMessage, validateEmail } from '../../utils/helpers'
import { HOME } from '../../Config/paths'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../Redux/actions/authActions'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from "../../Config/api";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import '../../App.css'
import googleLogo from "../../assets/Images/google-logo.png"
const Login = () => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)
    const history = useHistory()
    const [successCard, setSuccessCard] = useState(false)

    const { user, loading, errors, dispatch } = useContext(AuthContext);

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
        let data = {
            email: email,
            password: password,
        }
        dispatch({ type: "LOGIN_START" });
        axios.post('/auth/signin', data)
            .then(response => {
                if (response.status === 200) {
                    setSuccessCard(true)
                    successMessage(response.data.message)
                    dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
                    history.push(HOME)
                } else {
                    errorMessage(response.data.message)
                }
            })
            .catch(error => {
                console.error(error);
                dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
                errorMessage(error.response.data.message)
            });
    }


    const signInWithGoogle = async () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const data = {
                    email:result.user.email,
                    name:result.user.displayName,
                    profileImage:result.user.photoURL
                }
                dispatch({ type: "LOGIN_START" });
                axios.post('/auth/google', data)
                    .then(response => {
                        if (response.status === 200) {
                            setSuccessCard(true)
                            successMessage(response.data.message)
                            dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
                            history.push(HOME)
                        } else {
                            errorMessage(response.data.message)
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
                        errorMessage(error.response.data.message)
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <div className="container-big">
                {
                    !user
                        ? <div className="container-left" id='container-right01'  >
                            <div className="card  create_Account_card  "   >
                                <div className="card-body  ">
                                    <h5 className="card-title">Login</h5>
                                    <div className="text_section">
                                        <div className="inputs_div">
                                            <div className="inputs_inner">
                                                {error ? <div className='error_div'><ExclamationCircleOutlined className='error_icon' /><span className='error'> {error && error}</span></div> : null}
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
                                    <button className='google_button' onClick={signInWithGoogle}>
                                        <img src={googleLogo} alt="Google Icon"/>
                                            Sign in with Google
                                    </button>

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