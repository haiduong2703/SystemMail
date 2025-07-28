/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "./views/react-login/Register.jsx";
import Login from "./views/react-login/Login.jsx";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import ValidMails from "views/mail/ValidMails.js";
import ExpiredMails from "views/mail/ExpiredMails.js";
import ReviewMails from "views/mail/ReviewMails.js";
import AllMails from "views/mail/AllMails.js";
import Assignment from "views/Assignment.js";
import Server from "views/Server.js";
import DateFilterDemo from "views/DateFilterDemo.js";
import GroupManagement from "views/GroupManagement.js";
import PaginationDemo from "views/PaginationDemo.js";
import AdminTest from "views/AdminTest.jsx";
import DecryptionTest from "views/DecryptionTest.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/valid-mails",
    name: "Valid Mails",
    icon: "ni ni-check-bold text-success",
    component: <ValidMails />,
    layout: "/admin",
  },
  {
    path: "/expired-mails",
    name: "Expired Mails",
    icon: "ni ni-fat-remove text-danger",
    component: <ExpiredMails />,
    layout: "/admin",
  },
  {
    path: "/review-mails",
    name: "Review Mails",
    icon: "ni ni-archive-2 text-primary",
    component: <ReviewMails />,
    layout: "/admin",
  },
  {
    path: "/all-mails",
    name: "All Mails",
    icon: "ni ni-email-83 text-info",
    component: <AllMails />,
    layout: "/admin",
  },
  {
    path: "/assignment",
    name: "Assignment",
    icon: "ni ni-badge text-warning",
    component: <Assignment />,
    layout: "/admin",
  },
  {
    path: "/server",
    name: "Server",
    icon: "ni ni-settings-gear-65 text-danger",
    component: <Server />,
    layout: "/admin",
  },
  {
    path: "/decryption-test",
    name: "Decryption Test",
    icon: "ni ni-lock-circle-open text-info",
    component: <DecryptionTest />,
    layout: "/admin",
  },

  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
    invisible: true,
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
    invisible: true,
  },
];
export default routes;
