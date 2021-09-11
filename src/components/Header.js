import React, { useState } from "react";
import { AppBar, Avatar, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "white",
        height: "100vh",
        width: "100vw",
        zIndex: 0,
        flexGrow: 1,
    },
    logo: {
        width: "130px",
        marginTop: "5px",
        marginBottom: "5px",
        [theme.breakpoints.down('sm')]: {
            width: "100px",
        },
    },
    title: {
        flexGrow: 1,
        color: "white",
        [theme.breakpoints.down('sm')]: {
            fontSize: 15
        },
    },
    text: {
        color: "white",
    },
}));

export default function Header({ setPage }) {
    const classes = useStyles();
    const [menuSelect, setMenuSelect] = useState(null);
    const menuOpen = Boolean(menuSelect);

    const handleMenu = (event) => {
        setMenuSelect(event.currentTarget);
    };

    const handleClose = () => {
        setMenuSelect(null);
    };

    const logout = () => {
        setPage("login");
        localStorage.setItem("token", "");
        localStorage.setItem("email", "");
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <img src="/logo.png" className={classes.logo} />
                    <Typography variant="h5" gutterBottom className={classes.title}>Dashboard</Typography>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        className={classes.avatar} >
                        <Avatar alt="profile" src="/profile_default.png" />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={menuSelect}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={menuOpen}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => setPage("dashboard")}>Dashboard</MenuItem>
                        <MenuItem onClick={() => setPage("profile")}>Edit Profile</MenuItem>
                        <MenuItem onClick={logout}>Log Out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    )
}