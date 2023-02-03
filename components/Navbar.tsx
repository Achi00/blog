import { useContext} from 'react'
import Link from 'next/link'
import { UserContext } from '../lib/context'
import SignOutButton from '../pages/enter'

const Navbar = () => {
  const { user, username } = useContext(UserContext)
  
  
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className='btn-logo'>FEED</button>
          </Link>
        </li>
        {/* if user signed in */}
        {username && (
          <>
            <li className='push-left'>
                <Link href="/admin">
                  <button className='btn-blue'>Write Posts</button>
                </Link>
            </li>
            <li>
                <Link href={`/${username}`}>
                  <img src={user?.photoURL} alt="user"/>
                </Link>
            </li>
            <SignOutButton />
          </>
        )}
        {/* if user not signed in */}
        {!username && (
            <li>
              <Link href="/enter">
                  <button className='btn-blue'>Log in</button>
              </Link>
            </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar