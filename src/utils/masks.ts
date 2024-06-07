import { mask } from 'remask';

export const unmask = function (value: any): any {
  const unmasked = value ? value?.toString()?.replace(/[^\d]/g, '') : '';
  return unmasked;
};

export const cnpjMask = function (cnpj?: string): string | undefined {
  if (cnpj) {
    return mask(cnpj, ['99.999.999/9999-99']);
  }
  return undefined;
};

export const celMask = function (cel: string): string {
  if (cel) {
    return mask(cel, ['99+(99) 99999-9999']);
  } else {
    return '';
  }
};
