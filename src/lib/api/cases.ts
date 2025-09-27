// lib/api/cases.ts
import { DocumentItem } from "@/components/case-detail/media/otherDocuments";
import { PhotoItem } from "@/components/case-detail/media/photoSection";
import { CaseRowType } from "@/types/case";

// Simulated fetcher. Swap with your real API call.
export async function fetchCases(): Promise<CaseRowType[]> {
 return [
  {
   id: "1",
   clientName: "Muhammad Syaari Zainudin",
   caseId: "CS-1234",
   company: "Emon Kitchen",
   stage: "Phone",
   appliedLoanAmount: 1_000_000,
  },
  {
   id: "2",
   clientName: "Lim Wei Jun",
   caseId: "CS-1234",
   company: "Wei Jun Technologies",
   stage: "Phone",
   schedule: "2025/09/03 10:00",
   appliedLoanAmount: 1_000_000,
  },
  {
   id: "3",
   clientName: "Farah Zainal",
   caseId: "CS-1234",
   company: "Zainal Foods Co.",
   stage: "Meet",
   appliedLoanAmount: 1_000_000,
  },
  {
   id: "4",
   clientName: "Ravi Kumar",
   caseId: "CS-1234",
   company: "Kumar Automobiles",
   stage: "1st Review",
   appliedLoanAmount: 1_000_000,
  },
  {
   id: "5",
   clientName: "Siti Nurhaliza",
   caseId: "CS-1234",
   company: "Nurhaliza Fashion House",
   stage: "Final Review",
   score: 75,
   appliedLoanAmount: 1_000_000,
  },
  {
   id: "6",
   clientName: "Siti Nurhaliza",
   caseId: "CS-1234",
   company: "Nurhaliza Fashion House",
   stage: "Final Review",
   score: 50,
   attentionRequired: true,
   appliedLoanAmount: 1_000_000,
  },
  {
   id: "7",
   clientName: "Mohd Amirul",
   caseId: "CS-1234",
   company: "Amirul Construction",
   stage: "Approved",
   score: 90,
   appliedLoanAmount: 1_000_000,
   approvedLoanAmount: 1_000_000,
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
   appliedLoanAmount: 1_000_000,
   approvedLoanAmount: 0,
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
   appliedLoanAmount: 1_000_000,
   approvedLoanAmount: 0,
  },
 ];
}


export const fbPosts = [
 {
  id: 1,
  platform: "facebook",
  username: "@emon_kitchen",
  date: "August 24, 2025",
  text: "Feeling the heat and loving every bite 🔥🍜 Spicy noodles to warm your soul. Can you handle it?",
  imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1600&auto=format&fit=crop",
  likes: 24,
  comments: 2,
  postUrl: "https://facebook.com/",
 },
 {
  id: 2,
  platform: "facebook",
  username: "@emon_kitchen",
  date: "August 24, 2025",
  text: "Chicken that packs a punch! 🍗 Bring on the heat and flavor. Who’s ready for this spicy kick?",
  imageUrl: "https://images.unsplash.com/photo-1604908177071-731dc987a1f6?q=80&w=1600&auto=format&fit=crop",
  likes: 24,
  comments: 2,
  postUrl: "https://facebook.com/",
 },
];

export const igPosts = [
 {
  id: 3,
  platform: "instagram",
  username: "@emon_kitchen",
  date: "August 24, 2025",
  text: "Feeling the heat and loving every bite 🔥🍜 Spicy noodles to warm your soul. Can you handle it?",
  imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1600&auto=format&fit=crop",
  likes: 24,
  comments: 2,
  postUrl: "https://instagram.com/",
 },
 {
  id: 4,
  platform: "instagram",
  username: "@emon_kitchen",
  date: "August 24, 2025",
  text: "Chicken that packs a punch! 🍗 Bring on the heat and flavor. Who’s ready for this spicy kick?",
  imageUrl: "https://images.unsplash.com/photo-1604908177071-731dc987a1f6?q=80&w=1600&auto=format&fit=crop",
  likes: 24,
  comments: 2,
  postUrl: "https://instagram.com/",
 },
];

export const photos: PhotoItem[] = [
 { id: 1, url: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=1600&auto=format&fit=crop" },
 { id: 2, url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop" },
 { id: 3, url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop" },
 { id: 4, url: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=1600&auto=format&fit=crop" },
 { id: 5, url: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=1600&auto=format&fit=crop" },
];

export const dummySales = [
 { label: "Sales monthly", value: "RM130 – 150K" },
 { label: "Profit", value: "RM5K" },
 { label: "Expenses monthly", value: "RM30K" },
 { label: "Rent monthly", value: "RM7,9K" },
 { label: "Salary staff monthly", value: "10K" },
 { label: "Salary model", value: "Daily pay" },
 { label: "Salary per day", value: "RM60 – 70/ Day" },
]

export const dummyEvaluationDetail = [
 {
  id: 1,
  title: "Financial Health",
  criteria: [
   {
    label: "Profitability (Net income over past 6 months)",
    value: "-",
   },
   {
    label: "Cash flow stability",
    hint: "Consistency of inflows/outflows",
    value: "-",
   },
   { label: "Working Capital", value: "-", hint: "Testing" },
   { label: "Credit History", value: "-" },
   { label: "Others", value: "-" },
  ],
 },
 {
  id: 2,
  title: "Business & Sales",
  criteria: [
   { label: "Revenue Streams", value: "-" },
   { label: "Customer Base", value: "-" },
   {
    label: "Market Trends and Growth potential in industry.",
    value: "-",
   },
   {
    label: "Competitor’s positioning & market share",
    value: "-",
   },
   { label: "Others", value: "-" },
  ],
 },
]

export const documents: DocumentItem[] = [
 {
  id: "biz-license",
  label: "Business License",
  url: "https://images.unsplash.com/photo-1606326608606-aa0b62935f13?q=80&w=1600&auto=format&fit=crop",
  thumbUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f13?q=80&w=1200&auto=format&fit=crop",
 },
 {
  id: "utility-bill",
  label: "Utility Bills",
  url: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=1600&auto=format&fit=crop",
  thumbUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=1200&auto=format&fit=crop",
 },
];

export const sampleRows = [
 {
  no: 1,
  date: "03/02/2016",
  facility: "Purchase of passenger cars",
  balance: 673.0,
  limit: 46000.0,
  months: { Jul: 0, Jun: 0, May: 0, Apr: 0, Mar: 0, Feb: 0, Jan: 0, Dec: 0 },
 },
 {
  no: 2,
  date: "03/02/2016",
  facility: "Purchase of passenger cars",
  balance: 673.0,
  limit: 46000.0,
  months: { Jul: 0, Jun: 0, May: 0, Apr: 0, Mar: 0, Feb: 0, Jan: 0, Dec: 0 },
 },
 {
  no: 3,
  date: "03/02/2016",
  facility: "Purchase of passenger cars",
  balance: 673.0,
  limit: 46000.0,
  months: { Jul: 0, Jun: 0, May: 0, Apr: 0, Mar: 0, Feb: 0, Jan: 0, Dec: 0 },
 },
];
