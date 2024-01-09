import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ReferenceDataGrid from "./ReferenceDataGrid";
import { Button } from "@mui/material";

import "./ReferenceData.css";
import { useState } from "react";
import CreateMatchKeysModal from "./CreateMatchKeysModal";
import ReferenceDataEditor from "./ReferenceDataEditor";
import { REFERENCE_DATA_EDITOR_MODE } from "../../utils/constants";
import { useRef } from "react";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    })
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

export default function LandingPage() {
    const gridRef = React.useRef();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const editorModeRef = useRef(REFERENCE_DATA_EDITOR_MODE.create);

    const [showCreateMatchKeysModal, setShowCreateMatchKeysModal] =
        useState(false);

    const [showReferenceDataEditor, setShowReferenceDataEditor] =
        useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: "none" }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            marginLeft="auto"
                        >
                            Welcome User
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === "ltr" ? (
                                <ChevronLeftIcon />
                            ) : (
                                <ChevronRightIcon />
                            )}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {["Reference Data", "Requests"].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? (
                                            <InboxIcon />
                                        ) : (
                                            <MailIcon />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Main open={open}>
                    <DrawerHeader />

                    <Button
                        variant="contained"
                        onClick={() => {
                            // console.log(gridRef.current.api.getSelectedRows());
                            setShowCreateMatchKeysModal(true);
                        }}
                    >
                        Define
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // console.log(gridRef.current.api.getSelectedRows());
                            // setShowCreateMatchKeysModal(true);
                            editorModeRef.current =
                                REFERENCE_DATA_EDITOR_MODE.create;
                            setShowReferenceDataEditor(true);
                        }}
                    >
                        Add
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // console.log(gridRef.current.api.getSelectedRows());
                            editorModeRef.current =
                                REFERENCE_DATA_EDITOR_MODE.edit;
                            setShowReferenceDataEditor(true);
                        }}
                    >
                        Edit
                    </Button>
                    <div className="grid-container">
                        <ReferenceDataGrid gridRef={gridRef} />
                    </div>
                </Main>
            </Box>
            {showCreateMatchKeysModal && (
                <CreateMatchKeysModal
                    onClose={() => setShowCreateMatchKeysModal(false)}
                />
            )}
            {showReferenceDataEditor && (
                <ReferenceDataEditor
                    mode={editorModeRef.current}
                    onClose={() => setShowReferenceDataEditor(false)}
                />
            )}
        </React.Fragment>
    );
}
