import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-balham.css"; // Theme
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import ReferenceDataContainer from "./features/reference-data/Container";
import NotFound from "./404";
import Requests from "./features/requests";
import AccountingConfigurations from "./features/accounting-configurations/AccountingConfigurations";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<ReferenceDataContainer />}>
                        <Route path="/requests" element={<Requests />} />
                        <Route
                            index
                            element={
                                <Navigate to="/accounting-configurations" />
                            }
                        />
                        <Route
                            path="/accounting-configurations"
                            element={<AccountingConfigurations />}
                        />
                        <Route
                            path="/dashboards"
                            element={
                                <div className="flex flex-col bg-gray-50 items-center justify-center h-screen text-4xl font-bold mb-4 text-orange-600">
                                    {" "}
                                    Dashboards{" "}
                                </div>
                            }
                        />
                        <Route
                            path="/developer-tools"
                            element={
                                <div className="flex flex-col bg-gray-50 items-center justify-center h-screen text-4xl font-bold mb-4 text-orange-600">
                                    Developer Tools
                                </div>
                            }
                        />
                        <Route
                            path="/audit"
                            element={
                                <div className="flex flex-col bg-gray-50 items-center justify-center h-screen text-4xl font-bold mb-4 text-orange-600">
                                    Audit
                                </div>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Router>
        </Provider>
    </ThemeProvider>
);
