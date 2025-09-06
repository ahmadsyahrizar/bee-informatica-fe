import { StatusBadge } from "@/components/ui/statusBadge"
import { ScoreDisplay } from "@/components/ui/scoreChip"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 flex-wrap">
        <StatusBadge variant="final-review" />
        <StatusBadge variant="approved" />
        <StatusBadge variant="attention" />
        <StatusBadge variant="rejected" />
        <StatusBadge variant="phone" />
      </div>

      <div className="flex gap-6">
        <ScoreDisplay value={96} />
        <ScoreDisplay value={90} />
        <ScoreDisplay value={75} />
        <ScoreDisplay value={50} />
      </div>

      <Button variant={"default"}>dfsdf</Button>
      <Button variant={"destructive"}>dfsdf</Button>
      <Button variant={"outline"}>dfsdf</Button>
      <Button variant={"outline-red"}>OUTLINE RED</Button>
    </div>
  )
}     