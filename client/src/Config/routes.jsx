import { HOME, CREATE_ACCOUNT, DEPOSIT, WITHDRAW, ALL_DATA, LOGIN, CREATE_ACCOUNT_SUCCESS } from './paths'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home, CreateAccount, Deposit, WithDraw, AllData, Login, SuccessCard } from '../Screens'
import { Navbar } from '../Components'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc, } from 'firebase/firestore'
import { db } from '../firebase'
import { useSelector } from 'react-redux'

const Routing = () => {
    const [allUser, setAllUsers] = useState([])
    let locations = window?.location?.pathname
    const user = useSelector((state) => state?.authReducer?.user)

    console.log('locations', user)
    useEffect(() => {
        getAllUsers()
    }, [])

    const getAllUsers = async () => {
        await getDocs(collection(db, 'user'))
            .then((querySnapshot) => {
                const newData = querySnapshot?.docs?.map((doc) => ({
                    ...doc?.data(),
                    id: doc?.id,
                }))
                setAllUsers(newData)
            })
            .catch((e) => {
                console.log('e', e)
            })
    }
    console.log('allUser', allUser)
    return (
        <>
            <Router>
                <Navbar user={user} locations={locations} />
                <Switch>
                    <Route path={HOME} exact component={(props) => <Home {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                    <Route path={CREATE_ACCOUNT} exact component={(props) => <CreateAccount {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                    <Route path={CREATE_ACCOUNT_SUCCESS} exact component={(props) => <SuccessCard {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                    <Route path={LOGIN} exact component={(props) => <Login {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                    <Route path={DEPOSIT} exact component={(props) => <Deposit {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                    <Route path={WITHDRAW} exact component={(props) => <WithDraw  {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                    <Route path={ALL_DATA} exact component={(props) => <AllData {...props} user={user} locations={locations} allUser={allUser} getAllUsers={getAllUsers} />} />
                </Switch>
            </Router>
        </>
    )
}
export { Routing }
