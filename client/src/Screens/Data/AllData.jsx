import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components'
import profile from '../../assets/Images/profile.png'
import { AuthContext } from '../../context/AuthContext'
import axios from "../../Config/api";
import { errorMessage } from '../../utils/helpers';
import moment from 'moment';
import '../../App.css'
function AllData(props) {
    const { user } = props
    const [account, setAccount] = useState({});


    const [depositWithdrawHistory, setDepositWithdrawHistory] = useState([]);
    const [transferHistory, setTransferHistory] = useState([]);
    const [checkDepositHistory, setCheckDepositHistory] = useState([]);

    const [depositWithdrawHistoryClone, setDepositWithdrawHistoryClone] = useState([]);
    const [transferHistoryClone, setTransferHistoryClone] = useState([]);
    const [checkDepositHistoryClone, setCheckDepositHistoryClone] = useState([]);


    // const [transectionsHistoryClone, setTransectionsHistoryClone] = useState([]);


    const [error, setError] = useState(null)

    const fetchAccount = async () => {
        try {
            const response = await axios.get('/account/details', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + user?.access_token
                }
            });
            if (response.status === 200) {
                setAccount(response.data.account)
            } else {
                errorMessage(response.data.message)
            }
        }
        catch (err) {
            console.log(err);
            errorMessage(err.response.data.message)
        }
    }
    const fetchTransectionsHistory = async () => {
        try {
            const response = await axios.get('/account/history',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + user?.access_token
                    }
                });
            if (response.status === 200) {
                setDepositWithdrawHistory(response.data.depositWithdrawHistory);
                setCheckDepositHistory(response.data.checkDepositHistory);
                setTransferHistory(response.data.transferHistory);
                setDepositWithdrawHistoryClone(response.data.depositWithdrawHistory);
                setCheckDepositHistoryClone(response.data.checkDepositHistory);
                setTransferHistoryClone(response.data.transferHistory);
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
        fetchAccount()
        fetchTransectionsHistory()
    }, []);


    const handleSearchTableOne = (e) => {
        const searchValue = e.target.value;
        if (searchValue) {
            const filteredTransections = depositWithdrawHistoryClone?.filter(history => {
                return history?.type?.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                    history?.amount?.toString().toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                    moment(history?.createdAt).format('MMMM Do YYYY, h:mm:ss a')?.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
            })
            if (filteredTransections?.length) {
                setDepositWithdrawHistory(filteredTransections)
            } else {
                setDepositWithdrawHistory([])
            }
        } else {
            setDepositWithdrawHistory(depositWithdrawHistoryClone)
        }
    }
    const handleSearchTableTwo = (e) => {
        const searchValue = e.target.value;
        if (searchValue) {
            const filteredTransections = checkDepositHistoryClone?.filter(history => {
                return history?.type?.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                    history?.amount?.toString().toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                    history?.by?.name?.toString().toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                    moment(history?.createdAt).format('MMMM Do YYYY, h:mm:ss a')?.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
            })
            if (filteredTransections?.length) {
                setCheckDepositHistory(filteredTransections)
            } else {
                setCheckDepositHistory([])
            }
        } else {
            setCheckDepositHistory(checkDepositHistoryClone)
        }
    }
    const handleSearchTableThree = (e) => {
        const searchValue = e.target.value;
        if (searchValue) {
            const filteredTransections = transferHistoryClone?.filter(history => {
                return history?.type?.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                    history?.amount?.toString().toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                    history?.from?.name?.toString().toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                    history?.to?.name?.toString().toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                    moment(history?.createdAt).format('MMMM Do YYYY, h:mm:ss a')?.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
            })
            if (filteredTransections?.length) {
                setTransferHistory(filteredTransections)
            } else {
                setTransferHistory([])
            }
        } else {
            setTransferHistory(transferHistoryClone)
        }
    }


    return (
        <div>
            <div className="card mb-3 data_card  data_section ">
                <div className="card-body container text-center">
                    <div className="  Users_main_div   ">
                        <div className="user_img">
                            <img className='img' src={user?.profileImage || profile} />
                        </div>
                        <div className="Users_Data  ">
                            <h3>Your Information</h3>
                            <div className='user_name_div'>
                                <div>
                                    <b className='bold'>Name:</b><span> {user?.name}</span>
                                </div>
                                <div>
                                    <b className='bold'>Email:</b><span> {user?.email}</span>
                                </div>
                                <div>
                                    <b className='bold'>Account No:</b><span> {account?.accountNumber || 0}</span>
                                </div>
                                <div>
                                    <b className='bold'>Account Type:</b><span> {account?.accountType || 0}</span>
                                </div>
                                <div>
                                    <b className='bold'>Account Balance:</b><span> ${account?.accountBalance || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div className='mb-4'>
                <div className='all_data_heading'>
                    <h2>Deposit and Withdraw History</h2>
                </div>
                <div className="container mb-2 d-flex justify-content-end">
                    <input type="text" className='form-control w-25' onChange={handleSearchTableOne} placeholder='search...' />
                </div>
                <div className="container text-center all_data_container mb-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <div className="row data_heading">
                        <div className="col">
                            <b>#</b>
                        </div>
                        <div className="col">
                            <b>Type</b>
                        </div>
                        <div className="col">
                            <b>Amount</b>
                        </div>
                        <div className="col-4">
                            <b>Date/Time</b>
                        </div>
                    </div>
                    {
                        depositWithdrawHistory?.map((dwHistory, i) => {
                            return (
                                <div key={i} className="row all_user_data">
                                    <div className="col">
                                        {i + 1}
                                    </div>
                                    <div className="col">
                                        {dwHistory?.type}
                                    </div>
                                    <div className="col">
                                        {dwHistory?.amount}
                                    </div>
                                    <div className="col-4">
                                        {moment(dwHistory?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>


            <div className='mb-4'>
                <div className='all_data_heading'>
                    <h2>Check Deposit History</h2>
                </div>
                <div className="container mb-2 d-flex justify-content-end">
                    <input type="text" className='form-control w-25' onChange={handleSearchTableTwo} placeholder='search...' />
                </div>
                <div className="container text-center all_data_container mb-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <div className="row data_heading">
                        <div className="col">
                            <b>#</b>
                        </div>
                        <div className="col">
                            <b>Type</b>
                        </div>
                        <div className="col">
                            <b>By</b>
                        </div>
                        <div className="col">
                            <b>Amount</b>
                        </div>
                        <div className="col-4">
                            <b>Date/Time</b>
                        </div>
                    </div>
                    {
                        checkDepositHistory?.map((cdHistory, i) => {
                            return (
                                <div key={i} className="row all_user_data">
                                    <div className="col">
                                        {i + 1}
                                    </div>
                                    <div className="col">
                                        {cdHistory?.type}
                                    </div>
                                    <div className="col">
                                        {cdHistory?.by?.name + " "}
                                        (<small>{cdHistory?.by?.type}</small>)
                                    </div>
                                    <div className="col">
                                        {cdHistory?.amount}
                                    </div>
                                    <div className="col-4">
                                        {moment(cdHistory?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className='mb-4'>
                <div className='all_data_heading'>
                    <h2>Amount Transfer History</h2>
                </div>
                <div className="container mb-2 d-flex justify-content-end">
                    <input type="text" className='form-control w-25' onChange={handleSearchTableThree} placeholder='search...' />
                </div>
                <div className="container text-center all_data_container mb-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <div className="row data_heading">
                        <div className="col">
                            <b>#</b>
                        </div>
                        <div className="col">
                            <b>Type</b>
                        </div>
                        <div className="col">
                            <b>Transfer from</b>
                        </div>
                        <div className="col">
                            <b>Transfer to</b>
                        </div>
                        <div className="col">
                            <b>Amount</b>
                        </div>
                        <div className="col-4">
                            <b>Date/Time</b>
                        </div>
                    </div>
                    {
                        transferHistory?.map((tHistory, i) => {
                            return (
                                <div key={i} className="row all_user_data">
                                    <div className="col">
                                        {i + 1}
                                    </div>
                                    <div className="col">
                                        {tHistory?.type}
                                    </div>
                                    <div className="col">
                                        {tHistory?.from?.name}
                                    </div>
                                    <div className="col">
                                        {tHistory?.to?.name}
                                    </div>
                                    <div className="col">
                                        {tHistory?.amount}
                                    </div>
                                    <div className="col-4">
                                        {moment(tHistory?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>




        </div>
    )
}

export default AllData
