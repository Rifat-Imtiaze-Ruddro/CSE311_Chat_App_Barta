import {
  createBrowserRouter
} from "react-router";
import NotFound from "../shared/NotFound";
import Auth from "../auth/Auth";
import Login from "../auth/Login";
import Register from "../auth/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../Dashboard/Home";
import MyProfile from "../Dashboard/MyProfile";
import Chats from "../Dashboard/Chats";

const router = createBrowserRouter([
  {
    path: "/",
   Component:DashboardLayout,
   children:[
     {index:true,
        Component:Home
      },
      {path:'myProfile',
        Component:MyProfile
      },
      {path:'chats',
        Component:Chats
      },
   ]
  },
   {
    path: "/auth",
    Component: Auth,
    children:[
      {
path:'/auth/login',
Component:Login
},
      {
path:'/auth/register',
Component: Register

}
    ]
  },
  {
    path: "/*",
    Component:NotFound
  }
]);

export default router