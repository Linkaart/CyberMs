import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ConfirmationDialog({
  open,
  title,
  description,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title ?? 'Confirm'}</DialogTitle>
      <DialogContent>
        {description ? <Typography>{description}</Typography> : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
