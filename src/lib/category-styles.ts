import { EventCategory } from "@/types/calendar";

export const categoryStyles: Record<
  EventCategory,
  { bg: string; text: string; dot: string; solid: string; solidText: string }
> = {
  Workshop: {
    bg: "bg-indigoink-light",
    text: "text-indigoink",
    dot: "bg-indigoink",
    solid: "bg-indigoink",
    solidText: "text-white",
  },
  Festival: {
    bg: "bg-marigold-light",
    text: "text-marigold",
    dot: "bg-marigold",
    solid: "bg-marigold",
    solidText: "text-white",
  },
  Holiday: {
    bg: "bg-coral-light",
    text: "text-coral",
    dot: "bg-coral",
    solid: "bg-coral",
    solidText: "text-white",
  },
  CSR: {
    bg: "bg-moss-light",
    text: "text-moss",
    dot: "bg-moss",
    solid: "bg-moss",
    solidText: "text-white",
  },
  Training: {
    bg: "bg-slateblue-light",
    text: "text-slateblue",
    dot: "bg-slateblue",
    solid: "bg-slateblue",
    solidText: "text-white",
  },
  Sports: {
    bg: "bg-teal-light",
    text: "text-teal",
    dot: "bg-teal",
    solid: "bg-teal",
    solidText: "text-white",
  },
  Birthday: {
    bg: "bg-pinkrose-light",
    text: "text-pinkrose",
    dot: "bg-pinkrose",
    solid: "bg-pinkrose",
    solidText: "text-white",
  },
  "Town Hall": {
    bg: "bg-charcoalblue-light",
    text: "text-charcoalblue",
    dot: "bg-charcoalblue",
    solid: "bg-charcoalblue",
    solidText: "text-white",
  },
  Volunteer: {
    bg: "bg-moss-light",
    text: "text-moss",
    dot: "bg-moss",
    solid: "bg-moss",
    solidText: "text-white",
  },
  Celebration: {
    bg: "bg-pinkrose-light",
    text: "text-pinkrose",
    dot: "bg-pinkrose",
    solid: "bg-pinkrose",
    solidText: "text-white",
  },
};
