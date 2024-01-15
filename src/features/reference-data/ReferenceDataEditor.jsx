import React, { memo, useMemo } from "react";
import { REFERENCE_DATA_EDITOR_MODE } from "../../utils/constants";
import DialogBox from "../../components/DialogBox";

import styles from "./ReferenceDataEditor.module.scss";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    Grid,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import {
    useGetMatchKeyCombinationsMutation,
    useGetMatchKeysQuery,
    useGetReferenceDataColumnsQuery,
    useLazyGetMatchKeyCombinationsQuery,
} from "./referenceDataSlice";
import { useRef } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { AgGridReact } from "ag-grid-react";

const STEPS = {
    SELECT_MATCH_KEYS: 1,
    COMBINATION_PREVIEW: 2,
    LOOKUP_VALUE_SELECTION: 3,
};

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

const MatchKeyField = ({
    matchKey,
    onSelection = () => {},
    selected = [],
    single,
}) => {
    const [selectedMatchKeys, setSelectedMatchKeys] = React.useState(selected);
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
                multiple={!single}
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

const CreateLayout = ({
    onMatchKeySelection,
    step,
    combinationsData,
    selectedCombinations,
    onSelectedCombinationsChange,
}) => {
    const { data: allMatchKeysData, isLoading: matchKeysLoading } =
        useGetMatchKeysQuery();
    const { data: columns = [] } = useGetReferenceDataColumnsQuery();
    const selectionRef = useRef({ selectedMatchKeys: {} });

    const rowData = useMemo(() => {
        if (!combinationsData) return [];
        if (combinationsData.length) {
            return combinationsData.map((row, index) => ({
                ...row.columnToValueMap,
                id: index + 1,
            }));
        }
        return [];
    }, [combinationsData]);

    const colDefs = useMemo(() => {
        if (columns.length) {
            return columns.map((column) => ({
                field: column.name,
                editable: false,
            }));
        }
        return [];
    }, [columns]);

    const getRowId = useCallback((row) => {
        return row.data.id;
    }, []);

    const onCombinationSelectionChanged = (event) => {
        const selectedRows = event.api.getSelectedRows();
        onSelectedCombinationsChange(selectedRows);
    };

    if (matchKeysLoading) {
        return null;
    }

    const renderLayout = () => {
        switch (step) {
            case STEPS.SELECT_MATCH_KEYS:
                return (
                    <Grid container spacing={2}>
                        {allMatchKeysData.map((matchKey) => (
                            <Grid key={matchKey.name} item xs={6} md={6}>
                                <div>{matchKey.name}</div>
                                <MatchKeyField
                                    selected={
                                        selectionRef.current.selectedMatchKeys[
                                            matchKey.name
                                        ] || []
                                    }
                                    matchKey={matchKey}
                                    onSelection={(matchKeyName, newValues) => {
                                        selectionRef.current.selectedMatchKeys[
                                            matchKeyName
                                        ] = newValues;
                                        onMatchKeySelection(
                                            matchKeyName,
                                            newValues
                                        );
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case STEPS.COMBINATION_PREVIEW:
                return (
                    <div className="h-full">
                        <AgGridReact
                            className="ag-theme-balham"
                            getRowId={getRowId}
                            rowData={rowData}
                            rowSelection="multiple"
                            rowHeight={40}
                            // getRowStyle={getRowStyle}
                            // isRowSelectable={isRowSelectable}
                            onFirstDataRendered={(params) => {
                                const presetSelectedRows =
                                    selectedCombinations.map(
                                        (combination) => combination.id
                                    );
                                params.api.forEachNode((node) => {
                                    if (
                                        presetSelectedRows.includes(
                                            node.data.id
                                        )
                                    ) {
                                        node.setSelected(true);
                                    }
                                });
                            }}
                            onSelectionChanged={onCombinationSelectionChanged}
                            columnDefs={colDefs}
                            rowMultiSelectWithClick
                        />
                    </div>
                );
            case STEPS.LOOKUP_VALUE_SELECTION:
                return (
                    <div className="h-full flex flex-col">
                        <div className="flex-grow-0 mt-5 mb-5">
                            <Typography variant="h6">
                                Select output records
                            </Typography>
                        </div>
                        <AgGridReact
                            className="ag-theme-balham"
                            getRowId={getRowId}
                            rowData={rowData}
                            rowSelection="multiple"
                            rowHeight={40}
                            // getRowStyle={getRowStyle}
                            // isRowSelectable={isRowSelectable}
                            columnDefs={colDefs}
                            rowMultiSelectWithClick
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return renderLayout();
};

const EditLayout = ({ step, gridRows, onMatchKeySelection }) => {
    const { data: allMatchKeysData, isLoading: matchKeysLoading } =
        useGetMatchKeysQuery();
    const { data: columns = [] } = useGetReferenceDataColumnsQuery();
    const selectionRef = useRef({ selectedMatchKeys: {} });

    const getRowId = useCallback((row) => {
        return row.data.id;
    }, []);

    const colDefs = useMemo(() => {
        if (columns.length) {
            return columns.map((column) => ({
                field: column.name,
                editable: false,
                valueGetter: (params) => {
                    if (
                        params.data[column.name] &&
                        typeof params.data[column.name] === "object"
                    ) {
                        return params.data[column.name]["newValue"];
                    }
                    return params.data[column.name];
                },
                valueSetter: (params) => {
                    if (
                        params.data[column.name] &&
                        typeof params.data[column.name] === "object"
                    ) {
                        params.data[column.name]["newValue"] = params.newValue;
                    }
                    return true;
                },
            }));
        }
        return [];
    }, [columns]);
    if (matchKeysLoading) {
        return null;
    }

    const renderLayout = () => {
        switch (step) {
            case STEPS.SELECT_MATCH_KEYS:
                return (
                    <Grid container spacing={2}>
                        {allMatchKeysData.map((matchKey) => (
                            <Grid key={matchKey.name} item xs={6} md={6}>
                                <div>{matchKey.name}</div>
                                <MatchKeyField
                                    single
                                    selected={
                                        selectionRef.current.selectedMatchKeys[
                                            matchKey.name
                                        ] || []
                                    }
                                    matchKey={matchKey}
                                    onSelection={(matchKeyName, newValue) => {
                                        selectionRef.current.selectedMatchKeys[
                                            matchKeyName
                                        ] = newValue;
                                        onMatchKeySelection(
                                            matchKeyName,
                                            newValue
                                        );
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case STEPS.COMBINATION_PREVIEW:
                return (
                    <div className="h-full">
                        <AgGridReact
                            className="ag-theme-balham"
                            getRowId={getRowId}
                            rowData={gridRows}
                            rowHeight={40}
                            // getRowStyle={getRowStyle}
                            // isRowSelectable={isRowSelectable}
                            columnDefs={colDefs}
                        />
                    </div>
                );
            case STEPS.LOOKUP_VALUE_SELECTION:
                return (
                    <div className="h-full flex flex-col">
                        <div className="flex-grow-0 mt-5 mb-5">
                            <TextField label="Number of output" />
                        </div>
                        <AgGridReact
                            className="ag-theme-balham"
                            getRowId={getRowId}
                            rowData={gridRows}
                            rowHeight={40}
                            // getRowStyle={getRowStyle}
                            // isRowSelectable={isRowSelectable}
                            columnDefs={colDefs}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return renderLayout();
};

const EditorContentWrapper = memo(({ mode, onClose, editGridRows }) => {
    const [generateCombinations, { data: combinationsData }] =
        useLazyGetMatchKeyCombinationsQuery();

    const [isValid, setIsValid] = useState(false);
    const [step, setStep] = useState(STEPS.SELECT_MATCH_KEYS);
    const selectedMatchKeysRef = useRef({});
    const selectedCombinationsRef = useRef([]);

    const onMatchKeySelection = useCallback(
        (matchKey, selectedValues) => {
            selectedMatchKeysRef.current[matchKey] = selectedValues;

            if (!selectedMatchKeysRef.current[matchKey].length) {
                delete selectedMatchKeysRef.current[matchKey];
            }

            const allSelections = Object.values(selectedMatchKeysRef.current);

            const result = allSelections.length
                ? allSelections
                      .map((selection) => selection.length)
                      .reduce((prev, next) => {
                          return prev * next;
                      }, 1)
                : 0;

            if (isValid && (result > 30 || result === 0)) {
                setIsValid(false);
            } else if (!isValid && result <= 30) {
                setIsValid(true);
            }
        },
        [isValid]
    );

    const onSelectedCombinationsChange = (newCombinations) =>
        (selectedCombinationsRef.current = newCombinations);

    const renderCreateWorkflow = () => {
        return (
            <CreateLayout
                onMatchKeySelection={onMatchKeySelection}
                step={step}
                combinationsData={combinationsData}
                selectedCombinations={selectedCombinationsRef.current}
                onSelectedCombinationsChange={onSelectedCombinationsChange}
            />
        );
    };

    const renderEditWorkflow = () => {
        return (
            <EditLayout
                step={step}
                gridRows={editGridRows}
                onMatchKeySelection={onMatchKeySelection}
            />
        );
    };

    const renderContent = () => {
        return (
            <Box className="h-full">
                {mode === REFERENCE_DATA_EDITOR_MODE.create
                    ? renderCreateWorkflow()
                    : renderEditWorkflow()}
            </Box>
        );
    };

    const renderFooter = () => {
        switch (step) {
            case STEPS.SELECT_MATCH_KEYS:
                return (
                    <Button
                        variant="contained"
                        onClick={async () => {
                            await generateCombinations();
                            setStep(STEPS.COMBINATION_PREVIEW);
                        }}
                        disabled={!isValid}
                    >
                        Generate Combinations
                    </Button>
                );
            case STEPS.COMBINATION_PREVIEW:
                return (
                    <>
                        <Button
                            onClick={() => setStep(STEPS.SELECT_MATCH_KEYS)}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() =>
                                setStep(STEPS.LOOKUP_VALUE_SELECTION)
                            }
                            disabled={!isValid}
                        >
                            Next
                        </Button>
                    </>
                );
            case STEPS.LOOKUP_VALUE_SELECTION:
                return (
                    <>
                        <Button
                            onClick={() => setStep(STEPS.COMBINATION_PREVIEW)}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            disabled={!isValid}
                            onClick={onClose}
                        >
                            Add
                        </Button>
                    </>
                );
            default:
                <></>;
        }
    };
    return (
        <Box className={styles.container}>
            <div className="flex-grow overflow-auto">{renderContent()}</div>
            <div>{renderFooter()}</div>
        </Box>
    );
});

const ReferenceDataEditor = ({
    mode = REFERENCE_DATA_EDITOR_MODE.create,
    onClose,
    editGridRows,
}) => {
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

    return (
        <DialogBox
            renderContent={
                <EditorContentWrapper
                    mode={mode}
                    onClose={onClose}
                    editGridRows={editGridRows}
                />
            }
            renderTitle={renderTitle()}
            onClose={onClose}
        />
    );
};

export default ReferenceDataEditor;
