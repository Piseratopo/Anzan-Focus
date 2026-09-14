<template>
  <div class="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
    <AppHeader />

    <main class="w-full pt-16 bg-background flex-1">
      <div class="flex flex-col w-full max-w-[1366px] mx-auto px-md md:px-lg py-md md:py-lg space-y-lg md:space-y-xl">
        <!-- Page Title -->
        <div class="flex flex-col space-y-xs text-center md:text-left">
          <h1 class="font-display-lg text-3xl md:text-4xl text-on-surface">Practice Settings</h1>
          <p class="font-body-md text-on-surface-variant max-w-2xl text-sm md:text-base">
            Configure your mental math session parameters to dial in the perfect level of cognitive challenge.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-md lg:gap-lg">
          <!-- Left Column: Game Rules -->
          <div class="lg:col-span-8 flex flex-col space-y-md md:space-y-lg">
            
            <!-- Operations Section Box -->
            <section class="bg-surface-container-lowest rounded-xl shadow-sm p-md md:p-lg flex flex-col space-y-md relative overflow-hidden group border border-surface-variant/60 hover:border-primary/50 hover:shadow-md transition-all duration-300">
              <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-500 pointer-events-none"></div>
              
              <div class="flex items-center space-x-sm border-b-2 border-surface-container-high pb-xs z-10">
                <span class="material-symbols-outlined text-primary text-[24px]">calculate</span>
                <h2 class="font-headline-lg-mobile text-title-md text-on-surface">Operations</h2>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-md z-10">
                <!-- Addition -->
                <button
                  type="button"
                  @click="toggleOperation('addition')"
                  :class="[
                    'relative flex items-center justify-center p-md rounded-lg border-2 cursor-pointer transition-all duration-200 bg-surface-container-lowest text-left hover:scale-[1.03] active:scale-[0.97]',
                    settings.operations.includes('addition') 
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20' 
                      : 'border-outline-variant hover:border-primary/70'
                  ]"
                >
                  <div class="flex flex-col items-center space-y-xs">
                    <span 
                      class="text-3xl font-display-xl transition-colors"
                      :class="settings.operations.includes('addition') ? 'text-primary' : 'text-on-surface'"
                    >+</span>
                    <span 
                      class="font-label-sm text-label-sm transition-colors"
                      :class="settings.operations.includes('addition') ? 'text-primary' : 'text-on-surface-variant'"
                    >Addition</span>
                  </div>
                  <div 
                    v-if="settings.operations.includes('addition')"
                    class="absolute top-xs right-xs"
                  >
                    <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  </div>
                </button>

                <!-- Subtraction -->
                <button
                  type="button"
                  @click="toggleOperation('subtraction')"
                  :class="[
                    'relative flex items-center justify-center p-md rounded-lg border-2 cursor-pointer transition-all duration-200 bg-surface-container-lowest text-left hover:scale-[1.03] active:scale-[0.97]',
                    settings.operations.includes('subtraction') 
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20' 
                      : 'border-outline-variant hover:border-primary/70'
                  ]"
                >
                  <div class="flex flex-col items-center space-y-xs">
                     <span 
                        class="text-3xl font-display-xl transition-colors"
                        :class="settings.operations.includes('subtraction') ? 'text-primary' : 'text-on-surface'"
                     >−</span>
                     <span 
                        class="font-label-sm text-label-sm transition-colors"
                        :class="settings.operations.includes('subtraction') ? 'text-primary' : 'text-on-surface-variant'"
                     >Subtraction</span>
                  </div>
                  <div 
                     v-if="settings.operations.includes('subtraction')"
                     class="absolute top-xs right-xs"
                  >
                     <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  </div>
                </button>

                <!-- Multiplication -->
                <button
                  type="button"
                  @click="toggleOperation('multiplication')"
                  :class="[
                    'relative flex items-center justify-center p-md rounded-lg border-2 cursor-pointer transition-all duration-200 bg-surface-container-lowest text-left hover:scale-[1.03] active:scale-[0.97]',
                    settings.operations.includes('multiplication') 
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20' 
                      : 'border-outline-variant hover:border-primary/70'
                  ]"
                >
                  <div class="flex flex-col items-center space-y-xs">
                    <span 
                      class="text-3xl font-display-xl transition-colors"
                      :class="settings.operations.includes('multiplication') ? 'text-primary' : 'text-on-surface'"
                    >×</span>
                    <span 
                      class="font-label-sm text-label-sm transition-colors"
                      :class="settings.operations.includes('multiplication') ? 'text-primary' : 'text-on-surface-variant'"
                    >Multiply</span>
                  </div>
                  <div 
                    v-if="settings.operations.includes('multiplication')"
                    class="absolute top-xs right-xs"
                  >
                    <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  </div>
                </button>

                <!-- Division -->
                <button
                  type="button"
                  @click="toggleOperation('division')"
                  :class="[
                    'relative flex items-center justify-center p-md rounded-lg border-2 cursor-pointer transition-all duration-200 bg-surface-container-lowest text-left hover:scale-[1.03] active:scale-[0.97]',
                    settings.operations.includes('division') 
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20' 
                      : 'border-outline-variant hover:border-primary/70'
                  ]"
                >
                  <div class="flex flex-col items-center space-y-xs">
                    <span 
                      class="text-3xl font-display-xl transition-colors"
                      :class="settings.operations.includes('division') ? 'text-primary' : 'text-on-surface'"
                    >÷</span>
                    <span 
                      class="font-label-sm text-label-sm transition-colors"
                      :class="settings.operations.includes('division') ? 'text-primary' : 'text-on-surface-variant'"
                    >Division</span>
                  </div>
                  <div 
                    v-if="settings.operations.includes('division')"
                    class="absolute top-xs right-xs"
                  >
                    <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  </div>
                </button>
              </div>
            </section>

            <!-- Number Range Section Box -->
            <section class="bg-surface-container-lowest rounded-xl shadow-sm p-md md:p-lg flex flex-col space-y-md relative z-0 border border-surface-variant/60 hover:border-primary/50 hover:shadow-md transition-all duration-300 group overflow-hidden">
              <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-500 pointer-events-none"></div>

              <div class="flex items-center justify-between border-b-2 border-surface-container-high pb-xs z-10">
                <div class="flex items-center space-x-sm">
                  <span class="material-symbols-outlined text-primary text-[24px]">tune</span>
                  <h2 class="font-headline-lg-mobile text-title-md text-on-surface">Number Range</h2>
                </div>
              </div>

              <div class="flex flex-col md:flex-row gap-md items-center z-10">
                <div class="w-full flex-1 flex flex-col space-y-xs">
                  <label class="font-label-md text-label-md text-on-surface-variant" for="min-val">Minimum Value</label>
                  <div class="relative group/input">
                    <input 
                      id="min-val" 
                      v-model.number="settings.minValue"
                      @change="handleMinMaxChange"
                      type="number" 
                      min="1" 
                      max="999" 
                      placeholder="e.g. 1" 
                      class="w-full h-[44px] bg-surface-container-low border-2 border-outline-variant hover:border-primary/60 focus:border-primary rounded-lg px-md font-body-md text-body-md text-on-surface outline-none transition-all text-center text-lg font-medium placeholder-on-surface-variant/50 hover:scale-[1.01] focus:scale-[1.01]" 
                    />
                  </div>
                </div>

                <div class="hidden md:flex items-center justify-center pt-md text-on-surface-variant">
                  <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                </div>

                <div class="w-full flex-1 flex flex-col space-y-xs">
                  <label class="font-label-md text-label-md text-on-surface-variant" for="max-val">Maximum Value</label>
                  <div class="relative group/input">
                    <input 
                      id="max-val" 
                      v-model.number="settings.maxValue"
                      @change="handleMinMaxChange"
                      type="number" 
                      min="2" 
                      max="10000" 
                      placeholder="e.g. 100" 
                      class="w-full h-[44px] bg-surface-container-low border-2 border-outline-variant hover:border-primary/60 focus:border-primary rounded-lg px-md font-body-md text-body-md text-on-surface outline-none transition-all text-center text-lg font-medium placeholder-on-surface-variant/50 hover:scale-[1.01] focus:scale-[1.01]" 
                    />
                  </div>
                </div>
              </div>

              <div class="pt-xs z-10">
                <button
                  type="button"
                  @click="settings.allowNegative = !settings.allowNegative; saveSettings()"
                  class="inline-flex items-center gap-md cursor-pointer group/toggle select-none p-xs rounded-lg hover:bg-surface-container-low/60 transition-colors"
                >
                  <!-- Toggle Track -->
                  <div
                    :class="settings.allowNegative ? 'bg-primary' : 'bg-surface-container-high'"
                    class="relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
                  >
                    <!-- Toggle Thumb -->
                    <div
                      :class="settings.allowNegative ? 'translate-x-5' : 'translate-x-0'"
                      class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300"
                    ></div>
                  </div>
                  <span class="font-body-md text-sm md:text-base text-on-surface group-hover/toggle:text-primary transition-colors">Allow Negative Results</span>
                </button>
              </div>
            </section>

              <!-- Session Parameters Box (Session Flow) -->
            <section class="bg-surface-container-lowest rounded-xl shadow-sm p-md md:p-lg flex flex-col space-y-md relative border border-surface-variant/60 hover:border-primary/50 hover:shadow-md transition-all duration-300 group overflow-hidden">
              <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-500 pointer-events-none"></div>

              <div class="flex items-center justify-between border-b-2 border-surface-container-high pb-xs z-10">
                <div class="flex items-center space-x-sm">
                  <span class="material-symbols-outlined text-primary text-[24px]">hourglass_empty</span>
                  <h2 class="font-headline-lg-mobile text-title-md text-on-surface">Session Flow</h2>
                </div>

                <!-- Cloud Sync Badge Indicator -->
                <div v-if="isLoggedIn" class="flex items-center gap-xs">
                  <span 
                    class="inline-flex items-center gap-1 text-[11px] font-label-sm px-2 py-0.5 rounded-full"
                    :class="isSyncing ? 'bg-secondary-container text-secondary' : 'bg-primary-fixed/30 text-primary'"
                  >
                    <span class="material-symbols-outlined text-[13px]" :class="{ 'animate-spin': isSyncing }">
                      {{ isSyncing ? 'sync' : 'cloud_done' }}
                    </span>
                    <span>{{ isSyncing ? 'Saving to DB...' : 'Cloud Synced' }}</span>
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-md z-10">
                
                <!-- 1. Question Count Typeable Input + Steppers + Quick Options -->
                <div class="flex flex-col space-y-xs">
                  <div class="flex items-center justify-between">
                    <label class="font-label-md text-label-md text-on-surface-variant" for="question-count">Total Questions</label>
                    <span class="text-xs text-primary font-medium">Drill size</span>
                  </div>
                  
                  <div class="flex items-center h-[44px] bg-surface-container-low border-2 border-outline-variant hover:border-primary/60 focus-within:border-primary rounded-lg p-xs transition-all hover:scale-[1.01]">
                    <button 
                      type="button" 
                      @click="decrementQuestions(1)"
                      :disabled="settings.questionCount <= 1"
                      title="Decrease by 1"
                      class="w-9 h-full flex items-center justify-center rounded-md hover:bg-surface-container-high text-on-surface-variant transition-colors active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span class="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    
                    <input 
                      id="question-count" 
                      v-model.number="settings.questionCount"
                      @change="validateQuestionCount"
                      type="number" 
                      min="1"
                      max="100"
                      class="flex-1 bg-transparent text-center font-title-md text-lg text-on-surface outline-none appearance-none" 
                    />
                    
                    <button 
                      type="button" 
                      @click="incrementQuestions(1)"
                      :disabled="settings.questionCount >= 100"
                      title="Increase by 1"
                      class="w-9 h-full flex items-center justify-center rounded-md hover:bg-surface-container-high text-on-surface-variant transition-colors active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span class="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>

                  <!-- Quick Presets for Question Count -->
                  <div class="flex items-center gap-xs pt-0.5">
                    <span class="text-[11px] font-label-sm text-on-surface-variant/70 mr-1">Presets:</span>
                    <button
                      v-for="qty in [5, 10, 20, 50]"
                      :key="qty"
                      type="button"
                      @click="setQuestionCount(qty)"
                      :class="settings.questionCount === qty ? 'bg-primary text-on-primary font-bold border-primary' : 'bg-surface-container hover:bg-primary/10 hover:text-primary text-on-surface-variant border-surface-variant/60'"
                      class="px-2 py-0.5 text-[11px] font-label-sm rounded-md transition-all active:scale-95 border"
                    >
                      {{ qty }}
                    </button>
                  </div>
                </div>

                <!-- 2. Operands Typeable Input + Steppers + Quick Add Options -->
                <div class="flex flex-col space-y-xs">
                  <div class="flex items-center justify-between">
                    <label class="font-label-md text-label-md text-on-surface-variant" for="operands">Operands</label>
                    <span class="text-xs text-primary font-medium">Per drill</span>
                  </div>
                  
                  <div class="flex items-center h-[44px] bg-surface-container-low border-2 border-outline-variant hover:border-primary/60 focus-within:border-primary rounded-lg p-xs transition-all hover:scale-[1.01]">
                    <button 
                      type="button" 
                      @click="decrementOperands(1)"
                      :disabled="settings.operands <= 2"
                      title="Decrease by 1"
                      class="w-9 h-full flex items-center justify-center rounded-md hover:bg-surface-container-high text-on-surface-variant transition-colors active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span class="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    
                    <input 
                      id="operands" 
                      v-model.number="settings.operands"
                      @change="validateOperands"
                      type="number" 
                      min="2"
                      max="100"
                      class="flex-1 bg-transparent text-center font-title-md text-lg text-on-surface outline-none appearance-none" 
                    />
                    
                    <button 
                      type="button" 
                      @click="incrementOperands(1)"
                      :disabled="settings.operands >= 100"
                      title="Increase by 1"
                      class="w-9 h-full flex items-center justify-center rounded-md hover:bg-surface-container-high text-on-surface-variant transition-colors active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span class="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>

                  <!-- Quick + Options for Operands -->
                  <div class="flex items-center gap-xs pt-0.5">
                     <span class="text-[11px] font-label-sm text-on-surface-variant/70 mr-1">Quick:</span>
                     <button
                        type="button"
                        @click="incrementOperands(1)"
                        class="px-2 py-0.5 text-[11px] font-label-sm rounded-md bg-surface-container hover:bg-primary/10 hover:text-primary transition-all active:scale-95 border border-surface-variant/60"
                     >
                        +1
                     </button>
                     <button
                        type="button"
                        @click="incrementOperands(5)"
                        class="px-2 py-0.5 text-[11px] font-label-sm rounded-md bg-surface-container hover:bg-primary/10 hover:text-primary transition-all active:scale-95 border border-surface-variant/60"
                     >
                        +5
                     </button>
                     <button
                        type="button"
                        @click="decrementOperands(1)"
                        class="px-2 py-0.5 text-[11px] font-label-sm rounded-md bg-surface-container hover:bg-primary/10 hover:text-primary transition-all active:scale-95 border border-surface-variant/60"
                     >
                        -1
                     </button>
                     <button
                        type="button"
                        @click="decrementOperands(5)"
                        class="px-2 py-0.5 text-[11px] font-label-sm rounded-md bg-surface-container hover:bg-primary/10 hover:text-primary transition-all active:scale-95 border border-surface-variant/60"
                     >
                        -5
                     </button>
                  </div>
                </div>

                <!-- 3. Speed Typeable Input -->
                <div class="flex flex-col space-y-xs">
                  <div class="flex justify-between items-center">
                    <label class="font-label-md text-label-md text-on-surface-variant" for="speed">
                      Speed
                    </label>
                    <span class="text-xs text-primary font-medium">
                      {{ settings.timerType === 'per_operand' ? 'Total flash time (s)' : 'Countdown time (s)' }}
                    </span>
                  </div>

                  <div class="relative flex items-center h-[44px] bg-surface-container-low border-2 border-outline-variant hover:border-primary/60 focus-within:border-primary rounded-lg px-md transition-all hover:scale-[1.01]">
                    <span class="material-symbols-outlined text-outline text-[18px] mr-2">timer</span>
                    <input 
                      id="speed" 
                      v-model.number="settings.speed"
                      @change="validateSpeed"
                      type="number" 
                      min="0.1" 
                      max="60" 
                      step="0.1" 
                      placeholder="2.5"
                      class="flex-1 bg-transparent text-center font-title-md text-lg text-on-surface outline-none appearance-none" 
                    />
                    <span class="font-label-md text-xs text-on-surface-variant ml-2 font-medium">sec</span>
                  </div>
                </div>

              </div>

              <!-- Timer Mode -->
              <div class="flex flex-col space-y-xs pt-sm border-t-2 border-surface-container-high/50 z-10">
                <label class="font-label-md text-label-md text-on-surface-variant">Timer Mode</label>
                <div class="flex flex-col md:flex-row gap-sm">
                  
                  <button
                    type="button"
                    @click="settings.timerType = 'per_operand'; saveSettings()"
                    :class="[
                      'flex-1 relative flex items-center p-sm rounded-lg border-2 cursor-pointer transition-all duration-200 text-left bg-surface-container-lowest hover:scale-[1.01] active:scale-[0.99]',
                      settings.timerType === 'per_operand' 
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20' 
                        : 'border-outline-variant hover:border-primary/70'
                    ]"
                  >
                    <div 
                      :class="settings.timerType === 'per_operand' ? 'border-primary' : 'border-outline-variant'"
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center mr-sm flex-shrink-0"
                    >
                      <div 
                        v-if="settings.timerType === 'per_operand'"
                        class="w-2 h-2 rounded-full bg-primary"
                      ></div>
                    </div>
                    <div class="flex flex-col">
                      <span 
                        :class="settings.timerType === 'per_operand' ? 'text-primary font-semibold' : 'text-on-surface font-medium'"
                        class="font-body-md text-sm md:text-base"
                      >Per Operand</span>
                      <span class="font-label-sm text-xs text-on-surface-variant">Numbers flash for {{ settings.speed }}s total</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    @click="settings.timerType = 'whole_expression'; saveSettings()"
                    :class="[
                      'flex-1 relative flex items-center p-sm rounded-lg border-2 cursor-pointer transition-all duration-200 text-left bg-surface-container-lowest hover:scale-[1.01] active:scale-[0.99]',
                      settings.timerType === 'whole_expression' 
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20' 
                        : 'border-outline-variant hover:border-primary/70'
                    ]"
                  >
                    <div 
                      :class="settings.timerType === 'whole_expression' ? 'border-primary' : 'border-outline-variant'"
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center mr-sm flex-shrink-0"
                    >
                      <div 
                        v-if="settings.timerType === 'whole_expression'"
                        class="w-2 h-2 rounded-full bg-primary"
                      ></div>
                    </div>
                    <div class="flex flex-col">
                      <span 
                        :class="settings.timerType === 'whole_expression' ? 'text-primary font-semibold' : 'text-on-surface font-medium'"
                        class="font-body-md text-sm md:text-base"
                      >Whole Expression</span>
                      <span class="font-label-sm text-xs text-on-surface-variant">Total time for entire equation with countdown timer</span>
                    </div>
                  </button>

                </div>
              </div>
            </section>
          </div>

          <!-- Right Column: Preferences & Action -->
          <div class="lg:col-span-4 flex flex-col space-y-md md:space-y-lg">
            
            <!-- App Preferences Box -->
            <div class="bg-surface-container-lowest rounded-xl shadow-sm p-md md:p-lg flex flex-col space-y-md border-tertiary border border-surface-variant/60 hover:border-tertiary/70 hover:shadow-md transition-all duration-300 group overflow-hidden relative">
              <div class="absolute -right-16 -top-16 w-48 h-48 bg-tertiary/5 rounded-full blur-3xl group-hover:bg-tertiary/15 transition-colors duration-500 pointer-events-none"></div>

              <div class="flex items-center space-x-sm border-b-2 border-surface-container-high pb-xs z-10">
                <span class="material-symbols-outlined text-tertiary text-[22px]">settings</span>
                <h2 class="font-headline-lg-mobile text-title-md text-on-surface">App Preferences</h2>
              </div>

              <div class="flex flex-col space-y-sm z-10">
                <!-- Sound Effects (Coming Soon) -->
                <div class="flex items-center justify-between p-xs rounded-lg border border-transparent hover:border-surface-variant hover:bg-surface-container-low/60 transition-all">
                  <div class="flex items-center space-x-sm">
                    <span class="material-symbols-outlined text-on-surface-variant text-[20px]">volume_up</span>
                    <div class="flex flex-col">
                      <span class="font-body-md text-sm text-on-surface font-medium">Sound Effects</span>
                      <span class="text-[10px] text-tertiary font-label-sm">Coming soon</span>
                    </div>
                  </div>
                  <div class="relative w-10 h-5 bg-surface-container-high rounded-full overflow-hidden opacity-60 cursor-not-allowed">
                    <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>

                <!-- Dictation Mode (Coming Soon) -->
                <div class="flex items-center justify-between p-xs rounded-lg border border-transparent hover:border-surface-variant hover:bg-surface-container-low/60 transition-all">
                  <div class="flex items-center space-x-sm">
                    <span class="material-symbols-outlined text-on-surface-variant text-[20px]">record_voice_over</span>
                    <div class="flex flex-col">
                      <span class="font-body-md text-sm text-on-surface font-medium">Dictation Mode</span>
                      <span class="text-[10px] text-tertiary font-label-sm">Coming soon</span>
                    </div>
                  </div>
                  <div class="relative w-10 h-5 bg-surface-container-high rounded-full overflow-hidden opacity-60 cursor-not-allowed">
                    <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Card Box -->
            <div class="bg-primary-container/10 rounded-xl p-md md:p-lg flex flex-col items-center justify-center space-y-md text-center relative overflow-hidden group border border-primary/30 hover:border-primary/60 hover:shadow-lg transition-all duration-300">
              <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
              <div class="absolute -right-12 -bottom-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none"></div>
              
              <div class="z-10 flex flex-col items-center space-y-sm">
                <div class="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-110 transition-transform duration-300 text-on-primary">
                  <span class="material-symbols-outlined text-2xl">play_arrow</span>
                </div>
                <div>
                  <h3 class="font-title-md text-base md:text-lg text-on-surface mb-xs">Ready to begin?</h3>
                  <p class="font-label-sm text-xs text-on-surface-variant max-w-[200px]">
                    {{ settings.questionCount }} questions &bull; {{ settings.operands }} operands &bull; {{ settings.speed }}s {{ settings.timerType === 'per_operand' ? 'flash' : 'timer' }}
                  </p>
                </div>
              </div>

              <button 
                type="button"
                @click="startPractice"
                class="z-10 w-full h-[48px] bg-primary hover:bg-primary/90 text-on-primary rounded-full font-title-md text-base shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-sm group/btn"
              >
                <span>Start Practice ({{ settings.questionCount }} Qs)</span>
                <span class="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePracticeSettings } from '~/composables/usePracticeSettings';

const {
  settings,
  isSyncing,
  saveSettings,
  loadSettingsFromDb,
  toggleOperation,
  incrementOperands,
  decrementOperands,
  incrementQuestions,
  decrementQuestions,
} = usePracticeSettings();

const isLoggedIn = ref(false);

onMounted(() => {
  if (import.meta.client) {
    const token = localStorage.getItem('anzan_token') || sessionStorage.getItem('anzan_token');
    isLoggedIn.value = Boolean(token);
    if (token) {
      loadSettingsFromDb();
    }
  }
});

const handleMinMaxChange = () => {
  if (settings.value.minValue < 1) settings.value.minValue = 1;
  if (settings.value.minValue >= settings.value.maxValue) {
    settings.value.maxValue = settings.value.minValue + 1;
  }
  saveSettings();
};

const setQuestionCount = (count: number) => {
  settings.value.questionCount = count;
  saveSettings();
};

const validateQuestionCount = () => {
  if (!settings.value.questionCount || settings.value.questionCount < 1) {
    settings.value.questionCount = 1;
  } else if (settings.value.questionCount > 100) {
    settings.value.questionCount = 100;
  }
  saveSettings();
};

const validateOperands = () => {
  if (!settings.value.operands || settings.value.operands < 2) {
    settings.value.operands = 2;
  } else if (settings.value.operands > 100) {
    settings.value.operands = 100;
  }
  saveSettings();
};

const validateSpeed = () => {
  if (!settings.value.speed || settings.value.speed < 0.1) {
    settings.value.speed = 0.1;
  } else if (settings.value.speed > 60) {
    settings.value.speed = 60;
  }
  saveSettings();
};

const startPractice = () => {
  saveSettings();
  navigateTo('/practice');
};
</script>

