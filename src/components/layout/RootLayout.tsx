// This is our main layout component that wraps all pages
import Header from './Header'
import Footer from './Footer'

// Props type definition - tells TypeScript what props to expect
type RootLayoutProps = {
  children: React.ReactNode  // This allows the layout to wrap other components
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenSignup={() => console.log('Signup clicked')} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}