import React, { useEffect, useState } from "react";
import AddNewPostBtn from "./AddNewPostBtn";

function Post() {
  const postSchema = { title: "", body: "" };

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState(postSchema);
  const [postFormVisible, setPostFormVisible] = useState(false);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => setPosts([...data]));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then((data) => setPosts([...posts, data]))
      .then(setPostFormVisible(false))
      .then(setNewPost(postSchema));
  };

  return (
    <div>
      {!postFormVisible && (
        <AddNewPostBtn onClick={() => setPostFormVisible(true)} />
      )}

      {postFormVisible && (
        <form onSubmit={handleSubmit}>
          <h3>new Post</h3>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <br />
          <textarea
            name="body"
            id=""
            cols="30"
            rows="10"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            placeholder="Body"
          ></textarea>
          <button
            onClick={() => {
              setPostFormVisible(!postFormVisible);
              setNewPost(postSchema);
            }}
          >
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      )}

      <ul>
        {posts &&
          posts.map((post, i) => {
            return (
              <li key={i}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default Post;
