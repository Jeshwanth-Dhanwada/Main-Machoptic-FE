import axios from "axios";
import { BASE_URL } from "../constants/apiConstants";

export const getAllSoultions = () => {
    const apiUrl = `${BASE_URL}/api/AllExecutions`
    // return
        return new Promise((resolve, reject) => {
            axios.get(apiUrl)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.log(error, "Error ");
                reject(error)
            });
        })
}

export const getAllNodes = () => {
    // console.log("check refresh after saved")
    const apiUrl = `${BASE_URL}/api/MindmapNode`
    // return
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                // console.log(response.data);
                resolve(response.data)
            })
            .catch((error) => {
                console.log(error, "Error ");
                reject(error)
            });
    })
}

export const getAllEdges = () => {
    const apiUrl = `${BASE_URL}/api/MindmapEdge`
    // return
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                // console.log(response.data)
                resolve(response.data)
            })
            .catch((error) => {
                console.log(error, "Error ");
                reject(error)
            });
    })
}

export const saveNodes = (data) => {
    const apiUrl = `${BASE_URL}/api/MindmapNode/bulk`
    // console.log(data)
    // return
    return new Promise((resolve, reject) => {
        axios.put(apiUrl, data, {
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
            },
        })
            .then((response) => {
                resolve(response.data)
                console.log("saved data:",response.data)
                // alert("successfully saved Nodes!!!")
            })
            .catch((error) => {
                console.log(error, "Error ");
                reject(error)
            });
    })
}


export const saveEdges = (data) => {
    const apiUrl = `${BASE_URL}/api/MindmapEdge/bulk`
    // return
    return new Promise((resolve, reject) => {
        axios.put(apiUrl, data, {
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
            },
        })
            .then((response) => {
                resolve(response.data)
                console.log("response edge data: ", response.data)
            })
            .catch((error) => {
                console.log(error, "Error ");
                reject(error)
            });
    })
}

// Delete nodes
export const deleteNode = (nodeid) => {
    console.log("nodeid:",nodeid)
    if (!nodeid || typeof nodeid[0] === 'undefined') {
        console.error("Error: No nodeid provided");
        // return Promise.reject(new Error("No nodeid provided"));
    } else {
        const apiUrl = `${BASE_URL}/api/MindmapNode/${nodeid}`;
        console.log("nodeid:", nodeid,apiUrl)
        // return
        return new Promise((resolve, reject) => {
            axios.delete(apiUrl)
                .then((response) => {
                    // console.log("response: ", response.data)
                    resolve(response.data)
                })
                .catch((error) => {
                    console.log(error, "Error ");
                    reject(error)
                });
        })
    }
}


// Delete multiple nodes...

// export const deleteNode = (nodeId) => {
//     if (!nodeId || nodeId.length === 0) {
//       console.error("Error: No nodeIds provided");
//       // return Promise.reject(new Error("No nodeIds provided"));
//     } else {
//       const promises = nodeId.map((id) => {
//         const apiUrl = `${BASE_URL}/api/nodemaster/${id}`;
//         return axios.delete(apiUrl);
//       });
  
//       return Promise.all(promises)
//         .then((responses) => {
//           console.log("Deleted nodes:", responses);
//           return responses;
//         })
//         .catch((error) => {
//           console.log(error, "Error ");
//           throw error;
//         });
//     }
//   };

// Delete Edges
export const deleteEdge = (edgeid) => {
    if (typeof edgeid[0] === 'undefined') {
        console.error("Error: No edgeid provided");
        // return Promise.reject(new Error("No edgeid provided"));
    } else {
        const apiUrl = `${BASE_URL}/api/MindmapEdge/${edgeid}`;
        // return
        return new Promise((resolve, reject) => {
            axios.delete(apiUrl)
                .then((response) => {
                    // console.log("response: ", response.data)
                    resolve(response.data)
                })
                .catch((error) => {
                    console.log(error, "Error ");
                    reject(error)
                });
        })
    }
}

export const getNodesConfig = () => {
    const apiUrl = `${BASE_URL}/api/nodesConfig`
    // return
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                console.log(response.data);
                resolve(response.data)
            })
            .catch((error) => {
                console.log(error, "Error ");
                reject(error)
            });
    })
}

export const getEdgesConfig = () => {
    const apiUrl = `${BASE_URL}/api/edgesConfig`
    // return
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                // console.log(response.data);
                resolve(response.data)
            })
            .catch((error) => {
                console.log(error, "Error ");
                reject(error)
            });
    })
}

export const getCanvasConfig = () => {
    const apiUrl = `${BASE_URL}/api/canvasConfig`
    // return
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                // console.log(response.data);
                resolve(response.data)
            })
            .catch((error) => {
                console.log(error, "Error ");
                reject(error)
            });
    })
}


export const getAllTables = () => {
    const apiUrl = `${BASE_URL}/api/datasettings`
    // return
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then((response) => {
                // console.log(response.data);
                resolve(response.data)
            })
            .catch((error) => {
                console.log(error, "Error ");
                reject(error)
            });
    })
}

export const fetchTableData = (selectedtable) => {
    const apiUrl = `${BASE_URL}/api/datasettings/getTableData/${selectedtable}`;

    return new Promise((resolve, reject) => {
        axios.post(apiUrl,)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.log(error, "Error ");
                reject(error)
            });
    })
}

export const fetchAggregateData = (selectedtable, selectedColumn, queryName) => {
    const apiUrl = `${BASE_URL}/api/datasettings/getTableData/${selectedtable}`;

    return new Promise((resolve, reject) => {
        axios.post(apiUrl, {
            Table: selectedtable,
            column: selectedColumn,
            queryname: queryName
        })
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                console.log(error, "Error ");
                reject(error)
            });
    })
}