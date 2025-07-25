import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, KeyRound } from "lucide-react";

interface Props {
  value?: string;
  onChange?: any;
}

export default function ClearanceMenu(props: Props) {
  return (
    <Select defaultValue={props.value} onValueChange={props.onChange}>
      <SelectTrigger
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          width: "100%",
        }}
        className=""
      >
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <KeyRound color="dodgerblue" width={"1.25rem"} />
          <p
            style={{
              fontSize: "0.5rem",
              position: "absolute",
              marginLeft: "2rem ",
              opacity: "0.5",
              textTransform: "uppercase",
              fontWeight: "600",
            }}
          >
            Clearance
          </p>
        </div>

        <SelectValue placeholder="Clearance" />
      
      </SelectTrigger>
      <SelectContent>
        <SelectGroup
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexFlow: "column",
          }}
        >
          <SelectItem
            style={{ display: "flex", justifyContent: "flex-start" }}
            value="All"
          >
            All
          </SelectItem>

          <SelectItem
            style={{ display: "flex", justifyContent: "flex-start" }}
            value="none"
          >
            None
          </SelectItem>

          <SelectItem
            style={{ display: "flex", justifyContent: "flex-start" }}
            value="Sohar Star United"
          >
            Sohar Star United
          </SelectItem>
          <SelectItem
            style={{ display: "flex", justifyContent: "flex-start" }}
            value="Vale"
          >
            Vale
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
