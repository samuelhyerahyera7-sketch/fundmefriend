import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'destructive'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        {
          'bg-green-100 text-green-800': variant === 'default',
          'bg-gray-100 text-gray-800': variant === 'secondary',
          'bg-emerald-100 text-emerald-800': variant === 'success',
          'bg-red-100 text-red-800': variant === 'destructive',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
