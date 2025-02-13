// ADD NEW FILE: src/store/planSelection.ts
// Simple store to remember selected plan
export const setPlanSelection = (planId: string) => {
    sessionStorage.setItem('selectedPlan', planId)
  }
  
  export const getSelectedPlan = () => {
    return sessionStorage.getItem('selectedPlan')
  }