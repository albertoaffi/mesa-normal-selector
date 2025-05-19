
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent text-foreground hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-gradient-to-r from-amber-600 to-amber-400 text-black hover:from-amber-500 hover:to-amber-300 shadow-lg shadow-amber-500/20 border border-amber-300/10",
        purple: "bg-gradient-to-r from-purple-800 to-purple-600 text-white hover:from-purple-700 hover:to-purple-500 shadow-lg shadow-purple-500/20 border border-purple-400/10",
        premium: "backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all",
        glass: "backdrop-blur-md bg-black/30 border border-white/10 text-white hover:bg-black/40 transition-all",
        modern: "backdrop-blur-xl bg-gradient-to-r from-black/50 to-gray-900/50 border border-white/10 text-white hover:from-black/60 hover:to-gray-900/60 transition-all",
        glossy: "bg-gradient-to-r from-black/70 to-black/90 text-white border border-white/10 shadow-lg backdrop-blur-sm hover:from-black/80 hover:to-black/95 transition-all"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-md px-10 py-3 text-lg",
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
