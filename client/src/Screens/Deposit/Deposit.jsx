import React, { useContext, useEffect, useRef, useState } from 'react'
import { Inputs, Button, Cards } from '../../Components'
import { errorMessage, successMessage, validateEmail } from '../../utils/helpers'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { AuthContext } from '../../context/AuthContext'
import axios from "../../Config/api";

const Deposit = (props) => {
    const { user } = props

    const [depositValue, setDepositValue] = useState(null)

    const [checkNumber, setCheckNumber] = useState(null);
    const [checkImage, setCheckImage] = useState(null);


    const [error, setError] = useState(null)
    const [error2, setError2] = useState(null)
    const [loading, setLoading] = useState(false)
    const [successCard, setSuccessCard] = useState(false)

    const [account, setAccount] = useState({});
    const formRef1 = useRef()
    const formRef2 = useRef()

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

            if (!depositValue) {
                setError('Please Provide Deposit Amount.')
                return true
            }
            if (isNaN(depositValue)) {
                setError('Must Be A Number')
                return true
            }
            if (depositValue < 0) {
                setError('Must Be A Positive Number')
                return true
            }
            if (depositValue == 0) {
                setError('Must Be A Higher Than 0')
                return true
            }

            axios.post('/account/deposit', { amount: depositValue }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + user?.access_token
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        setSuccessCard(true);
                        successMessage(response.data.message);
                        setDepositValue("")
                        formRef1.current.reset();
                        fetchAccount();
                    } else {
                        errorMessage(response.data.message)
                    }
                })
                .catch(error => {
                    errorMessage(error?.response?.data?.message)
                });

        } catch (e) {
            console.log('e', e?.message)
        }
    }



    const submitCheck = async () => {

        try {
            if (!checkImage) {
                setError2('Please Select Check Image')
                return true
            } else {
                setError2(null)
            }

            if (!checkNumber) {
                setError2('Please Provide Check Number.')
                return true
            } else {
                setError2(null)
            }
            if (checkNumber.length > 12 || checkNumber.length < 12) {
                setError2('Check number must be 12 words.')
                return true
            } else {
                setError2(null)
            }

            const formData = new FormData();
            formData.append('checkImage', checkImage);
            formData.append('checkNumber', checkNumber);

            axios.post('/account/deposit-with-check', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + user?.access_token
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        setSuccessCard(true);
                        successMessage(response.data.message);
                        setDepositValue("")
                        formRef2.current.reset();
                        fetchAccount();
                    } else {
                        errorMessage(response.data.message)
                    }
                })
                .catch(error => {
                    errorMessage(error?.response?.data?.message)
                });

        } catch (e) {
            console.log('e', e?.message)
        }
    }

    return (
        <>
            <div className="container-big">
                <div className="main_cards_section">
                    <div className="container-left" id='container-right01'  >
                        <div className="card "   >
                            <form ref={formRef1} onSubmit={(e) => { e.preventDefault() }}>
                                <div className="card-body  ">
                                    <h5 className="card-title  Deposit_title ">Deposit</h5>
                                    <div className="text_section">
                                        <div className="heading">
                                            <h4 className='guest_heading' >Guest:<b> {user?.name && user?.name}</b></h4>
                                            <span className='balacnce'>balance<b>$ {account?.accountBalance || 0}</b></span>
                                        </div>
                                        <div className="inputs_div">
                                            <div className="inputs_inner">
                                                {error ? <div className='error_div'><ExclamationCircleOutlined className='error_icon' /><span className='error'> {error && error}</span></div> : null}
                                            </div>
                                            <div className="inputs_inner">
                                                <span className='inputSpan'  >Deposit Amount</span>
                                                <Inputs setError={setError} setState={setDepositValue} className='input' type='text' placeHolder={'Enter Deposit Amount'} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button loading={loading} onClick={updateUser} Name='Deposit' />
                                </div>
                            </form>
                        </div>
                        <div className="card mt-5"   >
                            <form ref={formRef2} onSubmit={(e) => { e.preventDefault() }}>
                                <div className="card-body  ">
                                    <h5 className="card-title  Deposit_title ">Submit Check For Deposit</h5>
                                    <div className="text_section">
                                        <div className="inputs_div">
                                            <div className="inputs_inner">
                                                {error2 ? <div className='error_div'><ExclamationCircleOutlined className='error_icon' /><span className='error'> {error2 && error2}</span></div> : null}
                                            </div>
                                            <div className="inputs_inner mb-3">
                                                <span className='inputSpan'>Check Image</span>
                                                <input type="file" name="checkImage" onChange={(e) => setCheckImage(e.target.files[0])} className='form-control' accept='image/*' />
                                            </div>
                                            <div className="inputs_inner">
                                                <span className='inputSpan'  >Check Number</span>
                                                <Inputs setError={setError} setState={setCheckNumber} className='input' type='text' placeHolder={'Enter Check Number'} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button loading={loading} onClick={submitCheck} Name='Submit Check' />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Deposit
