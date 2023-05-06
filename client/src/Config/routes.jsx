import { HOME, CREATE_ACCOUNT, DEPOSIT, WITHDRAW, ALL_DATA, LOGIN, CREATE_ACCOUNT_SUCCESS, TRANSFER, ALL_CHECK_FOR_DEPOSIT, DEPOSIT_CHECK } from './paths'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home, CreateAccount, Deposit, WithDraw, AllData, Login, SuccessCard } from '../Screens'
import { Navbar } from '../Components'
import React, { useContext, useEffect, useState } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc, } from 'firebase/firestore'
import { db } from '../firebase'
import { useSelector } from 'react-redux'
import { AuthContext } from '../context/AuthContext'
import Transfer from '../Screens/Transfer/Transfer'
import AllChek from '../Screens/AllChek/AllChek'
import DepositCheck from '../Screens/AllChek/DepositCheck'

const Routing = () => {

    const { user } = useContext(AuthContext);


    const [allUser, setAllUsers] = useState([])
    let locations = window?.location?.pathname

    useEffect(() => {
        getAllUsers()
    }, [])

    const getAllUsers = async () => {
        return []
    }
    return (
        <>
            <Router>
                <Navbar user={user} locations={locations} />
                <Switch>
                    <Route path={HOME} exact component={(props) => <Home {...props} user={user} />} />

                    <Route path={CREATE_ACCOUNT} exact component={(props) => <CreateAccount {...props} user={user} />} />

                    {
                        !user &&
                        <>
                            <Route path={CREATE_ACCOUNT_SUCCESS} exact component={(props) => <SuccessCard {...props} user={user} />} />

                            <Route path={LOGIN} exact component={(props) => <Login {...props} user={user} />} />
                        </>
                    }
                    {user && user.type !== "employee"
                        ?
                        <>
                            <Route path={DEPOSIT} exact component={(props) => <Deposit {...props} user={user} locations={locations} />} />

                            <Route path={WITHDRAW} exact component={(props) => <WithDraw  {...props} user={user} />} />

                            <Route path={TRANSFER} exact component={(props) => <Transfer  {...props} user={user} />} />

                            <Route path={ALL_DATA} exact component={(props) => <AllData {...props} user={user} />} />
                        </>
                        :
                        <>
                            <Route path={ALL_CHECK_FOR_DEPOSIT} exact component={(props) => <AllChek {...props} user={user} />} />
                            <Route path={DEPOSIT_CHECK + "/:checkId"} exact component={(props) => <DepositCheck {...props} user={user} />} />
                        </>

                    }
                </Switch>
            </Router>
        </>
    )
}
export { Routing }
