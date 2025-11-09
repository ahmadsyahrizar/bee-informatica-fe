export interface SalesReport {
 id: number;
 application_id: number;
 sales_monthly_min: number;
 sales_monthly_max: number;
 profit: number;
 expenses_monthly: number;
 rent_monthly: number;
 salary_staff_monthly: number;
 salary_model: string;
 salary_per_day_min: number;
 salary_per_day_max: number;
};

export interface SalesReportResponse {
 data: SalesReport
}
