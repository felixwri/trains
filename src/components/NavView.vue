<script setup lang="ts">
import NavLink from './NavLink.vue';
</script>

<template>
  <div>
    <nav>
      <span>
        <router-link class="title" to="/">FW</router-link>
      </span>
      <ul>
        <li>
          <NavLink to="/about">Portfolio</NavLink>
        </li>
        <li>
          <NavLink to="/about">Projects</NavLink>
        </li>
        <li>
          <NavLink to="/about">Contact</NavLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style>
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 2rem;
  height: 3rem;

  z-index: 99;
}

ul {
  display: flex;
  list-style: none;
  justify-content: flex-end;
  align-items: center;
  width: 50%;
}

.title {
  color: var(--text);
  text-decoration: none;
}
</style>
