import React, { useContext, useEffect, useRef, useState } from 'react'
import { Inputs, Button, Cards } from '../../Components'
import { errorMessage, successMessage, validateEmail } from '../../utils/helpers'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { AuthContext } from '../../context/AuthContext'
import axios from "../../Config/api";
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'

const DepositCheck = (props) => {
    const { user } = props

    const [depositValue, setDepositValue] = useState(null)
    const [checkNumber, setCheckNumber] = useState(null);
    const [accountNumber, setAccountNumber] = useState(null);
    const params = useParams()

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [successCard, setSuccessCard] = useState(false)

    const [account, setAccount] = useState({});
    const formRef = useRef()

    const fetchAccount = async () => {
        try {
            const response = await axios.get('/account/get-check/' + params.checkId, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + user?.access_token
                }
            });
            if (response.status === 200) {
                setAccount(response?.data?.account)
                setAccountNumber(response?.data?.account?.accountNumber)
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


    const depositCheck = async () => {
        try {

            if (!checkNumber || !accountNumber || !depositValue) {
                setError('All fields are required')
                return true
            }
            if (isNaN(depositValue)) {
                setError('Amount must be a number')
                return true
            }
            if (depositValue < 0) {
                setError('Amount must be a positive number')
                return true
            }
            if (depositValue == 0) {
                setError('Amount must be a higher than 0')
                return true
            }

            axios.post('/account/deposit-check', { amount: depositValue, accountNumber, checkNumber }, {
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
                        formRef.current.reset();
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
                            <form ref={formRef} onSubmit={(e) => { e.preventDefault() }}>
                                <div className="card-body  ">
                                    <h5 className="card-title  Deposit_title ">{account?.user?.name}'s Cheeck Deposit</h5>
                                    <div className="text_section">

                                        <div className="inputs_div">
                                            <div className="inputs_inner">
                                                {error ? <div className='error_div'><ExclamationCircleOutlined className='error_icon' /><span className='error'> {error && error}</span></div> : null}
                                            </div>
                                            <div className="input-group mb-3  ">
                                                <input
                                                    onChange={(e) => {
                                                        setAccountNumber(e?.target?.value)
                                                        setError(false)
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Account Number"
                                                    value={account.accountNumber}
                                                    aria-describedby="basic-addon1" disabled />
                                            </div>
                                            <div className="inputs_inner">
                                                <span className='inputSpan'> Check Number</span>
                                                <Inputs setError={setError} setState={setCheckNumber} className='input' type='text' placeHolder={'Enter Check Number'} />
                                            </div>
                                            <div className="inputs_inner">
                                                <span className='inputSpan'  >Deposit Amount</span>
                                                <Inputs setError={setError} setState={setDepositValue} className='input' type='text' placeHolder={'Enter Deposit Amount'} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button loading={loading} onClick={depositCheck} Name='Deposit' />
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default DepositCheck
