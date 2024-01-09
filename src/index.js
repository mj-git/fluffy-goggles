import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReferenceLayout from "./features/reference-data/ReferenceDataGrid";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-balham.css"; // Theme
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import ReferenceDataContainer from "./features/reference-data";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<ReferenceLayout />} />
                    <Route path="/home" element={<ReferenceDataContainer />} />
                </Routes>
            </Router>
        </Provider>
    </ThemeProvider>
);
