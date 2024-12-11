import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmModal({nodeData, closeConfirmModal}) {
console.log(nodeData);
  const handleClose = () => {
    closeConfirmModal(false);
  };

  const replaceEmployee = () => {
    closeConfirmModal(true);
    console.log(nodeData);
  }
  
  React.useEffect(() => {
    console.log(nodeData, "empData");
  },[nodeData])

  return (
    <React.Fragment>
      <Dialog
        open={nodeData}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you Sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Already the user <b>{nodeData.oldUserName}</b> is assigned to the machine <b>{nodeData.machineName}</b>. You want to replace this employee with <b>{nodeData.userName}</b> ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={replaceEmployee} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}