import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PopupProps {
  message: string
  onClose: () => void
  type?: 'welcome' | 'high-traffic'
  //autoClose?: boolean // Add this prop since you're using it
}


export default function Popup({ message, onClose, type = 'welcome' }: PopupProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (type === 'welcome') {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [onClose, type])
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (type === 'welcome' && e.target === e.currentTarget) {
      setIsVisible(false)
      onClose()
    }
  }

  if (!isVisible) return null

  return (
    <div 
    onClick={type === 'welcome' ? handleBackdropClick : undefined}  // ✅ Prevent closing high-traffic popup
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 min-h-screen"
    >
      <div className={`mx-4 p-6 rounded-lg max-w-md w-full ${
        type === 'welcome' 
          ? 'bg-yellow-50 border border-yellow-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <p className={
          type === 'welcome' ? 'text-yellow-800' : 'text-red-800'
        }>{message}</p>
      </div>
    </div>
  )
}