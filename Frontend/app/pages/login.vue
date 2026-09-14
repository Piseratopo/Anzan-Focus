<template>
  <div class="bg-background font-body-md text-on-surface antialiased min-h-screen">
    <main class="w-full min-h-screen flex flex-col justify-center py-md md:py-lg">
      <div class="flex flex-col w-full relative overflow-hidden">
        <!-- Ambient Background Elements -->
        <div class="absolute -top-32 -left-32 w-96 h-96 bg-primary-fixed/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-tertiary-fixed/30 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

        <div class="flex-1 flex items-center justify-center px-md md:px-lg z-10">
          <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-lg lg:gap-xl items-center">
            
            <!-- Visual / Branding Column -->
            <div class="hidden lg:flex flex-col items-start justify-center h-full relative">
              <div class="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl z-10 group">
                <div 
                  class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
                  data-alt="A macro photograph of an elegant brass abacus with smooth wooden beads resting on a pristine white marble surface, bathed in soft, diffused morning light." 
                  style="background-image: url('/abacus.jpg')"
                ></div>
                <div class="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-md md:p-lg w-full flex flex-col gap-xs">
                  <span class="inline-flex items-center gap-xs px-md py-0.5 rounded-full bg-primary/90 text-on-primary w-fit shadow-md">
                    <span class="material-symbols-outlined text-[15px]">bolt</span>
                    <span class="font-label-sm text-xs uppercase">Accelerate Cognition</span>
                  </span>
                  <h2 class="font-display-lg text-3xl md:text-4xl text-on-error w-full">Master Mental Math.</h2>
                  <p class="font-body-md text-surface-container max-w-sm mt-xs text-sm">
                    Join thousands of minds training their calculation speed, focus, and numerical fluency every day.
                  </p>
                </div>
              </div>

              <!-- Decorative overlapping element (top right) -->
              <div class="absolute -top-6 -right-6 w-40 h-40 bg-surface rounded-2xl shadow-xl flex items-center justify-center p-md -rotate-3 z-20">
                <svg class="w-full h-full text-primary" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-dasharray="4 4" stroke-width="2"></circle>
                  <circle class="opacity-50" cx="50" cy="50" r="30" stroke="currentColor" stroke-width="1.5"></circle>
                  <circle cx="50" cy="50" fill="currentColor" r="15"></circle>
                  <path d="M50 20 L50 35 M50 65 L50 80 M20 50 L35 50 M65 50 L80 50" stroke="currentColor" stroke-width="2"></path>
                </svg>
              </div>
            </div>

            <!-- Login Form Column -->
            <div class="flex flex-col justify-center items-center lg:items-start w-full max-w-md mx-auto lg:mx-0">
              <div class="w-full flex flex-col gap-xs mb-md text-center lg:text-left">
                <h1 class="font-headline-lg text-2xl md:text-3xl text-on-surface">Welcome Back</h1>
                <p class="font-body-md text-on-surface-variant text-sm">Sign in to continue your mental math training.</p>
              </div>

              <!-- Social Logins -->
              <div class="w-full grid grid-cols-2 gap-sm mb-md">
                <button 
                  type="button"
                  @click="handleSocialLogin('Google')"
                  class="flex items-center justify-center gap-xs px-md py-xs rounded-full bg-surface-container hover:bg-surface-variant transition-colors duration-200 active:scale-[0.98]"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span class="font-label-md text-sm text-on-surface">Google</span>
                </button>

                <button 
                  type="button"
                  @click="handleSocialLogin('GitHub')"
                  class="flex items-center justify-center gap-xs px-md py-xs rounded-full bg-surface-container hover:bg-surface-variant transition-colors duration-200 active:scale-[0.98]"
                >
                  <svg aria-hidden="true" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill-rule="evenodd"></path>
                  </svg>
                  <span class="font-label-md text-sm text-on-surface">GitHub</span>
                </button>
              </div>

              <!-- Social notification info banner -->
              <div v-if="socialNotice" class="w-full mb-sm p-xs px-md rounded-lg bg-secondary-container text-on-secondary-container text-xs flex items-center gap-xs">
                <span class="material-symbols-outlined text-[16px]">info</span>
                <span>{{ socialNotice }}</span>
              </div>

              <div class="w-full flex items-center gap-sm mb-md">
                <div class="h-px bg-surface-variant flex-1"></div>
                <span class="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest">Or log in with email</span>
                <div class="h-px bg-surface-variant flex-1"></div>
              </div>

              <!-- Feedback Messages -->
              <div 
                v-if="errorMessage" 
                class="w-full mb-sm p-xs px-md rounded-lg bg-error-container text-on-error-container text-xs flex items-center gap-xs border border-error/20"
              >
                <span class="material-symbols-outlined text-error text-[18px]">error</span>
                <span class="flex-1">{{ errorMessage }}</span>
              </div>

              <div 
                v-if="successMessage" 
                class="w-full mb-sm p-xs px-md rounded-lg bg-primary-fixed/40 text-on-primary-fixed-variant text-xs flex items-center gap-xs border border-primary/20"
              >
                <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                <span class="flex-1">{{ successMessage }}</span>
              </div>

              <!-- Login Form -->
              <form 
                class="w-full flex flex-col gap-sm" 
                @submit.prevent="handleSubmit"
              >
                <div class="flex flex-col gap-0.5">
                  <label class="font-label-md text-xs text-on-surface-variant ml-sm" for="loginEmail">Email Address</label>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[18px]">mail</span>
                    <input 
                      id="loginEmail" 
                      v-model="form.email" 
                      type="email"
                      required
                      placeholder="ada@example.com" 
                      :disabled="isLoading"
                      class="w-full pl-10 pr-md py-xs h-10 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-fixed ring-1 ring-surface-variant text-on-surface font-body-md text-sm transition-shadow disabled:opacity-60 disabled:cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center justify-between ml-sm mr-1">
                    <label class="font-label-md text-xs text-on-surface-variant" for="loginPassword">Password</label>
                    <a href="#" @click.prevent="handleForgotPassword" class="text-xs text-primary hover:underline font-label-md">Forgot password?</a>
                  </div>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[18px]">lock</span>
                    <input 
                      id="loginPassword" 
                      v-model="form.password" 
                      :type="showPassword ? 'text' : 'password'"
                      required
                      placeholder="••••••••" 
                      :disabled="isLoading"
                      class="w-full pl-10 pr-10 py-xs h-10 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-fixed ring-1 ring-surface-variant text-on-surface font-body-md text-sm transition-shadow disabled:opacity-60 disabled:cursor-not-allowed" 
                    />
                    <button 
                      type="button" 
                      @click="showPassword = !showPassword"
                      class="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors p-1"
                    >
                      <span class="material-symbols-outlined text-[18px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  :disabled="isLoading"
                  class="w-full h-11 mt-xs rounded-full bg-primary text-on-primary font-title-md text-sm md:text-base shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-sm group disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <template v-if="isLoading">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </template>
                  <template v-else>
                    <span>Log In</span>
                    <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </template>
                </button>
              </form>

              <div class="mt-md text-center w-full">
                <p class="font-body-md text-xs text-on-surface-variant">
                  Don't have an account? 
                  <NuxtLink to="/register" class="text-primary font-label-md hover:underline decoration-2 underline-offset-4">
                    Register here
                  </NuxtLink>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const config = useRuntimeConfig();

const form = reactive({
  email: '',
  password: '',
});

const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const socialNotice = ref('');

const handleSocialLogin = (provider: string) => {
  socialNotice.value = `${provider} login will be available soon!`;
  setTimeout(() => {
    socialNotice.value = '';
  }, 4000);
};

const handleForgotPassword = () => {
  socialNotice.value = 'Password reset instructions will be sent once enabled.';
  setTimeout(() => {
    socialNotice.value = '';
  }, 4000);
};

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!form.email.trim()) {
    errorMessage.value = 'Please enter your email address.';
    return;
  }

  if (!form.password) {
    errorMessage.value = 'Please enter your password.';
    return;
  }

  isLoading.value = true;

  try {
    const apiBase = config.public.apiBase || 'http://localhost:3001';
    const response = await $fetch<{ success: boolean; message: string; user?: any; idToken?: string }>(
      `${apiBase}/api/auth/login`,
      {
        method: 'POST',
        body: {
          email: form.email.trim(),
          password: form.password,
        },
      }
    );

    if (response?.success) {
      const authToken = response.idToken || (response as any).token || response.user?.uid;
      if (authToken && import.meta.client) {
        localStorage.setItem('anzan_token', authToken);
      }
      if (response.user && import.meta.client) {
        localStorage.setItem('anzan_user', JSON.stringify(response.user));
      }
      successMessage.value = `Welcome back${response.user?.name ? ', ' + response.user.name : ''}! Redirecting to dashboard...`;
      setTimeout(() => {
        navigateTo('/dashboard');
      }, 700);
    } else {
      errorMessage.value = response?.message || 'Login failed. Please verify credentials.';
    }
  } catch (err: any) {
    console.error('Login request failed:', err);
    if (err?.data?.error) {
      errorMessage.value = err.data.error;
    } else if (err?.message) {
      errorMessage.value = err.message;
    } else {
      errorMessage.value = 'Unable to connect to the login service. Please ensure the backend is running.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
