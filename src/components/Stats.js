import React, { useState, useEffect } from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
        align: "left",
        height: "100%"
    },
    body: {
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
    },
    text: {
        color: "white",
    },
    bodyText: {
        color: "white",
        [theme.breakpoints.down('md')]: {
            fontSize: 45
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: 40
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: 30
        },
    }
}));

export default function Stats({ log }) {
    const classes = useStyles();
    const [numEvents, setNumEvents] = useState("Loading...");
    const [hours, setHours] = useState("Loading...");

    function updateStats() {
        setNumEvents(log.length);
        let totalHours = 0;
        for (let i = 0; i < log.length; i++) {
            totalHours += parseFloat(log[i].hours);
        }
        setHours(totalHours);
    }

    useEffect(() => {
        if (log.length !== undefined && log.length >= 0) {
            updateStats();
            const interval = setInterval(updateStats, 300000);
            return () => {
                clearInterval(interval);
            }
        }
    })

    return (
        <div className={classes.root}>
            <div align="left" >
                <Typography variant="h2" className={classes.text}>Stats</Typography>
                <br /><br />
                <Typography variant="h3" className={classes.bodyText}>Number of Events: {numEvents} </Typography>
                <Typography variant="h3" className={classes.bodyText}>Total Hours: {hours} </Typography>
            </div>
        </div>
    )
}