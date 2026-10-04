import { describe, expect, it } from 'vitest';

import source from './PlayerDetailLeft.vue?raw';

describe('PlayerDetailLeft cover reflection', () => {
  it('gates the reflection layer behind the persisted setting', () => {
    expect(source).toContain('const showCoverReflection = computed(() => settings.value.showCoverReflection);');
    expect(source).toContain('v-if="props.isExpanded && showCoverReflection"');
  });
});
