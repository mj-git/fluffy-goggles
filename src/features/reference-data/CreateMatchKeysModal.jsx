import React, { useState } from "react";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DialogBox from "../../components/DialogBox";
import styles from "./CreateMatchKeysModal.module.scss";
import { styled } from "@mui/material/styles";
import {
    Box,
    Button,
    Chip,
    Divider,
    TextField,
    Typography,
} from "@mui/material";
import { useGetMatchKeysQuery } from "./referenceDataSlice";
import { useRef } from "react";
import { useCallback } from "react";
import Toast from "../../components/Toast";

const StyledTextField = styled(TextField)(() => ({
    "& .MuiOutlinedInput-input ": {
        // padding: "4px",
    },
}));

const MatchKey = ({ data: matchKey, onMatchKeyChange }) => {
    const [newMatchKeys, setNewMatchKeys] = useState([]);
    const [matchKeyValue, setMatchKeyValue] = useState("");
    return (
        <Box>
            <div className={styles.matchKeyField}>
                <Typography component="span" fontSize={14} fontWeight={"bold"}>
                    {matchKey.name}
                </Typography>

                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <StyledTextField
                        size="small"
                        value={matchKeyValue}
                        onChange={(event) => {
                            setMatchKeyValue(event.target.value);
                        }}
                    />
                    <button
                        style={{
                            height: "24px",
                            background: "unset",
                            border: "unset",
                        }}
                        disabled={
                            !matchKeyValue ||
                            matchKey.values.includes(matchKeyValue) ||
                            newMatchKeys.includes(matchKeyValue)
                        }
                        title="Hi"
                        tabIndex={0}
                        onClick={() => {
                            setNewMatchKeys((oldValue) => {
                                const newValue = [...oldValue, matchKeyValue];
                                onMatchKeyChange(matchKey.name, newValue);
                                return newValue;
                            });

                            setMatchKeyValue("");
                        }}
                    >
                        <AddCircleRoundedIcon />
                    </button>
                </div>
            </div>
            <div className={styles.selectedMatchKeys}>
                {matchKey.values.map((mk) => (
                    <Chip label={mk} key={mk} />
                ))}
                {newMatchKeys.map((mk) => (
                    <Chip
                        label={mk}
                        key={mk}
                        onDelete={() =>
                            setNewMatchKeys((matchKeys) => {
                                const newValue = matchKeys.filter(
                                    (matchKey) => mk !== matchKey
                                );
                                onMatchKeyChange(matchKey.name, newValue);
                                return newValue;
                            })
                        }
                    />
                ))}
            </div>
            <Divider />
        </Box>
    );
};

const CreateMatchKeysModal = ({ onClose }) => {
    const { data: allMatchKeys, isLoading } = useGetMatchKeysQuery();
    const matchKeysMapRef = useRef({});
    const [showMsg, setShowMsg] = useState(false);
    const onMatchKeyChange = useCallback((matchKey, newMatchKeyValues) => {
        matchKeysMapRef.current[matchKey] = newMatchKeyValues;
        console.log(matchKeysMapRef.current);
    }, []);
    const renderModalContent = () => {
        return (
            <Box className={styles.container}>
                {allMatchKeys.map((matchKey) => (
                    <MatchKey
                        key={matchKey.name}
                        data={matchKey}
                        onMatchKeyChange={onMatchKeyChange}
                    />
                ))}
            </Box>
        );
    };

    const onSave = () => {
        setShowMsg(true);
        onClose(true);
    };

    const renderActionButtons = () => {
        return (
            <React.Fragment>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSave}>Save</Button>
            </React.Fragment>
        );
    };

    if (isLoading) {
        return null;
    }

    return (
        <>
            <DialogBox
                renderTitle={
                    <Box className={styles.title}>
                        <Typography variant="h6">Create Match Keys</Typography>
                    </Box>
                }
                renderContent={renderModalContent()}
                renderFooter={renderActionButtons()}
                onClose={onClose}
            />
            {showMsg && <Toast message="Successfulll" />}
        </>
    );
};

export default CreateMatchKeysModal;
