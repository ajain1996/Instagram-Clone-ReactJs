import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';

import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in....
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out....
        setUser(null)
      }
    });

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  // Use Effect
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });
  }, []);

  // Sign Up Method
  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  }

  // Sign In Method
  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="App">
      {/* Sign Up Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
              className='header_img'
            />
          </center>

          <form className='app_signup'>
            <Input
              placeholder="username"
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type='text'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>

        </div>
      </Modal>
      {/* Sign Up Modal end */}

      {/* Sign In Modal */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
              className='header_img'
            />
          </center>

          <form className='app_signup'>
            <Input
              placeholder="email"
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type='text'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>

        </div>
      </Modal>
      {/* Sign In Modal ends */}


      {/* Header */}
      <div className='app__header'>
        <img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' className='app_header_img' />

        {user ? (
          <Button
            type="submit"
            onClick={() => auth.signOut()}
          >Logout</Button>
        ) : (
            <div className='app_container'>
              <Button
                type="submit"
                onClick={() => setOpenSignIn(true)}
              >Sign In</Button>
              <Button
                type="submit"
                onClick={() => setOpen(true)}
              >Sign Up</Button>
            </div>
          )}
      </div>

      
        <div className='app_posts row mx-auto text-center'>
          <div className='col-lg-7 col-md-7 col-sm-11 col-12 mx-auto'>
            <center>
              {
                posts.map(({ id, post }) => (
                  <Post
                    key={id}
                    postId={id}
                    user={user}
                    username={post.username}
                    caption={post.caption}
                    image={post.image}
                  />
                ))
              }
            </center>
          </div>

          <div className='col-lg-4 col-md-4 col-sm-10 col-12 mx-auto'>
            <center>
              <InstagramEmbed url='https://instagr.am/p/Zw9o4'
                hideCaption={false}
                containerTagName='div'
                protocol=''
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
              />

              <div className='col-md-12 col-lg-12 col-sm-12 col-12 mx-auto'>
                <div className='card py-2'>
                  {user?.displayName ? (
                    <ImageUpload username={user.displayName} />
                  ) : (
                    <h3>Sorry you are not login</h3>
                  )}
                </div>
              </div>
            </center>

          </div>
        </div>

    </div>
  );
}

export default App;
