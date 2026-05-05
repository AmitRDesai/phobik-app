import { createContext, useContext, type ReactNode } from 'react';
import { type Variant } from './variant-config';

const VariantContext = createContext<Variant>('default');

export function VariantProvider({
  variant,
  children,
}: {
  variant: Variant;
  children: ReactNode;
}) {
  return (
    <VariantContext.Provider value={variant}>
      {children}
    </VariantContext.Provider>
  );
}

/** Read the current variant set by the nearest `<Screen variant="...">`. */
export function useVariant(): Variant {
  return useContext(VariantContext);
}
