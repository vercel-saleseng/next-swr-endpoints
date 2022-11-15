import { type HTMLProps, createElement, forwardRef } from "react";
import { useForm as useForm_ } from "@next-fetch/core-plugin/form";
import type {
  UseMutationResult,
  UseMutationOptions,
} from "@tanstack/react-query";
import type { HookMetadata } from "@next-fetch/core-plugin/client";

type HookWithFormSubmission<Data, Error, Input, Context> = Pick<
  UseMutationResult<Data, Error, Input, Context>,
  "mutate"
> & {
  meta: HookMetadata;
};

/**
 * A React hook to create a form that can be submitted to a mutation.
 * This enables progressive enhancement, as the form can be submitted
 * without having to re-render the app using JavaScript code.
 */
export function useForm<Data, Error, Input, Context>(
  hook: HookWithFormSubmission<Data, Error, Input, Context>,
  config?: UseMutationOptions<Data, Error, Input, Context>
): {
  formProps: HTMLProps<HTMLFormElement>;
} {
  return useForm_({ meta: hook.meta, trigger: hook.mutate }, config);
}

/**
 * A mutation-aware form component.
 * This enables progressive enhancement, as the form can be submitted
 * without having to re-render the app using JavaScript code.
 */

// 4. https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref/58473012#58473012
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.ForwardedRef<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

type FormProps<Data, Error, Input, Context> = React.HTMLProps<HTMLFormElement> &
  React.PropsWithChildren<{
    mutation: HookWithFormSubmission<Data, Error, Input, Context>;
    mutationConfig?: UseMutationOptions<Data, Error, Input, Context>;
  }>;

export function FormImpl<Data, Error, Input, Context>(
  {
    mutation,
    mutationConfig,
    ...props
  }: FormProps<Data, Error, Input, Context>,
  ref: React.ForwardedRef<HTMLFormElement>
) {
  const { formProps } = useForm(mutation, mutationConfig);

  return createElement("form", { ...formProps, ...props, ref }, props.children);
}

export const Form = forwardRef(FormImpl)