import { describe, expect, it } from 'vitest';

import source from './PlayerDetailLeft.vue?raw';

describe('PlayerDetailLeft cover reflection', () => {
  it('gates the reflection layer behind the persisted setting', () => {
    expect(source).toContain('const showCoverReflection = computed(() => settings.value.showCoverReflection);');
    expect(source).toContain('v-if="props.isExpanded && showCoverReflection"');
  });

  it('applies the persisted cover position offsets to the cover transform', () => {
    expect(source).toContain('const coverOffsetX = computed(() => settings.value.coverOffsetX);');
    expect(source).toContain('const coverOffsetY = computed(() => settings.value.coverOffsetY);');
    expect(source).toContain('translate(${coverOffsetX}%, ${coverOffsetY}%) scale(1)');
  });

  it('applies the persisted cover scale to the cover width', () => {
    expect(source).toContain('const coverScale = computed(() => settings.value.coverScale);');
    expect(source).toContain('calc(clamp(220px, 45vh, 580px) * ${coverScale})');
  });
});
