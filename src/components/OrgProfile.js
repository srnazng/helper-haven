import React, { useState } from "react";
import { Box, Button, Grid, makeStyles, TextField, Typography, 
InputLabel, MenuItem, FormHelperText, FormControl, Select, InputAdornment} from "@material-ui/core";
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
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [description, setDescription] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [type, setType] = React.useState('');

    const [skillData, setSkills] = useState([
        {
          name: "Python",
          strength: "1"
        }
    ]);

    async function editProfile() {
        let email = localStorage.getItem("email");
        let response = await request({
            type: "PATCH",
            path: `edit-profile/${email}/`,
            body: {
                first_name: "Change later",
                last_name: "Change later"
            }
        })

        updateProfile();
        console.log(response);
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

    const updateType = (event) => {
        setType(event.target.value);
      };

    const deleteRow = index => e => {
        let newArr = [...skillData];
        newArr.splice(index, 1);
        setSkills(newArr);
    }


    const appendRow = () => {
        let newArr = [...skillData];
        newArr.push({
            name: "Python",
            strength: "1" 
        });
        setSkills(newArr);
    }

    const SkillRow = ({ind}) => 
    <div className={classes.row}>

        <FormControl className={classes.formControl}>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={skillData[ind].name}
                onChange={updateSkill(ind)}
                >
                <MenuItem value={"Education"}>Education</MenuItem>
                <MenuItem value={"Python"}>Animal</MenuItem>
                <MenuItem value={"Communication"}>Environmental</MenuItem>
                <MenuItem value={"Communication"}>Poverty Relief</MenuItem>
                <MenuItem value={"Communication"}>Medical</MenuItem>
                <MenuItem value={"Communication"}>Religious</MenuItem>
                <MenuItem value={"Communication"}>Other</MenuItem>
            </Select>
        </FormControl>
            <Rating
                style = {{flex:1}}
                precision = {0.5}
                value={skillData[ind].strength}
                onChange={updateStrength(ind)}
                max = {5}
            />

        <Button 
        variant="contained" 
        color="primary" 
        className={classes.button} 
        onClick={deleteRow(ind)} 
        style = {{flex:1, marginLeft: 5, maxHeight: 20, maxWidth: 20, minWidth: 20, minHeight: 20}}>
            X
        </Button>
        

    </div>


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
                        <Typography variant="h3" >Edit Profiles</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={10} xl={10}>
                    <div className={classes.box}>
                        <form autoComplete="off">
                            <TextField id="standard-basic" defaultValue={""} label="Organization Name" className={classes.input}/>
                            <br />
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Type of Organization</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={type}
                                    onChange={updateType}
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
                            <br />
                            <TextField id="standard-basic" defaultValue={website} label="Website" className={classes.input} onChange={(e) => setWebsite(e.target.value)}/>
                            <br />
                            <TextField id="standard-basic" defaultValue={email} label="Email" className={classes.input} onChange={(e) => setEmail(e.target.value)} />
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
                            <TextField id="standard-basic" defaultValue={description} label="Description" className={classes.input} onChange={(e) => setDescription(e.target.value)} />
                            <br />
                            <form className={classes.container} noValidate>
                            </form>
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
        </div >
    )
}