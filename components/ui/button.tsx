import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/10 hover:border-primary/30 btn-animate-pulse",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg shadow-destructive/20",
        outline: "border border-gray-200 bg-background hover:bg-gray-50 hover:border-gray-300 text-foreground hover:shadow-sm transition-all duration-200 btn-animate-pulse",
        secondary: "bg-secondary/90 text-secondary-foreground hover:bg-secondary border border-secondary/80 hover:border-secondary transition-all duration-200 btn-animate-bounce",
        ghost: "hover:bg-accent/40 hover:text-accent-foreground hover:shadow-sm border border-transparent hover:border-accent/30 transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline",
        shine: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg shadow-primary/20 btn-animate-shine",
        wiggle: "bg-secondary text-secondary-foreground hover:bg-secondary/80 btn-animate-wiggle",
      },
      size: {
        default: "h-10 px-6 py-2 hover:shadow-md active:scale-[0.98] transform transition-transform",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
