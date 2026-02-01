/**
 * Form 表单组件导出
 */

import Form from './Form.vue';
import FormItem from './FormItem.vue';

export { Form, FormItem };
export default Form;

// 类型导出
export type {
  FormProps,
  FormEmits,
  FormInstance,
  FormItemProps,
  FormItemInstance,
  FormRule,
  FormRules,
  FormLayout,
  FormLabelAlign,
  FormTrigger,
  FormValidateStatus,
  FormRuleType,
  FormValidateError,
  FormContext,
  FormItemContext,
} from './types';

export { FORM_CONTEXT_KEY, FORM_ITEM_CONTEXT_KEY } from './types';
