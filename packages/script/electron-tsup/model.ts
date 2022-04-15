export interface OperationConfig {
  /** 应用ID */
  appId: `${string}.${string}.${string}`;
  /** 版权 */
  copyright: string;
  /** 产品名称 */
  productName: string;
  /** 版本号 */
  buildVersion: `${number}.${number}` | `${number}.${number}.${number}`;
  /** 渲染进程编译所在目录 */
  renderDir: string;
}
