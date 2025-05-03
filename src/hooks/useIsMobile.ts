import * as React from "react"
import { MOBILE_BREAKPOINT } from "@/lib/constants";

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)


  React.useEffect(() => {
    // Initial check
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Set initial state
    checkMobile()

    // Set up event listener
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}