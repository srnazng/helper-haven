import React from "react";
import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import DataTable from "react-data-table-component";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "white",
        zIndex: 0,
        flexGrow: 1,
    },
    title: {
        color: theme.palette.textPrimary.dark,
    },
    box: {
        backgroundColor: theme.palette.primary.main,
        paddingTop: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
        borderRadius: "20px",
        height: "100%",
    },
    container: {
        padding: "30px"
    },
    grid: {
        marginBottom: "20px"
    },
    text: {
        color: "white"
    }
}));

export default function UpcomingEvents({ events }) {
    const classes = useStyles();

    const columns = [
        {
            name: "Name",
            selector: "event_name",
            sortable: true
        },
        {
            name: "Summary",
            selector: "event_summary",
            sortable: false,
            grow: 3
        },
        {
            name: "Role Description",
            selector: "role_description",
            sortable: false,
            grow: 2
        },
        {
            name: "Location",
            selector: "location",
            sortable: false
        },
        {
            name: "Time",
            selector: "time",
            sortable: false
        }
    ];

    const ExpandedComponent = ({ data }) => {
        return (
            <div className={classes.root}>
                <Grid container className={classes.container}>
                    <Grid item align="left" xs={12}>
                        <Typography variant="h6" className={classes.title} >
                            {data.event_name}
                        </Typography>
                        <Typography variant="body1" xs={12}>
                            Event Summary: {data.event_summary} <br />
                            Volunteer Role: {data.role_description} <br />
                            Location: {data.location} <br />
                            Time: {data.time} <br /><br />
                            {data.contact_name !== "" && data.contact_name !== undefined ?
                                "For more information contact " + data.contact_name
                                : (data.contact_email !== "" && data.contact_email !== undefined) || (data.contact_number != "" && data.contact_number !== undefined)
                                    ? "Contact: " : ""}
                            {(data.contact_email !== "" && data.contact_email !== undefined) || (data.contact_number != "" && data.contact_number !== undefined) ? <br /> : ""}
                            {data.contact_email !== "" && data.contact_email !== undefined ? data.contact_email : ""}
                            {(data.contact_email !== "" && data.contact_email !== undefined) && (data.contact_number != "" && data.contact_number !== undefined) ? <br /> : ""}
                            {data.contact_number !== "" && data.contact_number !== undefined ? data.contact_number : ""}
                            {(data.contact_email !== "" && data.contact_email !== undefined) || (data.contact_number != "" && data.contact_number !== undefined) ? <br /> : ""}
                        </Typography>
                        {data.link !== "" && data.link !== undefined ?
                            <Grid item>
                                <br />
                                <Button variant="contained" color="secondary" href={data.link}>More Information</Button>
                            </Grid> : ""}
                    </Grid>
                </Grid>
            </div>
        );
    }

    return (
        <div>
            <Typography variant="h4" className={classes.text}>Upcoming Volunteer Events</Typography>
            <br /><br />
            <DataTable
                columns={columns}
                data={events}
                pagination
                persistTableHead
                paginationRowsPerPageOptions={[5, 10, 20, 30, 50]}
                noHeader
                expandableRows
                expandableRowsComponent={<ExpandedComponent data={events || null} />}
            />
        </div>
    )
}