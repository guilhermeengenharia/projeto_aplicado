/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuid } from 'uuid';
import { ClsContextNamespace } from './cls-context-namespaces';

type ContextStore = Record<string, any>;

class LocalStorageContext {
  private storage = new AsyncLocalStorage<ContextStore>();

  /**
   * Inicia um novo contexto isolado com um UUID padrão.
   * Executa a função 'next' dentro desse contexto.
   */
  public async run(next: Function) {
    const state: ContextStore = { id: uuid() };
    return this.storage.run(state, async () => await next());
  }

  /**
   * Cria um novo escopo. Pode ser usada para separar contextos adicionais.
   * Atualmente, não implementa lógica específica.
   */
  public scope(): void {
    try {
      // Pode ser estendido para criar subescopos, ou resetar partes do contexto.
    } catch (err) {
      console.warn('Error while creating new log scope', err);
    }
  }

  /**
   * Define um namespace no contexto atual.
   */
  setContext(namespace: ClsContextNamespace, context: object): void {
    const store = this.storage.getStore();
    if (!store) return;
    store[namespace] = context;
  }

  /**
   * Retorna o contexto armazenado em um namespace.
   */
  getContext(namespace: ClsContextNamespace): object {
    const store = this.storage.getStore();
    if (!store) return {};
    return store[namespace] || {};
  }

  /**
   * Define uma chave dentro de um namespace específico.
   */
  setContextValue(key: string, value: unknown, namespace: ClsContextNamespace): void {
    const context = this.getContext(namespace);
    (context as any)[key] = value;
    this.setContext(namespace, context);
  }

  /**
   * Recupera uma chave dentro de um namespace específico.
   */
  getContextValue(key: string, namespace: ClsContextNamespace): any {
    const context = this.getContext(namespace);
    return (context as any)[key];
  }
}

const StorageContext = new LocalStorageContext();

export { StorageContext };
