import React, { useContext, useEffect, useRef, useState } from 'react'
import { Inputs, Button } from '../../Components'
import { db } from '../../firebase'
import { errorMessage, successMessage, validateEmail } from '../../utils/helpers'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { AuthContext } from '../../context/AuthContext'
import axios from "../../Config/api";

const WithDraw = (props) => {
    const { user } = props

    const [withDrawValue, setWithDrawValue] = useState(null)
    const [error, setError] = useState(null)
    const [successCard, setSuccessCard] = useState(false)
    const [account, setAccount] = useState({});
    const formRef = useRef()

    const fetchAccount = async () => {
        try {
            const response = await axios.get('/account/details', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + user?.access_token
                }
            });
            if (response.status === 200) {
                setAccount(response.data.account)
            } else {
                errorMessage(response.data.message)
            }
        }
        catch (error) {
            console.log(error);
            errorMessage(error.response.data.message)
        }
    }
    useEffect(() => {
        fetchAccount()
    }, [])


    const updateUser = async () => {
        try {
            if (!withDrawValue) {
                setError('Please Provide WithDraw Amount.')
                return true
            }
            if (isNaN(withDrawValue)) {
                setError('Must Be A Number')
                return true
            }
            if (withDrawValue < 0) {
                setError('Must Be A Positive Number')
                return true
            }
            if (withDrawValue == 0) {
                setError('Must Be A Higher Than 0')
                return true
            }
            if (withDrawValue > account?.accountBalance) {
                setError(`Must Be Less Than Or Equal To ${account?.accountBalance}`)
                return true
            }
            axios.post('/account/withdraw', { amount: withDrawValue }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + user?.access_token
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        setSuccessCard(true)
                        successMessage(response.data.message)
                        setWithDrawValue("")
                        formRef.current.reset();
                        fetchAccount();
                    } else {
                        errorMessage(response.data.message)
                    }
                })
                .catch(error => {
                    errorMessage(error?.response.data.message)
                });
        } catch (e) {
            console.log('e', e.message)
        }
    }
    return (
        <>
            <div className="container-big">
                <div className="main_cards_section">
                    <div className="container-left" id='container-right01'  >
                        <div className="card "   >
                            <form ref={formRef} onSubmit={(e) => { e.preventDefault() }}>
                                <div className="card-body  ">
                                    <h5 className="card-title  withDraw_title ">WithDraw</h5>
                                    <div className="text_section">
                                        <div className="heading">
                                            <h4 className='guest_heading' >Guest:<b> {user?.name && user?.name}</b></h4>
                                            <span className='balacnce'>balance<b>$ {account?.accountBalance || 0}</b></span>
                                        </div>
                                        <div className="inputs_div">
                                            <div className="inputs_inner">

                                                {error ? <div className='error_div'><ExclamationCircleOutlined className='error_icon' /><span className='error'> {error && error}</span></div> : null}

                                                {account?.accountBalance === 0 ? <div className='error_div'><ExclamationCircleOutlined className='error_icon' /><span className='error'>Don't have enough amount to withdraw!</span></div> : null}

                                            </div>
                                            <div className="inputs_inner">
                                                <span className='inputSpan'  >WithDraw Amount</span>
                                                <Inputs setError={setError} setState={setWithDrawValue} className='input' type='text' placeHolder={'Enter WithDraw Amount'} disabled={account?.accountBalance === 0} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button onClick={updateUser} Name='Withdraw ' disabled={account?.accountBalance === 0} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WithDraw
