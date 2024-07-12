import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
// import JsPDF from "jspdf"

import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { fDate } from "../../../utils/formatTime";
import { isLoading } from "../../../redux/action/defaultActions";

const CreateInvoiceForm = () => {
  const style = {
    width: "100%",
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 30,
    p: 4,
    borderRadius: "10px",
    alignContent: "center",
    justifyContent: "center",
  };

  const dispatch = useDispatch();

  const [data, setData] = useState();
  const userDetails = useLocation();
  const ref = useRef();
  const getData = async () => {
    dispatch(isLoading(true));

    try {
      const res = await axios.post(
        `/api/v1/admin/create/invoice/${userDetails?.state?.idShop}/${userDetails.state.shop}`
      );
      // console.log("getData", res?.data);
      dispatch(isLoading(false));
      setData(res?.data);
    } catch (error) {
      dispatch(isLoading(false));
      console.log(error);
    }
  };

  // ================================
  useEffect(() => {
    getData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid container sx={style} rounded={1} xs={12} sm={10} md={8} ref={ref}>
        <Grid item xs={6} sm={6} md={7}>
          <img
            style={{ maxWidth: "4.5rem" }}
            src={"/assets/icons/cbh.svg"}
            alt="logo"
          />
        </Grid>
        <Grid
          item
          container
          xs={6}
          sm={6}
          md={5}
          spacing={1}
          sx={{ overflow: "hidden" }}
        >
          <Grid item container xs={12}>
            <Grid item xs={4} sm={4} md={2}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                }}
              >
                MailId:
              </Typography>
            </Grid>
            <Grid item xs={8} sm={8} md={10}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  paddingLeft: "2%",
                }}
              >
                {data?.userDetail?.email}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12}>
            <Grid item xs={4} sm={4} md={3}>
              <Typography sx={{ fontSize: "0.9rem" }}>Phone.No:</Typography>
            </Grid>
            <Grid item xs={8} sm={8} md={9}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  paddingLeft: "2%",
                }}
              >
                {data?.userDetail?.contactNo}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{
            textAlign: "center",
          }}
        >
          <Typography spacing={2} variant="h3">
            Invoice
          </Typography>
          <Typography variant="h3">Central Business Hub</Typography>
          <Typography>5QFR+3RH, Parle Point, Umra Gam,</Typography>
          <Typography>Athwa, Surat, Gujarat 395007</Typography>
        </Grid>
        <Grid item container xs={7} sm={7} md={7} sx={{ marginTop: "1.5rem" }}>
          <Grid item container xs={12}>
            <Grid item xs={5} sm={4} md={3}>
              <Typography sx={{ color: "black", fontWeight: 800 }}>
                Username:
              </Typography>
            </Grid>
            <Grid item xs={7} sm={8} md={9}>
              <Typography>
                {data?.userDetail?.firstName} {data?.userDetail?.lastName}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12}>
            <Grid item xs={5} sm={4} md={3}>
              <Typography sx={{ color: "black", fontWeight: 800 }}>
                Shop-No:
              </Typography>
            </Grid>
            <Grid item xs={7} sm={8} md={9}>
              <Typography> {data?.shopMaintenanceData[0]?.shopNo}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item container xs={5} sm={5} md={5} sx={{ marginTop: "1.5rem" }}>
          <Grid item container xm={12} sm={12} md={12}>
            <Grid item xs={5} sm={6} md={6}>
              <Typography sx={{ color: "black", fontWeight: 600 }}>
                Invoice.No:
              </Typography>
            </Grid>
            <Grid item xs={7} sm={6} md={6}>
              <Typography sx={{ color: "#566468", fontWeight: 200 }}>
                {data?.invoiceNo}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container xm={12} sm={12} md={12}>
            <Grid item xs={5} sm={6} md={6}>
              <Typography sx={{ color: "black", fontWeight: 600 }}>
                Invoice.Date:
              </Typography>
            </Grid>
            <Grid item xs={7} sm={6} md={6}>
              <Typography sx={{ color: "#566468", fontWeight: 200 }}>
                &nbsp;{fDate(data?.invoiceDate)}
              </Typography>
            </Grid>
          </Grid>

          <Grid item container xm={12} sm={12} md={12}>
            <Grid item xs={5} sm={6} md={6}>
              <Typography sx={{ color: "black", fontWeight: 600 }}>
                Due Date:
              </Typography>
            </Grid>
            <Grid item xs={7} sm={6} md={6}>
              <Typography sx={{ color: "#566468", fontWeight: 200 }}>
                &nbsp;{fDate(data?.dueDate)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          container
          component={Paper}
          border={"1px solid grey"}
          mt={1}
          p={2}
        >
          <Grid item xs={8} sm={8} md={8}>
            <Typography
              variant="h6"
              sx={{
                // marginBottom: "0.5rem",
                textDecoration: "underline",
                color: "#575454",
              }}
            >
              Particulars
            </Typography>

            {data?.shopMaintenanceData.map((months, _id) => {
              return (
                <Grid item xs={12} key={_id}>
                  <Typography variant="h6">{months?.month}</Typography>
                  <Typography>
                    ({months?.ratePerSqFt} sq.ft &nbsp; x ₹{months?.shopArea})
                    /month
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="h6"
              sx={{
                textDecoration: "underline",
                color: "#575454",
              }}
            >
              Amount
            </Typography>

            {data?.shopMaintenanceData.map((months, _id) => {
              return (
                <Grid item container xs={12} key={_id}>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      ₹ &nbsp;{months?.maintenance}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    _
                  </Grid>
                </Grid>
              );
            })}
          </Grid>

          <Grid item container mt={1} xs={12} borderTop={"2px solid gray"}>
            <Grid item xs={8}>
              <Typography variant="h6"> Total</Typography>
              <Typography>
                (Add)&nbsp;GST @{data?.shopMaintenanceData[0]?.GST}%
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">
                ₹ &nbsp;{data?.totalMaintenance}
              </Typography>
              <Typography> ₹ &nbsp;{data?.totalGst}</Typography>
            </Grid>
          </Grid>
          <Grid item container mt={1} xs={12} borderTop={"2px solid gray"}>
            <Grid item xs={8}>
              <Typography variant="h6">3 Months Total Payable</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">₹ &nbsp;{data?.netAmount}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12} spacing={2}>
          <Typography variant="h6" paddingTop={2}>
            Note:-
          </Typography>
          <Typography>
            For any query contact to the mail-id or phone-no mentioned above .
          </Typography>
        </Grid>
      </Grid>

      <Stack mt={2}>
        {/* <Button variant="primary" onClick={generatePDF}></Button> */}
        <ReactToPrint
          pageStyle={`@page {
            size: auto; 
          }`}
          // pageStyle={`@page { size:(25.4 / 96)}mm (25.4 / 96)mm ; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; padding: 40px !important; } }`}
          trigger={() => {
            return <a href="#"> Download</a>;
          }}
          content={() => ref.current}
          fontSize={20}
        />
      </Stack>
    </Box>
  );
};
export default CreateInvoiceForm;
