import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Card from '../Card.vue';

describe('Card', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Card, {
        slots: {
          default: '<div>Content</div>',
        },
      });

      expect(wrapper.find('div.chips-card').exists()).toBe(true);
      expect(wrapper.text()).toContain('Content');
    });

    it('should render with default class only', () => {
      const wrapper = mount(Card);
      const card = wrapper.find('div.chips-card');

      expect(card.classes()).toContain('chips-card');
      expect(card.classes()).not.toContain('chips-card--bordered');
      expect(card.classes()).not.toContain('chips-card--hoverable');
      expect(card.classes()).not.toContain('chips-card--loading');
      expect(card.classes()).not.toContain('chips-card--small');
    });
  });

  describe('props', () => {
    it('should render with title', () => {
      const wrapper = mount(Card, {
        props: { title: 'Card Title' },
      });

      expect(wrapper.find('.chips-card__head').exists()).toBe(true);
      expect(wrapper.find('.chips-card__title').text()).toBe('Card Title');
    });

    it('should render bordered card', () => {
      const wrapper = mount(Card, {
        props: { bordered: true },
      });

      expect(wrapper.find('div.chips-card').classes()).toContain('chips-card--bordered');
    });

    it('should render hoverable card', () => {
      const wrapper = mount(Card, {
        props: { hoverable: true },
      });

      expect(wrapper.find('div.chips-card').classes()).toContain('chips-card--hoverable');
    });

    it('should render loading card', () => {
      const wrapper = mount(Card, {
        props: { loading: true },
      });

      expect(wrapper.find('div.chips-card').classes()).toContain('chips-card--loading');
    });

    it('should render small card', () => {
      const wrapper = mount(Card, {
        props: { size: 'small' },
      });

      expect(wrapper.find('div.chips-card').classes()).toContain('chips-card--small');
    });
  });

  describe('slots', () => {
    it('should render default slot', () => {
      const wrapper = mount(Card, {
        slots: {
          default: '<span class="content">Body Content</span>',
        },
      });

      expect(wrapper.find('.chips-card__body .content').exists()).toBe(true);
      expect(wrapper.find('.chips-card__body').text()).toBe('Body Content');
    });

    it('should render title slot (overriding title prop)', () => {
      const wrapper = mount(Card, {
        props: { title: 'Prop Title' },
        slots: {
          title: '<span class="custom-title">Slot Title</span>',
        },
      });

      expect(wrapper.find('.chips-card__title .custom-title').exists()).toBe(true);
      expect(wrapper.find('.chips-card__title').text()).toBe('Slot Title');
    });

    it('should render extra slot', () => {
      const wrapper = mount(Card, {
        props: { title: 'Title' },
        slots: {
          extra: '<button>More</button>',
        },
      });

      expect(wrapper.find('.chips-card__extra').exists()).toBe(true);
      expect(wrapper.find('.chips-card__extra button').exists()).toBe(true);
    });

    it('should render cover slot', () => {
      const wrapper = mount(Card, {
        slots: {
          cover: '<img src="test.jpg" alt="Cover" />',
        },
      });

      expect(wrapper.find('.chips-card__cover').exists()).toBe(true);
      expect(wrapper.find('.chips-card__cover img').exists()).toBe(true);
    });

    it('should render actions slot', () => {
      const wrapper = mount(Card, {
        slots: {
          actions: '<button>Action 1</button><button>Action 2</button>',
        },
      });

      expect(wrapper.find('.chips-card__actions').exists()).toBe(true);
      const buttons = wrapper.findAll('.chips-card__actions button');
      expect(buttons).toHaveLength(2);
    });
  });

  describe('head visibility', () => {
    it('should not render head when no title or extra', () => {
      const wrapper = mount(Card);

      expect(wrapper.find('.chips-card__head').exists()).toBe(false);
    });

    it('should render head with title prop', () => {
      const wrapper = mount(Card, {
        props: { title: 'Title' },
      });

      expect(wrapper.find('.chips-card__head').exists()).toBe(true);
    });

    it('should render head with title slot', () => {
      const wrapper = mount(Card, {
        slots: {
          title: 'Slot Title',
        },
      });

      expect(wrapper.find('.chips-card__head').exists()).toBe(true);
    });

    it('should render head with extra slot only', () => {
      const wrapper = mount(Card, {
        slots: {
          extra: '<button>Extra</button>',
        },
      });

      expect(wrapper.find('.chips-card__head').exists()).toBe(true);
      expect(wrapper.find('.chips-card__extra').exists()).toBe(true);
    });
  });

  describe('cover and actions visibility', () => {
    it('should not render cover when no cover slot', () => {
      const wrapper = mount(Card);

      expect(wrapper.find('.chips-card__cover').exists()).toBe(false);
    });

    it('should not render actions when no actions slot', () => {
      const wrapper = mount(Card);

      expect(wrapper.find('.chips-card__actions').exists()).toBe(false);
    });
  });

  describe('combinations', () => {
    it('should apply multiple props correctly', () => {
      const wrapper = mount(Card, {
        props: {
          title: 'Title',
          bordered: true,
          hoverable: true,
          loading: true,
          size: 'small',
        },
      });

      const card = wrapper.find('div.chips-card');
      expect(card.classes()).toContain('chips-card--bordered');
      expect(card.classes()).toContain('chips-card--hoverable');
      expect(card.classes()).toContain('chips-card--loading');
      expect(card.classes()).toContain('chips-card--small');
    });

    it('should render all slots together', () => {
      const wrapper = mount(Card, {
        props: { title: 'Title' },
        slots: {
          cover: '<img src="cover.jpg" />',
          extra: '<button>Extra</button>',
          default: '<p>Content</p>',
          actions: '<button>Action</button>',
        },
      });

      expect(wrapper.find('.chips-card__cover').exists()).toBe(true);
      expect(wrapper.find('.chips-card__head').exists()).toBe(true);
      expect(wrapper.find('.chips-card__extra').exists()).toBe(true);
      expect(wrapper.find('.chips-card__body').exists()).toBe(true);
      expect(wrapper.find('.chips-card__actions').exists()).toBe(true);
    });
  });
});
