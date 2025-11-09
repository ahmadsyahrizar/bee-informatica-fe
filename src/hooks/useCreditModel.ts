// src/hooks/useCreditModel.ts
import { useEffect, useState } from "react";
import { useCreditScoreTemplate } from "@/hooks/useCreditScoreTemplate";
import { useCreditScore } from "@/hooks/useCreditScore";
import type { CreditScoreData } from "@/lib/utils/mergeCreditModel";
import { mergeTemplateAndScore } from "@/lib/utils/mergeCreditModel";

export function useCreditModel(accessToken: string | undefined, caseId: string | number | undefined, fallback: CreditScoreData) {
 const { data: tpl, isLoading: tplLoading } = useCreditScoreTemplate(accessToken ?? "");
 const { data: score, isLoading: scoreLoading } = useCreditScore(accessToken ?? "", caseId ?? "");
 const loading = tplLoading || scoreLoading;

 const [model, setModel] = useState<CreditScoreData>(fallback);

 useEffect(() => {
  if (!tpl) return;
  // @ts-expect-error rija
  const merged = mergeTemplateAndScore(tpl, score ?? {}, {
   overview: fallback?.overview?.icon,
   pre: fallback?.preScreening?.icon,
   cash: fallback?.cashflow?.icon,
   qual: fallback?.qualitative?.icon,
  });
  setModel(merged);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [tpl, score]);

 return { model, setModel, loading };
}
