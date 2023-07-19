import React, { useState, useEffect } from "react";
import SideBar from "./molecules/side-bar";
import Navbar from "./molecules/nav-bar";
import Header from "./atom/head";
import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";

let sidebarAction: boolean = false;

type Props = {
  children: JSX.Element;
};

interface UserInterface {
  type: string;
  userId: string;
  phoneNumber: string;
  names: string;
  email: string;
  access_token: string;
}

function Layout(props: Props) {
  const router = useRouter();
  const User = React.useContext(UserContext);
  const [open, setOpen] = useState(sidebarAction);
  const [loading, setLoading] = useState(true); // Add loading state

  const handleSidebarState = (): void => {
    setOpen(!open);
  };

  const [userState, setUserState] = useState<UserInterface | any>(
    User?.user
  );
  const [userAuth, setUserAuth] = useState<boolean | undefined>(
    User?.authenticated
  );
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setUserAuth(Boolean(localStorage.getItem("userAuth")));
    setUserState(JSON.parse(localStorage.getItem("userState") || "null"));
    setMounted(true);
    setLoading(false); // Set loading to false after mounting
  }, [User?.authenticated, User?.user]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    // Show a loading state while redirecting
    return <div>Loading...</div>;
  }

  if (router.pathname !== "/auth/signIn" && router.pathname !== "/auth/signUp") {
    if (userAuth === false || userState.access_token < 8) {
      router?.replace("/auth/signIn");
      return null; // Return null to prevent rendering the content while redirecting
    }
  }

  return (
    <div>
      <Header />
      <div className="  bg-[#f0f4fd] dark:bg-[#0f172a] flex flex-col h-screen">
        <div className="flex z-50  w-full">
          {userAuth && router.pathname !== "/auth/signIn" && router.pathname !== "/auth/signUp" && <Navbar handleSidebar={handleSidebarState} />}
        </div>
        <div className="flex overflow-hidden flex-grow ">
          {userAuth && router.pathname !== "/auth/signIn" && router.pathname !== "/auth/signUp" && (
            <SideBar
              sidebarOpen={open}
              handleSidebar={handleSidebarState}
            />
          )}
          <div className="flex flex-grow w-full ">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
