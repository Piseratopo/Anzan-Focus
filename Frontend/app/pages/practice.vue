<template>
  <div class="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
    <AppHeader />

    <main class="w-full pt-16 bg-background flex-1 flex flex-col justify-center">
      <div class="flex flex-col w-full max-w-[1366px] mx-auto px-md md:px-lg py-md md:py-lg justify-center relative">
        <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none"></div>

        <!-- 1. PRE-PRACTICE LOBBY (PLAY BUTTON SCREEN) -->
        <div v-if="gameState === 'idle'" class="w-full max-w-xl mx-auto flex flex-col items-center">
          <div class="w-full bg-surface-container-lowest rounded-2xl shadow-xl p-md md:p-xl border border-surface-variant/60 relative overflow-hidden flex flex-col items-center text-center space-y-md group">
            <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors pointer-events-none"></div>

            <div class="flex flex-col items-center space-y-xs z-10">
              <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-xs shadow-inner">
                <span class="material-symbols-outlined text-3xl">calculate</span>
              </div>
              <h1 class="font-display-lg text-3xl md:text-4xl text-on-surface">Mental Math Practice</h1>
              <p class="font-body-md text-on-surface-variant max-w-md text-sm md:text-base">
                {{ settings.timerType === 'per_operand'
                  ? `Memorize each flashed number across ${totalQuestions} questions and calculate the total.`
                  : `Solve ${totalQuestions} arithmetic expressions under the timer. Test your calculation speed and precision.`
                }}
              </p>
            </div>

            <!-- Current Settings Summary Badges -->
            <div class="w-full bg-surface-container-low p-md rounded-xl flex flex-wrap items-center justify-center gap-sm z-10 border border-surface-variant/40">
              <span class="px-sm py-xs bg-surface rounded-full text-xs font-label-md text-on-surface border border-surface-variant/60 flex items-center gap-xs">
                <span class="material-symbols-outlined text-[15px] text-primary">timer</span>
                <span>{{ settings.timerType === 'per_operand' ? `${settings.speed}s total flash` : `${settings.speed}s per expression` }}</span>
              </span>
              <span class="px-sm py-xs bg-surface rounded-full text-xs font-label-md text-on-surface border border-surface-variant/60 flex items-center gap-xs">
                <span class="material-symbols-outlined text-[15px] text-primary">pin</span>
                <span>{{ settings.operands }} operands</span>
              </span>
              <span class="px-sm py-xs bg-surface rounded-full text-xs font-label-md text-on-surface border border-surface-variant/60 flex items-center gap-xs">
                <span class="material-symbols-outlined text-[15px] text-primary">tune</span>
                <span>Range: {{ settings.minValue }} - {{ settings.maxValue }}</span>
              </span>
              <span class="px-sm py-xs bg-surface rounded-full text-xs font-label-md text-on-surface border border-surface-variant/60 flex items-center gap-xs">
                <span class="material-symbols-outlined text-[15px] text-primary">functions</span>
                <span>{{ settings.operations.join(', ') }}</span>
              </span>
              <span v-if="settings.reducePulse" class="px-sm py-xs bg-surface rounded-full text-xs font-label-md text-on-surface border border-surface-variant/60 flex items-center gap-xs">
                <span class="material-symbols-outlined text-[15px] text-primary">animation</span>
                <span>Linear Zoom (Reduced Pulse)</span>
              </span>
            </div>

            <!-- Big Play / Start Button -->
            <div class="flex flex-col sm:flex-row items-center gap-md w-full justify-center z-10 pt-sm">
              <button 
                type="button" 
                @click="startCountdown"
                class="w-full sm:w-auto px-2xl h-[56px] bg-primary hover:bg-primary/90 text-on-primary rounded-full font-title-md text-title-md shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-sm group/btn"
              >
                <span class="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">play_arrow</span>
                <span>Start</span>
              </button>

              <NuxtLink 
                to="/settings"
                class="w-full sm:w-auto px-xl h-[56px] bg-surface-container hover:bg-surface-variant text-on-surface rounded-full font-title-md text-title-md transition-all active:scale-95 flex items-center justify-center gap-xs border border-surface-variant/60"
              >
                <span class="material-symbols-outlined text-[20px]">tune</span>
                <span>Settings</span>
              </NuxtLink>
            </div>

          </div>
        </div>

        <!-- 2. GET READY COUNTDOWN OVERLAY (3, 2, 1, GO!) -->
        <div v-else-if="gameState === 'countdown'" class="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center py-xl">
          <div class="relative w-32 h-32 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <span class="font-display-xl text-5xl font-bold text-primary animate-ping" :key="countdownNumber">
              {{ countdownNumber > 0 ? countdownNumber : 'GO!' }}
            </span>
          </div>
          <p class="mt-md font-label-md text-on-surface-variant uppercase tracking-widest">Get ready...</p>
        </div>

        <!-- 3. ACTIVE PRACTICE VIEW -->
        <div v-else-if="gameState === 'playing'" class="flex flex-col gap-md w-full mx-auto">
          
          <!-- Header: Question Progress & Live Score Counters -->
          <div class="flex flex-col gap-xs">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-sm">
                <span class="font-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                  Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
                </span>
              </div>

              <div class="flex gap-sm items-center">
                <!-- Correct Counter -->
                <span class="inline-flex items-center gap-xs px-2.5 py-0.5 rounded-full bg-primary-container/20 text-on-primary-container font-label-sm font-semibold">
                  <span class="material-symbols-outlined text-[15px]">check</span> {{ correctCount }}
                </span>
                <!-- Incorrect / Time Up Counter -->
                <span class="inline-flex items-center gap-xs px-2.5 py-0.5 rounded-full bg-error-container/20 text-on-error-container font-label-sm font-semibold">
                  <span class="material-symbols-outlined text-[15px]">close</span> {{ incorrectCount }}
                </span>
                <!-- Exit / Quit Practice Button -->
                <button 
                  type="button" 
                  @click="stopPracticeAndExit"
                  class="ml-1 p-1 text-outline hover:text-error hover:bg-error/10 rounded-full transition-colors"
                  title="Quit Session"
                >
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            <!-- Overall Session Progress Bar -->
            <div class="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div 
                class="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Timer Bar (Per Operand Flash Progress or Whole Expression Countdown) -->
          <div class="flex flex-col gap-xs">
            <div class="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden relative shadow-inner">
              <div 
                class="absolute top-0 left-0 h-full rounded-full transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                :class="[
                  !isPerOperandMode && timerProgressPercent < 25 ? 'bg-error shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-primary'
                ]"
                :style="{ width: `${timerProgressPercent}%` }"
              ></div>
            </div>
            <div class="text-center font-label-sm text-on-surface-variant font-medium text-xs">
              <template v-if="isPerOperandMode">
                <span v-if="isFlashing" class="text-primary font-semibold">
                  Flashing: {{ Math.max(0, totalAllowedTime - elapsedFlashSeconds).toFixed(1) }}s remaining &bull; Number {{ currentFlashIndex + 1 }} of {{ flashItems.length }}
                </span>
                <span v-else class="text-on-surface-variant">
                  <span class="text-primary font-semibold">{{ elapsedTotalSeconds.toFixed(1) }}s</span> elapsed
                </span>
              </template>
              <template v-else>
                <span :class="timerProgressPercent < 25 ? 'text-error font-semibold' : 'text-on-surface-variant'">
                  {{ remainingSeconds.toFixed(1) }}s remaining
                </span>
              </template>
            </div>
          </div>

          <!-- Expression Display Card -->
          <div 
            :class="[
              'bg-surface-container-lowest rounded-xl shadow-lg p-lg md:p-xl flex flex-col items-center justify-center min-h-[170px] border relative overflow-hidden group transition-all duration-300',
              feedbackState === 'correct' ? 'border-primary ring-2 ring-primary/30 bg-primary/5' :
              feedbackState === 'incorrect' ? 'border-error ring-2 ring-error/30 bg-error/5' :
              'border-surface-container-high hover:border-primary/40'
            ]"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-surface-container-low opacity-50 z-0"></div>
            
            <!-- Ambient Card Glow -->
            <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>

            <!-- Content Area: Whole Expression vs Flashing Per Operand -->
            <div class="z-10 relative flex flex-col items-center justify-center text-center px-md min-h-[70px]">
              <!-- 1. Whole Expression Mode OR Feedback State (shows full equation for review) -->
              <template v-if="!isPerOperandMode || Boolean(feedbackState)">
                <h2 class="font-display-xl text-3xl md:text-5xl lg:text-6xl text-on-surface tracking-tight select-none font-bold">
                  {{ currentQuestion?.displayStr }}
                </h2>
              </template>

              <!-- 2. Per Operand Mode: Number Currently Flashing -->
              <template v-else-if="isFlashing">
                <div class="flex flex-col items-center space-y-xs">
                  <span class="text-xs font-label-sm uppercase tracking-widest text-primary font-semibold px-2 py-0.5 rounded-full bg-primary/10 mb-1">
                    Operand {{ currentFlashIndex + 1 }} of {{ flashItems.length }}
                  </span>
                  <div class="min-h-[80px] flex items-center justify-center">
                    <h2 
                      :key="currentFlashIndex"
                      :class="[
                        'font-display-xl text-4xl md:text-6xl lg:text-7xl text-on-surface tracking-tight select-none font-extrabold',
                        settings.reducePulse ? 'flash-number-linear' : 'flash-number-zoom'
                      ]"
                      :style="{ animationDuration: `${zoomDurationMs}ms` }"
                    >
                      {{ currentFlashToken }}
                    </h2>
                  </div>
                </div>
              </template>

              <!-- 3. Per Operand Mode: Flashing Complete (Ready for user's calculation answer) -->
              <template v-else>
                <div class="flex flex-col items-center space-y-xs">
                  <span class="text-xs font-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
                    Flashing Complete
                  </span>
                  <h2 class="font-display-xl text-5xl md:text-7xl text-primary tracking-tight select-none font-bold">
                    ?
                  </h2>
                </div>
              </template>
            </div>

            <!-- Feedback Banner (Instant on submit/timeout) -->
            <div 
              v-if="feedbackState"
              class="z-20 mt-sm flex items-center gap-xs font-label-md px-md py-0.5 rounded-full text-xs md:text-sm font-semibold transition-all animate-bounce"
              :class="feedbackState === 'correct' ? 'bg-primary text-on-primary' : 'bg-error text-on-error'"
            >
              <span class="material-symbols-outlined text-[16px]">
                {{ feedbackState === 'correct' ? 'check_circle' : 'cancel' }}
              </span>
              <span>
                {{ feedbackState === 'correct' ? 'Correct!' : feedbackState === 'time_up' ? `Time's up! Answer: ${formatMinus(currentQuestion?.correctAnswer)}` : `Incorrect! Answer: ${formatMinus(currentQuestion?.correctAnswer)}` }}
              </span>
            </div>
          </div>

          <!-- Answer Input Form (Accepts standard -, unicode −, en-dash –, or em-dash —) -->
          <form @submit.prevent="submitAnswer" class="relative w-full group">
            <input 
              ref="answerInputRef"
              v-model="userAnswer" 
              :disabled="Boolean(feedbackState)"
              type="text"
              inputmode="decimal"
              autofocus
              :placeholder="isPerOperandMode && isFlashing ? 'Flashing numbers... (you can type answer)' : 'Enter your answer'"
              class="w-full bg-surface-container-lowest border-2 border-surface-container-high hover:border-primary/50 rounded-xl py-md px-lg text-center font-headline-lg text-xl md:text-2xl text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 placeholder-on-surface-variant/40 shadow-sm disabled:opacity-75 disabled:cursor-not-allowed" 
            />
            
            <div class="absolute inset-y-0 right-3 flex items-center">
              <button 
                type="submit"
                :disabled="Boolean(feedbackState) || userAnswer.trim() === ''"
                class="bg-primary hover:bg-primary/90 text-on-primary rounded-full p-2 transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                title="Submit Answer"
              >
                <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </form>

        </div>

        <!-- 4. SESSION SUMMARY VIEW (Shown upon completion) -->
        <div v-else-if="gameState === 'completed'" class="w-full mx-auto flex flex-col gap-lg">
          <div class="bg-surface-container-lowest rounded-2xl shadow-xl p-lg md:p-xl border border-surface-variant/60 relative overflow-hidden flex flex-col space-y-lg">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="flex flex-col items-center text-center space-y-xs z-10">
              <div class="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-xs shadow-inner">
                <span class="material-symbols-outlined text-3xl">emoji_events</span>
              </div>
              <h1 class="font-display-lg text-2xl md:text-3xl text-on-surface">Practice Complete!</h1>
              <p class="font-body-md text-on-surface-variant text-sm md:text-base">
                Great job completing your mental math exercise.
              </p>
            </div>

            <!-- Stats Overview Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-md z-10">
              <div class="bg-surface-container-low p-md rounded-xl text-center flex flex-col items-center">
                <span class="font-label-sm text-on-surface-variant uppercase">Accuracy</span>
                <span class="font-headline-lg text-2xl font-bold text-primary">{{ accuracyPercentage }}%</span>
              </div>
              <div class="bg-surface-container-low p-md rounded-xl text-center flex flex-col items-center">
                <span class="font-label-sm text-on-surface-variant uppercase">Correct</span>
                <span class="font-headline-lg text-2xl font-bold text-primary">{{ correctCount }} / {{ totalQuestions }}</span>
              </div>
              <div class="bg-surface-container-low p-md rounded-xl text-center flex flex-col items-center">
                <span class="font-label-sm text-on-surface-variant uppercase">Avg Speed</span>
                <span class="font-headline-lg text-2xl font-bold text-secondary">{{ averageSpeed }}s</span>
              </div>
              <div class="bg-surface-container-low p-md rounded-xl text-center flex flex-col items-center">
                <span class="font-label-sm text-on-surface-variant uppercase">Incorrect</span>
                <span class="font-headline-lg text-2xl font-bold text-error">{{ incorrectCount }}</span>
              </div>
            </div>

            <!-- Question Breakdown Table -->
            <div class="flex flex-col space-y-sm z-10">
              <div class="flex items-center justify-between">
                <h3 class="font-title-md text-title-md text-on-surface">Session Breakdown</h3>
                <span class="text-xs font-label-sm text-on-surface-variant">
                  {{ sessionLogs.length }} questions
                </span>
              </div>

              <div class="w-full border border-surface-variant/60 rounded-xl overflow-hidden shadow-sm bg-surface-container-lowest">
                <div class="overflow-x-auto">
                  <table class="w-full min-w-[560px] text-left border-collapse">
                    <thead>
                      <tr class="bg-surface-container-low/70 border-b border-surface-variant/60 font-label-md text-xs uppercase tracking-wider text-on-surface-variant">
                        <th scope="col" class="py-sm px-md w-16 text-center">#</th>
                        <th scope="col" class="py-sm px-md">Expression</th>
                        <th scope="col" class="py-sm px-md text-center">Your Answer</th>
                        <th scope="col" class="py-sm px-md text-center">Correct</th>
                        <th scope="col" class="py-sm px-md text-center">Time</th>
                        <th scope="col" class="py-sm px-md text-right pr-lg w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-surface-variant/40 font-body-md text-sm">
                      <tr 
                        v-for="(log, idx) in sessionLogs" 
                        :key="idx"
                        class="hover:bg-surface-container-low/40 transition-colors group"
                      >
                        <!-- # Column with status indicator -->
                        <td class="py-sm px-md text-center">
                          <span 
                            class="inline-flex items-center justify-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold"
                            :class="log.status === 'correct' ? 'bg-primary/15 text-primary' : 'bg-error/15 text-error'"
                          >
                            <span class="material-symbols-outlined text-[13px]">
                              {{ log.status === 'correct' ? 'check' : 'close' }}
                            </span>
                            {{ idx + 1 }}
                          </span>
                        </td>

                        <!-- Expression Column -->
                        <!-- Expression Column -->
                        <td class="py-sm px-md font-mono text-sm md:text-base font-medium text-on-surface">
                          <div class="flex items-center gap-xs">
                            <span>{{ formatMinus(log.displayStr || log.expressionStr) }}</span>
                            <span 
                              v-if="log.bookmarked" 
                              class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                              title="Bookmarked"
                            >
                              <span class="material-symbols-outlined text-[11px]" style="font-variation-settings: 'FILL' 1;">bookmark</span>
                              Bookmarked
                            </span>
                          </div>
                        </td>

                        <!-- Your Answer Column -->
                        <td class="py-sm px-md text-center">
                          <span :class="log.status === 'correct' ? 'text-primary font-bold' : 'text-error font-medium line-through'">
                            {{ log.userAnswer !== null ? formatMinus(log.userAnswer) : "Time's up" }}
                          </span>
                        </td>

                        <!-- Correct Answer Column -->
                        <td class="py-sm px-md text-center font-bold text-on-surface">
                          {{ formatMinus(log.correctAnswer) }}
                        </td>

                        <!-- Time Column -->
                        <td class="py-sm px-md text-center font-label-md text-xs text-on-surface-variant font-medium">
                          {{ log.timeTaken.toFixed(1) }}s
                        </td>

                        <!-- Actions Column -->
                        <td class="py-sm px-md text-right pr-lg">
                          <div class="flex items-center justify-end gap-xs">
                            <!-- Bookmark Question -->
                            <button 
                              type="button"
                              @click="handleToggleBookmark(log, idx)"
                              :disabled="log.isBookmarking"
                              :title="log.bookmarked ? 'Bookmarked! Click to remove bookmark' : 'Bookmark question'"
                              class="p-1.5 rounded-md transition-all active:scale-90 flex items-center justify-center"
                              :class="[
                                log.bookmarked 
                                  ? 'text-amber-600 dark:text-amber-400 bg-amber-500/15 hover:bg-amber-500/25' 
                                  : 'text-on-surface-variant hover:text-amber-600 hover:bg-amber-500/10',
                                log.isBookmarking ? 'opacity-70 cursor-wait' : ''
                              ]"
                            >
                              <span v-if="log.isBookmarking" class="material-symbols-outlined text-[18px] animate-spin">
                                progress_activity
                              </span>
                              <span v-else-if="log.bookmarked" class="material-symbols-outlined text-[18px] text-amber-600 dark:text-amber-400" style="font-variation-settings: 'FILL' 1;">
                                bookmark
                              </span>
                              <span v-else class="material-symbols-outlined text-[18px]">
                                bookmark_border
                              </span>
                            </button>

                            <!-- Copy Expression -->
                            <button 
                              type="button"
                              @click="handleAction('copy', log, idx)"
                              :title="copiedIndex === idx ? 'Copied!' : 'Copy expression'"
                              class="p-1 rounded-md transition-colors active:scale-90"
                              :class="copiedIndex === idx ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary hover:bg-primary/10'"
                            >
                              <span class="material-symbols-outlined text-[18px]">
                                {{ copiedIndex === idx ? 'done' : 'content_copy' }}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-md justify-center z-10 pt-md">
              <button 
                type="button" 
                @click="startCountdown"
                class="px-xl py-sm h-12 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-title-md text-title-md shadow-md transition-all active:scale-95 flex items-center justify-center gap-xs"
              >
                <span class="material-symbols-outlined text-[20px]">refresh</span>
                <span>Practice Again</span>
              </button>

              <NuxtLink 
                to="/settings"
                class="px-xl py-sm h-12 rounded-full bg-surface-container hover:bg-surface-variant text-on-surface font-title-md text-title-md transition-all active:scale-95 flex items-center justify-center gap-xs border border-surface-variant/60"
              >
                <span class="material-symbols-outlined text-[20px]">tune</span>
                <span>Adjust Settings</span>
              </NuxtLink>

              <NuxtLink 
                to="/dashboard"
                class="px-xl py-sm h-12 rounded-full bg-surface-container hover:bg-surface-variant text-on-surface font-title-md text-title-md transition-all active:scale-95 flex items-center justify-center gap-xs border border-surface-variant/60"
              >
                <span class="material-symbols-outlined text-[20px]">dashboard</span>
                <span>Dashboard</span>
              </NuxtLink>
            </div>

          </div>
        </div>

      </div>
    </main>

    <!-- Toast Feedback Notification -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div 
        v-if="saveToastMessage" 
        class="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container-high border border-primary/30 text-on-surface shadow-2xl text-sm font-medium backdrop-blur-md"
      >
        <span class="material-symbols-outlined text-primary text-[20px]">{{ saveToastIcon }}</span>
        <span>{{ saveToastMessage }}</span>
      </div>
    </transition>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick } from 'vue';
import { usePracticeSettings } from '~/composables/usePracticeSettings';
import { generateQuestion, type GeneratedQuestion } from '~/utils/expressionGenerator';

const { settings } = usePracticeSettings();

// Game Lifecycle States: 'idle' | 'countdown' | 'playing' | 'completed'
const gameState = ref<'idle' | 'countdown' | 'playing' | 'completed'>('idle');
const countdownNumber = ref(3);

// Session Setup
const totalQuestions = computed(() => Math.max(1, Number(settings.value.questionCount) || 10));
const currentQuestionIndex = ref(0);
const currentQuestion = ref<GeneratedQuestion | null>(null);
const userAnswer = ref('');
const answerInputRef = ref<HTMLInputElement | null>(null);

// Scores & Logs
const correctCount = ref(0);
const incorrectCount = ref(0);
const feedbackState = ref<'' | 'correct' | 'incorrect' | 'time_up'>('');

interface QuestionLog {
  id?: string;
  expressionStr: string;
  displayStr: string;
  operands?: number[];
  operators?: string[];
  userAnswer: number | null;
  correctAnswer: number;
  status: 'correct' | 'incorrect' | 'time_up';
  timeTaken: number;
  settingsSnapshot?: any;
  bookmarked?: boolean;
  isBookmarking?: boolean;
}
const sessionLogs = ref<QuestionLog[]>([]);

// Per Operand Flashing State
const isPerOperandMode = computed(() => settings.value.timerType === 'per_operand');
const isFlashing = ref(false);
const currentFlashIndex = ref(0);
const elapsedFlashSeconds = ref(0);
const elapsedTotalSeconds = ref(0);

// Deconstruct current question into sequential flash items (e.g. ['25', '+ 14', '− 8'])
const flashItems = computed(() => {
  if (!currentQuestion.value) return [];
  const operands = currentQuestion.value.operands || [];
  const operators = currentQuestion.value.operators || [];
  if (operands.length === 0) return [];

  const items: string[] = [];
  const first = operands[0];
  items.push(first < 0 ? `−${Math.abs(first)}` : `${first}`);
  for (let i = 1; i < operands.length; i++) {
    const rawOp = operators[i - 1] || '+';
    const op = (rawOp === '-' || rawOp === '−') ? '−' : rawOp;
    items.push(`${op} ${operands[i]}`);
  }
  return items;
});

const currentFlashToken = computed(() => {
  if (!flashItems.value.length) return '';
  return flashItems.value[currentFlashIndex.value] || '';
});

// Calculate snappy zoom-in animation duration proportional to the per-number flash speed
const zoomDurationMs = computed(() => {
  const count = flashItems.value.length || 1;
  const itemDuration = (totalAllowedTime.value / count) * 1000;
  const ratio = settings.value.reducePulse ? 0.2 : 0.2;
  const maxCap = settings.value.reducePulse ? 60 : 150;
  return Math.min(maxCap, Math.max(10, Math.round(itemDuration * ratio)));
});

// Timer State
// In Per Operand mode, settings.speed is the total allowed time the numbers will be flashed.
// In Whole Expression mode, settings.speed is the allowed time for the entire expression.
const totalAllowedTime = computed(() => Math.max(0.1, Number(settings.value.speed) || 2.5));
const remainingSeconds = ref(totalAllowedTime.value);
let timerInterval: ReturnType<typeof setInterval> | null = null;
let questionStartTime = 0;

const timerProgressPercent = computed(() => {
  if (isPerOperandMode.value) {
    if (totalAllowedTime.value <= 0) return 100;
    if (isFlashing.value) {
      return Math.max(0, Math.min(100, (elapsedFlashSeconds.value / totalAllowedTime.value) * 100));
    }
    return 100;
  }
  if (totalAllowedTime.value <= 0) return 0;
  return Math.max(0, Math.min(100, (remainingSeconds.value / totalAllowedTime.value) * 100));
});

// Summary Computed Stats
const accuracyPercentage = computed(() => {
  if (totalQuestions.value === 0) return 0;
  return Math.round((correctCount.value / totalQuestions.value) * 100);
});

const averageSpeed = computed(() => {
  if (sessionLogs.value.length === 0) return '0.0';
  const totalTime = sessionLogs.value.reduce((acc, log) => acc + log.timeTaken, 0);
  return (totalTime / sessionLogs.value.length).toFixed(1);
});

// Countdown sequence before starting question 1
const startCountdown = () => {
  gameState.value = 'countdown';
  countdownNumber.value = 3;
  correctCount.value = 0;
  incorrectCount.value = 0;
  sessionLogs.value = [];

  const cdTimer = setInterval(() => {
    countdownNumber.value--;
    if (countdownNumber.value <= 0) {
      clearInterval(cdTimer);
      startActualPractice();
    }
  }, 700);
};

const startActualPractice = () => {
  gameState.value = 'playing';
  loadQuestion(0);
};

// Start Question
const loadQuestion = (index: number) => {
  feedbackState.value = '';
  userAnswer.value = '';
  currentQuestionIndex.value = index;
  currentQuestion.value = generateQuestion(settings.value);

  questionStartTime = Date.now();
  remainingSeconds.value = totalAllowedTime.value;
  elapsedTotalSeconds.value = 0;
  elapsedFlashSeconds.value = 0;
  currentFlashIndex.value = 0;
  isFlashing.value = isPerOperandMode.value;

  startTimer();

  nextTick(() => {
    answerInputRef.value?.focus();
  });
};

const startTimer = () => {
  stopTimer();
  const stepMs = 50; // Update every 50ms for smooth animation
  timerInterval = setInterval(() => {
    const elapsedNow = (Date.now() - questionStartTime) / 1000;
    elapsedTotalSeconds.value = elapsedNow;

    if (isPerOperandMode.value) {
      // In Per Operand mode:
      const totalFlash = totalAllowedTime.value;
      const count = flashItems.value.length || 1;
      const itemDuration = totalFlash / count;

      if (elapsedNow < totalFlash) {
        isFlashing.value = true;
        elapsedFlashSeconds.value = elapsedNow;
        currentFlashIndex.value = Math.min(count - 1, Math.floor(elapsedNow / itemDuration));
      } else {
        if (isFlashing.value) {
          isFlashing.value = false;
          elapsedFlashSeconds.value = totalFlash;
          currentFlashIndex.value = count - 1;
          nextTick(() => {
            answerInputRef.value?.focus();
          });
        }
      }
      // Note: There is NO time up in Per Operand mode!
    } else {
      // In Whole Expression mode:
      remainingSeconds.value = Math.max(0, totalAllowedTime.value - elapsedNow);
      if (remainingSeconds.value <= 0) {
        remainingSeconds.value = 0;
        stopTimer();
        handleTimeUp();
      }
    }
  }, stepMs);
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const handleTimeUp = () => {
  // Guard: No time up in Per Operand mode
  if (feedbackState.value || isPerOperandMode.value) return;

  feedbackState.value = 'time_up';
  incorrectCount.value++;

  const timeTaken = totalAllowedTime.value;
  sessionLogs.value.push({
    expressionStr: currentQuestion.value?.expressionStr || '',
    displayStr: currentQuestion.value?.displayStr || '',
    operands: currentQuestion.value?.operands ? [...currentQuestion.value.operands] : [],
    operators: currentQuestion.value?.operators ? [...currentQuestion.value.operators] : [],
    userAnswer: null,
    correctAnswer: currentQuestion.value?.correctAnswer ?? 0,
    status: 'time_up',
    timeTaken,
    settingsSnapshot: { ...settings.value },
    bookmarked: false,
    isBookmarking: false,
  });

  transitionToNext();
};

// Helper to format any string or number to use mathematical minus sign (−) for display
const formatMinus = (val: string | number | null | undefined): string => {
  if (val === null || val === undefined) return '';
  return String(val).replace(/-/g, '−');
};

// Normalizes user input so it can accept standard minus (-), Unicode minus (− \u2212), en dash (– \u2013), em dash (— \u2014), fullwidth minus (－ \uFF0D)
const normalizeAnswerInput = (raw: string): number => {
  if (!raw) return NaN;
  const normalized = raw.replace(/[\u2212\u2013\u2014\uFF0D]/g, '-').trim();
  return Number(normalized);
};

const submitAnswer = () => {
  if (feedbackState.value || !userAnswer.value.trim() || !currentQuestion.value) return;

  const numAnswer = normalizeAnswerInput(userAnswer.value);
  if (isNaN(numAnswer)) {
    showToast('Please enter a valid number', 'error');
    return;
  }

  stopTimer();
  const isCorrect = Math.abs(numAnswer - currentQuestion.value.correctAnswer) < 0.001;
  // Total time includes the display time + answer time
  const timeTaken = Math.max(0.1, (Date.now() - questionStartTime) / 1000);

  if (isCorrect) {
    feedbackState.value = 'correct';
    correctCount.value++;
  } else {
    feedbackState.value = 'incorrect';
    incorrectCount.value++;
  }

  sessionLogs.value.push({
    expressionStr: currentQuestion.value.expressionStr,
    displayStr: currentQuestion.value.displayStr,
    operands: currentQuestion.value.operands ? [...currentQuestion.value.operands] : [],
    operators: currentQuestion.value.operators ? [...currentQuestion.value.operators] : [],
    userAnswer: numAnswer,
    correctAnswer: currentQuestion.value.correctAnswer,
    status: isCorrect ? 'correct' : 'incorrect',
    timeTaken,
    settingsSnapshot: { ...settings.value },
    bookmarked: false,
    isBookmarking: false,
  });

  transitionToNext();
};

const transitionToNext = () => {
  setTimeout(() => {
    if (currentQuestionIndex.value + 1 < totalQuestions.value) {
      loadQuestion(currentQuestionIndex.value + 1);
    } else {
      finishSession();
    }
  }, 900); // 900ms feedback pause before next expression
};

const finishSession = async () => {
  stopTimer();
  gameState.value = 'completed';

  // Automatically save session and all questions to history
  await autoSaveSessionToHistory();
};

const stopPracticeAndExit = () => {
  stopTimer();
  gameState.value = 'idle';
};

// Toast Notification State
const saveToastMessage = ref<string | null>(null);
const saveToastIcon = ref('check_circle');
let toastTimeout: ReturnType<typeof setTimeout> | null = null;

const showToast = (message: string, icon = 'check_circle', duration = 3000) => {
  saveToastMessage.value = message;
  saveToastIcon.value = icon;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    saveToastMessage.value = null;
  }, duration);
};

// Session Breakdown Table Actions
const copiedIndex = ref<number | null>(null);

const handleAction = (actionType: 'copy', log: QuestionLog, index: number) => {
  if (actionType === 'copy') {
    if (import.meta.client && navigator?.clipboard) {
      navigator.clipboard.writeText(`${log.displayStr} = ${log.correctAnswer}`);
      copiedIndex.value = index;
      setTimeout(() => {
        if (copiedIndex.value === index) {
          copiedIndex.value = null;
        }
      }, 1500);
    }
  }
};

/**
 * Automatically records the completed practice session and all its questions into history.
 */
const autoSaveSessionToHistory = async () => {
  if (sessionLogs.value.length === 0) return;

  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || 'http://localhost:3001';
  let token = import.meta.client
    ? localStorage.getItem('anzan_token') || sessionStorage.getItem('anzan_token')
    : null;

  if (!token && import.meta.client) {
    try {
      const userRaw = localStorage.getItem('anzan_user') || sessionStorage.getItem('anzan_user');
      if (userRaw) {
        const parsed = JSON.parse(userRaw);
        if (parsed?.uid) {
          token = parsed.uid;
          localStorage.setItem('anzan_token', token);
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached user for token resolution', e);
    }
  }

  const sessionPayload = {
    session: {
      totalQuestions: sessionLogs.value.length,
      correctCount: correctCount.value,
      incorrectCount: incorrectCount.value,
      timeUpCount: sessionLogs.value.filter((l) => l.status === 'time_up').length,
      averageSpeed: Number(averageSpeed.value),
      operationTags: [settings.value.operation],
      settings: { ...settings.value },
    },
    questionLogs: sessionLogs.value.map((log, idx) => ({
      expressionStr: log.expressionStr,
      displayStr: log.displayStr,
      operands: log.operands || [],
      operators: log.operators || [],
      userAnswer: log.userAnswer,
      correctAnswer: log.correctAnswer,
      status: log.status,
      timeTaken: log.timeTaken,
      bookmarked: Boolean(log.bookmarked),
      questionIndex: idx + 1,
      totalQuestions: sessionLogs.value.length,
      settingsSnapshot: log.settingsSnapshot || { ...settings.value },
    })),
  };

  if (!token) {
    // Guest fallback: store in localStorage
    if (import.meta.client) {
      try {
        const localSessionId = `local_sess_${Date.now()}`;
        const rawSessions = localStorage.getItem('anzan_sessions');
        const sessionsList = rawSessions ? JSON.parse(rawSessions) : [];
        const enrichedLogs = sessionPayload.questionLogs.map((q, i) => ({
          ...q,
          id: `local_q_${Date.now()}_${i}`,
          sessionId: localSessionId,
          createdAt: new Date().toISOString(),
        }));

        sessionsList.unshift({
          sessionId: localSessionId,
          id: localSessionId,
          ...sessionPayload.session,
          questionLogs: enrichedLogs,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('anzan_sessions', JSON.stringify(sessionsList));

        // Also add questions to anzan_saved_questions
        const rawQ = localStorage.getItem('anzan_saved_questions');
        const qList = rawQ ? JSON.parse(rawQ) : [];
        enrichedLogs.forEach((item) => qList.unshift(item));
        localStorage.setItem('anzan_saved_questions', JSON.stringify(qList));

        // Update sessionLogs with local IDs
        enrichedLogs.forEach((item, idx) => {
          if (sessionLogs.value[idx]) {
            sessionLogs.value[idx].id = item.id;
          }
        });
      } catch (e) {
        console.warn('Failed to save session.', e);
      }
    }
    showToast('Session saved!', 'history');
    return;
  }

  try {
    const res = await $fetch<{
      success: boolean;
      sessionId: string;
      questionLogs?: Array<{ id: string }>;
    }>(`${apiBase}/api/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: sessionPayload,
    });

    if (res?.success && Array.isArray(res.questionLogs)) {
      res.questionLogs.forEach((item, idx) => {
        if (sessionLogs.value[idx]) {
          sessionLogs.value[idx].id = item.id;
        }
      });
      showToast('Session saved!', 'history');
    }
  } catch (err) {
    console.error('Failed to save session:', err);
  }
};

/**
 * Toggles the bookmark status of an individual question play.
 */
const handleToggleBookmark = async (log: QuestionLog, index: number) => {
  if (log.isBookmarking) return;
  log.isBookmarking = true;

  const targetState = !Boolean(log.bookmarked);

  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || 'http://localhost:3001';
  let token = import.meta.client
    ? localStorage.getItem('anzan_token') || sessionStorage.getItem('anzan_token')
    : null;

  if (!token && import.meta.client) {
    try {
      const userRaw = localStorage.getItem('anzan_user') || sessionStorage.getItem('anzan_user');
      if (userRaw) {
        const parsed = JSON.parse(userRaw);
        if (parsed?.uid) token = parsed.uid;
      }
    } catch (e) {
      console.warn('Error reading token', e);
    }
  }

  // If question ID is present and user is logged in, sync with API
  if (token && log.id) {
    try {
      await $fetch(`${apiBase}/api/questions/${log.id}/bookmark`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: { bookmarked: targetState },
      });
      log.bookmarked = targetState;
      showToast(
        targetState ? 'Question bookmarked!' : 'Bookmark removed',
        targetState ? 'bookmark_added' : 'bookmark_remove'
      );
    } catch (err: any) {
      console.error('Failed to update bookmark:', err);
      showToast('Failed to update bookmark: ' + (err?.data?.error || err?.message || 'Error'), 'error');
    } finally {
      log.isBookmarking = false;
    }
    return;
  }

  // Guest / local fallback
  if (import.meta.client) {
    try {
      log.bookmarked = targetState;
      const raw = localStorage.getItem('anzan_saved_questions');
      if (raw) {
        const list = JSON.parse(raw);
        const match = list.find(
          (q: any) => q.id === log.id || (q.expressionStr === log.expressionStr && q.correctAnswer === log.correctAnswer)
        );
        if (match) {
          match.bookmarked = targetState;
          localStorage.setItem('anzan_saved_questions', JSON.stringify(list));
        }
      }
      showToast(
        targetState ? 'Question bookmarked locally!' : 'Bookmark removed',
        targetState ? 'bookmark_added' : 'bookmark_remove'
      );
    } catch (e) {
      console.warn('Failed to update local bookmark', e);
    } finally {
      log.isBookmarking = false;
    }
  }
};

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
/* Standard energetic flash zoom with subtle pulse overshoot */
@keyframes flashZoomIn {
  0% {
    transform: scale(0.5);
    opacity: 0.2;
  }
  65% {
    transform: scale(1.08);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Reduced pulse: clean, purely linear zoom directly to normal scale */
@keyframes flashZoomInLinear {
  0% {
    transform: scale(0.65);
    opacity: 0.2;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.flash-number-zoom {
  display: inline-block;
  transform-origin: center center;
  backface-visibility: hidden;
  will-change: transform, opacity;
  animation-name: flashZoomIn;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: both;
}

.flash-number-linear {
  display: inline-block;
  transform-origin: center center;
  backface-visibility: hidden;
  will-change: transform, opacity;
  animation-name: flashZoomInLinear;
  animation-timing-function: linear;
  animation-fill-mode: both;
}
</style>
