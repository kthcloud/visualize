import { Icon } from "@iconify/react";
import { memo } from "react";

function Iconify_({ icon, ...other }: any) {
  return <Icon icon={icon} {...other} />;
}

export const Iconify = memo(Iconify_);
export default Iconify;