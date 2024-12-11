import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { FaRegRectangleXmark } from "react-icons/fa6";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function NodeTypeModal({ isModalOpen, onClose,sendNodeType}) {
  const [open, setOpen] = React.useState(isModalOpen);
  const [selectedNodeType, setSelectedNodeType] = React.useState(""); // Track selected radio button

  // Update modal open state when the `isModalOpen` prop changes
  React.useEffect(() => {
    setOpen(isModalOpen);
  }, [isModalOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose(false);
  };

  const handleRadioChange = (event) => {
          // Update the state with the selected radio button value
          setSelectedNodeType(event.target.value);
        };
  const HandleNodeType = () => {
          sendNodeType(selectedNodeType)
          setOpen(false);
          onClose(false);
  }
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FaRegRectangleXmark 
                    onClick={handleClose}
                    style={{
                              fontSize:'20px',
                              color:'red',
                              position:'absolute',
                              right:1,
                              top:0,
                              cursor:'pointer'
                              }}/>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select the NodeType
          </Typography>

          {/* Use proper label for radio buttons */}
          <Box mt={2}>
            <div>
              <input
                type="radio"
                id="type1"
                name="nodetype"
                value="Machine" // Set value to "Machine"
                onChange={handleRadioChange} // Capture the change
                style={{ marginRight: "8px" }}
              />
              <label htmlFor="type1">Machine</label>
            </div>

            <div style={{ marginTop: "10px" }}>
              <input
                type="radio"
                id="type2"
                name="nodetype"
                value="Material" // Set value to "Material"
                onChange={handleRadioChange} // Capture the change
                style={{ marginRight: "8px" }}
              />
              <label htmlFor="type2">Material</label>
            </div>

            <div style={{ marginTop: "10px" }}>
                    <button className="btn btn-primary" onClick={HandleNodeType}>Submit</button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
