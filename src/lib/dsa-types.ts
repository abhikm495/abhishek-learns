export type Approach = "brute" | "better" | "optimal";

export interface SolutionData {
  id: string;
  approach: Approach;
  title: string;
  explanation: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  order: number;
}

export const approachLabels: Record<Approach, string> = {
  brute: "Brute Force",
  better: "Better Approach",
  optimal: "Optimal Solution",
};

export const approachOrder: Record<Approach, number> = {
  brute: 0,
  better: 1,
  optimal: 2,
};
