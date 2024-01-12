import { Alert, Snackbar, duration } from "@mui/material";
import React from "react";

const Toast = ({ onClose, message, messageType }) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open
            onClose={onClose}
        >
            <Alert
                onClose={onClose}
                severity={messageType}
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Toast;
