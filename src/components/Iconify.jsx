import { Icon } from "@iconify/react";

// ----------------------------------------------------------------------
export default function Iconify({ icon, ...other }) {
  return <Icon icon={icon} {...other} />;
}
