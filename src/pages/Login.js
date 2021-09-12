import React, { useState } from "react";
import { Button, CircularProgress, Link, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import { requestLogin } from "../util";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        height: "100%",
        width: "100%",
        zIndex: 0,
    },
    image: {
        marginTop: "20px",
        width: "300px",
        [theme.breakpoints.down('sm')]: {
            width: "300px",
        },
    },
    paper: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "fit-content",
        padding: "30px",
        paddingBottom: "50px",
        boxShadow: "2px 2px 10px 0",
        minWidth: "40%"
    },
    title: {
        marginTop: "50px",
        marginBottom: "20px",
        [theme.breakpoints.down('sm')]: {
            fontSize: 30
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: 25
        },
    },
    input: {
        minWidth: "300px",
        width: "80%",
        marginBottom: "20px",
    },
    button: {
        margin: "20px",
    }
}));

export default function Login({ setPage, setToken }) {
    const classes = useStyles();
    const [email, setEmail] = useState(""); // same as username
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const register = (e) => {
        e.preventDefault();
        setPage("register");
    }

    const login = async (e) => {
        setLoading(true);
        let response = await requestLogin(email, password);
        setLoading(false);
        console.log(response);
        if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('email', email);
            setError("");
            setPage("dashboard");
            setToken(localStorage.getItem("token"));
        }
        else if (response && response.username) {
            setError(response.username);
        }
        else if (response && response.password) {
            setError(response.password);
        }
        else if (response && response.non_field_errors) {
            setError(response.non_field_errors);
        }
    }

    return (
        <div align="center" className={classes.root}>
            <Paper className={classes.paper}>
                <img src="/logo-dark.png" className={classes.image} />
                <Typography variant="h4" className={classes.title}>
                    Login
                </Typography>
                <form autoComplete="off">
                    <TextField id="standard-basic" label="Email" className={classes.input} onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <TextField id="standard-basic" label="Password" className={classes.input} type="password" onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <Typography variant="body1">
                        {error}
                    </Typography>
                    <br />
                    {loading ? <div><CircularProgress /></div> : ""}
                    <Button variant="contained" color="secondary" className={classes.button} onClick={(e) => login(e)}>
                        Sign In
                    </Button>
                </form>
                <Typography variant="overline">
                    <Link href="#" onClick={(e) => register(e)}>
                        <u>Register</u>
                    </Link>
                    <br />
                </Typography>
            </Paper>
        </div>
    )
}