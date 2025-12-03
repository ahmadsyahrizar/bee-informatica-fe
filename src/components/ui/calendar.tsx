"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-0 [--cell-size:2.5rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),

        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),

        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),

        nav: cn(
          "relative flex h-[--cell-size] items-center justify-between gap-2 mb-2",
          defaultClassNames.nav
        ),

        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50 [&_svg]:w-5 [&_svg]:h-5",
          defaultClassNames.button_previous
        ),

        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50 [&_svg]:w-5 [&_svg]:h-5",
          defaultClassNames.button_next
        ),

        month_caption: cn(
          "mx-auto flex items-center justify-center h-[--cell-size] text-base pointer-events-none",
          defaultClassNames.month_caption
        ),

        // caption area (below nav) where we will render input + Today
        // @ts-expect-error rija
        caption: cn("px-4 py-3 mt-0", defaultClassNames.caption),

        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),

        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),

        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),

        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "text-sm",
          "hidden",
          defaultClassNames.caption_label
        ),

        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),

        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.9rem] font-normal",
          defaultClassNames.weekday
        ),

        week: cn("mt-2 flex w-full", defaultClassNames.week),

        week_number_header: cn("w-[--cell-size] select-none", defaultClassNames.week_number_header),

        week_number: cn("text-muted-foreground select-none text-[0.8rem]", defaultClassNames.week_number),

        day: cn(
          // keep the day container generic; sizing is controlled by button itself below
          "group/day relative h-full w-full select-none p-0 text-center",
          defaultClassNames.day
        ),

        range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),

        today: cn("bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none", defaultClassNames.today),

        outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),

        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),

        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
          )
        },

        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("w-5 h-5", className)} {...props} />
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("w-5 h-5", className)} {...props} />
          }

          return <ChevronDownIcon className={cn("w-5 h-5", className)} {...props} />
        },

        DayButton: CalendarDayButton,

        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex items-center justify-center text-center" style={{ width: "var(--cell-size)" }}>
                {children}
              </div>
            </td>
          )
        },

        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isSingleSelected =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={isSingleSelected}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        // base: use center alignment
        "flex items-center justify-center text-sm leading-none select-none",

        // ensure the button explicitly uses the calendar cell size
        // this makes the button a square exactly the size of a cell
        "h-[--cell-size] w-[--cell-size] min-w-[--cell-size] min-h-[--cell-size]",

        // default unselected look (transparent background, neutral text)
        "bg-transparent text-inherit",

        // === SELECTED (single day) ===
        // apply full circle, brand bg, white text, and remove any ring/border
        "data-[selected-single=true]:rounded-full",
        "data-[selected-single=true]:bg-brand-500",
        "data-[selected-single=true]:text-white",
        // force remove any ring/border left by outer styles
        "data-[selected-single=true]:!ring-0",
        "data-[selected-single=true]:!border-0",

        // range and other states — keep defaults but avoid large rounded styles
        "data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground",

        // small number sizing (you can tweak this)
        "[&>span]:text-sm [&>span]:leading-none",

        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
