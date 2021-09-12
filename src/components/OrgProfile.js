import React, { useState } from "react";
import {
    Box, Button, Grid, makeStyles, TextField, Typography,
    InputLabel, MenuItem, FormHelperText, FormControl, Select, InputAdornment
} from "@material-ui/core";


import { request } from "../util";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "white",
        height: "100vh",
        width: "100vw",
        zIndex: 0,
        flexGrow: 1,
    },
    box: {
        borderColor: theme.palette.primary.main,
        borderStyle: "solid",
        paddingTop: "30px",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingBottom: "10px",
        borderRadius: "20px",
        height: "100%",
    },
    container: {
        marginTop: "30px",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingBottom: "30px",
    },
    row: {
        marginTop: "30px",
        display: "flex",
        paddingLeft: "30px",
        paddingRight: "30px",
    },
    grid: {
        marginBottom: "20px"
    },
    input: {
        minWidth: "300px",
        width: "80%",
        marginBottom: "20px",
    },
    text: {
        color: "white",
    },
    formControl: {
        minWidth: "300px",
        width: "80%",
        marginBottom: "20px",
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function Profile({ profile, updateProfile }) {
    const classes = useStyles();
    const [name, setName] = useState(profile.name || "");
    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const [website, setWebsite] = useState(profile.link || "");
    const [phone, setPhone] = useState(profile.phone || "");
    const [address, setAddress] = useState(profile.address || "");
    const [city, setCity] = useState(profile.city || "");
    const [state, setState] = useState(profile.state || "");
    const [zip, setZip] = useState(profile.zip || "");
    const [description, setDescription] = useState(profile.description || "");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [type, setType] = useState(profile.category || "")

    async function editProfile() {
        let email = localStorage.getItem("email");
        let response;

        if (name === "" || description === "" || type === "") {
            setError("Fill all required fields.")
            return;
        }

        if (website !== "") {
            response = await request({
                type: "PATCH",
                path: `edit-organization/${email}/`,
                body: {
                    name: name,
                    category: type,
                    description: description,
                    link: website,
                    phone: phone,
                    address: address,
                    city: city,
                    state: state,
                    zip: zip,
                }
            })
        }
        else {
            response = await request({
                type: "PATCH",
                path: `edit-organization/${email}/`,
                body: {
                    name: name,
                    category: type,
                    description: description,
                    phone: phone,
                    address: address,
                    city: city,
                    state: state,
                    zip: zip,
                }
            })
        }
        updateProfile();
        console.log(response);
        if (response.response) {
            setError(response.response);
            return;
        }
        setError("");
    }

    const updateType = (event) => {
        setType(event.target.value);
    };

    return (
        <div >
            <Grid container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={10}
                className={classes.container}>
                <Grid item xs={10}>
                    <div >
                        <Typography variant="h3" >Organization Profile</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={10} xl={10}>
                    <div className={classes.box}>
                        <form autoComplete="off">
                            <TextField required id="standard-basic" defaultValue={name} label="Organization Name" className={classes.input} onChange={(e) => setName(e.target.value)} />
                            <br />
                            <FormControl className={classes.formControl} required>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={type}
                                    onChange={updateType}
                                    align="left"
                                >
                                    <MenuItem value={"Education"}>Education</MenuItem>
                                    <MenuItem value={"Animal"}>Animal</MenuItem>
                                    <MenuItem value={"Environmental"}>Environmental</MenuItem>
                                    <MenuItem value={"Poverty Relief"}>Poverty Relief</MenuItem>
                                    <MenuItem value={"Medical"}>Medical</MenuItem>
                                    <MenuItem value={"Religious"}>Religious</MenuItem>
                                    <MenuItem value={"Other"}>Other</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField required id="standard-basic" defaultValue={description} label="Description" className={classes.input} onChange={(e) => setDescription(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={website} label="Website" className={classes.input} onChange={(e) => setWebsite(e.target.value)} />
                            <br />
                            <TextField
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="standard-basic"
                                defaultValue={email}
                                label="Email"
                                className={classes.input} />
                            <br />
                            <TextField id="standard-basic" defaultValue={phone} label="Phone" className={classes.input} onChange={(e) => setPhone(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={address} label="Address" className={classes.input} onChange={(e) => setAddress(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={city} label="City" className={classes.input} onChange={(e) => setCity(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={state} label="State" className={classes.input} onChange={(e) => setState(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={zip} label="Zip Code" className={classes.input} onChange={(e) => setZip(e.target.value)} />
                            <br />
                            <Typography variant="body1">
                                {error}
                            </Typography>
                            <br />
                            <Button variant="contained" color="secondary" className={classes.button} onClick={editProfile}>
                                Save
                            </Button>
                        </form>
                    </div>
                </Grid>
            </Grid>
            <br /><br /><br />
        </div >
    )
}