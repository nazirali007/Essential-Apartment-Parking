import { filter } from "lodash";
import { useState, useEffect } from "react";
// @mui
import {
  Card,
  Button,
  MenuItem,
  Container,
  TextField,
  Grid,
  Box,
  Select,
} from "@mui/material";
// components
import { useNavigate } from "react-router-dom";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import axios from "axios";
import { IMG_PATH } from "../../../utils/url";
import { isLoading, openSnackbar } from "../../../redux/action/defaultActions";

import Scrollbar from "../../scrollbar";

import USERLIST from "../../../_mock/user";

// ----------------------------------------------------------------------

function CustomeGridToolbar() {
  return (
    <GridToolbarContainer>
      {/* <GridToolbarColumnsButton /> */}
      <GridToolbarFilterButton />
      {/* <GridToolbarDensitySelector /> */}
      {/* <GridToolbarExport /> */}
    </GridToolbarContainer>
  );
}

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "amenityType", label: "AmenityType", alignRight: false },
  { id: "bookedOn", label: "Booked On", alignRight: false },
  { id: "bookingDate", label: "Booking Date", alignRight: false },
  { id: "netPrice", label: "NetPrice", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
];

// ----------------------------------------------------------------------
function CustomeToolBar() {
  return (
    <Grid container>
      <Grid
        item
        md={6}
        sm={12}
        xs={12}
        sx={{
          alignItems: "center",
          display: "flex",
          direction: "row",
          justifyContent: "start",
        }}
      >
        <Box width="100%" sx={{ p: 2 }}>
          <GridToolbarQuickFilter
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "rgba(158, 158, 158, 1)",
                borderRadius: "10px",
                borderColor: "rgba(158, 158, 158, 1)",
              },
            }}
          />
        </Box>
      </Grid>
      <Grid
        item
        md={6}
        sm={12}
        xs={12}
        sx={{
          alignItems: "center",
          display: "flex",
          direction: "row",
          justifyContent: "end",
        }}
      >
        <CustomeGridToolbar />
      </Grid>
    </Grid>
  );
}
// ======================================================================
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ResolvedRequest() {
  const statusColor = {
    accepted: "blue",
    rejected: "red",
    completed: "green",
    pending: "yellow",
    expired: "red",
  };
  const dispatch = useDispatch();

  const [allUsers, setallUsers] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(
    USERLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  const getAllusers = async () => {
    dispatch(isLoading(true));

    try {
      const response = await axios.get("/api/v1/admin/get/all/past/bookings");
      // console.log(response?.data.bookings);
      setallUsers(response?.data.bookings);
      // setCardData(response?.data.bookings);
      dispatch(isLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(isLoading(false));
    }
  };

  const columns = [
    { field: "index", headerName: "Sr No.", width: 40 },
    {
      field: "firstName",
      headerName: "Name",
      width: 200,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.user?.firstName} {params?.row?.user?.lastName}
          </>
        );
      },
    },

    {
      field: "Amenity",
      headerName: "Amenity Type",
      width: 200,
      editable: false,
      renderCell: (params) => {
        return <>{params?.value?.amenityName}</>;
      },
    },
    {
      field: "createdAt",
      headerName: "Booked On",
      width: 140,
      editable: false,
      renderCell: (params) => {
        return `${dayjs(params?.row?.createdAt).format("DD-MM-YYYY ")}`;
      },
    },
    {
      field: "bookingDate",
      headerName: "Booking Date/Time",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 250,

      renderCell: (params) => {
        // console.log("===>", params);
        if (params?.row?.Amenity?.amenityName === "Conference Room") {
          return (
            <>
              <Select
                value="none"
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                fullWidth
                size="small"
              >
                <MenuItem value="none">
                  {`${dayjs(params?.row?.createdAt).format("DD-MM-YYYY")}`}
                </MenuItem>

                {params?.row?.bookedSlots?.map((slot, rowIndex) => {
                  return (
                    <>
                      <MenuItem key={rowIndex} value={"booking"}>
                        <>
                          {`${dayjs(slot?.startTime).format("hh:mm:A ")}
                                            to 
                            ${dayjs(slot?.endTime).format("hh:mm:A ")}`}
                        </>
                      </MenuItem>
                    </>
                  );
                })}
              </Select>
            </>
          );
        }
        return (
          <>{`${dayjs(params?.row?.dateForAdvertisingBoard?.from).format(
            "DD-MM-YYYY "
          )}
        to  ${dayjs(params?.row?.dateForAdvertisingBoard?.to).format(
          "DD-MM-YYYY "
        )}`}</>
        );
      },
    },
    {
      field: "price",
      headerName: "Net Price ₹",
      description: "This column has a value getter and is not sortable.",
      sortable: false,

      width: 140,
      renderCell: (params) => {
        <>{`₹ ${params?.row?.price}`}</>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <Button
              size="small"
              key={params?.row?.bookingStatus}
              style={{
                backgroundColor: statusColor[params?.row?.bookingStatus],
                fontWeight: 200,
                color: "black",
                border: "1px solid grey",
                borderRadius: "5px",
                minWidth: "5rem",
              }}
            >
              {params?.row?.bookingStatus}
            </Button>
          </>
        );
      },
    },
  ];

  //

  const rowsWithIndex = allUsers?.map((row, index) => ({
    ...row,
    index: index + 1,
  }));

  useEffect(() => {
    getAllusers();
  }, []);

  return (
    <>
      <Container style={{ padding: "0px" }}>
        <Card>
          <Scrollbar>
            <DataGrid
              rows={rowsWithIndex}
              columns={columns}
              slots={{ toolbar: CustomeToolBar }}
              getRowId={(row) => row?._id}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              sx={{
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
              }}
            />
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
}
