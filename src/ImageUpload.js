import React, { useState } from 'react';
import { Button } from '@material-ui/core'
import { storage, db } from './firebase';
import firebase from 'firebase';

import './ImageUpload.css';

export default function ImageUpload({ username }) {

    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTast = storage.ref(`images/${image.name}`).put(image);

        uploadTast.on(
            "state_changed",
            (snapshot) => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function ...
                console.log(error);
                alert(error.message);
            },
            () => {
                // omplete function ...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside db
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            image: url,
                            username: username,
                        });

                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    });
            }
        )
    }

    return (
        <div className='imageUpload'>
            <h5>Add new Post</h5>
            <progress className='img_upload_progress mb-2' value={progress} max='100' />
            <input 
                type='text' 
                placeholder='Enter a caption....' 
                onChange={event => setCaption(event.target.value)}
                value={caption}
                className='form-control imageUpload_input'
            />
            <div className='row mx-auto'>
                <input 
                    type='file' 
                    onChange={handleChange} 
                    className='btn btn-primary btn-sm my-2' 
                />
                <button onClick={handleUpload} className='btn btn-info btn-sm'>
                    Upload
                </button>
            </div>
        </div>
    )
}
