<template>
  <NuxtLayout>
    <div>
      <button @click="resetProfile">Reset Profile</button>
      <button @click="becomeEnterprise">Enterprise</button>
      <button @click="becomeStartup">Startup</button>
      <nav>
        <NuxtLink to="/"> Home </NuxtLink>
        <NuxtLink to="/pricing"> Pricing </NuxtLink>
      </nav>
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { NinetailedKey } from "./vuePlugins/ninetailed";
import type { Ninetailed } from "@ninetailed/experience.js";

let ninetailed: Ninetailed | undefined;

function resetProfile() {
  ninetailed?.reset();
}

function becomeEnterprise() {
  ninetailed?.identify("", { companysize: "more_than_2000" });
}

function becomeStartup() {
  ninetailed?.identify("", { companysize: "1-50" });
}

if (process.client) {
  ninetailed = inject(NinetailedKey);
}
</script>
