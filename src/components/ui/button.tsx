'use client' // Add this to mark as client component

// Reusable button component with consistent styling
type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success'  // Added 'success'
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'  // Added type prop
  disabled?: boolean
}

export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '' 
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium"
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    success: "bg-green-600 text-white hover:bg-green-700"  // Added success style
  }

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}