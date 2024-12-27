interface KeyIconProps {
  className?: string;
  keyText?: string;
}

const KeyIcon: React.FC<KeyIconProps> = ({ keyText, className }) => {
  return (
    <div
      className={`rounded-md border border-white items-center justify-center inline-block ${className}`}
    >
      <div className="text-white text-xs m-1 mx-2">{keyText}</div>
    </div>
  );
};
export default KeyIcon;
