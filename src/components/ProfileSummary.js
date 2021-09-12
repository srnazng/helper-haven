import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    image: {
        width: "200px",
        marginBottom: "20px",
    },
    text: {
        color: "white",
    },
}));

export default function ProfileSummary({ profile }) {
    const classes = useStyles();

    return (
        <div >
            <img src="/profile_default.png" className={classes.image} />
            <Typography variant="body1" className={classes.text}>{localStorage.getItem("role") === "ORGANIZATION" ? profile.name : profile.first_name + " " + profile.last_name}</Typography>
        </div>
    )
}