import React from "react";

import Route from "react-router-dom/Route";
import Home from "../home/Home";
import Login from "../login/Login";
import Signup from "../signUp/Signup";
const Routes = () => {
    return (
        <div>
            <Route excat path="/" component={Home} />
            <Route excat path="/login" component={Login} />
            <Route excat path="/signup" component={Signup} />
        </div>
    );
};
export default Routes;
