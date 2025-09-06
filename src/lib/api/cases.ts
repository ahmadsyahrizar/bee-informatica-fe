import { CaseRowType } from "@/types/case";

// Simulated fetcher. Swap with your real API call.
export async function fetchCases(): Promise<CaseRowType[]> {
 // await new Promise((r) => setTimeout(r, 700)); // simulate latency
 return [
  {
   id: "1",
   clientName: "Muhammad Syaari Zainudin",
   caseId: "CS-1234",
   company: "Emon Kitchen",
   stage: "Phone",
  },
  {
   id: "2",
   clientName: "Lim Wei Jun",
   caseId: "CS-1234",
   company: "Wei Jun Technologies",
   stage: "Phone",
   schedule: "2025/09/03 10:00",
  },
  {
   id: "3",
   clientName: "Farah Zainal",
   caseId: "CS-1234",
   company: "Zainal Foods Co.",
   stage: "Meet",
  },
  {
   id: "4",
   clientName: "Ravi Kumar",
   caseId: "CS-1234",
   company: "Kumar Automobiles",
   stage: "1st Review",
  },
  {
   id: "5",
   clientName: "Siti Nurhaliza",
   caseId: "CS-1234",
   company: "Nurhaliza Fashion House",
   stage: "Final Review",
   score: 75,
  },
  {
   id: "6",
   clientName: "Siti Nurhaliza",
   caseId: "CS-1234",
   company: "Nurhaliza Fashion House",
   stage: "Final Review",
   score: 50,
   attentionRequired: true,
  },
  {
   id: "7",
   clientName: "Mohd Amirul",
   caseId: "CS-1234",
   company: "Amirul Construction",
   stage: "Approved",
   score: 90,
   avatars: [
    { src: "/avatars/amirul.png", name: "A" },
    { name: "N" },
   ],
  },
  {
   id: "8",
   clientName: "Leong Mei Ling",
   caseId: "CS-1234",
   company: "Mei Ling Publishing",
   stage: "Approved",
   score: 96,
   avatars: [
    { src: "/avatars/ling.png", name: "L" },
    { name: "N" },
   ],
  },
  {
   id: "9",
   clientName: "Tan Cheng Ho",
   caseId: "CS-1234",
   company: "Cheng Ho Logistics",
   stage: "Rejected",
   score: 45,
  },
 ];
}