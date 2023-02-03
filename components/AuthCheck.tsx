import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../lib/context'

// components children only shown to logges in users
const AuthCheck = (props) => {
    const { username } = useContext(UserContext)
    return username ? 
        props.children : 
        props.fallback || <Link href="/enter"><button>You must be signed in</button></Link>
}

export default AuthCheck