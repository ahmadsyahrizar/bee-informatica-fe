export type TemplateItem = {
 key: string;
 value: string;
 header_key: string;
 header_value: string;
 ratio: number;
 full_rate: number;
 order: number;
};

export type ScoreItem = { key: string; score: number };
export type QualScoreItem = { category_id: number; final_score: number };

export type RatioRow = {
 label: string;
 ratio?: string | number;
 isHeader?: boolean;
 isFooter?: boolean;
 fullRate?: number | string;
 rateScore?: number | string | React.ReactNode;
 score?: number | string | React.ReactNode;
 aiScore?: number | string | React.ReactNode;
 aiReason?: string | React.ReactNode;
 finalScore?: number | string | React.ReactNode;
 isGroup?: boolean;
 key?: string;
};

export type Section = {
 title: string;
 icon?: React.ReactNode;
 columns: string[];
 rows: RatioRow[];
 footer?: RatioRow;
};

export type CreditScoreData = {
 overview: Section;
 preScreening: Section;
 cashflow: Section;
 qualitative: Section;
};
