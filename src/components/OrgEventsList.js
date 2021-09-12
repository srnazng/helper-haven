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
    formControl: {
        margin: theme.spacing(1),
        flex: 1,
        marginTop: -15,
        marginLeft: -40,
        minWidth: 100
    },
    
}));

export default function Portfolio({ events, log, updateLog }) {
    const classes = useStyles();
    const [eventName, setEventName] = useState("");
    const [customEventName, setCustomEventName] = useState("");
    const [role, setRole] = useState("");
    const [hours, setHours] = useState(0);
    const [comments, setComments] = useState("");
    const [error, setError] = useState("");
    
    const [eventAddress, setEventAddress] = useState("");
    const [eventState, setEventState] = useState("");
    const [eventCity, setEventCity] = useState("");
    const [eventStartTime, setStartTime] = useState("");
    const [eventEndTime, setEndTime] = useState("");
    const [eventZip, setEventZip] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [skillData, setSkills] = useState([
        {
          name: "Programming",
          strength: "1"
        }
    ]);

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
            name: "Programming",
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
                style={{ flex: 1}}
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
                style={{ flex: 1, marginTop: -20, marginLeft: 50, maxHeight: 20, maxWidth: 20, minWidth: 20, minHeight: 20 }}>
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
                data={log}
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
                        helperText="Event Name"
                        fullWidth
                        onChange={(e) => setEventName(e.target.value)}
                    />
                    <br />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="address"
                        label="Address"
                        helperText="Address"
                        fullWidth
                        onChange={(e) => setEventAddress(e.target.value)}
                    />
                    <br />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="city"
                        label="City"
                        helperText="City"
                        fullWidth
                        onChange={(e) => setEventCity(e.target.value)}
                    />
                    <br />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="state"
                        label="State"
                        helperText="State"
                        fullWidth
                        onChange={(e) => setEventState(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="zip"
                        label="Zip Code"
                        fullWidth
                        onChange={(e) => setEventZip(e.target.value)}
                    />

                    <TextField
                        id="time"
                        label="Start"
                        type="time"
                        style = {{marginRight:20}}
                        inputProps={{
                        step: 300, // 5 min
                        }}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    <TextField
                        id="time"
                        label="End"
                        type="time"
                        style = {{marginLeft:20, marginRight:20}}
                        
                        inputProps={{
                        step: 300, // 5 min
                        }}
                        onChange={(e) => setStartTime(e.target.value)}
                    />

                    
                    <Typography variant="h6" style = {{textAlign: "center", marginTop: 20}}>Needed Skills</Typography>
                    {[...Array(skillData.length)].map((_, i) => <SkillRow ind={i} key={i} />)}
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