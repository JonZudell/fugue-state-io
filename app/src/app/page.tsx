"use client";
import { Provider } from "react-redux";
import store from "../store";
import Workspace from "../components/Workspace";
export default function Home() {
  return (
    <Provider store={store}>
      <Workspace />
    </Provider>
  );
}
