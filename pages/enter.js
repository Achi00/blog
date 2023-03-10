import { useCallback, useContext, useEffect, useState} from 'react'
import GoogleButton from 'react-google-button'
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { UserContext } from '../lib/context'
import React from 'react';
import debounce from 'lodash.debounce';

const EnterPage = () => {
  const { user, username } = useContext(UserContext)

  return (
    <main>
      {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
    </main>
  )
}

const SignInButton = () => {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };
  return (
    <GoogleButton onClick={signInWithGoogle} />
  )
}
export const SignOutButton = () => {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
const UsernameForm = () => {
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, username } = useContext(UserContext)


  

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;


    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  }
  // 
        // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(debounce(async (username) => {
    if (username.length >= 3) {
      const ref = firestore.doc(`usernames/${username}`)
      const { exists } = await ref.get()
      console.log('firestore read executed');
      setIsValid(!exists)
      setLoading(false)
    }
  }, 500), [])
  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  // submit
  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      // create reference for document
    const userDoc = firestore.doc(`users/${user.uid}`)
    const usernameDoc = firestore.doc(`usernames/${formValue}`)
    // commit both docs as batch write
    const batch = firestore.batch()
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
    batch.set(usernameDoc, { uid: user.uid})
    await batch.commit()
    } catch (error) {
      console.log(error);
    }
  }
  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name='username' placeholder='username' value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading}/>
          <button type='submit' className='btn-green' disabled={!isValid}>Choose</button>

          <h3>Debug State</h3>
          <div>
            <h2>Username: {formValue}</h2>
            <h2>Loading: {loading.toString()}</h2>
            <h2>Username Valid: {isValid.toString()}</h2>
          </div>
        </form>
      </section>
    )
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}

export default EnterPage