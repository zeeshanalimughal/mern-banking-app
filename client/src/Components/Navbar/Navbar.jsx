import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HOME, CREATE_ACCOUNT, DEPOSIT, WITHDRAW, ALL_DATA, LOGIN } from '../../Config/paths'
import { useHistory } from 'react-router-dom'
import { errorMessage } from '../../utils/helpers'
import { useDispatch } from 'react-redux'
import { removeUser } from '../../Redux/actions/authActions'

const Navbar = ({ user }) => {
    const history = useHistory()
    // let locations = window?.location?.pathname
    const [locations, setPathName] = useState(window?.location?.pathname)
    const dispatch = useDispatch()
    const changeRoute = (path) => {
        if (user?.email && user?.password && user?.name) {
            history.push(path)
            setPathName(window?.location?.pathname)
        } else {
            return errorMessage('Please Login Or Create Your Account First')
        }
    }
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand text-white" onClick={() => history.push(HOME)}>Bad Bank</a>
                <button className="navbar-toggler text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="true" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon text-white"></span>
                </button>
                <div className="navbar-collapse collapse hide" id="navbarNav">
                    <div className='me-auto my-2 my-lg-0'></div>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <div className="w3-dropdown-hover navbar_text">
                                <button className={locations == '/' ? 'font_bold w3-button navbar_text txt' : "w3-button navbar_text txt"} onClick={() => {
                                    history.push(HOME)
                                    setPathName(window?.location?.pathname)
                                }}>Home</button>
                                <div className="w3-dropdown-content w3-bar-block w3-border text_hover_div">
                                    <span className="w3-bar-item w3-button">Welcome message to the website</span>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="w3-dropdown-hover navbar_text">
                                <button className={locations === '/create/account' ? 'font_bold w3-button navbar_text txt' : "w3-button navbar_text txt"} onClick={() => {
                                    history.push(CREATE_ACCOUNT)
                                    setPathName(window?.location?.pathname)
                                }}>Create Account</button>
                                <div className="w3-dropdown-content w3-bar-block w3-border text_hover_div">
                                    <span className="w3-bar-item w3-button">Create a new account with us using your name, email, and password</span>
                                </div>
                            </div>
                        </li>
                        {
                            user?.email && user?.password && user?.name ?
                                <li className="nav-item">
                                    <div className="w3-dropdown-hover navbar_text txt">
                                        <button className={locations == '/login' ? 'font_bold w3-button navbar_text txt' : "w3-button navbar_text txt"} onClick={() => {
                                            dispatch(removeUser())
                                            history.push(HOME)
                                            setPathName('/')
                                            // sessionStorage.setItem('user', null)
                                            // setPathName(window?.location?.pathname)
                                        }}>Logout</button>
                                        <div className="w3-dropdown-content w3-bar-block w3-border text_hover_div">
                                            <span className="w3-bar-item w3-button">Log out your account</span>
                                        </div>
                                    </div>
                                </li>
                                :
                                <li className="nav-item">
                                    <div className="w3-dropdown-hover navbar_text txt">
                                        <button className={locations == '/login' ? 'font_bold w3-button navbar_text txt' : "w3-button navbar_text txt"} onClick={() => {
                                            history.push(LOGIN)
                                            setPathName(window?.location?.pathname)
                                        }}>Login</button>
                                        <div className="w3-dropdown-content w3-bar-block w3-border text_hover_div">
                                            <span className="w3-bar-item w3-button">Login to your own account</span>
                                        </div>
                                    </div>
                                </li>
                        }
                        <li className="nav-item">
                            <div className="w3-dropdown-hover navbar_text txt">
                                <button className={locations == '/deposit' ? 'font_bold w3-button navbar_text txt' : "w3-button navbar_text txt"} onClick={() => {
                                    // history.push(DEPOSIT)
                                    // setPathName(window?.location?.pathname)
                                    changeRoute(DEPOSIT)
                                }}>Deposit</button>
                                <div className="w3-dropdown-content w3-bar-block w3-border text_hover_div">
                                    <span className="w3-bar-item w3-button">Put money in your bank account</span>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="w3-dropdown-hover navbar_text txt">
                                <button className={locations == '/withdraw' ? 'font_bold w3-button navbar_text txt' : "w3-button navbar_text txt"} onClick={() => {
                                    // history.push(WITHDRAW)
                                    // setPathName(window?.location?.pathname)
                                    changeRoute(WITHDRAW)
                                }}>Withdraw</button>
                                <div className="w3-dropdown-content w3-bar-block w3-border text_hover_div">
                                    <span className="w3-bar-item w3-button">Take money out of your bank account</span>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="w3-dropdown-hover navbar_text txt">
                                <button className={locations === ALL_DATA ? 'font_bold w3-button navbar_text txt' : "w3-button navbar_text txt"} onClick={() => {
                                    // history.push(ALL_DATA)
                                    // setPathName(window?.location?.pathname)
                                    changeRoute(ALL_DATA)
                                }}>All Data</button>
                                <div className="w3-dropdown-content w3-bar-block w3-border text_hover_div">
                                    <span className="w3-bar-item w3-button">Check your and others' Basic Information</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar