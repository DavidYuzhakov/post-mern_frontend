import { Alert, Box, Modal } from "@mui/material";
import { closeAlert } from "../store/slices/app";
import { useAppDispatch, useAppSelector } from "../hooks";

export function ModalAlert () {
  const dispatch = useAppDispatch()
  const { isOpen, message } = useAppSelector(state => state.app)

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 300,
    transform: 'translate(-50%, -50%)',
    pt: 2,
    px: 4,
    pb: 3,
  }

  return (
    <Modal
      open={isOpen}
      onClose={() => dispatch(closeAlert())}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{...style}}>
        <Alert severity="error">{ message }</Alert>
      </Box>
    </Modal>
  )
}