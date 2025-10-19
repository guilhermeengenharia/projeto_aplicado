/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorageContext, ClsContextNamespace } from '../../cls';
import { LoggerConfigs } from './logger-configs';

export class LoggerContext {
  static Keys = {
    AppName: 'app-name',
    CorrelationId: 'correlationId',
    ExtraInfo: 'extraLogInfo',
  };
  /**
   * Sets correlation id
   * The setted correlationId will be printed in every application log
   * @param correlationId: {string}
   */
  public static setCorrelationId(correlationId: string): void {
    StorageContext.scope();
    StorageContext.setContextValue(
      LoggerContext.Keys.CorrelationId,
      correlationId,
      ClsContextNamespace.LOGGER
    );
  }

  /**
   * Gets correlation id
   * @returns correlation id {string}
   */
  public static getCorrelationId(): string {
    const value: string = StorageContext.getContextValue(
      LoggerContext.Keys.CorrelationId,
      ClsContextNamespace.LOGGER
    );
    return value;
  }

  /**
   * Extra data
   * You can set some extra info to you log
   * For Example: You can specify the user loggedId so everytime your user has logged in just add the id here and a key then in every appliction log the user id will be logged
   * @param key: {string}
   * @param value: {string}
   */
  public static setLogInfoData(key: string, value: unknown): void {
    const data = LoggerContext.getLogInfoData();
    data[key] = value;
    StorageContext.setContextValue(LoggerContext.Keys.ExtraInfo, data, ClsContextNamespace.LOGGER);
  }

  /**
   * Extra data
   * Returns the storaged extra log data
   */
  public static getLogInfoData(): { [key: string]: unknown } {
    const data: { [key: string]: unknown } = StorageContext.getContextValue(
      LoggerContext.Keys.ExtraInfo,
      ClsContextNamespace.LOGGER
    );
    return data || {};
  }

  /**
   * Fields name to be added in list of fields should be hidden on logs, by default the fields will be hidden are: ['password', 'cpf', 'psw', 'senha']
   * @param fields {string[]}
   * @return {void}
   */
  public static addLoggerHidenField(fields: Array<string>): void {
    fields = fields || [];
    LoggerConfigs.hiddenFields = LoggerConfigs.hiddenFields.concat(fields);
  }

  /**
   * Replace fields to be hidden on logs, by default the fields will be hidden are: ['password', 'cpf', 'psw', 'senha']
   * @param fields {string[]}
   * @return {void}
   */
  public static setLoggerHidenField(fields: Array<string>): void {
    fields = fields || [];
    LoggerConfigs.hiddenFields = fields;
  }
}
