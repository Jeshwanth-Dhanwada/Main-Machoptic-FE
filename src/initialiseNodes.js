import React, { useEffect, useState } from 'react';

const NodesComponent = ({
    nodes,
    setNodes,
    tree,
    edges,
    buttonClicked,
    setButtonClicked,
    expandCollapse,
    setEditNodeProperties,
    setExpandNodestate,
    selectedNodeId,
    handleDelete,
    setSelectedNodeDelete,
    setNodeFormulapop,
    setNodedata
}) => {
    // State to track collapsed/expanded status of each node
    const [nodeStates, setNodeStates] = useState({});

    // Function to toggle collapse/expand state for a specific node
    //   const toggleNodeCollapse = (nodeId) => {
    //     setNodeStates((prevStates) => ({
    //       ...prevStates,
    //       [nodeId]: !prevStates[nodeId], // Toggle the state of the node
    //     }));
    //   };

    const toggleNodeCollapse = (nodeId) => {
        setNodeStates((prevStates) => ({
            ...prevStates,
            [nodeId]: !prevStates[nodeId], // Toggle the state of the node
        }));
        // setNodeStates((prevStates) => ({
        //     ...prevStates,
        //     [nodeId]: !prevStates[nodeId] ? 'collapsed' : 'expanded', // Set node state based on collapse state
        // }));
    };

    useEffect(() => {
        const nodeElements = document.querySelectorAll('[data-id]');
        nodeElements.forEach((nodeElement) => {
            // Remove any existing icon containers
            const iconContainer = nodeElement.querySelector('.icon-container');
            if (iconContainer) {
                nodeElement.removeChild(iconContainer);
            }
        });


        nodes.forEach((node) => {
            const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
            if (nodeElement) {
                let iconContainer = nodeElement.querySelector('.icon-container');
                if (!iconContainer) {
                    // Icon container creation logic
                    iconContainer = document.createElement('div');
                    iconContainer.className = 'icon-container';

                    const deleteIcon = document.createElement('div');
                    deleteIcon.className = 'icon delete-icon';
                    deleteIcon.innerHTML = `<svg width="14" height="8" viewBox="0 0 24 24" fill="#fa050d" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 6H5H21V8H19.7643L18.3506 19.6785C18.2084 20.8701 17.2326 21.8 16.0369 21.8H7.96313C6.76739 21.8 5.79155 20.8701 5.64938 19.6785L4.23567 8H3V6ZM7.96313 20H16.0369L17.4297 8H6.57033L7.96313 20ZM10 2V4H14V2H10ZM8 4V2C8 1.44772 8.44772 1 9 1H15C15.5523 1 16 1.44772 16 2V4H21C21.5523 4 22 4.44772 22 5V6H2V5C2 4.44772 2.44772 4 3 4H8Z" fill="#fa050d"/>
          </svg>`;
                    deleteIcon.style.fontSize = '4px';
                    deleteIcon.title = 'Delete';
                    deleteIcon.addEventListener('click', () => {
                        setSelectedNodeDelete(node.id);
                        handleDelete(node.id);
                    });

                    const editIcon = document.createElement('div');
                    editIcon.className = 'icon edit-icon';
                    editIcon.innerHTML = '✏️'; // Edit icon
                    //             editIcon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    //     <path d="M4 20H20" stroke="#034661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    //     <path d="M14.5 3.5L20.5 9.5L10.5 19.5L4.5 19.5L4.5 13.5L14.5 3.5Z" stroke="#034661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    //   </svg>`; // Edit icon in SVG format
                    editIcon.style.fontSize = '5px';
                    editIcon.style.color = '#034661';
                    editIcon.title = 'Edit';
                    editIcon.addEventListener('click', () => {
                        setEditNodeProperties(true);
                        setNodedata(node);
                    });

                    const addIcon = document.createElement('div');
                    addIcon.className = 'icon add-icon';
                    addIcon.innerHTML = nodeStates[node.id] ? '➖' : '➕'; // Based on collapse/expand state
                    addIcon.title = nodeStates[node.id] ? 'Collapse' : 'Expand';
                    addIcon.style.fontSize = '5px';
                    addIcon.style.color = '#034661';

                    // Toggle node expand/collapse when clicked
                    addIcon.addEventListener('click', () => {
                        expandCollapse(node.id);
                        toggleNodeCollapse(node.id)
                        setButtonClicked((prevState) => !prevState);
                    });

                    iconContainer.appendChild(deleteIcon);
                    iconContainer.appendChild(editIcon);
                    if (node.childLength == 0) { } else { iconContainer.appendChild(addIcon); }

                    nodeElement.appendChild(iconContainer);
                } else {
                    // Update icon state when buttonClicked changes
                    const addIcon = iconContainer.querySelector('.add-icon');
                    if (addIcon) {
                        addIcon.innerHTML = nodeStates[node.id] ? '➕' : '➖';
                        addIcon.title = nodeStates[node.id] ? 'Expand' : 'Collapse';
                    }
                }
            }
        });
    }, [nodes, nodeStates, buttonClicked, selectedNodeId, tree]);

    return <div>{/* Your component JSX */}</div>;
};

export default NodesComponent;
