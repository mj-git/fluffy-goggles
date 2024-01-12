import React, { useState, useRef } from "react";

// Components
import { Button } from "@mui/material";

// Constant and Utils
import { REFERENCE_DATA_EDITOR_MODE } from "../../utils/constants";

// Assets
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ReferenceDataGrid from "../reference-data/ReferenceDataGrid";
import CreateMatchKeysModal from "../reference-data/CreateMatchKeysModal";
import ReferenceDataEditor from "../reference-data/ReferenceDataEditor";

const AccountingConfigurations = () => {
    // Refs
    const editorModeRef = useRef(REFERENCE_DATA_EDITOR_MODE.create);
    const gridRef = useRef();

    // State
    const [showCreateMatchKeysModal, setShowCreateMatchKeysModal] =
        useState(false);
    const [showReferenceDataEditor, setShowReferenceDataEditor] =
        useState(false);
    const [editEnabled, setEditEnabled] = useState(false);

    return (
        <React.Fragment>
            <div className="mt-5 mb-5 flex">
                <Button
                    variant="contained"
                    onClick={() => {
                        // console.log(gridRef.current.api.getSelectedRows());
                        setShowCreateMatchKeysModal(true);
                    }}
                >
                    Create Match Keys
                </Button>
                <div className="ml-auto">
                    <Button
                        variant="contained"
                        style={{ marginInline: "10px" }}
                        startIcon={<AddIcon />}
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
                        startIcon={<EditIcon />}
                        disabled={!editEnabled}
                        onClick={() => {
                            // console.log(gridRef.current.api.getSelectedRows());
                            editorModeRef.current =
                                REFERENCE_DATA_EDITOR_MODE.edit;
                            setShowReferenceDataEditor(true);
                        }}
                    >
                        Edit
                    </Button>
                </div>
            </div>
            <div className="grid-container">
                <ReferenceDataGrid
                    gridRef={gridRef}
                    onRowSelected={() => {
                        const hasSelectedRows =
                            gridRef.current.api.getSelectedRows().length > 0;
                        if (!editEnabled && hasSelectedRows) {
                            setEditEnabled(true);
                        } else if (editEnabled && !hasSelectedRows) {
                            setEditEnabled(false);
                        }
                    }}
                />
            </div>
            {showCreateMatchKeysModal && (
                <CreateMatchKeysModal
                    onClose={() => setShowCreateMatchKeysModal(false)}
                />
            )}
            {showReferenceDataEditor && (
                <ReferenceDataEditor
                    mode={editorModeRef.current}
                    onClose={() => setShowReferenceDataEditor(false)}
                    editGridRows={gridRef.current.api.getSelectedRows()}
                />
            )}
        </React.Fragment>
    );
};

export default AccountingConfigurations;
