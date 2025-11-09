import { FinancialDataEvaluation } from "@/types/api/evaluation.type";
import formatCurrency from "./formatCurrencyRM";

export function mapFinancialDataToStats(data: FinancialDataEvaluation) {
 return [
  {
   label: "Sales monthly",
   value: `${formatCurrency(data.sales_monthly_min)} – ${formatCurrency(data.sales_monthly_max)}`,
  },
  {
   label: "Profit",
   value: `${formatCurrency(data.profit)}`,
  },
  {
   label: "Expenses monthly",
   value: `${formatCurrency(data.expenses_monthly)}`,
  },
  {
   label: "Rent monthly",
   value: `${formatCurrency(data.rent_monthly)}`,
  },
  {
   label: "Salary staff monthly",
   value: `${formatCurrency(data.salary_staff_monthly)}`,
  },
  {
   label: "Salary model",
   value: data.salary_model === "monthly" ? "Monthly pay" : "Daily pay",
  },
  {
   label: "Salary per day",
   value: `${formatCurrency(data.salary_per_day_min)} – ${formatCurrency(data.salary_per_day_max)}/ Day`,
  },
 ];
}
