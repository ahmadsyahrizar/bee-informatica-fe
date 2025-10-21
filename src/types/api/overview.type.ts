export type OverviewResponse = {
 data: {
  id: number;
  application_id: number;
  overview: ApplicantOverview;
  business_overview: BusinessOverview;
 };
};

export type ApplicantOverview = {
 applicant_photo_url: string;
 applicant_identity_photo_url: string;
 applicant_dob: string;
 total_score: number;
 pre_screen_score: number;
 cashflow_score: number;
 qualitative_score: number;
 phone_number: number | string;
 email: string;
 summary: string;
 description: string;
 notes: string;
};

export type BusinessOverview = {
 name: string;
 address: string;
 nob: string;
 capital: number;
 year_of_establishment: number;
 owner_work_experience: string;
};
