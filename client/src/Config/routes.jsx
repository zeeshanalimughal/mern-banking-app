import { HOME, CREATE_ACCOUNT, DEPOSIT, WITHDRAW, ALL_DATA, LOGIN, CREATE_ACCOUNT_SUCCESS, TRANSFER } from './paths'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home, CreateAccount, Deposit, WithDraw, AllData, Login, SuccessCard } from '../Screens'
import { Navbar } from '../Components'
import React, { useContext, useEffect, useState } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc, } from 'firebase/firestore'
import { db } from '../firebase'
import { useSelector } from 'react-redux'
import { AuthContext } from '../context/AuthContext'
import Transfer from '../Screens/Transfer/Transfer'

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
                    <Route path={HOME} exact component={(props) => <Home {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                    <Route path={CREATE_ACCOUNT} exact component={(props) => <CreateAccount {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />

                    {
                        !user &&
                        <>
                            <Route path={CREATE_ACCOUNT_SUCCESS} exact component={(props) => <SuccessCard {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                            <Route path={LOGIN} exact component={(props) => <Login {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                        </>
                    }

                    <Route path={DEPOSIT} exact component={(props) => <Deposit {...props} user={user} locations={locations} />} />

                    <Route path={WITHDRAW} exact component={(props) => <WithDraw  {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                    <Route path={TRANSFER} exact component={(props) => <Transfer  {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                    <Route path={ALL_DATA} exact component={(props) => <AllData {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                </Switch>
            </Router>
        </>
    )
}
export { Routing }
