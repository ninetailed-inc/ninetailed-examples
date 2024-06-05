<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { NinetailedKey } from './plugins/ninetailed'
import { inject, watch } from 'vue'

const route = useRoute()
const ninetailedInstance = inject(NinetailedKey)

function resetProfile() {
  ninetailedInstance?.reset()
}

function becomeEnterprise() {
  ninetailedInstance?.identify('', { companysize: 'more_than_2000' })
}

function becomeStartup() {
  ninetailedInstance?.identify('', { companysize: '1-50' })
}

if (ninetailedInstance) {
  const { page } = ninetailedInstance
  watch(
    () => route.fullPath,
    () => {
      page()
    },
    { immediate: true }
  )
}
</script>

<template>
  <header>
    <div class="wrapper">
      <button @click="resetProfile">Reset Profile</button>
      <button @click="becomeEnterprise">Enterprise</button>
      <button @click="becomeStartup">Startup</button>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/pricing">Pricing</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
