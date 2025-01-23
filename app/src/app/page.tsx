"use client";
import { Provider } from "react-redux";
import store from "../store";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppRoot from "@/components/app-root";
import { useState } from "react";
import { LoaderPinwheel } from "lucide-react";
export default function Home() {
  const [ready, setReady] = useState(false);
  return (
    <Provider store={store}>
      <SidebarProvider>
        <AppRoot setReady={setReady} hidden={!ready} />
        {!ready && (
          <div className="w-full h-screen flex items-center justify-center bg-black">
            <LoaderPinwheel className="animate-spin text-white" size={64} />
          </div>
        )}
      </SidebarProvider>
    </Provider>
  );
}
