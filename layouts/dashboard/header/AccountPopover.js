import { useState } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
  Button,
  Modal,
  Grid,
} from "@mui/material";
// mocks_
import axios from "axios";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { isLoading, openSnackbar } from "../../../redux/action/defaultActions";
import account from "../../../_mock/account";

// ----------------------------------------------------------------------

const MENU_OPTIONS = {
  label: "Profile",
  icon: "eva:person-fill",
};

// ----------------------------------------------------------------------
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

export default function AccountPopover() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);
  const [unlock, setUnlock] = useState(false);

  const handleLogoutOpen = (event) => {
    setUnlock(true);
  };
  const handleLogoutClose = () => {
    setUnlock(false);
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // ********************************Logout Function  *********************************

  const handleLogout = async () => {
    dispatch(isLoading(true));
    try {
      const res = await axios.post(`/api/v1/admin/sign/out`);
      dispatch(isLoading(false));
      dispatch(openSnackbar("Successfully Logout", "success"));
      navigate(`/login`);
    } catch (error) {
      dispatch(isLoading(false));
      console.log(error);
    }
  };

  // **********************************************************************************

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          <MenuItem>{MENU_OPTIONS?.label}</MenuItem>
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogoutOpen} sx={{ m: 1 }}>
          <Button>Logout</Button>
        </MenuItem>

        <Modal
          open={unlock}
          onClose={handleLogoutClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              color={"#A51818"}
            >
              Logout Modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure to want to Logout ?
            </Typography>
            <Grid mt={2} spacing={2}>
              <Button
                size="small"
                variant="contained"
                onClick={handleLogoutClose}
              >
                Cancle
              </Button>
              <Button
                size="small"
                variant="contained"
                sx={{ marginLeft: "2rem" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Grid>
          </Box>
        </Modal>
      </Popover>
    </>
  );
}
