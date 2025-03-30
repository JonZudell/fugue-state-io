"use client";

import * as React from "react";
import { ChevronsUpDown, Folder, GalleryVerticalEnd, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { selectDisplay, setDisplayMode } from "@/store/display-slice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const menus = {
  timeline: {
    id: "timeline",
    name: "Timeline Settings",
    logo: GalleryVerticalEnd,
  },
  display: {
    id: "display",
    name: "Display Settings",
    logo: GalleryVerticalEnd,
  },
};
export function MenuSwitcher() {
  const dispatch = useDispatch();
  const { isMobile } = useSidebar();
  const { displayMode } = useSelector(selectDisplay);
  const [activeMenu, setActiveMenu] = useState(menus[displayMode]);
  useEffect(() => {
    setActiveMenu(menus[displayMode]);
  }, [displayMode]);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeMenu.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeMenu.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Switch Menu
            </DropdownMenuLabel>
            {Object.values(menus).map((menu, index) => (
              <DropdownMenuItem
                key={menu.name}
                onClick={() => dispatch(setDisplayMode(menu.id))}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <menu.logo className="size-4 shrink-0" />
                </div>
                {menu.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
