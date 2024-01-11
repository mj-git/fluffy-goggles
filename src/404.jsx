import React from "react";

const NotFound = () => {
    return (
        <div class="flex flex-col bg-gray-50 items-center justify-center h-screen">
            <h1 class="text-4xl font-bold mb-4 text-orange-600">
                404 - Not Found
            </h1>
            <p class="text-gray-600">
                Sorry, the page you're looking for doesn't exist.
            </p>
        </div>
    );
};

export default NotFound;
