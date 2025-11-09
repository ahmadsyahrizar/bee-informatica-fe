"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Info } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import useCaseDetail from "@/hooks/useCaseDetail";
import { BusinessAssessmentResponse } from "@/types/api/evaluation-detail.type";
import { mapAssessmentToSections } from "@/lib/utils/mapEvaluationDetail";
import EditableValueCell from "./EditableValueCell";
import { CaseDetailInitResponse } from "@/types/api/case-detail.type";

type Criterion = {
  label: string;
  value?: string | React.ReactNode;
  hint?: string;
};

type Section = {
  id: number;
  title: string;
  criteria: Criterion[];
};

type Props = {
  onChange?: (next: Section[]) => void;
};

export default function EvaluationDetails({ onChange }: Props) {
  const { id } = useParams()
  const { data: dataInitial } = useCaseDetail<CaseDetailInitResponse>({ type: 'initial', caseId: id as string })
  const isEditable = dataInitial?.stage === '1st_review'
  const { data: dataEvaluation } = useCaseDetail<BusinessAssessmentResponse>({ type: "evaluation_detail", caseId: id as string });
  const sections = useMemo(() => dataEvaluation ? mapAssessmentToSections(dataEvaluation) : [], [dataEvaluation]);

  const [data, setData] = useState<Section[]>(
    sections.map((s) => ({
      ...s,
      criteria: s.criteria.map((c) => ({ ...c })),
    }))
  );

  useEffect(() => {
    setData(sections.map((s) => ({ ...s, criteria: s.criteria.map((c) => ({ ...c })) })));
  }, [sections]);

  const updateValue = (secIdx: number, critIdx: number, val: string) => {
    setData((prev) => {
      const next = prev.map((s) => ({ ...s, criteria: s.criteria.map((c) => ({ ...c })) }));
      next[secIdx].criteria[critIdx].value = val.length ? val : "-";
      onChange?.(next);
      return next;
    });
  };

  return (
    <section id="evaluation-details" className="space-y-10 mt-[32px] scroll-mt-28 lg:scroll-mt-32">
      <h3 className="text-20 font-semibold text-gray-900">Evaluation Details</h3>

      {data.map((sec, secIdx) => (
        <div key={sec.id} className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="flex h-24 w-24 items-center justify-center rounded-full text-brand-500 bg-brand-50 text-16 font-semibold">
              {sec.id}
            </span>
            <h4 className="text-16 font-semibold text-gray-900">{sec.title}</h4>
          </div>

          <div>
            {sec.criteria.map((c, i) => (
              <div
                key={i}
                className={`flex py-16 items-start justify-start text-14 text-gray-700 ${i !== sec.criteria.length - 1 ? "border-b" : ""
                  } border-gray-200 bg-white`}
              >
                <div className="flex flex-1 text-gray-600 text-14 items-center gap-2 pr-6">
                  {c.label}
                  {c.hint && (
                    <span title={c.hint}>
                      <Info className="h-18 w-18 text-gray-400" />
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <EditableValueCell
                    value={c.value}
                    canEdit={isEditable}
                    onSave={(val) => updateValue(secIdx, i, val)}
                    className="text-gray-900 font-medium text-18"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
