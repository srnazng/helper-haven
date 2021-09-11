import React, { useState } from "react";
import { Box, Button, Grid, makeStyles, TextField, Typography, 
InputLabel, MenuItem, FormHelperText, FormControl, Select} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';


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
        margin: theme.spacing(1),
        minWidth: 120,
        flex: 1,
        marginTop: -10,
        marginRight: 40,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function Profile({ profile, updateProfile }) {
    const classes = useStyles();
    const [firstname, setFirstname] = useState(profile.first_name || "");
    const [lastname, setLastname] = useState(profile.last_name || "");
    const [email, setEmail] = useState(profile.email || "");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [value, setValue] = useState(2);
    const [age, setAge] = useState("");

    async function editProfile() {
        let email = localStorage.getItem("email");
        let response = await request({
            type: "PATCH",
            path: `edit-profile/${email}/`,
            body: {
                first_name: firstname,
                last_name: lastname
            }
        })

        updateProfile();
        console.log(response);
    }

    const handleChange = (event) => {
        setAge(event.target.value);
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
                        <Typography variant="h3" >Edit Profile</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={10} md={6} lg={5} xl={5}>
                    <div className={classes.box}>
                        <Typography variant="h6" >Personal Information</Typography>
                        <form autoComplete="off">
                            <TextField id="standard-basic" defaultValue={firstname} label="First Name" className={classes.input} onChange={(e) => setFirstname(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={lastname} label="Last Name" className={classes.input} onChange={(e) => setLastname(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={lastname} label="Address" className={classes.input} onChange={(e) => setLastname(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={lastname} label="State" className={classes.input} onChange={(e) => setLastname(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={lastname} label="Zip Code" className={classes.input} onChange={(e) => setLastname(e.target.value)} />
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
                <Grid item xs={12} sm={10} md={6} lg={5} xl={5}>
                    <div className={classes.box}>
                        <Typography variant="h6" >Skills</Typography>
                        <div className={classes.row}>
                        <FormControl className={classes.formControl}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                onChange={handleChange}
                                >
                                <MenuItem value={"Java"}>Java</MenuItem>
                                <MenuItem value={"Python"}>Python</MenuItem>
                                <MenuItem value={"Communication"}>Communication</MenuItem>
                            </Select>
                        </FormControl>
                            <Rating
                                style = {{flex:1}}
                                name="simple-controlled"
                                value={value}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                                max = {10}
                            />
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div >
    )
}