import CardCaseDetail from "./CardCaseDetail";

export function AIHighlight() {
 return (
  <div>
   <p className="mt-32 mb-12 text-18 font-semibold bg-gradient-to-r from-[#AD00FE] to-[#00E0EE] bg-clip-text text-transparent">AI Highlight ✨</p>

   <section className="grid grid-cols-12 gap-16">
    <CardCaseDetail title={"Strength"} desc="Insights will appear after the call is processed"
     bgColor="bg-success-50"
    />

    <CardCaseDetail bgColor="bg-error-50" title={"Risks"} desc="Insights will appear after the call is processed
"  />
   </section>
  </div>
 );
}   