// @mui
import PropTypes from "prop-types";
import { alpha, styled } from "@mui/material/styles";
import { Card, Grid, Typography } from "@mui/material";
// utils
import { fShortenNumber } from "../../../utils/formatNumber";
// components
import Iconify from "../../../components/iconify";

// ----------------------------------------------------------------------

const StyledIcon = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  sx: PropTypes.object,
};

export default function AppWidgetSummary({
  title,
  total,
  icon,
  Shops,
  color = "primary",
  sx,
  ...other
}) {
  // console.log("objectShoppPuri Details", Shops);
  return (
    <Card
      sx={{
        py: 3,
        boxShadow: 0,
        textAlign: "center",
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
        width: "100%",
      }}
      {...other}
    >
      <StyledIcon
        sx={{
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(
              theme.palette[color].dark,
              0
            )} 0%, ${alpha(theme.palette[color].dark, 0.24)} 100%)`,
        }}
      >
        <Iconify icon={icon} width={24} height={24} />
      </StyledIcon>

      <Typography variant="h3">{fShortenNumber(total)}</Typography>

      {title === "Total No of User" ? (
        <>
          <Typography variant="h6" sx={{ opacity: 0.72 }}>
            Total No. Of
          </Typography>
          <Typography variant="h6" my={3} sx={{ opacity: 0.72 }}>
            User
          </Typography>
        </>
      ) : (
        ""
      )}

      {title === "Total Maintenance Request" ? (
        <>
          <Typography variant="h6" sx={{ opacity: 0.72 }}>
            Maintenance Request
          </Typography>
          <Grid container my={2}>
            <Grid item xs={12} sm={3} md={3} pl={1}>
              <Typography>&nbsp;Pending </Typography>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Typography>{Shops?.pendingRequests}</Typography>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Typography>&nbsp;Reject </Typography>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Typography>{Shops?.rejectedRequests}</Typography>
            </Grid>
            <Grid item xs={12} sm={3} md={3} pl={1}>
              <Typography>&nbsp;Accept</Typography>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Typography>{Shops?.acceptedRequests}</Typography>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Typography>&nbsp;Closed </Typography>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Typography>{Shops?.closedRequests}</Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        ""
      )}
      {title === "Total Booking Request" ? (
        <>
          <Typography variant="h6" sx={{ opacity: 0.72 }}>
            Booking Request
          </Typography>
          <Grid container my={2}>
            <Grid item xs={6} sm={3} md={3} pl={1}>
              <Typography>&nbsp;Pending </Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Typography>{Shops?.pendingBookings}</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Typography>&nbsp;Reject</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Typography>{Shops?.rejectedBookings}</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={3} pl={1}>
              <Typography>&nbsp;Accept </Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Typography>{Shops?.acceptedBookings}</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Typography>&nbsp;Expire</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Typography>{Shops?.expiredBookings}</Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        ""
      )}
      {title === "Shop" ? (
        <>
          <Typography variant="h6" sx={{ opacity: 0.72 }}>
            Shop
          </Typography>
          <Grid container my={2}>
            <Grid item xs={6} sm={3} md={6}>
              <Typography>&nbsp;AllotedShops</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={6}>
              <Typography>{Shops?.allotedShops}</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={6}>
              <Typography>&nbsp;VacantShops</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={6}>
              <Typography>{Shops?.vacantShops}</Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        ""
      )}
    </Card>
  );
}
