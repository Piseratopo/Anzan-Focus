<template>
  <div class="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
    <AppHeader />

    <main class="w-full pt-16 bg-background flex-1">
      <div class="flex flex-col w-full max-w-[1366px] mx-auto px-md md:px-lg py-md md:py-lg space-y-lg md:space-y-xl">

        <!-- Page Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
          <div>
            <h1 class="font-headline-lg text-3xl md:text-4xl text-on-surface tracking-tight mb-xs">Practice History</h1>
            <p class="font-body-md text-on-surface-variant text-sm md:text-base">
              Review past sessions, question breakdowns, and bookmarked exercises.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-sm w-full md:w-auto">
            <!-- View Mode Switcher -->
            <div class="flex items-center bg-surface-container rounded-xl p-1 border border-surface-variant/40 shadow-sm">
              <button
                type="button"
                @click="activeTab = 'sessions'"
                class="px-md py-1.5 rounded-lg font-label-md text-sm transition-all flex items-center gap-xs"
                :class="activeTab === 'sessions' ? 'bg-primary text-on-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'"
              >
                <span class="material-symbols-outlined text-[18px]">table_rows</span>
                <span>Session Breakdown</span>
                <span 
                  v-if="sessions.length > 0"
                  class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                  :class="activeTab === 'sessions' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container-high text-on-surface-variant'"
                >
                  {{ sessions.length }}
                </span>
              </button>
              <button
                type="button"
                @click="activeTab = 'questions'"
                class="px-md py-1.5 rounded-lg font-label-md text-sm transition-all flex items-center gap-xs"
                :class="activeTab === 'questions' ? 'bg-primary text-on-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'"
              >
                <span class="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                <span>All Questions</span>
                <span 
                  v-if="(stats?.total ?? questions.length) > 0"
                  class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                  :class="activeTab === 'questions' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container-high text-on-surface-variant'"
                >
                  {{ stats?.total ?? questions.length }}
                </span>
              </button>
            </div>

            <!-- Filter (Only in Questions View) -->
            <div v-if="activeTab === 'questions'" class="relative w-full sm:w-48 group">
              <select
                id="status-filter"
                v-model="statusFilter"
                @change="onFilterChange"
                class="w-full appearance-none bg-surface-container border border-surface-variant/40 rounded-lg py-sm pl-md pr-xl font-label-md text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
              >
                <option value="">All Questions</option>
                <option value="bookmarked">Bookmarked Only</option>
                <option value="correct">Correct Only</option>
                <option value="incorrect">Incorrect Only</option>
                <option value="time_up">Time Up Only</option>
              </select>
              <span class="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none group-focus-within:text-primary transition-colors text-[20px]">arrow_drop_down</span>
            </div>

            <!-- Refresh Button -->
            <button
              type="button"
              @click="refreshData"
              :disabled="isLoading"
              class="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-sm px-md py-sm rounded-lg border border-surface-variant/40 shadow-sm transition-all active:scale-[0.98] whitespace-nowrap disabled:opacity-70 flex items-center gap-xs"
              title="Refresh"
            >
              <span class="material-symbols-outlined text-[16px]" :class="isLoading ? 'animate-spin' : ''">refresh</span>
              <span class="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <!-- Guest Notice Banner -->
        <div v-if="!isLoggedIn" class="bg-primary/10 border border-primary/20 rounded-xl p-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm text-on-surface">
          <div class="flex items-center gap-sm">
            <span class="material-symbols-outlined text-primary text-[22px]">info</span>
            <span class="font-body-md text-sm text-on-surface-variant">
              You are currently viewing offline history. <NuxtLink to="/login" class="text-primary font-semibold underline hover:no-underline">Sign in</NuxtLink> to sync your sessions and bookmarks across all devices.
            </span>
          </div>
          <NuxtLink
            to="/login"
            class="px-md py-1 rounded-full bg-primary text-on-primary font-label-md text-xs font-semibold whitespace-nowrap hover:bg-primary/90 transition-all shadow-sm"
          >
            Sign In
          </NuxtLink>
        </div>

        <!-- Error State -->
        <div v-if="error && !isLoading" class="bg-error-container rounded-xl p-md flex items-center gap-sm text-on-error-container">
          <span class="material-symbols-outlined text-[20px]">error</span>
          <span class="font-label-md text-sm">{{ error }}</span>
          <button @click="refreshData" class="ml-auto font-label-md text-sm underline hover:no-underline">Retry</button>
        </div>

        <!-- TAB 1: SESSION BREAKDOWN VIEW -->
        <div v-if="activeTab === 'sessions'" class="flex flex-col gap-md">

          <!-- Skeletons -->
          <div v-if="isLoading && sessions.length === 0" class="flex flex-col gap-md animate-pulse">
            <div v-for="n in 3" :key="n" class="bg-surface-container-lowest rounded-2xl p-lg border border-surface-variant/40 space-y-md">
              <div class="flex justify-between items-center">
                <div class="h-6 w-48 bg-surface-container-high rounded"></div>
                <div class="h-8 w-24 bg-surface-container-high rounded-lg"></div>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-sm">
                <div v-for="k in 4" :key="k" class="h-14 bg-surface-container rounded-lg"></div>
              </div>
            </div>
          </div>

          <!-- Empty Sessions State -->
          <div
            v-else-if="!isLoading && sessions.length === 0"
            class="bg-surface-container-lowest p-lg md:p-xl rounded-2xl border border-dashed border-surface-variant flex flex-col items-center justify-center text-center space-y-sm py-xl"
          >
            <span class="material-symbols-outlined text-4xl text-outline-variant">table_rows</span>
            <h3 class="font-title-md text-base md:text-lg text-on-surface">No Practice Sessions Yet</h3>
            <p class="font-label-sm text-xs text-on-surface-variant max-w-sm">
              Complete your first mental math practice session to see its full breakdown here.
            </p>
            <NuxtLink
              to="/practice"
              class="mt-xs px-md py-xs rounded-full bg-primary text-on-primary font-label-md text-sm shadow-md hover:bg-primary/90 transition-all"
            >
              Start Practice Now
            </NuxtLink>
          </div>

          <!-- Session Cards List -->
          <div v-else class="flex flex-col gap-md">
            <div
              v-for="sess in sessions"
              :key="sess.sessionId || sess.id"
              class="bg-surface-container-lowest rounded-2xl border border-surface-variant/50 shadow-[0_4px_20px_rgba(30,41,59,0.04)] overflow-hidden transition-all hover:shadow-[0_8px_25px_rgba(30,41,59,0.08)]"
            >
              <!-- Session Header Summary Card -->
              <div class="p-md md:p-lg flex flex-col gap-md">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-sm border-b border-surface-container pb-sm">
                  <div class="flex items-center gap-sm">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                      <span class="material-symbols-outlined text-[22px]">calculate</span>
                    </div>
                    <div>
                      <div class="flex items-center gap-xs">
                        <h3 class="font-title-md text-base md:text-lg text-on-surface font-semibold">
                          {{ formatSessionTitle(sess) }}
                        </h3>
                        <span 
                          v-if="sess.operationTags?.[0]" 
                          class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container-high text-on-surface-variant uppercase tracking-wider"
                        >
                          {{ sess.operationTags[0] }}
                        </span>
                      </div>
                      <p class="font-label-sm text-xs text-on-surface-variant">
                        {{ formatSessionDate(sess.timestamp) }}
                      </p>
                    </div>
                  </div>

                  <!-- Right controls: Expand Toggle & Delete Session -->
                  <div class="flex items-center gap-sm self-end sm:self-center">
                    <button
                      type="button"
                      @click="toggleSessionExpanded(sess.sessionId || sess.id)"
                      class="flex items-center gap-xs px-md py-1.5 rounded-xl font-label-md text-xs md:text-sm transition-all border border-surface-variant/40 hover:border-primary/40 active:scale-95"
                      :class="isSessionExpanded(sess.sessionId || sess.id) ? 'bg-primary/10 text-primary font-semibold' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'"
                    >
                      <span class="material-symbols-outlined text-[18px]">
                        {{ isSessionExpanded(sess.sessionId || sess.id) ? 'expand_less' : 'expand_more' }}
                      </span>
                      <span>{{ isSessionExpanded(sess.sessionId || sess.id) ? 'Hide Breakdown' : 'Session Breakdown' }}</span>
                      <span class="text-xs font-normal opacity-80">({{ (sess.questionLogs || []).length }} Qs)</span>
                    </button>

                    <button
                      type="button"
                      @click="confirmDeleteSession(sess)"
                      title="Delete Session"
                      class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors active:scale-95"
                    >
                      <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>

                <!-- Session Metrics Tiles -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-sm">
                  <div class="bg-surface p-sm rounded-xl flex flex-col">
                    <span class="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Score</span>
                    <div class="font-headline-lg text-xl md:text-2xl font-bold text-on-surface mt-0.5 flex items-baseline gap-1">
                      <span>{{ sess.correctCount ?? 0 }}</span>
                      <span class="text-xs text-on-surface-variant font-normal">/ {{ sess.totalQuestions ?? (sess.questionLogs || []).length }}</span>
                    </div>
                  </div>

                  <div class="bg-surface p-sm rounded-xl flex flex-col border-t-2 border-primary">
                    <span class="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Accuracy</span>
                    <span 
                      class="font-headline-lg text-xl md:text-2xl font-bold mt-0.5"
                      :class="calcAccuracy(sess) >= 80 ? 'text-primary' : calcAccuracy(sess) >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-error'"
                    >
                      {{ calcAccuracy(sess) }}%
                    </span>
                  </div>

                  <div class="bg-surface p-sm rounded-xl flex flex-col border-t-2 border-secondary">
                    <span class="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Avg Speed</span>
                    <span class="font-headline-lg text-xl md:text-2xl font-bold text-secondary mt-0.5">
                      {{ Number(sess.averageSpeed ?? 0).toFixed(1) }}s
                    </span>
                  </div>

                  <div class="bg-surface p-sm rounded-xl flex flex-col border-t-2 border-error">
                    <span class="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Incorrect / Time Up</span>
                    <div class="font-headline-lg text-xl md:text-2xl font-bold text-error mt-0.5 flex items-baseline gap-1">
                      <span>{{ sess.incorrectCount ?? 0 }}</span>
                      <span v-if="sess.timeUpCount" class="text-xs text-tertiary font-normal">({{ sess.timeUpCount }} slow)</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Expanded Session Breakdown Table -->
              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[2000px]"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 max-h-[2000px]"
                leave-to-class="opacity-0 max-h-0"
              >
                <div 
                  v-if="isSessionExpanded(sess.sessionId || sess.id)" 
                  class="border-t border-surface-variant/40 bg-surface-container-lowest/50 p-md md:p-lg flex flex-col gap-sm"
                >
                  <div class="flex items-center justify-between">
                    <h4 class="font-title-md text-sm md:text-base font-semibold text-on-surface flex items-center gap-xs">
                      <span class="material-symbols-outlined text-primary text-[18px]">list_alt</span>
                      Question-by-Question Breakdown
                    </h4>
                    <span class="font-label-sm text-xs text-on-surface-variant">
                      {{ (sess.questionLogs || []).length }} Total Exercises
                    </span>
                  </div>

                  <div class="w-full border border-surface-variant/50 rounded-xl overflow-hidden shadow-xs bg-surface-container-lowest">
                    <div class="overflow-x-auto">
                      <table class="w-full min-w-[620px] text-left border-collapse">
                        <thead>
                          <tr class="bg-surface-container-low/80 border-b border-surface-variant/50 font-label-md text-xs uppercase tracking-wider text-on-surface-variant">
                            <th scope="col" class="py-sm px-md w-16 text-center">#</th>
                            <th scope="col" class="py-sm px-md">Expression</th>
                            <th scope="col" class="py-sm px-md text-center">Your Answer</th>
                            <th scope="col" class="py-sm px-md text-center">Correct</th>
                            <th scope="col" class="py-sm px-md text-center">Time</th>
                            <th scope="col" class="py-sm px-md text-right pr-lg w-36">Actions</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-surface-variant/40 font-body-md text-sm">
                          <tr 
                            v-for="(log, idx) in (sess.questionLogs || [])" 
                            :key="log.id || idx"
                            class="hover:bg-surface-container-low/40 transition-colors group"
                          >
                            <!-- # Column with Status Badge -->
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

                            <!-- Expression Column with Bookmarked Tag -->
                            <td class="py-sm px-md font-mono text-sm md:text-base font-medium text-on-surface">
                              <div class="flex items-center gap-xs">
                                <span>{{ formatMinus(log.displayStr || log.expressionStr) }}</span>
                                <span 
                                  v-if="log.bookmarked" 
                                  class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                                  title="Bookmarked Exercise"
                                >
                                  <span class="material-symbols-outlined text-[11px]" style="font-variation-settings: 'FILL' 1;">bookmark</span>
                                  Bookmarked
                                </span>
                              </div>
                            </td>

                            <!-- User Answer -->
                            <td class="py-sm px-md text-center">
                              <span :class="log.status === 'correct' ? 'text-primary font-bold' : 'text-error font-medium line-through'">
                                {{ log.userAnswer !== null && log.userAnswer !== undefined ? formatMinus(log.userAnswer) : "Time's up" }}
                              </span>
                            </td>

                            <!-- Correct Answer -->
                            <td class="py-sm px-md text-center font-bold text-on-surface">
                              {{ formatMinus(log.correctAnswer) }}
                            </td>

                            <!-- Time Taken -->
                            <td class="py-sm px-md text-center font-label-md text-xs text-on-surface-variant font-medium">
                              {{ Number(log.timeTaken ?? 0).toFixed(1) }}s
                            </td>

                            <!-- Actions (Bookmark, Copy, Replay) -->
                            <td class="py-sm px-md text-right pr-lg">
                              <div class="flex items-center justify-end gap-xs">
                                <!-- Bookmark Toggle Button -->
                                <button 
                                  type="button"
                                  @click="toggleQuestionBookmark(log)"
                                  :title="log.bookmarked ? 'Remove Bookmark' : 'Bookmark Question'"
                                  class="p-1.5 rounded-md transition-all active:scale-90 flex items-center justify-center"
                                  :class="[
                                    log.bookmarked 
                                      ? 'text-amber-600 dark:text-amber-400 bg-amber-500/15 hover:bg-amber-500/25' 
                                      : 'text-on-surface-variant hover:text-amber-600 hover:bg-amber-500/10'
                                  ]"
                                >
                                  <span 
                                    class="material-symbols-outlined text-[18px]"
                                    :style="log.bookmarked ? { fontVariationSettings: `'FILL' 1` } : {}"
                                  >
                                    {{ log.bookmarked ? 'bookmark' : 'bookmark_border' }}
                                  </span>
                                </button>

                                <!-- Copy Expression -->
                                <button 
                                  type="button"
                                  @click="copyLog(log)"
                                  title="Copy Expression"
                                  class="p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors active:scale-90"
                                >
                                  <span class="material-symbols-outlined text-[18px]">content_copy</span>
                                </button>

                                <!-- Replay Question -->
                                <NuxtLink
                                  to="/practice"
                                  title="Replay in Practice"
                                  class="p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors active:scale-90 flex items-center"
                                >
                                  <span class="material-symbols-outlined text-[18px]">play_arrow</span>
                                </NuxtLink>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- TAB 2: ALL QUESTIONS VIEW -->
        <div v-else class="flex flex-col gap-lg">

          <!-- Overall Statistics Card -->
          <div class="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] p-lg flex flex-col gap-md">
            <h2 class="font-title-md text-title-md text-on-surface border-b border-surface-container pb-sm">Overall Question Statistics</h2>
            
            <div v-if="isLoading && !stats" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-md">
              <div v-for="n in 5" :key="n" class="flex flex-col bg-surface p-sm rounded-lg animate-pulse">
                <div class="h-3 w-20 bg-surface-container-high rounded mb-xs"></div>
                <div class="h-8 w-10 bg-surface-container-high rounded mt-xs"></div>
              </div>
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-md">
              <div class="flex flex-col bg-surface p-sm rounded-lg">
                <span class="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Total Played</span>
                <span class="font-headline-lg text-2xl md:text-3xl text-on-surface mt-xs">{{ stats?.total ?? 0 }}</span>
              </div>
              <div class="flex flex-col bg-surface p-sm rounded-lg border-t-2 border-primary">
                <span class="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Correct</span>
                <span class="font-headline-lg text-2xl md:text-3xl text-primary mt-xs">{{ stats?.correct ?? 0 }}</span>
              </div>
              <div class="flex flex-col bg-surface p-sm rounded-lg border-t-2 border-error">
                <span class="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Incorrect</span>
                <span class="font-headline-lg text-2xl md:text-3xl text-error mt-xs">{{ stats?.incorrect ?? 0 }}</span>
              </div>
              <div class="flex flex-col bg-surface p-sm rounded-lg border-t-2 border-tertiary">
                <span class="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Time Up</span>
                <span class="font-headline-lg text-2xl md:text-3xl text-tertiary mt-xs">{{ stats?.time_up ?? 0 }}</span>
              </div>
              <div class="flex flex-col bg-surface p-sm rounded-lg border-t-2 border-amber-500">
                <span class="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <span class="material-symbols-outlined text-[13px] text-amber-600 dark:text-amber-400" style="font-variation-settings: 'FILL' 1;">bookmark</span>
                  Bookmarked
                </span>
                <span class="font-headline-lg text-2xl md:text-3xl text-amber-600 dark:text-amber-400 mt-xs">
                  {{ stats?.bookmarked ?? questions.filter(q => q.bookmarked).length }}
                </span>
              </div>
            </div>
          </div>

          <!-- Questions List -->
          <div class="flex flex-col gap-sm">

            <!-- Loading Skeletons -->
            <template v-if="isLoading && questions.length === 0">
              <div
                v-for="n in 5"
                :key="n"
                class="bg-surface-container-lowest rounded-xl p-md flex flex-col md:flex-row items-start md:items-center justify-between gap-md animate-pulse"
              >
                <div class="flex-1 pl-sm flex flex-col gap-xs">
                  <div class="h-6 bg-surface-container-high rounded w-3/4"></div>
                  <div class="h-3 bg-surface-container-high rounded w-1/3"></div>
                </div>
                <div class="flex gap-sm">
                  <div class="h-8 w-20 bg-surface-container-high rounded-lg"></div>
                  <div class="h-8 w-8 bg-surface-container-high rounded-lg"></div>
                </div>
              </div>
            </template>

            <!-- Empty Questions State -->
            <div
              v-else-if="!isLoading && questions.length === 0"
              class="bg-surface-container-lowest p-lg md:p-xl rounded-2xl border border-dashed border-surface-variant flex flex-col items-center justify-center text-center space-y-sm py-xl"
            >
              <span class="material-symbols-outlined text-4xl text-outline-variant">history</span>
              <h3 class="font-title-md text-base md:text-lg text-on-surface">
                {{ statusFilter ? 'No matching questions found' : 'No Practice Questions Yet' }}
              </h3>
              <p class="font-label-sm text-xs text-on-surface-variant max-w-sm">
                {{ statusFilter
                  ? 'Try clearing your filter or selecting a different status option.'
                  : 'Start a practice session to automatically record all questions here.'
                }}
              </p>
              <button
                v-if="statusFilter"
                type="button"
                @click="statusFilter = ''; onFilterChange()"
                class="mt-xs px-md py-xs rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-sm transition-all"
              >
                Clear Filter
              </button>
              <NuxtLink
                v-else
                to="/practice"
                class="mt-xs px-md py-xs rounded-full bg-primary text-on-primary font-label-md text-sm shadow-md hover:bg-primary/90 transition-all"
              >
                Start Practice Now
              </NuxtLink>
            </div>

            <!-- Question Items Cards -->
            <template v-else>
              <div
                v-for="q in questions"
                :key="q.id"
                class="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] p-md flex flex-col md:flex-row items-start md:items-center justify-between gap-md relative overflow-hidden group hover:shadow-[0_10px_25px_rgba(30,41,59,0.1)] transition-shadow"
              >
                <!-- Status color strip -->
                <div
                  class="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                  :class="{
                    'bg-primary': q.status === 'correct',
                    'bg-error': q.status === 'incorrect',
                    'bg-tertiary': q.status === 'time_up',
                  }"
                ></div>

                <!-- Question Info -->
                <div class="flex flex-col gap-xs flex-1 w-full overflow-hidden pl-sm min-w-0">
                  <div class="flex items-center gap-sm flex-wrap">
                    <span class="font-mono text-base md:text-lg lg:text-xl text-on-surface font-semibold tracking-tight">
                      {{ formatMinus(q.displayStr || q.expressionStr || '—') }}
                    </span>

                    <!-- Bookmarked Tag Badge -->
                    <span
                      v-if="q.bookmarked"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 shadow-2xs"
                    >
                      <span class="material-symbols-outlined text-[13px]" style="font-variation-settings: 'FILL' 1;">bookmark</span>
                      Bookmarked
                    </span>
                  </div>

                  <div class="flex flex-wrap items-center gap-sm mt-0.5">
                    <span class="font-label-sm text-xs text-on-surface-variant">
                      {{ q.createdAt ? new Date(q.createdAt).toLocaleString() : '' }}
                    </span>

                    <!-- Status Badge -->
                    <span
                      class="inline-flex items-center gap-xs px-2 py-0.5 rounded-full font-label-sm text-[10px] tracking-wider uppercase font-semibold"
                      :class="{
                        'bg-primary/15 text-primary': q.status === 'correct',
                        'bg-error/15 text-error': q.status === 'incorrect',
                        'bg-tertiary/15 text-tertiary': q.status === 'time_up',
                      }"
                    >
                      <span class="material-symbols-outlined text-[11px]">
                        {{ q.status === 'correct' ? 'check_circle' : q.status === 'time_up' ? 'timer_off' : 'cancel' }}
                      </span>
                      {{ q.status === 'time_up' ? 'Time Up' : q.status === 'correct' ? 'Correct' : 'Incorrect' }}
                    </span>

                    <!-- Answer info -->
                    <span v-if="q.status !== 'time_up'" class="font-label-sm text-xs text-on-surface-variant">
                      Your answer:
                      <span :class="q.status === 'correct' ? 'text-primary font-medium' : 'text-error font-medium'">{{ formatMinus(q.userAnswer ?? '—') }}</span>
                      &bull; Correct: <span class="text-on-surface font-medium">{{ formatMinus(q.correctAnswer) }}</span>
                    </span>
                    <span v-else class="font-label-sm text-xs text-on-surface-variant">
                      Answer: <span class="text-on-surface font-medium">{{ formatMinus(q.correctAnswer) }}</span>
                    </span>

                    <!-- Time taken -->
                    <span v-if="q.timeTaken !== undefined" class="font-label-sm text-xs text-on-surface-variant/70 flex items-center gap-xs">
                      <span class="material-symbols-outlined text-[11px]">timer</span>{{ Number(q.timeTaken).toFixed(1) }}s
                    </span>
                  </div>
                </div>

                <!-- Actions: Bookmark Toggle, Replay, Delete -->
                <div class="flex items-center gap-sm w-full md:w-auto mt-sm md:mt-0 flex-shrink-0">
                  <!-- Bookmark Button -->
                  <button
                    type="button"
                    @click="toggleQuestionBookmark(q)"
                    :title="q.bookmarked ? 'Remove Bookmark' : 'Bookmark Question'"
                    class="p-sm rounded-lg transition-colors active:scale-95 flex items-center justify-center"
                    :class="[
                      q.bookmarked
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-500/15 hover:bg-amber-500/25'
                        : 'text-on-surface-variant hover:text-amber-600 hover:bg-amber-500/10'
                    ]"
                  >
                    <span 
                      class="material-symbols-outlined text-[20px]"
                      :style="q.bookmarked ? { fontVariationSettings: `'FILL' 1` } : {}"
                    >
                      {{ q.bookmarked ? 'bookmark' : 'bookmark_border' }}
                    </span>
                  </button>

                  <NuxtLink
                    to="/practice"
                    class="flex-1 md:flex-none flex items-center justify-center gap-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-sm px-md py-sm rounded-lg transition-colors active:scale-[0.98]"
                  >
                    <span class="material-symbols-outlined text-[18px]">play_arrow</span>
                    Replay
                  </NuxtLink>

                  <button
                    type="button"
                    :disabled="deletingId === q.id"
                    @click="confirmDeleteQuestion(q)"
                    aria-label="Delete question"
                    class="p-sm text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors active:scale-[0.98] disabled:opacity-40"
                  >
                    <span class="material-symbols-outlined text-[20px]">
                      {{ deletingId === q.id ? 'progress_activity' : 'delete' }}
                    </span>
                  </button>
                </div>
              </div>
            </template>

          </div>

          <!-- Load More -->
          <div v-if="hasMore" class="flex justify-center mt-md">
            <button
              type="button"
              @click="loadMoreQuestions"
              :disabled="isLoadingMore"
              class="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-sm px-xl py-sm rounded-full transition-colors active:scale-[0.98] flex items-center gap-xs disabled:opacity-70"
            >
              <span class="material-symbols-outlined text-[16px]">{{ isLoadingMore ? 'progress_activity' : 'expand_more' }}</span>
              {{ isLoadingMore ? 'Loading...' : 'Load More Questions' }}
            </button>
          </div>

        </div>

      </div>
    </main>

    <!-- Delete Question Confirmation Modal -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-md">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="deleteTarget = null"></div>
        <div class="relative bg-surface-container-lowest rounded-2xl p-lg max-w-sm w-full shadow-2xl flex flex-col gap-md z-10">
          <div class="flex items-center gap-sm">
            <div class="w-10 h-10 rounded-full bg-error-container flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-error text-xl">delete</span>
            </div>
            <div>
              <h3 class="font-title-md text-base text-on-surface">Delete Question?</h3>
              <p class="font-label-sm text-xs text-on-surface-variant mt-0.5">This cannot be undone.</p>
            </div>
          </div>
          <p class="font-body-md text-sm text-on-surface-variant bg-surface-container rounded-lg px-md py-sm font-mono truncate">
            {{ deleteTarget?.displayStr || deleteTarget?.expressionStr }}
          </p>
          <div class="flex gap-sm justify-end">
            <button
              type="button"
              @click="deleteTarget = null"
              class="px-lg py-sm rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="deleteQuestion(deleteTarget!)"
              class="px-lg py-sm rounded-full bg-error hover:bg-error/90 text-on-error font-label-md text-sm shadow-sm transition-all active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Session Confirmation Modal -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="deleteSessionTarget" class="fixed inset-0 z-50 flex items-center justify-center p-md">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="deleteSessionTarget = null"></div>
        <div class="relative bg-surface-container-lowest rounded-2xl p-lg max-w-sm w-full shadow-2xl flex flex-col gap-md z-10">
          <div class="flex items-center gap-sm">
            <div class="w-10 h-10 rounded-full bg-error-container flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-error text-xl">delete_sweep</span>
            </div>
            <div>
              <h3 class="font-title-md text-base text-on-surface">Delete Entire Session?</h3>
              <p class="font-label-sm text-xs text-on-surface-variant mt-0.5">
                Removes this session and all its recorded questions.
              </p>
            </div>
          </div>
          <div class="flex gap-sm justify-end">
            <button
              type="button"
              @click="deleteSessionTarget = null"
              class="px-lg py-sm rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="deleteSession(deleteSessionTarget!)"
              class="px-lg py-sm rounded-full bg-error hover:bg-error/90 text-on-error font-label-md text-sm shadow-sm transition-all active:scale-95"
            >
              Delete Session
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast Notification -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="toast.message"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container-high border text-on-surface shadow-2xl text-sm font-medium backdrop-blur-md"
        :class="toast.type === 'error' ? 'border-error/30' : 'border-primary/30'"
      >
        <span
          class="material-symbols-outlined text-[20px]"
          :class="toast.type === 'error' ? 'text-error' : 'text-primary'"
        >
          {{ toast.type === 'error' ? 'error' : 'check_circle' }}
        </span>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

useHead({ title: 'Practice History & Sessions — Anzan Focus' });

// ── Types ──────────────────────────────────────────────────────────────────
interface QuestionItem {
  id?: string;
  sessionId?: string | null;
  expressionStr: string;
  displayStr: string;
  operands?: number[];
  operators?: string[];
  userAnswer: number | null;
  correctAnswer: number;
  status: 'correct' | 'incorrect' | 'time_up';
  timeTaken: number;
  bookmarked?: boolean;
  createdAt?: string | null;
  settings?: any;
}

interface PracticeSession {
  sessionId: string;
  id?: string;
  timestamp: string | null;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  timeUpCount: number;
  averageSpeed: number;
  operationTags?: string[];
  settings?: any;
  questionLogs?: QuestionItem[];
}

interface Stats {
  total: number;
  correct: number;
  incorrect: number;
  time_up: number;
  bookmarked: number;
}

// ── State ──────────────────────────────────────────────────────────────────
const config = useRuntimeConfig();
const apiBase = computed(() => (config.public?.apiBase as string) || 'http://localhost:3001');

const activeTab = ref<'sessions' | 'questions'>('sessions');

const isLoggedIn = ref(false);
const token = ref<string | null>(null);

const sessions = ref<PracticeSession[]>([]);
const expandedSessionIds = ref<Set<string>>(new Set());

const questions = ref<QuestionItem[]>([]);
const stats = ref<Stats | null>(null);
const hasMore = ref(false);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref('');

const statusFilter = ref('');
const currentLimit = ref(25);

const deletingId = ref<string | null>(null);
const deleteTarget = ref<QuestionItem | null>(null);
const deleteSessionTarget = ref<PracticeSession | null>(null);

const toast = ref<{ message: string; type: 'success' | 'error' }>({ message: '', type: 'success' });
let toastTimer: ReturnType<typeof setTimeout> | null = null;

// ── Toast ──────────────────────────────────────────────────────────────────
function showToast(message: string, type: 'success' | 'error' = 'success') {
  if (toastTimer) clearTimeout(toastTimer);
  toast.value = { message, type };
  toastTimer = setTimeout(() => { toast.value = { message: '', type: 'success' }; }, 3000);
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatMinus(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  return String(val).replace(/-/g, '−');
}

function formatSessionTitle(sess: PracticeSession): string {
  const op = sess.operationTags?.[0] || sess.settings?.operation || 'Mental Math';
  const digits = sess.settings?.digits || 'Standard';
  return `${op} Practice (${digits} digits)`;
}

function formatSessionDate(ts: string | null): string {
  if (!ts) return '';
  const d = new Date(ts);
  return isNaN(d.getTime()) ? '' : d.toLocaleString();
}

function calcAccuracy(sess: PracticeSession): number {
  const total = sess.totalQuestions || (sess.questionLogs || []).length || 1;
  const correct = sess.correctCount ?? 0;
  return Math.round((correct / total) * 100);
}

function isSessionExpanded(id: string): boolean {
  return expandedSessionIds.value.has(id);
}

function toggleSessionExpanded(id: string) {
  if (expandedSessionIds.value.has(id)) {
    expandedSessionIds.value.delete(id);
  } else {
    expandedSessionIds.value.add(id);
  }
}

function copyLog(log: QuestionItem) {
  if (import.meta.client && navigator?.clipboard) {
    navigator.clipboard.writeText(`${log.displayStr || log.expressionStr} = ${log.correctAnswer}`);
    showToast('Expression copied to clipboard!');
  }
}

// ── Data Fetching ──────────────────────────────────────────────────────────
async function refreshData() {
  await Promise.all([loadSessions(), loadQuestions(true)]);
}

async function loadSessions() {
  if (!token.value) {
    // Guest fallback: load from localStorage
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem('anzan_sessions');
        sessions.value = raw ? JSON.parse(raw) : [];
        // Auto-expand the first session if available
        if (sessions.value.length > 0) {
          expandedSessionIds.value.add(sessions.value[0].sessionId || sessions.value[0].id || '');
        }
      } catch (e) {
        console.warn('Error reading local sessions', e);
      }
    }
    return;
  }

  try {
    const res = await $fetch<{ success: boolean; sessions: PracticeSession[] }>(
      `${apiBase.value}/api/sessions`,
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
    if (res?.success) {
      sessions.value = res.sessions ?? [];
      // Auto-expand the most recent session
      if (sessions.value.length > 0 && expandedSessionIds.value.size === 0) {
        expandedSessionIds.value.add(sessions.value[0].sessionId || sessions.value[0].id || '');
      }
    }
  } catch (err: any) {
    console.warn('Failed to load sessions from API:', err);
  }
}

async function loadQuestions(reset = false) {
  if (reset) {
    currentLimit.value = 25;
    questions.value = [];
  }
  isLoading.value = true;
  error.value = '';

  if (!token.value) {
    // Guest fallback: load from localStorage
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem('anzan_saved_questions');
        const allList: QuestionItem[] = raw ? JSON.parse(raw) : [];

        stats.value = {
          total: allList.length,
          correct: allList.filter((q) => q.status === 'correct').length,
          incorrect: allList.filter((q) => q.status === 'incorrect').length,
          time_up: allList.filter((q) => q.status === 'time_up').length,
          bookmarked: allList.filter((q) => Boolean(q.bookmarked)).length,
        };

        let filtered = allList;
        if (statusFilter.value === 'bookmarked') {
          filtered = allList.filter((q) => Boolean(q.bookmarked));
        } else if (statusFilter.value) {
          filtered = allList.filter((q) => q.status === statusFilter.value);
        }

        hasMore.value = filtered.length > currentLimit.value;
        questions.value = filtered.slice(0, currentLimit.value);
      } catch (e) {
        console.warn('Error reading local questions', e);
      }
    }
    isLoading.value = false;
    return;
  }

  try {
    const params = new URLSearchParams({ limit: String(currentLimit.value) });
    if (statusFilter.value === 'bookmarked') {
      params.set('bookmarked', 'true');
    } else if (statusFilter.value) {
      params.set('status', statusFilter.value);
    }

    const res = await $fetch<{
      success: boolean;
      questions: QuestionItem[];
      stats: Stats;
      hasMore: boolean;
    }>(`${apiBase.value}/api/questions/saved?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (res?.success) {
      questions.value = res.questions ?? [];
      stats.value = res.stats ?? null;
      hasMore.value = res.hasMore ?? false;
    } else {
      error.value = 'Failed to load questions.';
    }
  } catch (err: any) {
    const msg = err?.data?.error || err?.message || 'Failed to load questions.';
    error.value = msg;
  } finally {
    isLoading.value = false;
  }
}

async function loadMoreQuestions() {
  if (isLoadingMore.value) return;
  isLoadingMore.value = true;
  currentLimit.value += 25;

  if (!token.value) {
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem('anzan_saved_questions');
        const allList: QuestionItem[] = raw ? JSON.parse(raw) : [];
        let filtered = allList;
        if (statusFilter.value === 'bookmarked') {
          filtered = allList.filter((q) => Boolean(q.bookmarked));
        } else if (statusFilter.value) {
          filtered = allList.filter((q) => q.status === statusFilter.value);
        }
        hasMore.value = filtered.length > currentLimit.value;
        questions.value = filtered.slice(0, currentLimit.value);
      } catch {}
    }
    isLoadingMore.value = false;
    return;
  }

  try {
    const params = new URLSearchParams({ limit: String(currentLimit.value) });
    if (statusFilter.value === 'bookmarked') {
      params.set('bookmarked', 'true');
    } else if (statusFilter.value) {
      params.set('status', statusFilter.value);
    }

    const res = await $fetch<{
      success: boolean;
      questions: QuestionItem[];
      stats: Stats;
      hasMore: boolean;
    }>(`${apiBase.value}/api/questions/saved?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (res?.success) {
      questions.value = res.questions ?? [];
      stats.value = res.stats ?? null;
      hasMore.value = res.hasMore ?? false;
    }
  } catch {
    showToast('Failed to load more questions.', 'error');
  } finally {
    isLoadingMore.value = false;
  }
}

function onFilterChange() {
  loadQuestions(true);
}

// ── Bookmark Toggle ────────────────────────────────────────────────────────
async function toggleQuestionBookmark(q: QuestionItem) {
  const targetState = !Boolean(q.bookmarked);
  q.bookmarked = targetState;

  // Also update inside sessions.questionLogs if present
  sessions.value.forEach((sess) => {
    (sess.questionLogs || []).forEach((log) => {
      if (log.id && log.id === q.id) {
        log.bookmarked = targetState;
      } else if (log.displayStr === q.displayStr && log.correctAnswer === q.correctAnswer) {
        log.bookmarked = targetState;
      }
    });
  });

  // Update local stats
  if (stats.value) {
    stats.value.bookmarked = Math.max(0, stats.value.bookmarked + (targetState ? 1 : -1));
  }

  if (!token.value) {
    // Guest fallback
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem('anzan_saved_questions');
        if (raw) {
          const list = JSON.parse(raw);
          const item = list.find((item: any) => item.id === q.id || (item.displayStr === q.displayStr && item.correctAnswer === q.correctAnswer));
          if (item) item.bookmarked = targetState;
          localStorage.setItem('anzan_saved_questions', JSON.stringify(list));
        }

        const rawSess = localStorage.getItem('anzan_sessions');
        if (rawSess) {
          const sessList = JSON.parse(rawSess);
          sessList.forEach((s: any) => {
            (s.questionLogs || []).forEach((log: any) => {
              if (log.id === q.id || (log.displayStr === q.displayStr && log.correctAnswer === q.correctAnswer)) {
                log.bookmarked = targetState;
              }
            });
          });
          localStorage.setItem('anzan_sessions', JSON.stringify(sessList));
        }
      } catch (e) {
        console.warn('Error saving local bookmark:', e);
      }
    }
    showToast(targetState ? 'Question bookmarked!' : 'Bookmark removed', 'success');
    return;
  }

  if (q.id) {
    try {
      await $fetch(`${apiBase.value}/api/questions/${q.id}/bookmark`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
        body: { bookmarked: targetState },
      });
      showToast(targetState ? 'Question bookmarked!' : 'Bookmark removed', 'success');
    } catch (err: any) {
      q.bookmarked = !targetState; // rollback
      showToast(err?.data?.error || 'Failed to update bookmark.', 'error');
    }
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────
function confirmDeleteQuestion(q: QuestionItem) {
  deleteTarget.value = q;
}

async function deleteQuestion(q: QuestionItem) {
  deleteTarget.value = null;
  deletingId.value = q.id || '';

  if (!token.value) {
    // Guest delete
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem('anzan_saved_questions');
        if (raw) {
          const list = JSON.parse(raw);
          const updated = list.filter((item: any) => item.id !== q.id);
          localStorage.setItem('anzan_saved_questions', JSON.stringify(updated));
        }
      } catch {}
    }
    questions.value = questions.value.filter((item) => item.id !== q.id);
    if (stats.value) {
      stats.value.total = Math.max(0, stats.value.total - 1);
      if (q.status === 'correct') stats.value.correct = Math.max(0, stats.value.correct - 1);
      if (q.status === 'incorrect') stats.value.incorrect = Math.max(0, stats.value.incorrect - 1);
      if (q.status === 'time_up') stats.value.time_up = Math.max(0, stats.value.time_up - 1);
      if (q.bookmarked) stats.value.bookmarked = Math.max(0, stats.value.bookmarked - 1);
    }
    deletingId.value = null;
    showToast('Question deleted.', 'success');
    return;
  }

  try {
    await $fetch(`${apiBase.value}/api/questions/saved/${q.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    });
    questions.value = questions.value.filter((item) => item.id !== q.id);
    if (stats.value) {
      stats.value.total = Math.max(0, stats.value.total - 1);
      if (q.status === 'correct') stats.value.correct = Math.max(0, stats.value.correct - 1);
      if (q.status === 'incorrect') stats.value.incorrect = Math.max(0, stats.value.incorrect - 1);
      if (q.status === 'time_up') stats.value.time_up = Math.max(0, stats.value.time_up - 1);
      if (q.bookmarked) stats.value.bookmarked = Math.max(0, stats.value.bookmarked - 1);
    }
    showToast('Question deleted successfully.', 'success');
  } catch (err: any) {
    showToast(err?.data?.error || 'Failed to delete question.', 'error');
  } finally {
    deletingId.value = null;
  }
}

function confirmDeleteSession(sess: PracticeSession) {
  deleteSessionTarget.value = sess;
}

async function deleteSession(sess: PracticeSession) {
  deleteSessionTarget.value = null;
  const targetId = sess.sessionId || sess.id;
  if (!targetId) return;

  if (!token.value) {
    // Guest local delete
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem('anzan_sessions');
        if (raw) {
          const list = JSON.parse(raw);
          const updated = list.filter((s: any) => (s.sessionId || s.id) !== targetId);
          localStorage.setItem('anzan_sessions', JSON.stringify(updated));
        }
      } catch {}
    }
    sessions.value = sessions.value.filter((s) => (s.sessionId || s.id) !== targetId);
    showToast('Session removed from history.', 'success');
    return;
  }

  try {
    await $fetch(`${apiBase.value}/api/sessions/${targetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    });
    sessions.value = sessions.value.filter((s) => (s.sessionId || s.id) !== targetId);
    // Also reload questions to reflect deletion of associated questions
    loadQuestions(true);
    showToast('Session and associated questions removed.', 'success');
  } catch (err: any) {
    showToast(err?.data?.error || 'Failed to delete session.', 'error');
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  if (import.meta.client) {
    const stored = localStorage.getItem('anzan_token') || sessionStorage.getItem('anzan_token');
    token.value = stored;
    isLoggedIn.value = Boolean(stored);

    // If token not directly present, check cached user
    if (!stored) {
      try {
        const rawUser = localStorage.getItem('anzan_user') || sessionStorage.getItem('anzan_user');
        if (rawUser) {
          const u = JSON.parse(rawUser);
          if (u?.uid) {
            token.value = u.uid;
            isLoggedIn.value = true;
          }
        }
      } catch {}
    }

    refreshData();
  }
});
</script>
