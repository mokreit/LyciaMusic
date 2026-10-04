<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { showCoverStylePanel } from '../../composables/coverStylePanel';
import {
  DEFAULT_COVER_OFFSET_X,
  DEFAULT_COVER_OFFSET_Y,
  MAX_COVER_OFFSET_X,
  MAX_COVER_OFFSET_Y,
  MIN_COVER_OFFSET_X,
  MIN_COVER_OFFSET_Y,
  clampCoverOffsetX,
  clampCoverOffsetY,
  useSettingsStore,
} from '../../features/settings/store';

const COVER_OFFSET_STEP = 1;

const settingsStore = useSettingsStore();
const coverPanelRef = ref<HTMLElement | null>(null);

const showCoverReflection = computed(() => settingsStore.settings.showCoverReflection);
const coverOffsetX = computed(() => settingsStore.settings.coverOffsetX);
const coverOffsetY = computed(() => settingsStore.settings.coverOffsetY);

const horizontalOffsetPercent = computed(() => formatOffsetValue(coverOffsetX.value));
const verticalOffsetPercent = computed(() => formatOffsetValue(coverOffsetY.value));

const horizontalOffsetProgress = computed(() => (
  ((coverOffsetX.value - MIN_COVER_OFFSET_X) / (MAX_COVER_OFFSET_X - MIN_COVER_OFFSET_X)) * 100
));
const verticalOffsetProgress = computed(() => (
  ((coverOffsetY.value - MIN_COVER_OFFSET_Y) / (MAX_COVER_OFFSET_Y - MIN_COVER_OFFSET_Y)) * 100
));

function formatOffsetValue(value: number) {
  return `${value > 0 ? '+' : ''}${Math.round(value)}%`;
}

function toggleCoverReflection() {
  settingsStore.patchSettings({ showCoverReflection: !showCoverReflection.value });
}

function updateCoverOffset(axis: 'x' | 'y', value: number) {
  if (axis === 'x') {
    settingsStore.patchSettings({ coverOffsetX: clampCoverOffsetX(value) });
    return;
  }

  settingsStore.patchSettings({ coverOffsetY: clampCoverOffsetY(value) });
}

function handleOffsetInput(axis: 'x' | 'y', event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (!target) return;

  updateCoverOffset(axis, Number(target.value));
}

function resetCoverOffset(axis: 'x' | 'y') {
  updateCoverOffset(axis, axis === 'x' ? DEFAULT_COVER_OFFSET_X : DEFAULT_COVER_OFFSET_Y);
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node | null;
  if (!target) return;
  if (coverPanelRef.value?.contains(target)) return;

  showCoverStylePanel.value = false;
}

onMounted(() => {
  window.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('mousedown', handleClickOutside);
  showCoverStylePanel.value = false;
});
</script>

<template>
  <div
    class="pointer-events-none absolute top-2 bottom-12 z-[85] flex min-h-0 min-w-[260px] max-w-[320px] flex-col justify-center cover-style-panel"
  >
    <transition name="font-panel">
      <div
        v-if="showCoverStylePanel"
        ref="coverPanelRef"
        class="pointer-events-auto flex max-h-[100%] min-h-0 w-full flex-col rounded-3xl border border-white/10 bg-black/30 text-white shadow-[0_28px_70px_rgba(0,0,0,0.36)] backdrop-blur-2xl"
        @click.stop
        @mousedown.stop
      >
        <div class="min-h-0 overflow-y-auto px-4 py-4 custom-scrollbar">
          <div class="mb-3">
            <div class="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30">Cover</div>
          </div>

          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <div class="text-[13px] font-medium text-white/85">封面倒影</div>
              <div class="mt-0.5 text-[10px] leading-4 text-white/40">封面下方的玻璃倒影</div>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="showCoverReflection"
              title="封面倒影"
              class="relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors"
              :class="showCoverReflection ? 'bg-white/80' : 'bg-white/15'"
              @click="toggleCoverReflection"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full transition duration-200 ease-in-out"
                :class="showCoverReflection ? 'translate-x-6 bg-black/80' : 'translate-x-1 bg-white'"
              />
            </button>
          </div>

          <div class="mt-6 mb-3">
            <div class="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30">Position</div>
            <div class="mt-1.5 flex items-center justify-between gap-3">
              <span class="text-[13px] font-medium text-white/85">封面位置</span>
              <div class="flex items-center gap-1">
                <button
                  v-if="coverOffsetX !== DEFAULT_COVER_OFFSET_X"
                  type="button"
                  class="flex h-5 w-5 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
                  @click="resetCoverOffset('x')"
                  title="重置水平偏移"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
                <button
                  v-if="coverOffsetY !== DEFAULT_COVER_OFFSET_Y"
                  type="button"
                  class="flex h-5 w-5 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
                  @click="resetCoverOffset('y')"
                  title="重置垂直偏移"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="text-[12px] font-medium text-white/70">水平</span>
                <span class="text-[11px] font-medium tabular-nums text-white/48">{{ horizontalOffsetPercent }}</span>
              </div>
              <input
                class="font-size-slider h-1 w-full cursor-pointer appearance-none rounded-full"
                :style="{ background: `linear-gradient(to right, rgba(255,255,255,0.85) ${horizontalOffsetProgress}%, rgba(255,255,255,0.12) ${horizontalOffsetProgress}%)` }"
                type="range"
                :min="MIN_COVER_OFFSET_X"
                :max="MAX_COVER_OFFSET_X"
                :step="COVER_OFFSET_STEP"
                :value="coverOffsetX"
                @input="handleOffsetInput('x', $event)"
              />
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="text-[12px] font-medium text-white/70">垂直</span>
                <span class="text-[11px] font-medium tabular-nums text-white/48">{{ verticalOffsetPercent }}</span>
              </div>
              <input
                class="font-size-slider h-1 w-full cursor-pointer appearance-none rounded-full"
                :style="{ background: `linear-gradient(to right, rgba(255,255,255,0.85) ${verticalOffsetProgress}%, rgba(255,255,255,0.12) ${verticalOffsetProgress}%)` }"
                type="range"
                :min="MIN_COVER_OFFSET_Y"
                :max="MAX_COVER_OFFSET_Y"
                :step="COVER_OFFSET_STEP"
                :value="coverOffsetY"
                @input="handleOffsetInput('y', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.cover-style-panel {
  --panel-width: min(320px, calc(34vw - 24px));
  --shift-vw: 14vw;
  width: var(--panel-width);
  right: calc(100% + min(var(--shift-vw), max(40vw, 300px) + 40px - var(--panel-width) - 16px));
}

.font-panel-enter-active,
.font-panel-leave-active {
  transition: opacity 180ms ease, transform 180ms ease, backdrop-filter 180ms ease;
  will-change: transform, opacity;
}

.font-panel-enter-from,
.font-panel-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
  backdrop-filter: blur(0px);
}
</style>
