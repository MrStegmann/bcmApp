import { useContext } from "react";
import DBContext from "../context/DBProvider";

export default () => {
  const context = useContext(DBContext);
  if (context === null) {
    throw new Error("useDb must be used within a DBProvider");
  }
  return context;
};
