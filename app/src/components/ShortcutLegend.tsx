"use client";
import { useSelector } from "react-redux";
import { selectControlDown } from "@/store/commandSlice";
import KeyIcon from "@/components/KeyIcon";
interface ShortcutLegendProps {
  className?: string;
  width?: number;
}

const ShortcutLegend: React.FC<ShortcutLegendProps> = ({
  className,
  width,
}) => {
  const controlOrCommandDown = useSelector(selectControlDown);
  return (
    <>
      {controlOrCommandDown && (
        <div
          className={`bg-gray-800 items-center border-b-2 border-gray-900 ${className}`}
          style={{
            position: "absolute",
            right: 0,
            marginRight: 0,
            width: width,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <h2 className="command-legend__title pt-4">Shortcut Legend</h2>
          <ul className="command-legend grid grid-cols-1 gap-4 p-4">
            <li className="command-legend__item">
              <div className="command-legend__key">
                <KeyIcon keyText="Ctrl" /> - Show Command Bar Legend
              </div>
            </li>
            <li className="command-legend__item">
              <div className="command-legend__key">
                <KeyIcon keyText="Ctrl" /> + <KeyIcon keyText="K" /> - Focus
                Command Bar
              </div>
            </li>
            <li className="command-legend__item">
              <div className="command-legend__key">
                <KeyIcon keyText="Ctrl" /> + <KeyIcon keyText="P" /> -
                Play/Pause
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
export default ShortcutLegend;
