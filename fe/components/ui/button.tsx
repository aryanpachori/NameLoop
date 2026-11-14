import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[8px] border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-muted",
        ghost:
          "text-muted-foreground hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive text-white hover:opacity-90",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-2 px-3 text-[13px] font-medium has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[8px] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1.5 rounded-[8px] px-2.5 text-[13px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 rounded-[8px] px-4 text-[14px] font-medium has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[8px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[8px]",
        "icon-lg": "size-9 rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
