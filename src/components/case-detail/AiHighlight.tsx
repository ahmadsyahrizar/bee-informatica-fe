import CardCaseDetail from "./CardCaseDetail";
import { AiGradientHeading } from "./GradientHeading";

const strengthIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.24984 9.99935L8.74984 12.4993L13.7498 7.49935M18.3332 9.99935C18.3332 14.6017 14.6022 18.3327 9.99984 18.3327C5.39746 18.3327 1.6665 14.6017 1.6665 9.99935C1.6665 5.39698 5.39746 1.66602 9.99984 1.66602C14.6022 1.66602 18.3332 5.39698 18.3332 9.99935Z" stroke="#17B26A" strokeLinecap="round" strokeLinejoin="round" />
</svg>

const riskIcon = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.6665 9.99935H13.3332M18.3332 9.99935C18.3332 14.6017 14.6022 18.3327 9.99984 18.3327C5.39746 18.3327 1.6665 14.6017 1.6665 9.99935C1.6665 5.39698 5.39746 1.66602 9.99984 1.66602C14.6022 1.66602 18.3332 5.39698 18.3332 9.99935Z" stroke="#F04438" strokeLinecap="round" strokeLinejoin="round" />
</svg>


export function AIHighlight({ strength, risks }: { strength: string[], risks: string[] }) {
    return (
        <div className="mt-[32px] scroll-mt-28 lg:scroll-mt-32" id="ai-highlight">
            <AiGradientHeading id="ai-highlight">
                AI Highlight
            </AiGradientHeading>

            <section className="grid grid-cols-12 gap-16">
                <CardCaseDetail title={"Strength"} bgColor="bg-success-50" >
                    <div className="mt-8 list-disc list-inside text-14 text-gray-700 font-medium">
                        {strength.length > 0 ? strength.map((item, index) => (
                            <div className="flex gap-3 mb-2 justify-start items-center" key={index}>
                                {strengthIcon}
                                <div>{item}</div>
                            </div>
                        )) : <li>No strengths available</li>}
                    </div>
                </CardCaseDetail>
                <CardCaseDetail bgColor="bg-error-50" title={"Risks"}>
                    <div className="mt-8 list-disc list-inside text-14 text-gray-700 font-medium">
                        {risks.length > 0 ? risks.map((item, index) => (
                            <div className="flex gap-3 mb-2 justify-start items-center" key={index}>
                                {riskIcon}
                                <div>{item}</div>
                            </div>
                        )) : <li>No risks available</li>}
                    </div>
                </CardCaseDetail>
            </section>
        </div>
    );
}   