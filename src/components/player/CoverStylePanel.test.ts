import { describe, expect, it } from 'vitest';

import source from './CoverStylePanel.vue?raw';

describe('CoverStylePanel', () => {
  it('offers the cover reflection switch', () => {
    expect(source).toContain('封面倒影');
    expect(source).toContain('toggleCoverReflection');
    expect(source).toContain('role="switch"');
  });

  it('wires the cover position sliders to the persisted offsets', () => {
    expect(source).toContain('封面位置');
    expect(source).toContain('coverOffsetX');
    expect(source).toContain('coverOffsetY');
    expect(source).toContain("handleOffsetInput('x', $event)");
    expect(source).toContain("handleOffsetInput('y', $event)");
    expect(source).toContain("resetCoverOffset('x')");
    expect(source).toContain("resetCoverOffset('y')");
  });

  it('offers a cover size slider backed by the persisted scale', () => {
    expect(source).toContain('封面大小');
    expect(source).toContain('coverScale');
    expect(source).toContain('handleScaleInput');
    expect(source).toContain('resetCoverScale');
  });

  it('reuses the shared player style panel placement', () => {
    expect(source).toContain('cover-style-panel');
    expect(source).toContain('showCoverStylePanel');
  });

  it('closes itself when clicking outside of the panel', () => {
    expect(source).toContain('function handleClickOutside(event: MouseEvent)');
    expect(source).toContain('coverPanelRef.value?.contains(target)');
    expect(source).toContain("window.addEventListener('mousedown', handleClickOutside)");
    expect(source).toContain("window.removeEventListener('mousedown', handleClickOutside)");
    expect(source).toContain('showCoverStylePanel.value = false;');
  });
});
