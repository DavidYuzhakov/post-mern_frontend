import { Backdrop, CircularProgress } from "@mui/material";

export function LazyLoading () {
  return (
    <Backdrop open={true}>
      <CircularProgress  />
    </Backdrop>
  )
}