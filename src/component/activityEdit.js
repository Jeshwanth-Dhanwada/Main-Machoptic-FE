import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";
import AuthContext from '../context/AuthProvider';
import { FaCheck } from "react-icons/fa6";
import { Form } from "react-bootstrap";
import ActivityUpdateForm from "./activityUpdate";
import { ToastContainer, toast } from "react-toastify";


const ActivityEdit = () => {
    const { auth } = useContext(AuthContext);
    const [selectedJob, setSelectedJob] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [activityData, setActivityData] = useState([]);
    const [nodeData, setnodedata] = useState([]);
    const [activityEdit, showActivityEdit] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState(null);


    // Fetching Activity data ----------
    useEffect(() => {
        // Fetch data from the API when the component mounts
        const apiUrl = `${BASE_URL}/api/activitylog`;
        axios
            .get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`,
                }
            })
            .then((response) => {
                // console.log("shift data",response.data);
                setActivityData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // Fetching Node data ----------
    useEffect(() => {
        // Fetch data from the API when the component mounts
        const apiUrl = `${BASE_URL}/api/nodeMaster`;
        axios
            .get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`,
                }
            })
            .then((response) => {
                // console.log("shift data",response.data);
                setnodedata(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const getActivityData = () => {
        if (selectedDate) {
            return activityData.filter((item) => item?.date === selectedDate);
        }
        return activityData;
    };

    const getNodeDesc = (nodeId) => {
        const node = nodeData.filter((item) => item?.nodeId == nodeId);
        return node[0]?.nodeName;
    };

    const setActivity = () => {
        if (selectedActivity) {
            showActivityEdit(false);
        } else {
            toast.error(<span>Please select any activity to continue</span>);
        }
    }

    return (
        <div>
            {activityEdit ? (
                <div className="row d-flex flex-row justify-content-center">
                    <div className="d-flex justify-content-center">
                        <div className="d-flex m-2 justify-content-center">
                            <h6 style={{ padding: "4px", marginRight: "10px" }}>Date :</h6>
                            <input
                                type="date"
                                value={selectedDate}
                                // min={getFormattedToday()}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                }}
                                style={{ border: 'none', width: '120px', height: '25px', backgroundColor: 'whitesmoke' }}
                            />
                        </div>
                    </div>
                    <div className="d-flex container-fluid justify-content-center">
                        <div className="row">
                            <div className="col-12">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>JobId</th>
                                            <th>Activity Id</th>
                                            <th>Node</th>
                                            <th style={{ width: '100px' }}>Date</th>
                                            <th>Shift</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getActivityData().map((item, index) =>
                                            <tr key={index}>
                                                <td>{item?.jobId}</td>
                                                <td>{item?.id}</td>
                                                <td>{getNodeDesc(item?.nodeId)}</td>
                                                <td>{item?.date}</td>
                                                <td>{item?.Shift}</td>
                                                <td>
                                                    <Form.Check.Input
                                                        type="radio"
                                                        name="Select"
                                                        id="allocated"
                                                        style={{ border: "1px solid #808080" }}
                                                        onChange={(e) => { setSelectedActivity(item) }}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <button className="btn btn-success" onClick={setActivity}><FaCheck /></button> &nbsp;
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <ActivityUpdateForm type="edit" activityData={selectedActivity} />
            )}
            <ToastContainer />
        </div>
    );
}

export default ActivityEdit;