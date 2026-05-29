<script setup lang="ts">
import { Field } from 'vee-validate'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { useProfilePage } from './ProfilePage.composable'

const { profile, saveProfile } = useProfilePage()
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="mb-6 text-2xl">Profile</h1>

    <div class="mb-8 flex items-center justify-center">
      <div v-if="profile.pictureUrl" class="mr-4">
        <img :src="profile.pictureUrl" alt="Profile" class="h-16 w-16 rounded-full" />
      </div>
      <div>
        <h2 class="text-xl font-semibold">{{ profile.displayName || 'User' }}</h2>
        <p class="text-gray-600">{{ profile.statusMessage || '' }}</p>
      </div>
    </div>

    <form class="space-y-4" @submit="saveProfile">
      <div>
        <label for="building" class="mb-2 block text-sm font-medium">Building</label>
        <Field name="building" v-slot="{ componentField, errorMessage }">
          <Input
            id="building"
            v-bind="componentField"
            placeholder="Enter your building (A B C D)"
            :class="['w-full', errorMessage && 'border-red-500']"
          />
          <p v-if="errorMessage" class="mt-1 text-sm text-red-500">{{ errorMessage }}</p>
        </Field>
      </div>

      <div>
        <label for="roomId" class="mb-2 block text-sm font-medium">Room ID</label>
        <Field name="roomId" v-slot="{ componentField, errorMessage }">
          <Input
            id="roomId"
            v-bind="componentField"
            placeholder="Enter your Room ID (2XX)"
            :class="['w-full', errorMessage && 'border-red-500']"
          />
          <p v-if="errorMessage" class="mt-1 text-sm text-red-500">{{ errorMessage }}</p>
        </Field>
      </div>

      <div>
        <label for="tel" class="mb-2 block text-sm font-medium">Tel</label>
        <Field name="tel" v-slot="{ componentField, errorMessage }">
          <Input
            id="tel"
            v-bind="componentField"
            placeholder="Enter your telephone number"
            :class="['w-full', errorMessage && 'border-red-500']"
          />
          <p v-if="errorMessage" class="mt-1 text-sm text-red-500">{{ errorMessage }}</p>
        </Field>
      </div>

      <Button type="submit" class="mt-4 w-full">Save Profile</Button>
      <Button
        type="button"
        @click="$router.push('/order-history')"
        class="mt-4 w-full"
        variant="secondary"
        >View Order History</Button
      >
      <Button type="button" @click="$router.push('/')" class="mt-4 w-full" variant="outline"
        >Back to Home</Button
      >
    </form>
  </div>
</template>
