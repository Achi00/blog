import React, {useEffect, useState} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth,firestore } from '../lib/firebase'

const useUserData = () => {
const [user] = useAuthState(auth)
  const [username, setUsername] = useState(null)
  useEffect(() => {
    // turn off subscruption
    let unsubscribe

    if (user) {
      const ref = firestore.collection('users').doc(user.uid)
      unsubscribe = ref.onSnapshot(doc => {
        setUsername(doc.data()?.username)
      })
    } else {
      setUsername(null)
    }
    return unsubscribe
  }, [user])
  return { user, username}
}

export default useUserData