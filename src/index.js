import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-balham.css"; // Theme
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import ReferenceDataContainer from "./features/reference-data";
import NotFound from "./404";
import Requests from "./features/requests";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<ReferenceDataContainer />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </Provider>
    </ThemeProvider>
);
