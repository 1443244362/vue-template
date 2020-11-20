/**接口地址 */
const testApiUrl = 'http://localhost:7001/api';
const formalApiUrl = '';
export const apiUrl =
  process.env.VUE_APP_INTERFACE_ENV === 'test' ? testApiUrl : formalApiUrl;

/**表格高度 */ export const tableHeight = 470;
/**表格多选框列宽度 */ export const tableSelectionWidth = 40;
/**操作按钮大小 */ export const actionBtnSize = 'mini';
/**弹窗按钮大小 */ export const dialogBtnSize = 'mini';
/**限制一条选择 */ export const limitOneSelectedMessage = '请选择一条数据';
/**未选择的提示 */ export const notSelectedMessage = '请选择要操作的数据';
/**确定删除提示 */ export const confirmDeleteMessage = '确定删除选中数据?';
/**平台类型代码 */ export const platform = '';
/**阿里oss region */ export const ossRegion = '';
/**阿里oss bucketName */ export const bucketName = '';
/**阿里oss accessKeyId */ export const accessKeyId = '';
/**阿里oss accessKeySecret */ export const accessKeySecret = '';
/**阿里oss 访问域名 */ export const fileDomain = '';
