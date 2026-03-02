import { Tooltip } from "react-native-elements";

const CustomTooltip = ({ children, popover }) => {
  return (
    <Tooltip width={"auto"} height={"auto"} popover={popover}>
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
