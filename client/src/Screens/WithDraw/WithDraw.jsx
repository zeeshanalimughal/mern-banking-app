import Password from 'antd/lib/input/Password'
import React, { useState } from 'react'
import { Inputs, Button } from '../../Components'
import { collection, getDocs, addDoc, updateDoc, doc, } from 'firebase/firestore'
import { db } from '../../firebase'
import { errorMessage, successMessage, validateEmail } from '../../utils/helpers'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../Redux/actions/authActions'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const WithDraw = (props) => {
    const { user, getAllUsers } = props
    const [withDrawValue, setWithDrawValue] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const updateUser = async () => {
        try {
            const cond = doc(db, 'user', user?.id)
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
            if (withDrawValue > user?.balance) {
                setError(`Must Be Less Than Or Equal To ${user?.balance}`)
                return true
            }
            if (withDrawValue == 0) {
                setError('Must Be A Higher Than 0')
                return true
            }
            setLoading(true)
            await updateDoc(cond, {
                balance: Number(user?.balance) - Number(withDrawValue),
            }).then(() => {
                user.balance = Number(user?.balance) - Number(withDrawValue)
                dispatch(loginUser(user))
                successMessage('Successfully Withdrawal')
                getAllUsers()
                setLoading(false)
            }).catch((e) => {
                setLoading(false)
                errorMessage('Something Went Wrong ')
            })
        } catch (e) {
            console.log('e', e.message)
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
                                <h5 className="card-title  withDraw_title ">WithDraw</h5>
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
                                            <span className='inputSpan'  >WithDraw Amount</span>
                                            <Inputs setError={setError} setState={setWithDrawValue} className='input' type='text' placeHolder={'Enter WithDraw Amount'} />
                                        </div>
                                    </div>
                                </div>
                                <Button loading={loading} onClick={updateUser} Name='Withdraw ' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WithDraw
