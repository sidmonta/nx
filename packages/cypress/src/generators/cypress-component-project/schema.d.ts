export interface CypressComponentProjectSchema {
  project: string;
  componentType: 'react';
  compiler: 'swc' | 'babel';
  force?: boolean;
}
