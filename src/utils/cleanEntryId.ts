export const cleanEntryId = (id) => {
  // 移除 .md 或 .mdx 扩展名
  let cleanId = id.replace(/\.mdx?$/, '');
  // 移除 /index 部分（如果存在）
  cleanId = cleanId.replace(/\/index$/, '');
  // 确保不以斜杠开头或结尾
  cleanId = cleanId.replace(/^\/+|\/+$/g, '');
  return cleanId;
};