import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import Carousel from "react-multi-carousel";
import dayjs from "dayjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  isLoading,
  openSnackbar,
} from "../../../../redux/action/defaultActions";
import Iconify from "../../../iconify/Iconify";
import { IMG_PATH } from "../../../../utils/url";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
const AcceptAdverTisingBoard = () => {
  const dispatch = useDispatch();
  const [cardData, setCardData] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  const getData = async () => {
    console.log("bookingId=====>", cardData);
    dispatch(isLoading(true));
    try {
      const data = await axios.get(
        `/api/v1/admin/get/single/booking/${cardData._id}`
      );
      console.log("get Sigle Data===>", data);
      setCardData(data);
      dispatch(isLoading(false));
    } catch (error) {
      dispatch(openSnackbar("something went wrong", "error"));
      dispatch(isLoading(false));
      console.log(error);
    }
  };

  const changeStatus = async (status) => {
    dispatch(isLoading(true));
    try {
      const data = await axios.put(`/api/v1/admin/update/booking/status`, {
        bookingId: cardData?._id,
        orderBookingStatus: status,
      });
      navigate("/dashboard/requests");
      dispatch(openSnackbar("Successfully Updated", "success"));
      dispatch(isLoading(false));
    } catch (error) {
      dispatch(openSnackbar("something went wrong", "error"));
      dispatch(isLoading(false));
      console.log(error);
    }
  };
  useEffect(() => {
    if (state) {
      console.log("useEFFECT", state);
      setCardData(state);
      getData();
    }
  }, []);
  // console.log("bookingId", cardData);

  return (
    <Modal open>
      <Card
        sx={{
          position: "fixed",
          zIndex: 1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "80%",
          maxHeight: "80vh",
          marginX: "10px",
          overflow: "scroll",
        }}
      >
        <CardContent>
          <Stack
            // direction={"row"}
            mt={2}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <img
              width={"25px"}
              height={"25px"}
              src={`
              ${IMG_PATH}
              ${cardData?.problemId?.problemIcon?.url}`}
              alt={cardData?.problemId?.problemType}
            />
            <Typography
              variant="body2"
              fontFamily={"monospace"}
              fontSize={"15px"}
              fontWeight={"bold"}
              component={"span"}
              color={"error.dark"}
            >
              {cardData?.Amenity?.amenityName}
            </Typography>

            <Button
              sx={{
                all: "unset",
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/dashboard/requests")}
            >
              <Iconify icon="material-symbols:close" />
            </Button>
            {/* <Typography gutterBottom variant="h5" component="div">
              {cardData?.problemId?.problemType}
              <Typography
                variant="body2"
                fontFamily={"monospace"}
                fontSize={"15px"}
                fontWeight={"bold"}
                component={"span"}
                color={"error.dark"}
              >
                {cardData?.emergency ? "(urgent)" : ""}
              </Typography>
            </Typography> */}
          </Stack>
          <Stack>
            <Grid style={{ display: "flex" }}>
              <Typography>Booked On :</Typography>
              <Typography color={"error.dark"}>
                &nbsp; {dayjs(cardData?.createdAt).format("DD-MM-YYYY ")}
              </Typography>
            </Grid>
            {/* <Grid style={{ display: "flex" }}>
              <Typography>Floor :</Typography>
              <Typography color={"error.dark"}>
                &nbsp; {cardData?.shop?.floor?.floor}
              </Typography>
            </Grid> */}
            <Grid style={{ display: "flex" }}>
              <Typography component={"blockquote"}>Name : </Typography>
              <Typography color={"primary"} style={{ fontWeight: "100px" }}>
                &nbsp;
                {`${cardData?.user?.firstName} ${cardData?.user?.lastName}`}
              </Typography>
            </Grid>
            <Grid style={{ display: "flex", alignItems: "center" }}>
              <Typography>Raised On : &nbsp;</Typography>
              <Typography color={"primary"}>
                {dayjs(cardData?.createdAt).format("DD/MM/YYYY")}
              </Typography>
            </Grid>
            <Typography>Problem Desicription :</Typography>
            <Typography variant="body2" color={"primary"}>
              {cardData?.description}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h6" my={2}>
              Images /Videos Shared By User
            </Typography>
            {cardData?.images && (
              <Carousel
                swipeable={"false"}
                draggable={"false"}
                showDots={"true"}
                responsive={responsive}
                ssr={"true"} // means to
                infinite={"true"}
                autoPlay={responsive.deviceType !== "mobile"}
                autoPlaySpeed={1000}
                keyBoardControl={"true"}
                transitionDuration={1000}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
              >
                {cardData?.images?.map((item, i) => {
                  if (
                    item?.filename?.split(".")[
                      item?.filename?.split(".").length - 1
                    ] === "mp4"
                  ) {
                    return (
                      <Box
                        key={i}
                        height={{ md: "150px", xs: "350px" }}
                        width={{ md: "150px", xs: "450px" }}
                      >
                        <video
                          autoPlay
                          controls
                          loop
                          muted
                          poster="https://assets.codepen.io/6093409/river.jpg"
                          style={{
                            minWidth: "100%",
                            maxWidth: "100%",
                            margin: "5px",
                            borderRadius: "5px",
                          }}
                        >
                          <source
                            src={`${IMG_PATH}${item?.filePath}`}
                            type="video/mp4"
                          />
                        </video>
                      </Box>
                    );
                  }
                  return (
                    <Box
                      key={i}
                      height={{ md: "170px", xs: "280px" }}
                      width={{ md: "170px", xs: "280px" }}
                    >
                      <img
                        srcSet={`${IMG_PATH}${item?.filePath}`}
                        src={`${item.filePath}`}
                        alt={item.title}
                        loading="lazy"
                        style={{
                          minWidth: "100%",
                          maxWidth: "100%",
                          margin: "5px",
                          borderRadius: "5px",
                        }}
                      />
                    </Box>
                  );
                })}
                {/* <div>option one1</div>
            <div>option one2</div>
            <div>option one3</div> */}
              </Carousel>
            )}
          </Stack>
          {cardData?.adminImages?.length > 0 ? (
            <Stack>
              <Typography variant="h6" my={2}>
                Images /Videos Shared By Admin
              </Typography>
              <Carousel
                swipeable={"true"}
                draggable={"true"}
                showDots={"true"}
                responsive={responsive}
                ssr={"true"} // means to
                infinite={"true"}
                autoPlay={responsive.deviceType !== "mobile"}
                autoPlaySpeed={1000}
                keyBoardControl={"true"}
                transitionDuration={1000}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
              >
                {cardData?.adminImages?.map((item, i) => {
                  if (
                    item?.filename?.split(".")[
                      item?.filename?.split(".").length - 1
                    ] === "mp4"
                  ) {
                    return (
                      <Box
                        key={i}
                        height={{ md: "150px", xs: "250px" }}
                        width={{ md: "150px", xs: "250px" }}
                      >
                        <video
                          autoPlay
                          controls
                          loop
                          muted
                          poster="https://assets.codepen.io/6093409/river.jpg"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <source
                            src={`${IMG_PATH}${item?.filePath}`}
                            type="video/mp4"
                          />
                        </video>
                      </Box>
                    );
                  }
                  return (
                    <Box
                      key={i}
                      height={{ md: "150px", xs: "250px" }}
                      width={{ md: "150px", xs: "250px" }}
                    >
                      <img
                        srcSet={`${IMG_PATH}${item?.filePath}`}
                        src={`${item.filePath}`}
                        alt={item.title}
                        loading="lazy"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </Box>
                  );
                })}
              </Carousel>
            </Stack>
          ) : (
            ""
          )}
          <Button
            onClick={() => changeStatus("accepted")}
            sx={{ backgroundColor: "#9f2936", color: "white", width: "45%" }}
          >
            Accept
          </Button>
          <Button
            onClick={() => changeStatus("rejected")}
            sx={{
              backgroundColor: "#9f2936",
              color: "white",
              width: "45%",
              marginLeft: "1rem",
            }}
          >
            Reject
          </Button>
        </CardContent>
      </Card>
    </Modal>
  );
};
export default AcceptAdverTisingBoard;
