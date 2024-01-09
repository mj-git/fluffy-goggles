import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useMemo, useRef } from "react";
import {
    useGetReferenceDataColumnsQuery,
    useGetReferenceDataQuery,
    useUpdateReferenceDataMutation,
} from "./referenceDataSlice";
import { Button } from "@mui/material";

const ReferenceDataGrid = ({ gridRef }) => {
    const { data: columns = [], isLoading: isLoadingColumnsData } =
        useGetReferenceDataColumnsQuery();
    const { data: rows = [], isLoading: isLoadingRowsData } =
        useGetReferenceDataQuery();
    const [updateReferenceData] = useUpdateReferenceDataMutation();
    const colDefs = useMemo(() => {
        if (columns.length) {
            return columns.map((column, index) => ({
                field: column.name,
                editable: column.canModify,
                ...(index === 0 && {
                    checkboxSelection: index === 0,
                    showDisabledCheckboxes: true,
                }),
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

    const rowData = useMemo(() => {
        return rows.map((row) => structuredClone(row));
    }, [rows]);

    const getRowId = useCallback((row) => {
        return row.data.id;
    }, []);

    const onRowValueChanged = useCallback(
        async (params) => {
            await updateReferenceData(params.data);
            const transaction = {
                update: [params.data],
            };
            params.api.applyTransaction(transaction);
        },
        [updateReferenceData]
    );

    // const getRowStyle = (params) => {
    //     if (params.node.rowIndex % 2 === 0) {
    //         return { background: "yellow" };
    //     }
    // };

    const isRowSelectable = () => false;

    if (isLoadingColumnsData || isLoadingRowsData) {
        return null;
    }

    return (
        <div style={{ height: "100%" }}>
            <AgGridReact
                className="ag-theme-balham"
                ref={gridRef}
                getRowId={getRowId}
                rowData={rowData}
                rowSelection="multiple"
                rowHeight={40}
                // getRowStyle={getRowStyle}
                // isRowSelectable={isRowSelectable}
                columnDefs={colDefs}
                editType={"fullRow"}
                onRowValueChanged={onRowValueChanged}
                suppressRowClickSelection={true}
            />
        </div>
    );
};

export default ReferenceDataGrid;
