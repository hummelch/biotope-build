
export type ProjectEnvironment = 'default' | 'local' | 'dev' | 'prod';
export type NodeEnvironment = 'local' | 'development' | 'production' | 'test';

export const environments: IndexObject<NodeEnvironment> = {
  default: 'development',
  local: 'local',
  dev: 'development',
  prod: 'production',
};
