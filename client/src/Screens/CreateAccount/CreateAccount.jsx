import React, { useState } from 'react'
import { Inputs, Button } from '../../Components'
import { collection, getDocs, addDoc, updateDoc, doc, } from 'firebase/firestore'
import { db } from '../../firebase'
import _ from 'lodash'
import { errorMessage, successMessage, validateEmail } from '../../utils/helpers'
import { CREATE_ACCOUNT_SUCCESS, LOGIN } from '../../Config/paths'
import {ExclamationCircleOutlined} from '@ant-design/icons'

const CreateAccount = (props) => {
    const { getAllUsers, allUser, history } = props
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [successCard, setSuccessCard] = useState(false)

    const signUp = async () => {
        try {
            let obj = {
                name: name,
                email: email,
                password: password,
                balance: 0
            }
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
            console.log('obj', obj)
            let alreadyExistEmail = _.find(allUser, { email: obj?.email })
            if (alreadyExistEmail?.email) {
                console.log('EMAIL ALREADY IN USE.')
                setError('Email Already In Use.')
                return true
            }
            setLoading(true)
            await addDoc(collection(db, 'user'), obj)
                .then((data) => {
                    successMessage('Account Created Successfully')
                    setLoading(false)
                    getAllUsers()
                    history.push(CREATE_ACCOUNT_SUCCESS)
                    setSuccessCard(true)
                })
                .catch((e) => {
                    setLoading(false)
                    errorMessage('Something Went Wrong')
                    console.log('Something Went Wrong ', e)
                })
        } catch (e) {
            console.error('Error adding document: ', e)
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
