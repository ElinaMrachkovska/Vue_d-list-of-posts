<script setup lang="ts">
import { ref } from 'vue';
import { User } from './types/User';
import { Post } from './types/Post';
import client from './utils/http.js';
import Login from './components/login.vue';
import Header from './blocks/header.vue';
import PostsList from './components/postsList.vue';
import Sidebar from './components/sidebar.vue';
import Loader from './components/loader.vue';
import './App.scss';

const currentUser = ref<User | null>(null);
const posts = ref<Post[]>([]);
const selectedPost = ref<Post | null>(null);
const isLoadingPosts = ref(false);
const isAddingPost = ref(false);
const postsError = ref<string | null>(null);


const handleLogin = async (user: User) => {
  currentUser.value = user;
  isLoadingPosts.value = true;
  postsError.value = null;
  selectedPost.value = null;
  posts.value = [];

  try {
    const response = await client.get<Post[]>(`/posts?userId=${user.id}`);
    posts.value = response.data;
  } catch {
    postsError.value = 'Failed to load posts. Please try again later.';
  } finally {
    isLoadingPosts.value = false;
  }
};

const handleLogout = () => {
  currentUser.value = null;
  posts.value = [];
  selectedPost.value = null;
  isAddingPost.value = false;
  postsError.value = null;
};

const togglePost = (post: Post) => {
  if (selectedPost.value?.id === post.id) {
    selectedPost.value = null;
  } else {
    selectedPost.value = post;
    isAddingPost.value = false;
  }
};

const openAddPost = () => {
  isAddingPost.value = true;
  selectedPost.value = null;
};

// --- Закрити sidebar ---
const closeSidebar = () => {
  selectedPost.value = null;
  isAddingPost.value = false;
};

// --- Після успішного створення поста — перезавантажуємо список ---
const handlePostAdded = async () => {
  isAddingPost.value = false;
  if (currentUser.value) {
    try {
      const response = await client.get<Post[]>(`/posts?userId=${currentUser.value.id}`);
      posts.value = response.data;
    } catch {
      console.error('Failed to refresh posts');
    }
  }
};

// --- Видалення поста ---
const handlePostDelete = async (postId: number) => {
  try {
    await client.delete(`/posts/${postId}`);
    posts.value = posts.value.filter(p => p.id !== postId);
    if (selectedPost.value?.id === postId) {
      selectedPost.value = null;
    }
  } catch {
    console.error('Failed to delete post');
  }
};

// --- Редагування поста ---
const handlePostEdit = async (updatedPost: Post) => {
  try {
    const response = await client.patch<Post>(`/posts/${updatedPost.id}`, {
      title: updatedPost.title,
      body: updatedPost.body,
    });
    const index = posts.value.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
      posts.value[index] = response.data;
    }
    if (selectedPost.value?.id === updatedPost.id) {
      selectedPost.value = response.data;
    }
  } catch {
    console.error('Failed to update post');
  }
};
</script>

<template>
  <!-- Екран логіну -->
  <Login v-if="!currentUser" @login="handleLogin" />

  <!-- Головний екран -->
  <template v-else>
    <Header :user="currentUser" @logout="handleLogout" />

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">

          <!-- Ліва колонка: список постів -->
          <div class="tile is-parent">
            <div class="tile is-child box is-success">

              <div class="block is-flex is-justify-content-space-between is-align-items-center">
                <h1 class="title is-3">Posts</h1>
                <button class="button is-link" @click="openAddPost">
                  Add New Post
                </button>
              </div>

              <Loader v-if="isLoadingPosts" />

              <template v-else>
                <div v-if="postsError" class="notification is-danger">
                  {{ postsError }}
                </div>

                <div v-else-if="posts.length === 0" class="notification is-warning">
                  No posts yet.
                </div>

                <PostsList
                  v-if="posts.length > 0"
                  :posts="posts"
                  :selectedPostId="selectedPost?.id ?? null"
                  @select="togglePost"
                  @delete="handlePostDelete"
                  @edit="handlePostEdit"
                />
              </template>
            </div>
          </div>

          <!-- Права колонка: sidebar (AddPost або PostPreview) -->
          <Sidebar
            :selectedPost="selectedPost"
            :isAdding="isAddingPost"
            :userId="currentUser.id"
            @close="closeSidebar"
            @post-added="handlePostAdded"
          />

        </div>
      </div>
    </main>
  </template>
</template>