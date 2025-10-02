import CardCaseDetail from "./CardCaseDetail";
import { AiGradientHeading } from "./GradientHeading";

export function AIHighlight() {
    return (
        <div className="mt-[32px] scroll-mt-28 lg:scroll-mt-32" id="ai-highlight">
            <AiGradientHeading id="ai-highlight">
                AI Highlight
            </AiGradientHeading>

            <section className="grid grid-cols-12 gap-16">
                <CardCaseDetail title={"Strength"} desc="Insights will appear after the call is processed" bgColor="bg-success-50" />
                <CardCaseDetail bgColor="bg-error-50" title={"Risks"} desc="Insights will appear after the call is processed" />
            </section>
        </div>
    );
}   