import React, { useEffect, useState } from 'react'
import { Button, Navbar } from '../../Components'
import profile from '../../assets/Images/profile.png'
import { AuthContext } from '../../context/AuthContext'
import axios, { serverUrl } from "../../Config/api";
import { errorMessage } from '../../utils/helpers';
import moment from 'moment';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { DEPOSIT_CHECK } from '../../Config/paths';

function AllChek(props) {
    const { user } = props
    const [checks, setChecks] = useState([]);
    const [checksCopy, setChecksCopy] = useState([]);

    const history = useHistory()

    const [error, setError] = useState(null)

    const fetchCheks = async () => {
        try {
            const response = await axios.get('/account/checks', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + user?.access_token
                }
            });
            if (response.status === 200) {
                setChecks(response.data.checks)
                setChecksCopy(response.data.checks)
            } else {
                errorMessage(response.data.message)
            }
        }
        catch (err) {
            console.log(err);
            errorMessage(err.response.data.message)
        }
    }

    useEffect(() => {
        fetchCheks()
    }, []);


    const handleSearch = (e) => {
        const searchValue = e.target.value;
        if (searchValue) {
            const filteredCkecks = checksCopy?.filter(check => {
                return check?.user?.name?.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                    check?.accountNumber?.toString().toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
            })
            if (filteredCkecks?.length) {
                setChecks(filteredCkecks)
            } else {
                setChecks([])
            }
        } else {
            setChecks(checksCopy)
        }
    }


    return (
        <div>

            <div className='mb-4'>
                <div className='all_data_heading'>
                    <h2>Cheks For Deposit</h2>
                </div>
                <div className="container mb-2 d-flex justify-content-end">
                    <input type="text" className='form-control w-25' onChange={handleSearch} placeholder='search...' />
                </div>
                <div className="container text-center all_data_container mb-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <div className="row data_heading">
                        <div className="col">
                            <b>#</b>
                        </div>
                        <div className="col">
                            <b>Name</b>
                        </div>
                        <div className="col">
                            <b>Account Number</b>
                        </div>
                        <div className="col">
                            <b>Check Image</b>
                        </div>
                        <div className="col">
                            <b>Date/Time Submitted</b>
                        </div>
                        <div className="col">
                            Action
                        </div>
                    </div>
                    {checks.map((check) => (
                        check.checkDeposits.map((deposit, i) => (
                            <div key={i} className="row all_user_data">
                                <div className="col">
                                    {i + 1}
                                </div>
                                <div className="col">
                                    {check?.user?.name}
                                </div>
                                <div className="col">
                                    {check?.accountNumber}
                                </div>
                                <div className="col">
                                    <a href={serverUrl + deposit.checkImage} target='_blank'>
                                        <img src={serverUrl + deposit.checkImage} style={{ width: "70px", objectFit: "cover" }} />
                                    </a>
                                </div>
                                <div className="col">
                                    {moment(deposit?.createdAt)?.format('MMMM Do YYYY, h:mm:ss a')}
                                </div>
                                <div className="col">
                                    <button className='btn btn-primary' onClick={() => history.push(DEPOSIT_CHECK + "/" + deposit._id)}>Deposit</button>
                                </div>
                            </div>
                        )
                        )
                    ))
                    }
                </div>
            </div>

        </div>
    )
}

export default AllChek
