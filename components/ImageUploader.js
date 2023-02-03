import React, { useState } from 'react'
import { auth, storage, STATE_CHANGE } from '../lib/firebase'
import Loader from './Loader'

const ImageUploader = () => {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [downloadURL, setDownloadURL] = useState(null)

    // create firebase upload task
    const uploadFile = async (e) => {
        // get file
        const file = Array.from(e.target.files)[0]
        const extension = file.type.split('/')[1]

        // make reference to the storage bucker location
        const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`)
        setUploading(true)
        // starts upload
        const task = ref.put(file)
        // listen to updates to upload task
        task.on(STATE_CHANGE, (snapshot) => {
            const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
            setProgress(pct)

            // get download url after task resolves (not native Promise)
            task
              .then((d) => ref.getDownloadURL())
              .then((url) => {
                setDownloadURL(url)
                setUploading(false)
              })
        })
    }
  return (
    <div className='box'>
        <Loader show={uploading}/>
        {uploading && <h3>{progress} %</h3>}
        {!uploading && (
            <>
                <label className='btn'>
                    📸 Upload Img
                    <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
                </label>
            </>
        )}
        {downloadURL && <code className='upload-snipet'>{`![alt](${downloadURL})`}</code>}
        {downloadURL && <p>Paste URL to input</p>}
    </div>
  )
}

export default ImageUploader