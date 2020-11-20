import Upload from './Upload.vue';
import ImportExcel from './ImportExcel.vue';
import Collapse from './Collapse.vue';
import CodeShow from './CodeShow.vue';
import CodeSelect from './CodeSelect.vue';
import RoleSelect from './RoleSelect.vue';
const components = {
  Upload,
  ImportExcel,
  Collapse,
  CodeShow,
  CodeSelect,
  RoleSelect
};

const install = (Vue: any) => {
  for (const key in components) {
    Vue.component(key, components[key]);
  }
};

export default { install };
