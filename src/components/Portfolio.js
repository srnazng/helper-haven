import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@material-ui/core";
import DataTable from "react-data-table-component";
import { request } from "../util";

const useStyles = makeStyles((theme) => ({
    text: {
        color: "white",
    },
    button: {
        margin: "20px"
    }
}));

export default function Portfolio({ events, log, updateLog }) {
    const classes = useStyles();
    const [eventName, setEventName] = useState("");
    const [customEventName, setCustomEventName] = useState("");
    const [role, setRole] = useState("");
    const [hours, setHours] = useState(0);
    const [comments, setComments] = useState("");
    const [error, setError] = useState("");

    const [openDialog, setOpenDialog] = useState(false);
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const columns = [
        {
            name: "Event Name",
            selector: "event_name",
            sortable: true,
            grow: 2
        },
        {
            name: "Role",
            selector: "role",
            sortable: false,
            grow: 2
        },
        {
            name: "Hours",
            selector: "hours",
            sortable: true,
        },
        {
            name: "Comments",
            selector: "comments",
            sortable: false,
            grow: 3,
        }
    ];

    function handleHoursChange(event) {
        if (event.target.value < 0) {
            event.target.value = 0;
        }
        setHours(event.target.value);
    }

    async function addEvent() {
        let event = eventName;
        if (eventName === "Other") {
            event = customEventName;
        }
        let response = await request({
            type: "POST",
            path: "log/add/", // change to any user
            body: {
                event_name: event,
                user_email: localStorage.getItem("email"),
                role: role,
                hours: hours,
                comments: comments
            }
        });

        if (response.response !== "Successfully added new log entry.") {
            if (response.event_name) {
                setError("Event Name: " + response.comments);
                return;
            }
            else if (response.user_email) {
                setError("Error with user email");
                return;
            }
            else if (response.event_id) {
                setError("Error with event id");
                return;
            }
            else if (response.role) {
                setError("Role: " + response.role);
                return;
            }
            else if (response.hours) {
                setError("Hours: " + response.hours);
                return;
            }
            else if (response.comments) {
                setError("Comments: " + response.comments);
                return;
            }
        }
        else {
            setEventName("");
            setCustomEventName("");
            setRole("");
            setHours("");
            setComments("");
        }

        console.log(response);
        setError("");
        updateLog();
        handleClose();
    }

    // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
    function convertArrayOfObjectsToCSV(array) {
        let result;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';

        const keys = Object.keys(array[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];

                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
    async function downloadCSV() {
        let array = await request({
            type: "GET",
            path: `log/${localStorage.getItem("email")}` // change to any user
        })

        let profile = await request({
            type: "GET",
            path: `profile/${localStorage.getItem("email")}` // change to any user
        })

        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;

        const filename = profile.first_name + ' ' + profile.last_name + ' JANJ Volunteer Log.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }

    const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Export</Button>;
    const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV()} />, []);

    return (
        <div >
            <Typography variant="h4" className={classes.text}>Portfolio</Typography>
            <Button variant="contained" color="secondary" className={classes.button} onClick={handleClickOpen}>Add New Event</Button>
            <br /><br />
            <DataTable
                className={classes.table}
                columns={columns}
                data={log}
                pagination
                persistTableHead
                noHeader={Object.keys(log).length === 0 || log.length == 0 || log[0] === undefined || log[0] === null ? true : false}
                paginationRowsPerPageOptions={[5, 10, 20, 30, 50]}
                actions={actionsMemo}
            />
            <Dialog open={openDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add New Event</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel id="event_name">Event Name</InputLabel>
                        <Select
                            labelId="event_name"
                            align="left"
                            onChange={(e) => setEventName(e.target.value)}
                        >
                            {console.log(events)}
                            {events[0] ?
                                events.map(event => <MenuItem value={event.event_name}>{event.event_name}</MenuItem>)
                                : <TextField
                                    autoFocus
                                    margin="dense"
                                    id="event_name"
                                    label="Event Name"
                                    fullWidth
                                    onChange={(e) => setEventName(e.target.value)}
                                />}
                            < MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <br /><br />
                    {eventName === "Other" ? <TextField
                        autoFocus
                        margin="dense"
                        id="hours"
                        label="Event Name"
                        fullWidth
                        onChange={(e) => setCustomEventName(e.target.value)}
                    /> : ""}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="hours"
                        label="Role"
                        helperText="Describe what you did as a volunteer."
                        fullWidth
                        onChange={(e) => setRole(e.target.value)}
                    />
                    <br />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="hours"
                        label="Volunteer Hours"
                        helperText="Include preparation, training, event, meeting times etc."
                        fullWidth
                        type="number"
                        onChange={(event) => handleHoursChange(event)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="comments"
                        label="Comments"
                        fullWidth
                        onChange={(e) => setComments(e.target.value)}
                    />
                    <Typography variant="body1">
                        {error}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addEvent} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}