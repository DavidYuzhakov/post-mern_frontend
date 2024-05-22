import { 
  Box,
  Modal,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material"
import { Dispatch, SetStateAction } from "react"

interface EditCommentProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  value: string
  setValue: Dispatch<SetStateAction<string>>
  isLoading: boolean
  editHandler: () => void 
}

export function EditComment({ open, setOpen, value, setValue, isLoading, editHandler}: EditCommentProps) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 300,
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 5,
    pt: 2,
    px: 4,
    pb: 3,
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={{ ...style }}>
        <h2>Edit comment</h2>
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          id="standard-basic"
          label="Standard"
          variant="standard"
        />
        <Button
          onClick={() => editHandler()}
          style={{ marginTop: 30 }}
          variant="contained"
        >
          Edit
        </Button>
        {isLoading && <CircularProgress />}
      </Box>
    </Modal>
  )
}
