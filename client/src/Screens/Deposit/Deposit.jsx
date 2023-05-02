import Password from 'antd/lib/input/Password'
import React, { useState } from 'react'
import { Inputs, Button, Cards } from '../../Components'
import { collection, getDocs, addDoc, updateDoc, doc, } from 'firebase/firestore'
import { db } from '../../firebase'
import { errorMessage, successMessage, validateEmail } from '../../utils/helpers'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../Redux/actions/authActions'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const Deposit = (props) => {
    const { user, getAllUsers } = props
    const [depositValue, setDepositValue] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const updateUser = async () => {
        try {
            const cond = doc(db, 'user', user?.id)

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

            setLoading(true)
            await updateDoc(cond, {
                balance: Number(user?.balance) + Number(depositValue),
            }).then(() => {
                user.balance = Number(user?.balance) + Number(depositValue)
                dispatch(loginUser(user))
                // sessionStorage.setItem('user', JSON.stringify(user))
                successMessage('Successfully Added')
                getAllUsers()
                setLoading(false)
            }).catch((e) => {
                setLoading(false)
                errorMessage('Something Went Wrong ', e)
            })
        } catch (e) {
            console.log('e', e?.message)
        }
    }
    // setTimeout(() => {
    //     setError(null)
    // }, 6000)
    return (
        <>
            <div className="container-big">
                <div className="main_cards_section">
                    <div className="container-left" id='container-right01'  >
                        <div className="card "   >
                            <div className="card-body  ">
                                <h5 className="card-title  Deposit_title ">Deposit</h5>
                                <div className="text_section">
                                    <div className="heading">
                                        <h4 className='guest_heading' >Guest:<b> {user?.name && user?.name}</b></h4>
                                        <span className='balacnce'>balance<b>$ {user?.balance || 0}</b></span>
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
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Deposit
