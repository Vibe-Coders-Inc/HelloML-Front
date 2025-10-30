import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A67A5B]/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#A67A5B] to-[#C9B790] text-white hover:from-[#A67A5B]/90 hover:to-[#C9B790]/90 shadow-lg hover:shadow-xl",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl",
        outline:
          "border-2 border-[#A67A5B] bg-white text-[#A67A5B] hover:bg-[#A67A5B] hover:text-white shadow-md hover:shadow-lg",
        secondary:
          "bg-gradient-to-r from-[#C9B790] to-[#D8CBA9] text-[#A67A5B] hover:from-[#C9B790]/90 hover:to-[#D8CBA9]/90 shadow-md hover:shadow-lg",
        ghost: "hover:bg-[#D8CBA9]/30 text-[#A67A5B] hover:text-[#A67A5B]",
        link: "text-[#A67A5B] underline-offset-4 hover:underline hover:text-[#A67A5B]/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

