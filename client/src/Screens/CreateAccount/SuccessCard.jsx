import React, { useState } from 'react'
import { Inputs, Button } from '../../Components'
import { collection, getDocs, addDoc, updateDoc, doc, } from 'firebase/firestore'
import { db } from '../../firebase'
import _ from 'lodash'
import { errorMessage, successMessage, validateEmail } from '../../utils/helpers'
import { CREATE_ACCOUNT, LOGIN } from '../../Config/paths'

const SuccessCard = (props) => {
    const { getAllUsers, allUser, history } = props
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [successCard, setSuccessCard] = useState(false)

    return (
        <>
            <div className="container-big">
                {
                    <div class="card success_card">
                        <div class="card-body">
                            <h5 class="card-title card_title">Create Account</h5>
                            <h5 class="card-subtitle mb-2 text-black text_bold">Success</h5>
                            <div className='add_another_account_btn_div'>
                                <Button loading={loading} onClick={() => history.push(CREATE_ACCOUNT)} Name='Add Another Accout' />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default SuccessCard