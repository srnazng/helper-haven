import React, { useState } from "react";
import {
    Box, Button, Grid, makeStyles, TextField, Typography, IconButton,
    InputLabel, MenuItem, FormHelperText, FormControl, Select, InputAdornment
} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Delete from '@material-ui/icons/Delete';


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
        display: "flex-end",
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
    select: {
        minWidth: "200px",
        marginRight: "15px"
    },
    text: {
        color: "white",
    },
    formControl: {
        margin: theme.spacing(1),
        flex: 1,
        marginTop: -5,
        marginLeft: -40,
        minWidth: 100
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    }
}));

export default function Profile({ profile, updateProfile }) {
    const classes = useStyles();
    const [firstname, setFirstname] = useState(profile.first_name || "");
    const [lastname, setLastname] = useState(profile.last_name || "");
    const [gender, setGender] = useState(profile.gender || "");
    const [address, setAddress] = useState(profile.address || "");
    const [city, setCity] = useState(profile.city || "");
    const [state, setState] = useState(profile.state || "");
    const [zip, setZip] = useState(profile.zip || "");
    const [dob, setDob] = useState(profile.dob || "");
    const [link, setLink] = useState(profile.link || "");
    const [skillData, setSkills] = useState(profile.skills ? JSON.parse(profile.skills) : [
        {
            name: "",
            strength: "0"
        }
    ]);
    const [error, setError] = useState("");

    async function editProfile() {
        let email = localStorage.getItem("email");
        let response;

        if (firstname === "" || lastname === "" || gender === "" || dob === "") {
            setError("Fill all required fields.")
            return;
        }

        if (link !== "") {
            response = await request({
                type: "PATCH",
                path: `edit-volunteer/${email}/`,
                body: {
                    first_name: firstname,
                    last_name: lastname,
                    gender: gender,
                    address: address,
                    city: city,
                    state: state,
                    zip: zip,
                    dob: dob,
                    link: link
                }
            })
        }
        else {
            response = await request({
                type: "PATCH",
                path: `edit-volunteer/${email}/`,
                body: {
                    first_name: firstname,
                    last_name: lastname,
                    gender: gender,
                    address: address,
                    city: city,
                    state: state,
                    zip: zip,
                    dob: dob
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

    async function editSkills() {
        let email = localStorage.getItem("email");
        let skills = JSON.stringify(skillData);
        let response = await request({
            type: "PATCH",
            path: `edit-volunteer/${email}/`,
            body: {
                skills: skills
            }
        })
        updateProfile();
        console.log(response);
        if (response.response) {
            setError(response.response);
            return;
        }
        setError("");
    }

    const updateSkill = index => e => {
        console.log(index);
        let newArr = [...skillData];
        newArr[index].name = e.target.value;
        setSkills(newArr);
        console.log(skillData);
    };

    const updateStrength = index => e => {
        let newArr = [...skillData];
        newArr[index].strength = e.target.value;
        setSkills(newArr);

    }

    const deleteRow = index => e => {
        let newArr = [...skillData];
        newArr.splice(index, 1);
        setSkills(newArr);
    }

    const appendRow = () => {
        let newArr = [...skillData];
        newArr.push({
            name: "Python",
            strength: "0"
        });
        setSkills(newArr);
    }

    const SkillRow = ({ ind }) =>
        <div className={classes.row}>
            <FormControl className={classes.formControl}>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={skillData[ind].name}
                    onChange={updateSkill(ind)}
                    className={classes.select}
                >
                    <MenuItem value={"Programming"}>Programming</MenuItem>
                    <MenuItem value={"English"}>English</MenuItem>
                    <MenuItem value={"Medicine"}>Medicine</MenuItem>
                    <MenuItem value={"Marketing"}>Marketing</MenuItem>
                    <MenuItem value={"Cooking"}>Cooking</MenuItem>
                    <MenuItem value={"Art"}>Art</MenuItem>
                    <MenuItem value={"K-12 Education"}>K-12 Education</MenuItem>
                    <MenuItem value={"Other"}></MenuItem>
                </Select>
            </FormControl>
            <Rating
                style={{ flex: 1 }}
                precision={0.5}
                value={skillData[ind].strength}
                onChange={updateStrength(ind)}
                max={5}
            />
            <IconButton
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={deleteRow(ind)}
                style={{ flex: 1, marginLeft: 15, marginTop: -15, maxHeight: 20, maxWidth: 20, minWidth: 20, minHeight: 20 }}>
                <Delete />
            </IconButton>
        </div>


    return (
        <div >
            <Grid container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
                className={classes.container}>
                <Grid item xs={10}>
                    <div >
                        <Typography variant="h3" >Edit Profile</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={5} xl={5}>
                    <div className={classes.box}>
                        <Typography variant="h6" >Personal Information</Typography>
                        <form autoComplete="off">
                            <TextField id="standard-basic" required defaultValue={firstname} label="First Name" className={classes.input} onChange={(e) => setFirstname(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" required defaultValue={lastname} label="Last Name" className={classes.input} onChange={(e) => setLastname(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" required defaultValue={gender} label="Gender" className={classes.input} onChange={(e) => setGender(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={address} label="Address" className={classes.input} onChange={(e) => setAddress(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={city} label="City" className={classes.input} onChange={(e) => setCity(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={state} label="State" className={classes.input} onChange={(e) => setState(e.target.value)} />
                            <br />
                            <TextField id="standard-basic" defaultValue={zip} label="Zip Code" className={classes.input} onChange={(e) => setZip(e.target.value)} />
                            <br />
                            <form noValidate>
                                <TextField
                                    id="date"
                                    label="Day of Birth"
                                    type="date"
                                    required
                                    defaultValue={dob}
                                    className={classes.input}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => setDob(e.target.value)}
                                />
                            </form>
                            <TextField id="standard-basic" defaultValue={link} label="Social Media / Useful Link" className={classes.input} onChange={(e) => setLink(e.target.value)} />
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
                <Grid item xs={12} sm={12} md={6} lg={5} xl={5}>
                    <div className={classes.box}>
                        <Typography variant="h6" >Top Skills</Typography>
                        {[...Array(skillData.length)].map((_, i) => <SkillRow ind={i} key={i} />)}
                        <IconButton className={classes.button} onClick={appendRow} style={{ marginTop: 20 }}>
                            <AddCircleOutlineIcon />
                        </IconButton>
                        <br /> <br /><br />
                        <Button variant="contained" color="secondary" onClick={editSkills}>Save</Button>
                    </div>
                </Grid>
            </Grid>
            <br /><br /><br />
        </div >
    )
}