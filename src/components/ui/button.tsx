// Reusable button component with consistent styling
type ButtonProps = {
    children: React.ReactNode
    variant?: 'primary' | 'secondary'
    onClick?: () => void
    className?: string
  }
  
  export function Button({ 
    children, 
    variant = 'primary', 
    onClick, 
    className = '' 
  }: ButtonProps) {
    // Base styles all buttons share
    const baseStyles = "px-4 py-2 rounded-lg font-medium"
    
    // Variant-specific styles
    const variantStyles = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
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