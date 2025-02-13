// This file sets up our connection to Supabase
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Create a single instance
const supabase = createClientComponentClient()

export default supabase