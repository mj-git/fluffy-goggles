import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: "unset",
    },
    "& .MuiDialogActions-root": {
        padding: "unset",
    },
    "& .MuiDialogTitle-root": {
        padding: "unset",
        background: theme.palette.primary.main,
        color: "#fff",
    },
    "& .MuiPaper-elevation": {
        maxHeight: "unset",
        maxWidth: "unset",
    },
}));

export default function DialogBox({
    onClose,
    renderTitle,
    renderContent,
    renderFooter,
}) {
    console.log("Render Dialog");
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        if (typeof onClose === "function") {
            onClose();
        }
    };
    return (
        <StyledDialog onClose={handleClose} open={open}>
            <DialogTitle component="div">{renderTitle}</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.common.white,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>{renderContent}</DialogContent>
            <DialogActions>{renderFooter}</DialogActions>
        </StyledDialog>
    );
}
