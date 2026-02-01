import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Row from '../Row.vue';
import Col from '../Col.vue';

describe('Grid', () => {
  describe('Row', () => {
    describe('rendering', () => {
      it('should render correctly', () => {
        const wrapper = mount(Row);
        expect(wrapper.find('div').exists()).toBe(true);
      });

      it('should render with default classes', () => {
        const wrapper = mount(Row);
        const row = wrapper.find('div');

        expect(row.classes()).toContain('chips-row');
        expect(row.classes()).toContain('chips-row--justify-start');
        expect(row.classes()).toContain('chips-row--align-top');
      });

      it('should render slot content', () => {
        const wrapper = mount(Row, {
          slots: {
            default: '<div class="test-content">Content</div>',
          },
        });

        expect(wrapper.find('.test-content').exists()).toBe(true);
        expect(wrapper.text()).toContain('Content');
      });
    });

    describe('justify', () => {
      it.each([
        ['start', 'chips-row--justify-start'],
        ['center', 'chips-row--justify-center'],
        ['end', 'chips-row--justify-end'],
        ['space-between', 'chips-row--justify-space-between'],
        ['space-around', 'chips-row--justify-space-around'],
        ['space-evenly', 'chips-row--justify-space-evenly'],
      ] as const)('should render %s justify', (justify, expectedClass) => {
        const wrapper = mount(Row, {
          props: { justify },
        });

        expect(wrapper.find('div').classes()).toContain(expectedClass);
      });
    });

    describe('align', () => {
      it.each([
        ['top', 'chips-row--align-top'],
        ['middle', 'chips-row--align-middle'],
        ['bottom', 'chips-row--align-bottom'],
        ['stretch', 'chips-row--align-stretch'],
      ] as const)('should render %s align', (align, expectedClass) => {
        const wrapper = mount(Row, {
          props: { align },
        });

        expect(wrapper.find('div').classes()).toContain(expectedClass);
      });
    });

    describe('wrap', () => {
      it('should not have no-wrap class by default', () => {
        const wrapper = mount(Row);
        expect(wrapper.find('div').classes()).not.toContain('chips-row--no-wrap');
      });

      it('should have no-wrap class when wrap is false', () => {
        const wrapper = mount(Row, {
          props: { wrap: false },
        });

        expect(wrapper.find('div').classes()).toContain('chips-row--no-wrap');
      });
    });

    describe('gutter', () => {
      it('should apply horizontal gutter style', () => {
        const wrapper = mount(Row, {
          props: { gutter: 16 },
        });

        const style = wrapper.find('div').attributes('style');
        expect(style).toContain('margin-left: -8px');
        expect(style).toContain('margin-right: -8px');
      });

      it('should apply both horizontal and vertical gutter', () => {
        const wrapper = mount(Row, {
          props: { gutter: [16, 24] },
        });

        const style = wrapper.find('div').attributes('style');
        // 样式可能被压缩为 shorthand 格式
        expect(style).toBeDefined();
        expect(style).toMatch(/-8px/);
        expect(style).toMatch(/-12px/);
      });

      it('should not apply margin when gutter is 0', () => {
        const wrapper = mount(Row, {
          props: { gutter: 0 },
        });

        const style = wrapper.find('div').attributes('style');
        expect(style).toBeUndefined();
      });
    });
  });

  describe('Col', () => {
    describe('rendering', () => {
      it('should render correctly', () => {
        const wrapper = mount(Col);
        expect(wrapper.find('div').exists()).toBe(true);
      });

      it('should render with base class', () => {
        const wrapper = mount(Col);
        expect(wrapper.find('div').classes()).toContain('chips-col');
      });

      it('should render slot content', () => {
        const wrapper = mount(Col, {
          slots: {
            default: '<span>Column Content</span>',
          },
        });

        expect(wrapper.text()).toContain('Column Content');
      });
    });

    describe('span', () => {
      it.each([1, 6, 12, 18, 24])('should render span-%d class', (span) => {
        const wrapper = mount(Col, {
          props: { span },
        });

        expect(wrapper.find('div').classes()).toContain(`chips-col--${span}`);
      });

      it('should not render span class when span is undefined', () => {
        const wrapper = mount(Col);
        const classes = wrapper.find('div').classes();

        // 不应该有任何 span 类
        expect(classes.some((c) => /chips-col--\d+$/.test(c))).toBe(false);
      });
    });

    describe('offset', () => {
      it.each([1, 6, 12, 18, 24])('should render offset-%d class', (offset) => {
        const wrapper = mount(Col, {
          props: { offset },
        });

        expect(wrapper.find('div').classes()).toContain(`chips-col--offset-${offset}`);
      });
    });

    describe('push and pull', () => {
      it('should render push class', () => {
        const wrapper = mount(Col, {
          props: { push: 4 },
        });

        expect(wrapper.find('div').classes()).toContain('chips-col--push-4');
      });

      it('should render pull class', () => {
        const wrapper = mount(Col, {
          props: { pull: 4 },
        });

        expect(wrapper.find('div').classes()).toContain('chips-col--pull-4');
      });
    });

    describe('responsive breakpoints', () => {
      it.each(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const)(
        'should render %s responsive class with number',
        (breakpoint) => {
          const wrapper = mount(Col, {
            props: { [breakpoint]: 12 },
          });

          expect(wrapper.find('div').classes()).toContain(`chips-col--${breakpoint}-12`);
        }
      );

      it('should render responsive class with object config', () => {
        const wrapper = mount(Col, {
          props: {
            md: {
              span: 8,
              offset: 4,
            },
          },
        });

        const classes = wrapper.find('div').classes();
        expect(classes).toContain('chips-col--md-8');
        expect(classes).toContain('chips-col--md-offset-4');
      });

      it('should render multiple breakpoint classes', () => {
        const wrapper = mount(Col, {
          props: {
            xs: 24,
            sm: 12,
            md: 8,
            lg: 6,
          },
        });

        const classes = wrapper.find('div').classes();
        expect(classes).toContain('chips-col--xs-24');
        expect(classes).toContain('chips-col--sm-12');
        expect(classes).toContain('chips-col--md-8');
        expect(classes).toContain('chips-col--lg-6');
      });
    });

    describe('order', () => {
      it('should apply order style', () => {
        const wrapper = mount(Col, {
          props: { order: 2 },
        });

        const style = wrapper.find('div').attributes('style');
        expect(style).toContain('order: 2');
      });
    });
  });

  describe('Row and Col integration', () => {
    it('should pass gutter from Row to Col', () => {
      const wrapper = mount(Row, {
        props: { gutter: 16 },
        slots: {
          default: () => [
            mount(Col, {
              props: { span: 12 },
              slots: { default: 'Col 1' },
            }).vm.$el,
          ],
        },
      });

      // Row 应该有负边距
      const rowStyle = wrapper.find('div').attributes('style');
      expect(rowStyle).toContain('margin-left: -8px');
    });

    it('should render multiple columns', () => {
      const wrapper = mount({
        template: `
          <Row>
            <Col :span="12">Col 1</Col>
            <Col :span="12">Col 2</Col>
          </Row>
        `,
        components: { Row, Col },
      });

      const cols = wrapper.findAll('.chips-col');
      expect(cols).toHaveLength(2);
      expect(cols[0].classes()).toContain('chips-col--12');
      expect(cols[1].classes()).toContain('chips-col--12');
    });

    it('should render responsive grid layout', () => {
      const wrapper = mount({
        template: `
          <Row :gutter="[16, 16]">
            <Col :xs="24" :sm="12" :md="8" :lg="6">Col 1</Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">Col 2</Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">Col 3</Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">Col 4</Col>
          </Row>
        `,
        components: { Row, Col },
      });

      const cols = wrapper.findAll('.chips-col');
      expect(cols).toHaveLength(4);

      // 每个 Col 应该有响应式类
      cols.forEach((col) => {
        expect(col.classes()).toContain('chips-col--xs-24');
        expect(col.classes()).toContain('chips-col--sm-12');
        expect(col.classes()).toContain('chips-col--md-8');
        expect(col.classes()).toContain('chips-col--lg-6');
      });
    });

    it('should apply gutter padding to Col via provide/inject', async () => {
      const wrapper = mount({
        template: `
          <Row :gutter="24">
            <Col :span="12" data-testid="test-col">Content</Col>
          </Row>
        `,
        components: { Row, Col },
      });

      const col = wrapper.find('[data-testid="test-col"]');
      const style = col.attributes('style');

      expect(style).toContain('padding-left: 12px');
      expect(style).toContain('padding-right: 12px');
    });

    it('should apply vertical gutter to Col', async () => {
      const wrapper = mount({
        template: `
          <Row :gutter="[16, 24]">
            <Col :span="12" data-testid="test-col">Content</Col>
          </Row>
        `,
        components: { Row, Col },
      });

      const col = wrapper.find('[data-testid="test-col"]');
      const style = col.attributes('style');

      // 样式可能被压缩为 shorthand 格式
      expect(style).toBeDefined();
      expect(style).toMatch(/8px/);  // horizontal padding
      expect(style).toMatch(/12px/); // vertical padding
    });
  });

  describe('accessibility', () => {
    it('Row should have semantic structure', () => {
      const wrapper = mount(Row, {
        slots: {
          default: '<div>Content</div>',
        },
      });

      // Row 使用 div 作为容器是标准的
      expect(wrapper.find('div.chips-row').exists()).toBe(true);
    });

    it('Col should have semantic structure', () => {
      const wrapper = mount(Col, {
        slots: {
          default: '<p>Column content</p>',
        },
      });

      expect(wrapper.find('div.chips-col').exists()).toBe(true);
      expect(wrapper.find('p').text()).toBe('Column content');
    });
  });
});
