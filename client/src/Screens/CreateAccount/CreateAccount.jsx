import React, { useState } from 'react'
import { Inputs, Button } from '../../Components'
import { collection, getDocs, addDoc, updateDoc, doc, } from 'firebase/firestore'
import { db } from '../../firebase'
import _ from 'lodash'
import { errorMessage, successMessage, validateEmail } from '../../utils/helpers'
import { CREATE_ACCOUNT_SUCCESS, LOGIN } from '../../Config/paths'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from "../../Config/api";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const CreateAccount = () => {
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null);
    const [accountType, setAccountType] = useState("checking");
    const [userType, setUserType] = useState("user");
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [successCard, setSuccessCard] = useState(false)
    const history = useHistory()

    const signUp = async () => {
        try {
            if (!name || !password || !email) {
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
            const data = {
                name,
                email,
                password,
                accountType,
                type: userType,
            };
            setLoading(true)

            axios.post('/auth/signup', data)
                .then(response => {
                    if (response.data.status === true) {
                        setLoading(false)
                        successMessage(response.data.message)
                        history.push(LOGIN)
                    }
                })
                .catch(error => {
                    console.error(error);
                    setError(error?.response?.data?.message)
                    setLoading(false)
                });
        } catch (e) {
            console.error('Error adding document: ', e)
            setLoading(false)
        }
    }

    return (
        <>
            <div className="container-big">
                {
                    true ?
                        <div className="container-left" id='container-right01'  >
                            <div className="card  create_Account_card  "   >
                                <div className="card-body  ">
                                    <h5 className="card-title">Create Account</h5>
                                    <div className="createAccount_text_section">
                                        <div className="inputs_div">
                                            <div className="inputs_inner">
                                                {error ? <div className='error_div'><ExclamationCircleOutlined className='error_icon' /><span className='error'> {error && error}</span></div> : null}
                                            </div>
                                            <div className="inputs_inner">
                                                <span>Name</span>
                                                <Inputs setState={setName} setError={setError} className='input' type='text' placeHolder={'Enter Your Name'} />
                                            </div>
                                            <div className="inputs_inner">
                                                <span>Email</span>
                                                <Inputs setState={setEmail} setError={setError} type='email' placeHolder={'Email@gmail.com'} />
                                            </div>
                                            <div className="inputs_inner">
                                                <span>Password</span>
                                                <Inputs setError={setError} setState={setPassword} type='Password' placeHolder={'Enter Password'} />
                                            </div>
                                            <div className="inputs_inner">
                                                <span>Account Type</span>
                                                <div className="input-group mb-3  ">
                                                    <select className="form-select" onChange={(e) => setAccountType(e.target.value)}>
                                                        <option value="saving" selected>saving</option>
                                                        <option value="checking" >current</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="inputs_inner">
                                                <span>User Type</span>
                                                <div className="input-group mb-3  ">
                                                    <select className="form-select" onChange={(e) => setUserType(e.target.value)}>
                                                        <option value="user" selected>user</option>
                                                        <option value="employee">employee</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button loading={loading} onClick={signUp} Name='Create Account' />
                                </div>
                            </div>
                        </div>
                        :
                        <div class="card success_card">
                            <div class="card-body">
                                <h5 class="card-title card_title">Create Account</h5>
                                <h5 class="card-subtitle mb-2 text-black text_bold">Success</h5>
                                <div className='add_another_account_btn_div'>
                                    <Button loading={loading} onClick={() => setSuccessCard(false)} Name='Add Another Accout' />
                                </div>
                            </div>
                        </div>
                }
            </div>
        </>
    )
}

export default CreateAccount
