"use client";
import "./CommandDropdown.css";
interface CommandDropdownProps {
  className?: string;
  width?: number;
  offset?: number;
}

const CommandDropdown: React.FC<CommandDropdownProps> = ({
  className,
  width,
  offset,
}) => {
  return (
    <div
      className={`command-bar bg-gray-100 items-center border-b-2 border-gray-900 ${className}`}
      style={{
        position: "absolute",
        marginBottom: 0,
        width: width,
        left: offset,
        transform: `translateX(-${width ? width / 2 : 0}px)`,
      }}
    >
      <ul>
        <li>No options</li>
      </ul>
    </div>
  );
};
export default CommandDropdown;
