'use client' // Needed for interactive components

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react' // X icon for close button

// Props type definition
type ModalProps = {
  isOpen: boolean              // Controls if modal is shown
  onClose: () => void         // Function to call when modal closes
  title: string               // Modal title
  children: React.ReactNode   // Modal content
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    // Transition and Dialog from HeadlessUI handle accessibility and animations
    <Transition show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={onClose}
        open={isOpen}
      >
        {/* Dark overlay behind modal */}
        <Transition
          show={isOpen}
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition>

        {/* Modal panel */}
        <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition
              show={isOpen}
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Close button */}
                <div className="absolute right-4 top-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Title */}
                <Dialog.Title 
                  as="h3" 
                  className="text-lg font-semibold text-center mb-8"  // CHANGE: add mb-8 instead of mb-4
                  >
                  {title}
                </Dialog.Title>

                {/* Content */}
                {children}
              </div>
            </Transition>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}