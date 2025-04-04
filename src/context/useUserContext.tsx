"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import Cookies from "js-cookie";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useGetProfileData } from "@/hooks/useAuth";

interface UserContextType {
  user: any | null;
  setUser: Dispatch<SetStateAction<any | null>>;
  login: (value: any) => void;
  logout: () => void;
  loadingGlobal: boolean;
  setLoadingGlobal: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const router = useRouter();
  const { profile } = useGetProfileData();
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [user, setUser] = useState<any | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") || "")
        : null;
    }
    return null;
  });

  useEffect(() => {
    if (profile?.data) {
      setUser(profile.data);
      localStorage.setItem("user", JSON.stringify(profile.data));
    }
  }, [profile]);

  const login = (value: any) => {
    setUser(value?.user);
    Cookies.set("accessToken", value?.accessToken, { expires: 7 });
    localStorage.setItem("user", JSON.stringify(value?.user));
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    Cookies.remove("accessToken");
    router.push("/dang-nhap");
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, setUser, logout, login, loadingGlobal, setLoadingGlobal }}
    >
      {loadingGlobal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 z-[999]">
          <Spin
            indicator={
              <LoadingOutlined style={{ fontSize: 48, color: "#fff" }} spin />
            }
          />
        </div>
      )}
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
