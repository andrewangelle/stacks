import type { ComponentPropsWithRef, ElementType, ReactElement } from 'react';
import { createElement } from 'react';

type AnyRecipe = (variants?: never) => string;

export type StyledComponent<E extends ElementType, Extra> = (
  props: ComponentPropsWithRef<E> & Extra,
) => ReactElement;

/**
 * `omitProps` lists props the style consumes that must not reach the DOM.
 * Recipe variants are not stripped automatically: some of them (`disabled` on a
 * button, `checked` on a Radix checkbox) are real props the element still needs.
 */
export function styledEl<E extends ElementType, Extra = unknown>(
  element: E,
  className: string,
  omitProps?: readonly string[],
): StyledComponent<E, Extra>;

export function styledEl<E extends ElementType, Variants>(
  element: E,
  recipeFn: (variants?: Variants) => string,
  omitProps?: readonly string[],
): StyledComponent<E, NonNullable<Variants>>;

export function styledEl(
  element: ElementType,
  styling: string | AnyRecipe,
  omitProps: readonly string[] = [],
) {
  const omitted = new Set(omitProps);

  // The recipes runtime throws on selection keys it has no variant for, so a
  // recipe must only ever see its own variant props — never the full props
  // object. Recipes report their variant names via `.variants()`; composed
  // plain functions fall back to the omit list.
  const selectionKeys =
    typeof styling === 'function'
      ? ((styling as { variants?: () => string[] }).variants?.() ?? omitProps)
      : [];

  return function Styled({
    className,
    ...props
  }: Record<string, unknown> & { className?: string }) {
    let bound: string;
    if (typeof styling === 'function') {
      const selection: Record<string, unknown> = {};
      for (const key of selectionKeys) {
        if (key in props) {
          selection[key] = props[key];
        }
      }
      bound = styling(selection as never);
    } else {
      bound = styling;
    }

    const forwarded: Record<string, unknown> = {};
    for (const key of Object.keys(props)) {
      if (!omitted.has(key)) {
        forwarded[key] = props[key];
      }
    }

    return createElement(element, {
      ...forwarded,
      className: className ? `${bound} ${className}` : bound,
    });
  };
}
