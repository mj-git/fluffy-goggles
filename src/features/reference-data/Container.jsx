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

import "./ReferenceData.css";
import { NavLink, Outlet } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ConstructionIcon from "@mui/icons-material/Construction";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../../redux/error/errorSlice";
import { useCallback } from "react";
import Toast from "../../components/Toast";

const drawerWidth = 240;

const MenuItems = [
    {
        name: "Reference Data",
        url: "/accounting-configurations",
        iconComponent: <SettingsSuggestIcon />,
    },
    {
        name: "Requests",
        url: "/requests",
        iconComponent: <QuestionAnswerIcon />,
    },
    {
        name: "Dashboards",
        url: "/dashboards",
        iconComponent: <DashboardIcon />,
    },
    {
        name: "Developer Tools",
        url: "/developer-tools",
        iconComponent: <ConstructionIcon />,
    },
    {
        name: "Audit",
        url: "/audit",
        iconComponent: <ReceiptLongIcon />,
    },
];

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

function AppContainer() {
    const apiError = useSelector((state) => state.error.value);
    const dispatch = useDispatch();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const clearErrorMessage = useCallback(
        () => dispatch(clearError()),
        [dispatch]
    );

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
                        <div className="ml-auto">
                            <Typography
                                variant="h6"
                                textAlign="right"
                                noWrap
                                component="div"
                            >
                                Welcome Meghaa
                            </Typography>
                            <Typography
                                textAlign="right"
                                variant="body2"
                                noWrap
                                component="div"
                            >
                                You're Editor
                            </Typography>
                        </div>
                        <img
                            src="ING.png"
                            width={70}
                            height={70}
                            alt="logo"
                            loading="lazy"
                        />
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
                        {MenuItems.map((menuItem, index) => (
                            <ListItem key={menuItem.name} disablePadding>
                                <NavLink
                                    style={({ isActive }) =>
                                        isActive
                                            ? {
                                                  background: "#ff6200",
                                                  color: "#fff",
                                              }
                                            : {
                                                  color: "#ff6200",
                                              }
                                    }
                                    to={menuItem.url}
                                    className="flex-grow hov nav-bar"
                                >
                                    <ListItemButton>
                                        <ListItemIcon>
                                            {menuItem.iconComponent}
                                        </ListItemIcon>
                                        <ListItemText primary={menuItem.name} />
                                    </ListItemButton>
                                </NavLink>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Main open={open}>
                    <DrawerHeader />
                    <Outlet />
                </Main>
            </Box>
            {apiError && (
                <Toast
                    message={apiError}
                    messageType="error"
                    onClose={clearErrorMessage}
                />
            )}
        </React.Fragment>
    );
}

export default AppContainer;
