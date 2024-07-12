import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { values } from "lodash";
import { useDispatch } from "react-redux";
import axios from "axios";
import { isLoading, openSnackbar } from "../../../redux/action/defaultActions";
import Iconify from "../../iconify/Iconify";

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

const EditShop = ({ data, shopId }) => {
  const dispatch = useDispatch();
  // console.log("dataDekhooo====>", data);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    shopArea: null,
    type: "hhhhh",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event, index) => {
    setEditData({
      ...editData,
      [event.target.name]: event.target.value,
    });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(isLoading(true));

    try {
      const res = await axios.put(
        `/api/v1/admin/update/shop/by/shopId/${shopId}`,
        editData
      );
      // console.log("createShop=====>", res?.data?.message);
      if (res.data.success === true) {
        dispatch(isLoading(false));
        handleClose();
        dispatch(openSnackbar("Shop Updated Successfully", "success"));
      }
    } catch (error) {
      console.log(error);
      dispatch(isLoading(false));
      dispatch(openSnackbar(error.message, "error"));
    }
  };
  useEffect(() => {
    if (data) {
      setEditData({
        shopNo: data?.shopNo,
        shopArea: data?.shopArea,
        type: data?.type,
      });
    }
  }, [data]);

  return (
    <Box>
      <IconButton
        sx={{ color: "white" }}
        // onClick={() => handleOpenEditModal(data)}
        onClick={handleOpen}
      >
        <Iconify icon="mingcute:edit-line" />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          '
          <Stack>
            <Typography variant="h5" color={"#9f2936"}>
              Update shop Details
            </Typography>
          </Stack>
          <Stack mt={2} spacing={2}>
            <TextField
              type="number"
              value={editData?.shopNo}
              disabled
              name="shopNo"
              fullWidth
              label="Shop-No"
              focused
              size="small"
            />

            <TextField
              type="number"
              value={editData?.shopArea}
              name="shopArea"
              label="ShopArea"
              size="small"
              onChange={(event) => {
                handleInputChange(event);
              }}
            />

            <TextField
              label="ShopType"
              className="textfield"
              size="small"
              select
              name="type"
              required
              value={editData?.type}
              sx={{ maxWidth: "150px" }}
              onChange={(event) => handleInputChange(event)}
            >
              <MenuItem value={"office"}>Office</MenuItem>
              <MenuItem value={"shop"}>Shop</MenuItem>
            </TextField>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={1} mt={2}>
            <Button variant="contained" onClick={handleSubmit}>
              Update
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default EditShop;
