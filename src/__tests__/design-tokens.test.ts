const tailwindConfig = require('../../tailwind.config.js');

describe('CourtVision Kinetic Design Tokens', () => {
  const { colors, spacing, borderRadius, fontFamily } = tailwindConfig.theme.extend;

  describe('Colors Contract', () => {
    it('defines all required surfaces and athletic slates', () => {
      expect(colors['surface'].toLowerCase()).toBe('#0b1326');
      expect(colors['surface-container'].toLowerCase()).toBe('#171f33');
      expect(colors['surface-container-high'].toLowerCase()).toBe('#222a3d');
      expect(colors['slate-dark'].toLowerCase()).toBe('#0f172a');
      expect(colors['slate-card'].toLowerCase()).toBe('#1e293b');
      expect(colors['slate-border'].toLowerCase()).toBe('#334155');
    });

    it('defines brand and accent colors (Court Orange & Tactical Blue)', () => {
      expect(colors['court-orange'].toLowerCase()).toBe('#f97316');
      expect(colors['primary-container'].toLowerCase()).toBe('#f97316');
      expect(colors['tactical-blue'].toLowerCase()).toBe('#0ea5e9');
      expect(colors['secondary-container'].toLowerCase()).toBe('#00a2e6');
    });

    it('maintains backward compatibility with legacy danish-* tokens', () => {
      expect(colors['danish-red']).toBeDefined();
      expect(colors['danish-white']).toBeDefined();
      expect(colors['danish-dark-gray']).toBeDefined();
      expect(colors['danish-light-gray']).toBeDefined();
      expect(colors['danish-gold']).toBeDefined();
    });
  });

  describe('Spacing Contract', () => {
    it('defines required spacing and gutter units', () => {
      expect(spacing['gutter']).toBe('1rem');
      expect(spacing['gutter-sm']).toBe('0.75rem');
      expect(spacing['margin']).toBe('1rem');
      expect(spacing['space-xs']).toBe('0.25rem');
      expect(spacing['space-sm']).toBe('0.5rem');
      expect(spacing['space-md']).toBe('1rem');
      expect(spacing['space-lg']).toBe('1.5rem');
      expect(spacing['space-xl']).toBe('2rem');
    });
  });

  describe('Border Radius Contract', () => {
    it('defines all required border radiuses', () => {
      expect(borderRadius['sm']).toBe('0.25rem');
      expect(borderRadius['DEFAULT']).toBe('0.5rem');
      expect(borderRadius['md']).toBe('0.75rem');
      expect(borderRadius['lg']).toBe('1rem');
      expect(borderRadius['xl']).toBe('1.5rem');
      expect(borderRadius['full']).toBe('9999px');
    });
  });

  describe('Typography Contract', () => {
    it('defines cross-platform font families with fallbacks', () => {
      expect(fontFamily['display'][0]).toBe('Space Grotesk');
      expect(fontFamily['body'][0]).toBe('Inter');
    });
  });
});
