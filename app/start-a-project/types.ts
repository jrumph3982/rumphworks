import type { Dispatch, SetStateAction } from "react";
import type { IntakeData } from "@/lib/intake";

export type StepProps = {
  data: IntakeData;
  setData: Dispatch<SetStateAction<IntakeData>>;
};
