import React from 'react'
import { Navbar } from '../../Components/index'
import { Inputs, Button } from '../../Components'
import BankImg from '../../assets/Images/bank.png'
import CreaditGIf from '../../assets/Images/credit.gif' 

function Home({user}) {
    return (
        <>
            <div className="Home_container">
                <div className="container-left" id='container-right01'  >
                    <div className="card  Home_card  "   >
                        <div className="card-body  ">
                            <h5 className="card-title  bank-Crd-title">BadBank Landing Page</h5>
                            <div className="main_home-Section">
                                <h3>Welcome to the bank {user?.name ? user?.name : 'Guest'}!</h3>
                                <p>You can use this bank</p>
                                <img  className='BankImage'  src={BankImg} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-right" id='container-right01' >

                    <img src={CreaditGIf} alt="" />
                </div>

            </div>
        </>
    )
}

export default Home
