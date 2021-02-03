import React, { useState, useEffect } from 'react';
import './post.css';
import { db } from './firebase';
import firebase from 'firebase';

export default function Post({ username, image, caption, postId, user }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment('');
    }

    return (
        <div className='post col-lg-12 col-md-12 col-sm-12 col-12 mx-auto'>
            {/* Header --> avtar + uername */}
            <div className='post_header'>
                <div className='post_avtar_div'>
                    <img
                        className='post_avatar'
                        src={image}
                    />
                </div>
                <h6 className='post_title'>{username}</h6>
            </div>

            {/* image */}
            <img src={image} className='post_img' />

            {/* username + caption */}
            <h6 className='post_text'>
                <strong>{username}</strong> - {caption}
            </h6>

            <div className='post_comments bg-light'>
                {comments.map((comment) => (
                    <p className='bg-white post_comment'>
                        <div className='post_avtar_div'>
                            <img
                                className='post_avatar'
                                src={image}
                            />
                        </div>
                        <div className='post_title'>
                            <strong> @{comment.username} - </strong> {comment.text}
                        </div>
                    </p>
                ))}

                {user && (
                    <form className='post_commentBox row mx-auto'>
                        <input
                            className='col-lg-9 col-md-9 col-sm-9 col-9 mx-auto post_input'
                            type='text'
                            placeholder='Add a comment'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            className='col-lg-3 col-md-3 col-sm-3 col-3 mx-auto post_button btn btn-info'
                            disabled={!comment}
                            type='submit'
                            onClick={postComment}
                        > Post </button>
                    </form>
                )}
            </div>
        </div>
    )
}
