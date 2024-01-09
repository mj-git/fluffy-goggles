import React from "react";
import { REFERENCE_DATA_EDITOR_MODE } from "../../utils/constants";
import DialogBox from "../../components/DialogBox";

import styles from "./ReferenceDataEditor.module.scss";
import {
    Box,
    Checkbox,
    FormControl,
    Grid,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
} from "@mui/material";

import { useGetMatchKeysQuery } from "./referenceDataSlice";
import { useRef } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const MatchKeyField = ({ matchKey, onSelection = () => {} }) => {
    const [selectedMatchKeys, setSelectedMatchKeys] = React.useState([]);
    const onMatchKeySelectionChange = (event) => {
        const {
            target: { value },
        } = event;
        // On autofill we get a stringified value.
        const newValues = typeof value === "string" ? value.split(",") : value;
        onSelection(matchKey.name, newValues);
        setSelectedMatchKeys(newValues);
    };
    return (
        <FormControl sx={{ m: 1, width: 200 }}>
            <Select
                multiple
                value={selectedMatchKeys}
                onChange={onMatchKeySelectionChange}
                input={<OutlinedInput size="small" label={"Yo"} />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
            >
                {matchKey.values.map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox
                            checked={selectedMatchKeys.indexOf(name) > -1}
                        />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const CreateLayout = ({ onMatchKeySelection }) => {
    const { data: allMatchKeysData, isLoading: matchKeysLoading } =
        useGetMatchKeysQuery();

    if (matchKeysLoading) {
        return null;
    }

    return (
        <Grid container spacing={2}>
            {allMatchKeysData.map((matchKey) => (
                <Grid key={matchKey.name} item xs={6} md={6}>
                    <div>{matchKey.name}</div>
                    <MatchKeyField
                        matchKey={matchKey}
                        onSelection={onMatchKeySelection}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

const ReferenceDataEditor = ({
    mode = REFERENCE_DATA_EDITOR_MODE.create,
    onClose,
}) => {
    const selectedMatchKeysRef = useRef({});
    const onMatchKeySelection = (matchKey, selectedValues) => {
        selectedMatchKeysRef.current[matchKey] = selectedValues.length;

        const result = Object.values(selectedMatchKeysRef.current).reduce(
            (prev, next) => {
                return prev * next;
            },
            1
        );

        console.log(result);
    };

    const renderCreateWorkflow = () => {
        return <CreateLayout onMatchKeySelection={onMatchKeySelection} />;
    };

    const renderEditWorkflow = () => {
        return <p>Edit</p>;
    };

    const renderTitle = () => {
        return (
            <Box className={styles.title}>
                <Typography variant="h6">
                    {mode === REFERENCE_DATA_EDITOR_MODE.create
                        ? "Create Reference Data"
                        : "Edit Reference Data"}
                </Typography>
            </Box>
        );
    };

    const renderContent = () => {
        return (
            <Box className={styles.container}>
                {mode === REFERENCE_DATA_EDITOR_MODE.create
                    ? renderCreateWorkflow()
                    : renderEditWorkflow()}
            </Box>
        );
    };

    return (
        <DialogBox
            renderContent={renderContent()}
            renderTitle={renderTitle()}
            onClose={onClose}
        />
    );
};

export default ReferenceDataEditor;
