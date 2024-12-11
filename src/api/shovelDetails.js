import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";

export const getShovels = () => {
    const apiUrl = `${BASE_URL}/api/shovelsolution`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}

export const getTrucks = () => {
    const apiUrl = `${BASE_URL}/api/trucksolution`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject(error)
            });
    })
}

export const minePlanData = () => {
    const apiUrl = `${BASE_URL}/api/mineplansolution`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}

export const parameterDetails = () => {
    const apiUrl = `${BASE_URL}/api/parametersolution`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}

export const getEmployees = () => {
    const apiUrl = `${BASE_URL}/api/employee`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getOADetails = () => {
    const apiUrl = `${BASE_URL}/api/OA_DETRoute`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getAttendance = () => {
    const apiUrl = `${BASE_URL}/api/attendance`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getJobAssign = () => {
    const apiUrl = `${BASE_URL}/api/jobassign`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getStaffAllocation = () => {
    const apiUrl = `${BASE_URL}/api/nodeAllocation`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getItemmaster = () => {
    const apiUrl = `${BASE_URL}/api/itemmaster`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getDeviceMaster = () => {
    const apiUrl = `${BASE_URL}/api/devices`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getDeviceMapping = () => {
    const apiUrl = `${BASE_URL}/api/deviceMapping`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getNodeMaster = () => {
    const apiUrl = `${BASE_URL}/api/nodeMaster`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getEmpNodeMapping = () => {
    const apiUrl = `${BASE_URL}/api/employeeNodeMapping`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getEdges = () => {
    const apiUrl = `${BASE_URL}/api/edgeMaster`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getRoutes = () => {
    const apiUrl = `${BASE_URL}/api/routeMaster`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getShifts = () => {
    const apiUrl = `${BASE_URL}/api/shift`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}

export const getDepartments = () => {
    const apiUrl = `${BASE_URL}/api/department`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getBranchs = () => {
    const apiUrl = `${BASE_URL}/api/branch`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}

export const getNodeAllocation = () => {
    const apiUrl = `${BASE_URL}/api/nodeAllocation`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getActivities = () => {
    const apiUrl = `${BASE_URL}/api/activitylog`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getbatches = () => {
    const apiUrl = `${BASE_URL}/api/batch`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getbatch_master = () => {
    const apiUrl = `${BASE_URL}/api/batchMaster`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}

export const getWorkingHourSchedule = () => {
    const apiUrl = `${BASE_URL}/api/workinghourschedule`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}

export const getRowMaster = () => {
    const apiUrl = `${BASE_URL}/api/rows`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getTasksMaster = () => {
    const apiUrl = `${BASE_URL}/api/tasks`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getDependencyMaster = () => {
    const apiUrl = `${BASE_URL}/api/dependency`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getNodeParameter = () => {
    const apiUrl = `${BASE_URL}/api/NodeParameter`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getNodeVariable = () => {
    const apiUrl = `${BASE_URL}/api/NodeVariable`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getMachineMaster = () => {
    const apiUrl = `${BASE_URL}/api/MachineMaster`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}
export const getMaterialMaster = () => {
    const apiUrl = `${BASE_URL}/api/MaterialMaster`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}

export const getSpareparts = () => {
    const apiUrl = `${BASE_URL}/api/spareparts`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}

export const getAgentSupplies = () => {
    const apiUrl = `${BASE_URL}/api/agentsupplies`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}

export const getSectiondata = () => {
    const apiUrl = `${BASE_URL}/api/section`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}

export const getUnitsdata = () => {
    const apiUrl = `${BASE_URL}/api/unitMaster`;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject()
            });
    })
}