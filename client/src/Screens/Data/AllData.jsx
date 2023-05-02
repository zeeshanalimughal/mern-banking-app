import React from 'react'
import { Navbar } from '../../Components'
import profile from '../../assets/Images/profile.png'

function AllData(props) {
    const { user, allUser } = props
    return (
        <div>
            <div className="card mb-3 data_card  data_section ">
                <div className="card-body container text-center">
                    <div className="  Users_main_div   ">
                        <div className="user_img">
                            <img className='img' src={profile} />
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
                                    <b className='bold'>Balance:</b><span> ${user?.balance || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='all_data_heading'>
                <h1>All Data</h1>
            </div>
            <div className="container text-center all_data_container">
                <div className="row data_heading">
                    <div className="col">
                        <b>Name</b>
                    </div>
                    <div className="col-4 email">
                        <b>Email</b>
                    </div>
                    <div className="col">
                        <b>Password</b>
                    </div>
                    <div className="col">
                        <b>Balance</b>
                    </div>
                </div>
                {
                    allUser?.map((val, i) => {
                        return (
                            <div key={i} className="row all_user_data">
                                <div className="col">
                                    {val?.name}
                                </div>
                                <div className="col-4">
                                    {val?.email}
                                </div>
                                <div className="col">
                                    {val?.password}
                                </div>
                                <div className="col">
                                    $ {val?.balance || 0}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default AllData
