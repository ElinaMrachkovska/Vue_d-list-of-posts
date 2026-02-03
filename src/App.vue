<script setup lang="ts">
import { ref } from 'vue';
import { User } from './types/User';
import { Post } from './types/Post';
import client from './utils/http.js';
import Login from './components/login.vue';
import PostsList from './components/postsList.vue';
import PostPreview from './components/postPreview.vue';
import AddPost from './components/addPost.vue'; // Твій компонент
import Loader from './components/loader.vue'; 
import Sidebar from './components/sidebar.vue';
import './App.scss';

const currentUser = ref<User | null>(null);
const posts = ref<Post[]>([]);
const selectedPost = ref<Post | null>(null);
const isLoadingPosts = ref(false);
const isAddingPost = ref(false); // Стан для показу форми

const handleLogin = async (user: User) => {
  currentUser.value = user;
  isLoadingPosts.value = true;
  selectedPost.value = null;
  
  try {
    const response = await client.get<Post[]>(`/posts?userId=${user.id}`);
    posts.value = response.data;
  } catch (error) {
    console.error('Error loading posts', error);
  } finally {
    isLoadingPosts.value = false;
  }
};

const togglePost = (post: Post | null) => {
  if (selectedPost.value?.id === post?.id) {
    selectedPost.value = null;
  } else {
    selectedPost.value = post;
    isAddingPost.value = false; // Закриваємо форму додавання, якщо відкриваємо перегляд
  }
};

const handlePostAdded = (newPost: Post) => {
  posts.value.push(newPost); // Додаємо новий пост у список
  isAddingPost.value = false; // Закриваємо форму
};
</script>

<template>
  <Login v-if="!currentUser" @login="handleLogin" />

  <main v-else class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block is-flex is-justify-content-space-between is-align-items-center">
              <h1 class="title is-3">Posts of {{ currentUser.name }}</h1>
              <button class="button is-light" @click="currentUser = null">Logout</button>
            </div>

            <div class="block">
              <button 
                v-if="!isAddingPost"
                class="button is-link is-fullwidth mb-4" 
                @click="isAddingPost = true; selectedPost = null"
              >
                Add Post
              </button>

              <Loader v-if="isLoadingPosts" />
              
              <template v-else>
                <AddPost 
                  v-if="isAddingPost" 
                  :userId="currentUser.id"
                  @added="handlePostAdded"
                  @cancel="isAddingPost = false"
                />

                <div v-if="posts.length === 0 && !isAddingPost" class="notification is-warning">
                  No posts yet.
                </div>

                <PostsList 
                  v-if="posts.length > 0"
                  :posts="posts" 
                  :selectedPostId="selectedPost?.id || null"
                  @select="togglePost"
                />
              </template>
            </div>
          </div>
        </div>

        <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': !!selectedPost }">
          <div class="tile is-child box is-success">
            <PostPreview v-if="selectedPost" :post="selectedPost" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>