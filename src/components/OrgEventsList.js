import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    InputAdornment,
    IconButton,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@material-ui/core";
import DataTable from "react-data-table-component";
import { request } from "../util";
import Rating from '@material-ui/lab/Rating';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Delete from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    text: {
        color: "white",
    },
    button: {
        margin: "20px"
    },
    row: {
        marginTop: "30px",

        paddingLeft: "30px",
        paddingRight: "30px",
    },
    select: {
        minWidth: "200px",
        marginRight: "30px",
        marginLeft: "10px",
        marginTop: "10px"
    },
    formControl: {
        margin: theme.spacing(1),
        flex: 1,
        marginTop: -15,
        marginLeft: -40,
        minWidth: 100
    },
    input: {
        minWidth: "300px",
        width: "100%",
        marginBottom: "20px",
    },
}));

export default function Portfolio({ events, profile, updateEvents }) {
    const classes = useStyles();
    const [eventName, setEventName] = useState("");
    const [roleDescription, setRoleDescription] = useState("");
    const [hours, setHours] = useState(0);
    const [comments, setComments] = useState("");
    const [error, setError] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventDate, setDate] = useState("");
    const [eventTime, setTime] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [link, setLink] = useState("");
    const [skillData, setSkills] = useState([
        {
            name: "",
            strength: "0"
        }
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setEventName("");
        setEventLocation("");
        setDate("");
        setTime("");
        setSkills("");
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
            name: "Summary",
            selector: "event_summary",
            sortable: false,
            grow: 3
        },
        {
            name: "Location",
            selector: "location",
            sortable: false,
        },
        {
            name: "Date",
            selector: "date",
            sortable: true,
        }
    ];

    async function addEvent() {
        let event = eventName;
        let skills = JSON.stringify(skillData);
        let response = await request({
            type: "POST",
            path: "events/",
            body: {
                event_name: event,
                org_name: profile.name,
                org_email: localStorage.getItem("email"),
                event_summary: eventDescription,
                role_description: roleDescription,
                link: link,
                location: eventLocation,
                date: eventDate,
                time: eventTime,
                skills: skills,
            }
        });

        if (response.response !== "Successfully added new event.") {
            if (response.event_name) {
                setError("Event Name: " + response.comments);
                return;
            }
        }
        else {
            setEventName("");
        }

        console.log(response);
        setError("");
        setEventName("");
        setEventLocation("");
        setDate("");
        setTime("");
        setSkills("");
        handleClose();
        updateEvents();
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
            path: `log/${localStorage.getItem("email")}/` // change to any user
        })

        let profile = await request({
            type: "GET",
            path: `profile/${localStorage.getItem("email")}/` // change to any user
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

    };

    const deleteRow = index => e => {
        let newArr = [...skillData];
        newArr.splice(index, 1);
        setSkills(newArr);
    };

    const appendRow = () => {
        let newArr = [...skillData];
        newArr.push({
            name: "",
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
                style={{ marginTop: 5, marginLeft: 100, maxHeight: 20, maxWidth: 20, minWidth: 20, minHeight: 20 }}>
                <Delete />
            </IconButton>
        </div>

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
                data={events}
                pagination
                persistTableHead
                //noHeader={Object.keys(log).length === 0 || log.length == 0 || log[0] === undefined || log[0] === null ? true : false}
                paginationRowsPerPageOptions={[5, 10, 20, 30, 50]}
                actions={actionsMemo}
            />
            <Dialog open={openDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add New Event</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Event Name"
                        fullWidth
                        className={classes.input}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Description"
                        fullWidth
                        className={classes.input}
                        onChange={(e) => setEventDescription(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Volunteer Role"
                        fullWidth
                        className={classes.input}
                        onChange={(e) => setRoleDescription(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="link"
                        label="Link"
                        fullWidth
                        className={classes.input}
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="location"
                        label="Location"
                        fullWidth
                        className={classes.input}
                        onChange={(e) => setEventLocation(e.target.value)}
                    />
                    <br /><br />
                    <TextField
                        id="date"
                        label="Date"
                        type="date"
                        fullWidth
                        required
                        defaultValue={eventDate}
                        className={classes.input}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <TextField
                        id="time"
                        label="Time"
                        type="time"
                        fullWidth
                        inputProps={{
                            step: 300, // 5 min,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        className={classes.input}
                        onChange={(e) => setTime(e.target.value)}
                    />
                    <Typography variant="h6" style={{ marginTop: 20 }}>Needed Skills</Typography>
                    {[...Array(skillData.length)].map((_, i) => <SkillRow ind={i} key={i} />)}
                    <br />
                    <IconButton className={classes.button} onClick={appendRow} style={{ marginTop: 20 }}>
                        <AddCircleOutlineIcon />
                    </IconButton>
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