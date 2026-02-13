import type { Job } from "../types";

export function renderName(event?: Job): string | undefined {
    if (event?.args?.name) return event.args.name;
    if (event?.args?.params && event.args.params.name)
      return event?.args?.params.name;
  }

export function renderIcon(event: Job): string | undefined {
    if (event.status === "finished" || event.status === "completed")
      return "octicon:check-16";
    if (event.status === "failed") return "octicon:x-16";
    if (event.type.toLowerCase().includes("creat")) return "tabler:crane";
    if (event.type.toLowerCase().includes("delet")) return "mdi:nuke";
    if (event.type.toLowerCase().includes("gpu")) return "bi:gpu-card";
    if (event.type.toLowerCase().includes("update"))
      return "mingcute:tool-fill";
}

export function abbrFix(str: string): string {
    return str
      .replace("gpu", "GPU")
      .replace("vm", "VM")
      .replace("deployment", "Deployment");
}

export function getTextSize(text: string): string {
    if (text.length > 30) return "text-3xl";
    if (text.length > 20) return "text-4xl";
    if (text.length > 15) return "text-5xl";
    if (text.length > 10) return "text-6xl";
    if (text.length > 5) return "text-7xl";
    return "text-8xl";
}
