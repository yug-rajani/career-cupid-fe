import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Copyright from "../../components/common/Copyright";
import * as seekerClient from "../../seekers/client.ts";
import * as userClient from "../../users/client.ts";
import commonUtil from "../../utils/commonUtil.js";

export default function SeekerEdit() {
  const navigate = useNavigate();
  const defaultTheme = createTheme();
  const [countries, setCountries] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [seekerFormData, setSeekerFormData] = React.useState({
    city: "",
    state: "",
    country: "",
    bio: "",
    profile_picture: "",
    email: "",
    _id: "",
    experience: "",
    resume: "",
    education: "",
    job_titles: [],
    skills: [],
  });
  const [userFormData, setUserFormData] = React.useState({
    firstname: "",
    lastname: "",
    _id: "",
  });

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: value,
    });
  };
  const handleSeekerChange = (e) => {
    const { name, value } = e.target;

    setSeekerFormData({
      ...seekerFormData,
      [name]: value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const seekerResponse = await seekerClient.updateSeekers(seekerFormData);
      const userResponse = await userClient.updateUser(userFormData);
      if (seekerResponse || userResponse) {
        handleSnackbar("Congratulations, the changes have been saved.", "success");
        setTimeout(() => {
          navigate(`/seekers/${userFormData.username}`);
        }, 1000);
      }
    } catch (error) {
      handleSnackbar("Error saving the changes. Please try again.", "error");
      console.log("Oops, there was an error:", error);
    }
  };
  const handleCancel = () => {
    navigate(`/seekers/${userFormData.username}`);
  };
  const handleSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let CC_LOGIN_TOKENS = commonUtil.getLoginTokens();
        let user_id = null;

        if (CC_LOGIN_TOKENS && CC_LOGIN_TOKENS.length > 0) {
          const key = CC_LOGIN_TOKENS[0];
          user_id = Object.keys(key)[0];
        } else {
          console.error("Not enough tokens present in auth");
          return;
        }

        if (user_id) {
          let userResponse = await userClient.getUserById(user_id);
          console.log(user_id);

          if (userResponse && userResponse._id === user_id) {
            const queryParams = {
              user: user_id,
            };
            const queryString = new URLSearchParams(queryParams).toString();

            let seekerResponse = await seekerClient.getSeekersByFilter(queryString);

            setSeekerFormData({
              city: seekerResponse[0].city,
              state: seekerResponse[0].state,
              country: seekerResponse[0].country,
              bio: seekerResponse[0].bio,
              profile_picture: seekerResponse[0].profile_picture,
              email: seekerResponse[0].email,
              _id: seekerResponse[0]._id,
              experience: seekerResponse[0].experience,
              resume: seekerResponse[0].resume,
              education: seekerResponse[0].education,
              job_titles: seekerResponse[0].job_titles,
              skills: seekerResponse[0].skills,
            });
            setUserFormData({
              firstname: userResponse.firstname,
              lastname: userResponse.lastname,
              username: userResponse.username,
              _id: userResponse._id,
            });
            try {
              const response = await fetch("https://restcountries.com/v3.1/all");
              const data = await response.json();
              const formattedCountries = data.map((country) => ({
                code: country.cca2,
                name: country.name.common,
              }));
              setCountries(formattedCountries);
            } catch (error) {
              console.error("Error fetching countries:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Typography component="h1" variant="h5" paddingTop={3}>
          Edit Profile
        </Typography>
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstname"
                  required
                  fullWidth
                  id="firstname"
                  label="First Name"
                  autoFocus
                  value={userFormData.firstname}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastname"
                  label="Last Name"
                  name="lastname"
                  autoComplete="family-name"
                  value={userFormData.lastname}
                  onChange={handleUserChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={seekerFormData.email}
                  onChange={handleSeekerChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="city"
                  label="City"
                  id="city"
                  autoComplete="city"
                  value={seekerFormData.city}
                  onChange={handleSeekerChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="state"
                  label="State"
                  id="state"
                  autoComplete="state"
                  value={seekerFormData.state}
                  onChange={handleSeekerChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select
                    labelId="country-label"
                    id="country"
                    value={seekerFormData.country}
                    label="Country"
                    onChange={(e) =>
                      setSeekerFormData({ ...seekerFormData, country: e.target.value })
                    }
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="bio"
                  label="Bio"
                  id="bio"
                  autoComplete="bio"
                  value={seekerFormData.bio}
                  multiline
                  rows={6}
                  onChange={handleSeekerChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="profile_picture"
                  label="Profile Picture"
                  id="profile_picture"
                  autoComplete="profile_picture"
                  value={seekerFormData.profile_picture}
                  onChange={handleSeekerChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="resume"
                  label="Resume"
                  id="resume"
                  autoComplete="resume"
                  value={seekerFormData.resume}
                  onChange={handleSeekerChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="experience"
                  label="Experience"
                  id="experience"
                  autoComplete="experience"
                  value={seekerFormData.experience}
                  onChange={handleSeekerChange}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  name="education"
                  label="Education"
                  id="education"
                  autoComplete="education"
                  value={seekerFormData.education}
                  onChange={handleSeekerChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="skills"
                  label="Skills"
                  value={
                    Array.isArray(seekerFormData.skills) ? seekerFormData.skills.join(",") : ""
                  }
                  onChange={(event) =>
                    setSeekerFormData({ ...seekerFormData, skills: event.target.value.split(",") })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="job_titles"
                  label="Job Titles"
                  value={
                    Array.isArray(seekerFormData.job_titles)
                      ? seekerFormData.job_titles.join(",")
                      : ""
                  }
                  onChange={(event) =>
                    setSeekerFormData({
                      ...seekerFormData,
                      job_titles: event.target.value.split(","),
                    })
                  }
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", marginTop: 3 }}>
              <Button type="submit" variant="contained" sx={{ mr: 3, ml: 13 }}>
                Save
              </Button>
              <Button color="error" variant="contained" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
