"use client";
import { Provider } from "react-redux";
import store from "../store";
import Workspace from "../components/Workspace";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
export default function Home() {
  return (
    <Provider store={store}>
      <SidebarProvider>
        <AppSidebar />
        <Workspace />
      </SidebarProvider>
    </Provider>
  );
}
