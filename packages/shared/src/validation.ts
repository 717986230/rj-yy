const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export const PASSWORD_MIN = 8;

/** 返回错误提示；为 null 表示通过 */
export function checkPassword(value: string): string | null {
  if (value.length < PASSWORD_MIN) return `密码至少 ${PASSWORD_MIN} 位`;
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return '密码需同时包含字母和数字';
  return null;
}

/** 只接受 http(s) 外链；返回来源域名，非法时返回 null */
export function externalSource(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    return u.hostname;
  } catch {
    return null;
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** https 页面里加载 http 资源会被浏览器当作混合内容拦截 */
export function isBlockedMixedContent(url: string, pageProtocol: string): boolean {
  return pageProtocol === 'https:' && url.trim().toLowerCase().startsWith('http:');
}
