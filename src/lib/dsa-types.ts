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
