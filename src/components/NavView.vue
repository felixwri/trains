<template>
  <div>
    <nav>
      <span>
        <router-link class="title" to="/">github.com/felixwri/trains/</router-link>
      </span>
      <ul>
        <li>
          <!-- <router-link to="/" class="link">Contact</router-link> -->
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
  height: 4rem;

  font-size: 1rem;

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
  font-weight: bold;
}

.link {
  text-decoration: none;
  color: var(--text);
  font-family: var(--font);
  padding: 0.5rem;

  transition: color 0.25s;
}

.link:hover {
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}
</style>
